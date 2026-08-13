<?php
/**
 * Head meta, Open Graph, canonicals, and the crawl surface.
 *
 * All hand-rolled, because no SEO plugin is installed. WordPress core already
 * does two of these jobs adequately — it emits canonicals and generates
 * sitemaps since 5.5 — so those are configured rather than replaced, and only
 * the parts core does not cover are written here.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Title, falling back sensibly.
 *
 * The 60-character guidance in the field is advice, not enforcement: truncating
 * an editor's title silently would be worse than showing them a long one.
 */
function fpc_meta_title(?WP_Post $post = null): string
{
    if ($post && ($custom = fpc_field('meta_title', $post->ID))) {
        return (string) $custom;
    }

    if (is_front_page()) {
        return sprintf('%s — %s', fpc_option('brand_name'), fpc_option('tagline'));
    }

    if (is_post_type_archive('industry')) {
        return 'Industries We Serve · ' . fpc_option('brand_name');
    }

    if (is_post_type_archive('service')) {
        return 'Services · ' . fpc_option('brand_name');
    }

    if (is_tax('post_industry')) {
        return single_term_title('', false) . ' — SEO & AI Search Articles';
    }

    // Every remaining case is resolved from the query directly. Calling
    // wp_get_document_title() here would be catastrophic: this function is the
    // pre_get_document_title filter, so it would re-enter itself and recurse
    // until PHP ran out of memory — which is exactly what happened, taking out
    // /blog/, the author archive and every 404 with a 500.
    $title = match (true) {
        is_home()   => 'Blog',
        is_author() => (string) get_the_author_meta('display_name', (int) get_query_var('author')),
        is_search() => sprintf('Search: %s', get_search_query()),
        is_404()    => 'Page not found',
        is_archive()=> (string) get_the_archive_title(),
        default     => $post ? get_the_title($post) : (string) get_bloginfo('name'),
    };

    return sprintf('%s · %s', wp_strip_all_tags($title), fpc_option('brand_name'));
}

/**
 * Description.
 *
 * Prefers the hand-written meta description, then the quick answer — which is
 * the page's own answer-first paragraph and therefore a better description than
 * anything auto-generated — then the excerpt.
 */
function fpc_meta_description(?WP_Post $post = null): string
{
    if ($post) {
        if ($custom = fpc_field('meta_description', $post->ID)) {
            return (string) $custom;
        }
        if ($answer = fpc_field('quick_answer', $post->ID)) {
            return wp_trim_words((string) $answer, 30, '…');
        }
        if ($excerpt = get_the_excerpt($post)) {
            return wp_trim_words($excerpt, 30, '…');
        }
    }

    return (string) fpc_option('description');
}

function fpc_current_url(): string
{
    if (is_front_page()) {
        return fpc_id();
    }
    if (is_singular()) {
        return (string) get_permalink();
    }
    if (is_post_type_archive()) {
        return (string) get_post_type_archive_link((string) get_query_var('post_type'));
    }
    if (is_tax() || is_category() || is_tag()) {
        $term = get_queried_object();
        return $term instanceof WP_Term ? (string) get_term_link($term) : home_url(add_query_arg([]));
    }
    if (is_home()) {
        $page = (int) get_option('page_for_posts');
        return $page ? (string) get_permalink($page) : fpc_id('blog/');
    }
    return home_url(add_query_arg([]));
}

