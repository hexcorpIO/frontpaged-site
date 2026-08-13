<?php
/**
 * GTM container and dataLayer, ported from the Next.js instrumentation.
 *
 * Everything the container already reads has to keep arriving with the same key
 * names and the same values, or the GA4 property loses continuity across the
 * cutover — reports would show a step change on migration day that looks like a
 * traffic collapse and is actually a renamed variable.
 *
 * The container reads: page_type, industry, content_group, tier, scheduler,
 * cta_location, score_bucket (FLAT), check.questions_answered (DOTTED),
 * fp_click. That asymmetry between score_bucket and check.questions_answered is
 * reproduced exactly rather than tidied, for the same reason as before —
 * matching the consumer beats a neater shape that reports undefined.
 *
 * One thing WordPress makes simpler: page_type no longer has to be guessed from
 * the URL by a regex in the browser. The server already knows what it is
 * rendering, so it is emitted directly and cannot disagree with the template
 * that produced the page.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Page type, from the query rather than from the path.
 *
 * The JavaScript classifier had to parse location.pathname and could be wrong
 * about routes it had never been taught. WordPress is authoritative here.
 * The vocabulary is unchanged from what the container already receives.
 */
function fpc_page_type(): string
{
    return match (true) {
        is_front_page()                  => 'home',
        is_singular('industry')          => 'industry',
        is_post_type_archive('industry') => 'industry-index',
        is_singular('service')           => 'service',
        is_post_type_archive('service')  => 'service-index',
        is_page('pricing')               => 'pricing',
        is_page('ai-readiness-check')    => 'check',
        is_page('contact'), is_page('thank-you') => 'contact',
        is_singular('post'), is_home(), is_tax('post_industry') => 'blog',
        is_page('faq')                   => 'faq',
        is_page('about')                 => 'about',
        default                          => 'other',
    };
}

/**
 * The industry slug this page is about, or 'none'.
 *
 * An industry page reports itself. A blog post reports its assigned industry
 * term — which the JavaScript version could not do at all, because the slug
 * only lived in the URL for /blog/industry/<slug>/ and nowhere for individual
 * posts. So this is strictly better data than the site had before.
 */
function fpc_page_industry(): string
{
    if (is_singular('industry')) {
        return (string) get_post_field('post_name', get_the_ID());
    }

    if (is_tax('post_industry')) {
        $term = get_queried_object();
        return $term instanceof WP_Term ? $term->slug : 'none';
    }

    if (is_singular('post')) {
        $terms = get_the_terms(get_the_ID(), 'post_industry');
        if (is_array($terms) && $terms !== []) {
            return $terms[0]->slug;
        }
    }

    return 'none';
}

/** @return array<string, string> */
function fpc_page_context(): array
{
    $type = fpc_page_type();

    return [
        'page_type'     => $type,
        'industry'      => fpc_page_industry(),
        'content_group' => ucfirst($type),
        // The container declares `tier`, not `tier_context`.
        'tier'          => 'none',
    ];
}

/**
 * Page context and the container, in <head>.
 *
 * Ordering is the whole point: the context must be in the dataLayer before
 * gtm.js runs, or the first page_view arrives with no page_type or industry on
 * it. Printed as one block at priority 1 so nothing can be inserted between
 * them by another hook.
 */
function fpc_print_head_tracking(): void
{
    $context = fpc_page_context();

    echo "<script>window.dataLayer = window.dataLayer || [];\n";
    printf("window.__fp_industry = %s;\n", wp_json_encode($context['industry']));
    printf("dataLayer.push(%s);</script>\n", wp_json_encode($context, JSON_UNESCAPED_SLASHES));

    $gtm = (string) fpc_option('gtm_id');
    if ($gtm === '') {
        return;
    }

    printf(
        "<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\n"
        . "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\n"
        . "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\n"
        . "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\n"
        . "})(window,document,'script','dataLayer',%s);</script>\n<!-- End Google Tag Manager -->\n",
        wp_json_encode($gtm)
    );
}
add_action('wp_head', 'fpc_print_head_tracking', 1);

/** The noscript half, immediately after <body>. */
function fpc_print_body_tracking(): void
{
    $gtm = (string) fpc_option('gtm_id');
    if ($gtm === '') {
        return;
    }

    printf(
        '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=%s"'
        . ' height="0" width="0" style="display:none;visibility:hidden"'
        . ' title="Google Tag Manager"></iframe></noscript>' . "\n",
        esc_attr($gtm)
    );
}
add_action('wp_body_open', 'fpc_print_body_tracking', 1);

/**
 * Click tracking.
 *
 * The delegated listener survives the migration unchanged in spirit: one
 * listener at the document, walking up from whatever was clicked. On WordPress
 * this matters even more than it did on Next.js, because content is now edited
 * in Gutenberg — an editor adding a link in the block editor gets it tracked
 * without anyone touching a template.
 *
 * page_type is NOT pushed here. It is set once per page in <head> above, and
 * two writers on one GA4 dimension produce reports that disagree with
 * themselves.
 */
function fpc_enqueue_tracking(): void
{
    $handle = 'fpc-tracking';
    wp_enqueue_script(
        $handle,
        FPC_URL . 'assets/tracking.js',
        [],
        FPC_VERSION,
        ['strategy' => 'defer', 'in_footer' => true]
    );

    wp_localize_script($handle, 'fpcConfig', [
        'calendly'  => (string) fpc_option('calendly'),
        'formEndpoint' => (string) fpc_option('form_endpoint'),
        // Kept for parity with the Next.js build. The cookie gate stays closed
        // while this is false; see the note in the JS.
        'captureAttribution' => false,
    ]);
}
add_action('wp_enqueue_scripts', 'fpc_enqueue_tracking');

/**
 * A stable tracking id for a link, mirroring the 293 data-track-id values on
 * the static site so GA4 continuity survives the cutover.
 */
function fpc_track_id(string $section, string $label): string
{
    $slug = sanitize_title($section . '-' . $label);
    return substr($slug, 0, 64);
}

/** Echo the tracking attributes for a link. */
function fpc_track_attrs(string $id, string $type = ''): string
{
    $out = sprintf(' data-track-id="%s"', esc_attr($id));
    if ($type !== '') {
        $out .= sprintf(' data-track-type="%s"', esc_attr($type));
    }
    return $out;
}
