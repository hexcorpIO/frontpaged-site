<?php
/**
 * Theme setup.
 *
 * The theme owns presentation only. Post types, fields, schema, meta and the
 * dataLayer all live in the Frontpaged Core plugin — so a future redesign can
 * replace this directory entirely without touching the content or the SEO.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

const FP_VERSION = '1.0.0';

add_action('after_setup_theme', static function (): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('responsive-embeds');
    add_theme_support('wp-block-styles');

    register_nav_menus([
        'primary' => 'Primary navigation',
        'footer_industries' => 'Footer — industries',
        'footer_services'   => 'Footer — services',
        'footer_company'    => 'Footer — company',
    ]);
});

/**
 * Assets.
 *
 * One stylesheet, no jQuery, no block library bloat on the front end. The site
 * argues that speed is part of being findable, so the theme has to behave like
 * it believes that.
 */
add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_style(
        'frontpaged',
        get_theme_file_uri('assets/css/main.css'),
        [],
        (string) filemtime(get_theme_file_path('assets/css/main.css'))
    );

    // Preload the two faces used above the fold. Without this the serif headline
    // arrives a beat late and the hero visibly reflows.
    foreach (['geist-normal-400-latin.woff2', 'fraunces-normal-600-latin.woff2'] as $font) {
        printf(
            '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
            esc_url(get_theme_file_uri("assets/fonts/{$font}"))
        );
    }

    wp_enqueue_script(
        'frontpaged',
        get_theme_file_uri('assets/js/site.js'),
        [],
        (string) filemtime(get_theme_file_path('assets/js/site.js')),
        ['strategy' => 'defer', 'in_footer' => true]
    );
}, 5);

/**
 * Site icons.
 *
 * Served from the theme rather than as loose files in public_html, so they are
 * version-controlled and deploy with everything else. The static export kept
 * them at the web root; removing that root left /favicon.ico returning 404,
 * which browsers request unprompted — it logged a console error on every page
 * and cost a Lighthouse best-practices point.
 *
 * The .ico is still declared at its conventional path via the rewrite below,
 * because browsers and crawlers ask for /favicon.ico whether or not a link tag
 * points elsewhere.
 */
add_action('wp_head', static function (): void {
    $icons = get_theme_file_uri('assets/icons');
    printf('<link rel="icon" href="%s/icon.svg" sizes="any" type="image/svg+xml">' . "\n", esc_url($icons));
    printf('<link rel="icon" href="%s/favicon.ico" sizes="32x32">' . "\n", esc_url($icons));
    printf('<link rel="apple-touch-icon" href="%s/logo-512.png">' . "\n", esc_url($icons));
}, 2);

/**
 * Strip the front-end block CSS we do not use.
 *
 * WordPress ships ~90KB of global styles and block library CSS on every page.
 * The theme styles blocks itself through Tailwind, so this is pure weight —
 * and Core Web Vitals are part of what this site sells.
 */
add_action('wp_enqueue_scripts', static function (): void {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
}, 100);

add_action('wp_enqueue_scripts', static function (): void {
    wp_deregister_script('jquery');
}, 100);

/** Emoji script and its DNS prefetch: unused, and two requests. */
add_action('init', static function (): void {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wp_shortlink_wp_head');
});

/**
 * Excerpts read as sentences, not as truncated marketing.
 */
add_filter('excerpt_length', static fn(): int => 32);
add_filter('excerpt_more', static fn(): string => '…');

/* -------------------------------------------------------------------------
 * Template helpers
 * ---------------------------------------------------------------------- */

/**
 * A link with tracking attributes.
 *
 * Every CTA on the site goes through this, so a link cannot be added without an
 * analytics identifier — the failure mode on the old build was a button that
 * shipped untracked and produced a metric nobody noticed was missing.
 */
function fp_link(string $href, string $label, string $track_id, string $classes = '', string $type = 'cta'): string
{
    return sprintf(
        '<a href="%s" class="%s" data-track-id="%s" data-track-type="%s">%s</a>',
        esc_url($href),
        esc_attr($classes),
        esc_attr($track_id),
        esc_attr($type),
        esc_html($label)
    );
}

/** Solid teal button. */
function fp_button_classes(string $variant = 'solid', string $size = 'md'): string
{
    $base = 'inline-flex items-center justify-center rounded-full font-semibold transition '
        . 'hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal';

    $variants = [
        'solid' => 'bg-teal text-white hover:bg-teal-dark',
        'ghost' => 'border border-warm-line bg-transparent text-navy hover:border-teal hover:bg-soft',
        'onNavy'=> 'bg-teal text-white hover:bg-white hover:text-navy',
    ];

    $sizes = ['md' => 'px-7 py-3 text-[15px]', 'lg' => 'px-9 py-4 text-[17px]'];

    return trim($base . ' ' . ($variants[$variant] ?? $variants['solid']) . ' ' . ($sizes[$size] ?? $sizes['md']));
}

/** Page-width container, matching the Next.js Container component. */
function fp_container(string $extra = ''): string
{
    return trim('mx-auto w-full max-w-[1080px] px-6 ' . $extra);
}