function fpc_print_meta(): void
{
    $post = is_singular() ? get_post() : null;
    $title = fpc_meta_title($post);
    $description = fpc_meta_description($post);
    $url = fpc_current_url();

    printf("<meta name=\"description\" content=\"%s\">\n", esc_attr($description));
    printf("<link rel=\"canonical\" href=\"%s\">\n", esc_url($url));

    // Open Graph
    printf("<meta property=\"og:type\" content=\"%s\">\n", is_singular('post') ? 'article' : 'website');
    printf("<meta property=\"og:site_name\" content=\"%s\">\n", esc_attr((string) fpc_option('brand_name')));
    printf("<meta property=\"og:title\" content=\"%s\">\n", esc_attr($title));
    printf("<meta property=\"og:description\" content=\"%s\">\n", esc_attr($description));
    printf("<meta property=\"og:url\" content=\"%s\">\n", esc_url($url));
    printf("<meta property=\"og:locale\" content=\"en_US\">\n");

    if ($image = fpc_og_image($post)) {
        printf("<meta property=\"og:image\" content=\"%s\">\n", esc_url($image));
        printf("<meta name=\"twitter:image\" content=\"%s\">\n", esc_url($image));
    }

    printf("<meta name=\"twitter:card\" content=\"summary_large_image\">\n");
    printf("<meta name=\"twitter:title\" content=\"%s\">\n", esc_attr($title));
    printf("<meta name=\"twitter:description\" content=\"%s\">\n", esc_attr($description));

    if (is_singular('post')) {
        printf("<meta property=\"article:published_time\" content=\"%s\">\n", esc_attr(get_the_date('c', $post)));
        printf("<meta property=\"article:author\" content=\"%s\">\n", esc_attr((string) fpc_option('founder_name')));
    }
}
add_action('wp_head', 'fpc_print_meta', 5);

function fpc_og_image(?WP_Post $post): ?string
{
    if ($post && has_post_thumbnail($post)) {
        return (string) get_the_post_thumbnail_url($post, 'full');
    }
    $default = fpc_option('og_image');
    return $default ? (string) $default : null;
}

/** WordPress emits its own <title>; make it ours. */
add_filter('pre_get_document_title', static function (string $title): string {
    $post = is_singular() ? get_post() : null;
    return fpc_meta_title($post);
});

/**
 * Keep the crawl surface tight.
 *
 * Author archives, date archives and attachment pages are all thin duplicates
 * of content that already has a canonical home. The static site never published
 * them; WordPress does by default, and every one of them is a page competing
 * with the article it duplicates.
 *
 * /author/benton-purvis/ is the deliberate exception — it exists on the live
 * site as a real author page and carries the Person entity.
 */
add_action('wp_head', static function (): void {
    if (is_date() || is_attachment() || is_search() || is_paged() && is_home()) {
        echo "<meta name=\"robots\" content=\"noindex, follow\">\n";
    }
}, 1);

add_action('template_redirect', static function (): void {
    if (is_attachment()) {
        wp_safe_redirect(get_permalink(get_post()->post_parent ?: 0) ?: home_url('/'), 301);
        exit;
    }
    if (is_date()) {
        wp_safe_redirect(home_url('/blog/'), 301);
        exit;
    }
});

/** Core sitemaps: drop the noise, keep the pages that matter. */
add_filter('wp_sitemaps_post_types', static function (array $types): array {
    unset($types['attachment']);
    return $types;
});

add_filter('wp_sitemaps_taxonomies', static function (array $taxonomies): array {
    // post_tag and category are unused; post_industry is the real one.
    unset($taxonomies['post_tag'], $taxonomies['category']);
    return $taxonomies;
});

/**
 * llms.txt — the plain-text summary for language models.
 *
 * Not a standard anyone is obliged to honour, and cheap to publish. It states
 * what the business does and lists the canonical pages, so a model crawling it
 * gets the entity right without having to infer it from marketing copy.
 */
/**
 * /favicon.ico.
 *
 * Browsers request this path unprompted regardless of what link tags say, and a
 * 404 there is a console error on every page view. Mapped to the theme's copy
 * rather than left as a loose file at the web root, so it deploys with the code.
 */
add_action('template_redirect', static function (): void {
    if (($_SERVER['REQUEST_URI'] ?? '') !== '/favicon.ico') {
        return;
    }
    $file = get_theme_file_path('assets/icons/favicon.ico');
    if (!is_readable($file)) {
        return;
    }
    header('Content-Type: image/x-icon');
    header('Cache-Control: public, max-age=31536000, immutable');
    readfile($file);
    exit;
}, 0);

add_action('init', static function (): void {
    add_rewrite_rule('^llms\.txt$', 'index.php?fpc_llms=1', 'top');
    add_rewrite_tag('%fpc_llms%', '1');
});

/**
 * WordPress's canonical redirect appends a trailing slash to anything it does
 * not recognise, turning /llms.txt into a 301 to /llms.txt/ — which the rewrite
 * rule does not match, so the file was unreachable. Files are not directories.
 */
