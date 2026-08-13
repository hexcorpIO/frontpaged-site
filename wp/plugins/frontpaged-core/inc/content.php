<?php
/**
 * Article rendering helpers: heading anchors, table of contents, reading time.
 *
 * The Next.js build did this at markdown-parse time. Here it happens on
 * `the_content` instead, so it also applies to anything written or edited in
 * Gutenberg — content authored in the admin gets the same anchors and the same
 * table of contents as content that came through the importer, with nobody
 * having to remember.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Slug for a heading, matching the ids the static site published.
 *
 * These are live anchor targets: the old table of contents linked to them and
 * anything that deep-linked into an article used them. Changing the algorithm
 * would quietly break every one of those links, so it is the same rule —
 * lowercase, strip anything not alphanumeric, collapse to single hyphens.
 */
function fpc_heading_id(string $text): string
{
    $slug = strtolower(wp_strip_all_tags($text));
    $slug = str_replace(['’', "'"], '', $slug);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
    return trim($slug, '-');
}

/**
 * Add ids to H2s and collect them, in one pass.
 *
 * Stored on a static so the template can read the headings after the content
 * has rendered — but the table of contents has to print BEFORE the body, so
 * single.php primes this by calling fpc_collect_headings() first.
 *
 * @return array<int, array{id:string, text:string}>
 */
function fpc_collect_headings(string $content): array
{
    $headings = [];

    preg_replace_callback(
        '/<h2\b([^>]*)>(.*?)<\/h2>/is',
        static function (array $m) use (&$headings): string {
            $text = trim(wp_strip_all_tags($m[2]));
            if ($text !== '') {
                $headings[] = ['id' => fpc_heading_id($text), 'text' => $text];
            }
            return $m[0];
        },
        $content
    );

    return $headings;
}

/**
 * Inject the ids at render time.
 *
 * Runs late so other filters have finished with the markup, and leaves an
 * existing id alone — an editor who set one deliberately means it.
 */
add_filter('the_content', static function (string $content): string {
    if (!is_singular(['post', 'industry', 'service'])) {
        return $content;
    }

    return preg_replace_callback(
        '/<h2\b([^>]*)>(.*?)<\/h2>/is',
        static function (array $m): string {
            if (preg_match('/\bid=/i', $m[1])) {
                return $m[0];
            }
            $id = fpc_heading_id(trim(wp_strip_all_tags($m[2])));
            return $id === '' ? $m[0] : sprintf('<h2%s id="%s">%s</h2>', $m[1], esc_attr($id), $m[2]);
        },
        $content
    ) ?? $content;
}, 20);

/**
 * Reading time in minutes.
 *
 * 200 words per minute, floored at one. The exact figure matters less than it
 * being stable — it appears on every card, and a number that drifts between
 * page loads reads as broken.
 */
function fpc_reading_time(?int $post_id = null): int
{
    $post = get_post($post_id ?? get_the_ID());
    if (!$post) {
        return 1;
    }
    $words = str_word_count(wp_strip_all_tags(strip_shortcodes($post->post_content)));
    return max(1, (int) round($words / 200));
}