/**
 * The answer-first block.
 *
 * Rendered before the body on every content page because it is the passage an
 * AI assistant lifts. Its position is the feature: a page that opens with three
 * paragraphs of philosophy has nothing liftable at the top.
 */
function fp_quick_answer(?int $post_id = null): void
{
    $answer = fpc_field('quick_answer', $post_id ?? get_the_ID());
    if (!$answer) {
        return;
    }
    printf(
        '<div class="mt-8 rounded-2xl border-l-4 border-teal bg-soft p-6">
            <p class="mb-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-teal-dark">Quick answer</p>
            <p class="text-[17px] leading-[1.7] text-ink">%s</p>
        </div>',
        esc_html((string) $answer)
    );
}

/**
 * FAQs, rendered from the same rows that produce the FAQPage schema.
 *
 * Marking up a question the page does not visibly answer is the specific thing
 * Google issues manual actions for, so there is deliberately no way to emit one
 * without the other.
 */
function fp_faqs(?int $post_id = null, string $heading = 'Questions people actually ask'): void
{
    $faqs = fpc_faqs($post_id ?? get_the_ID());
    if ($faqs === []) {
        return;
    }
    ?>
    <section class="border-t border-warm-line py-14 sm:py-16" aria-labelledby="faq-heading">
        <div class="<?php echo esc_attr(fp_container()); ?>">
            <h2 id="faq-heading" class="font-serif text-[28px] leading-tight text-navy sm:text-[34px]">
                <?php echo esc_html($heading); ?>
            </h2>
            <div class="mt-8 divide-y divide-line border-y border-line">
                <?php foreach ($faqs as $faq) : ?>
                    <details class="group py-5">
                        <summary class="cursor-pointer list-none font-serif text-[18px] text-navy marker:content-none">
                            <?php echo esc_html((string) ($faq['question'] ?? '')); ?>
                        </summary>
                        <p class="mt-3 text-[16px] leading-[1.7] text-warm-grey">
                            <?php echo esc_html((string) ($faq['answer'] ?? '')); ?>
                        </p>
                    </details>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php
}

/** Closing CTA panel, shared by every inner page. */
function fp_cta_panel(string $heading = 'See where your business stands — free'): void
{
    ?>
    <section class="border-t border-warm-line bg-cream py-20 sm:py-28">
        <div class="<?php echo esc_attr(fp_container()); ?>">
            <div class="grid items-center gap-10 overflow-hidden rounded-2xl bg-navy p-8 text-white sm:p-12 lg:grid-cols-2">
                <div>
                    <h2 class="font-serif text-[30px] font-semibold tracking-tight sm:text-[36px]">
                        <?php echo esc_html($heading); ?>
                    </h2>
                    <p class="mt-4 max-w-md text-[17px] leading-[1.7] text-[#cdd6e2]">
                        Book a 30-minute visibility check and we&rsquo;ll run the AI test on your
                        business, then show you your three fastest wins. No pitch required.
                    </p>
                    <?php echo fp_link(
                        home_url('/contact/'),
                        'Get your free visibility check',
                        'cta-panel-visibility-check',
                        'mt-7 ' . fp_button_classes('onNavy', 'lg')
                    ); ?>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.30)]">
                    <p class="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-teal-dark">
                        The AI answer, after Frontpaged
                    </p>
                    <ol class="space-y-2 text-[15px] text-navy">
                        <li class="font-semibold">1. Your Business</li>
                        <li class="pl-1 text-warm-grey">2. [Competitor A]</li>
                        <li class="pl-1 text-warm-grey">3. [Competitor B]</li>
                    </ol>
                    <p class="mt-3 text-[12px] font-medium text-teal-dark">
                        Cited by ChatGPT · Perplexity · Google AI Overviews
                    </p>
                </div>
            </div>
        </div>
    </section>
    <?php
}

/** Breadcrumbs. Visible trail matching the BreadcrumbList schema. */
function fp_breadcrumbs(array $crumbs): void
{
    ?>
    <nav aria-label="Breadcrumb" class="border-b border-warm-line">
        <div class="<?php echo esc_attr(fp_container()); ?>">
            <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 py-4 text-[13.5px] text-warm-grey">
                <?php foreach ($crumbs as $i => $crumb) :
                    $is_last = $i === count($crumbs) - 1; ?>
                    <li class="flex items-center gap-2">
                        <?php if (!empty($crumb['url']) && !$is_last) : ?>
                            <a href="<?php echo esc_url($crumb['url']); ?>"
                               data-track-id="<?php echo esc_attr('breadcrumb-' . $i . '-' . sanitize_title($crumb['name'])); ?>"
                               class="hover:text-teal hover:underline underline-offset-2"><?php echo esc_html($crumb['name']); ?></a>
                        <?php else : ?>
                            <span class="<?php echo $is_last ? 'text-navy' : ''; ?>"
                                  <?php echo $is_last ? 'aria-current="page"' : ''; ?>><?php echo esc_html($crumb['name']); ?></span>
                        <?php endif; ?>
                        <?php if (!$is_last) : ?>
                            <span aria-hidden="true" class="text-line">/</span>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ol>
        </div>
    </nav>
    <?php
}