add_filter('redirect_canonical', static function ($redirect) {
    return get_query_var('fpc_llms') ? false : $redirect;
});

add_action('template_redirect', static function (): void {
    if (!get_query_var('fpc_llms')) {
        return;
    }

    header('Content-Type: text/plain; charset=utf-8');

    printf("# %s\n\n> %s\n\n", fpc_option('brand_name'), fpc_option('description'));
    printf("%s\n\n", fpc_option('tagline'));

    echo "## Industries\n\n";
    foreach (fpc_all_industries() as $industry) {
        printf("- [%s](%s): %s\n", get_the_title($industry), get_permalink($industry), fpc_field('hero_tagline', $industry->ID));
    }

    echo "\n## Services\n\n";
    foreach (fpc_all_services() as $service) {
        printf("- [%s](%s)\n", get_the_title($service), get_permalink($service));
    }

    printf("\n## Contact\n\n- Email: %s\n- Phone: %s\n", fpc_option('email'), fpc_option('phone'));
    exit;
});

/* -------------------------------------------------------------------------
 * Crawl-surface parity with the static export
 * ---------------------------------------------------------------------- */

/**
 * robots.txt.
 *
 * WordPress's default is four lines and says nothing about AI crawlers. The
 * static site names seventeen of them explicitly and allows each one.
 *
 * Naming them matters even though "User-agent: *  Allow: /" already permits
 * them: several of these agents are opt-OUT by convention, and an explicit
 * Allow is the unambiguous signal. For a business whose entire proposition is
 * being cited by AI assistants, silently blocking one would be the single most
 * expensive configuration mistake available.
 */
const FPC_AI_CRAWLERS = [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
    'PerplexityBot', 'Perplexity-User',
    'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
    'Google-Extended', 'Applebot', 'Applebot-Extended',
    'Bingbot', 'CCBot', 'meta-externalagent', 'Amazonbot', 'DuckAssistBot',
];

add_filter('robots_txt', static function (string $output, $public): string {
    if (!$public) {
        return $output; // a discouraged site stays discouraged
    }

    $lines = ["User-Agent: *", "Allow: /", ""];

    foreach (FPC_AI_CRAWLERS as $agent) {
        $lines[] = "User-Agent: {$agent}";
        $lines[] = "Allow: /";
        $lines[] = "";
    }

    // wp-admin is the one place worth excluding: it is behind auth anyway, and
    // crawling it wastes budget on redirects.
    $lines[] = "Disallow: /wp-admin/";
    $lines[] = "Allow: /wp-admin/admin-ajax.php";
    $lines[] = "";
    $lines[] = 'Host: ' . home_url('/');
    $lines[] = 'Sitemap: ' . home_url('/sitemap.xml');

    return implode("\n", $lines) . "\n";
}, 10, 2);

/**
 * /rss.xml and /sitemap.xml.
 *
 * WordPress publishes these at /feed/ and /wp-sitemap.xml. The static export
 * publishes them at /rss.xml and /sitemap.xml, those are the URLs in the wild —
 * in <head> link tags, in Search Console, in whatever readers subscribed — so
 * the WordPress URLs are the ones that have to move, not the published ones.
 *
 * Served at the original path rather than 301'd, because a feed reader that
 * follows a redirect once may not re-follow it, and a sitemap that redirects is
 * a sitemap Search Console reports as an error.
 */
add_action('init', static function (): void {
    add_rewrite_rule('^rss\.xml$', 'index.php?feed=rss2', 'top');
    add_rewrite_rule('^sitemap\.xml$', 'index.php?sitemap=index', 'top');
});

/**
 * Both are files, and WordPress's canonical redirect appends a trailing slash
 * to anything it does not recognise — which turns them into 301s to URLs that
 * match no rule at all.
 */
add_filter('redirect_canonical', static function ($redirect) {
    $path = parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH) ?? '';
    return preg_match('#^/(rss|sitemap)\.xml$#', $path) ? false : $redirect;
}, 20);

/** Advertise the feed at the URL we actually publish. */
add_filter('feed_link', static function (string $output, string $feed): string {
    return $feed === 'rss2' || $feed === '' ? home_url('/rss.xml') : $output;
}, 10, 2);
