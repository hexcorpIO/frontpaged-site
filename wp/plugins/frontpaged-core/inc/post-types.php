<?php
/**
 * Content model.
 *
 * Every rewrite rule here exists to reproduce a URL the live site already
 * ranks for. The static export publishes 54 pages; if any of these slugs
 * changes, that page 404s on cutover and the ranking goes with it. The URL is
 * therefore the requirement and the post type is the implementation, not the
 * other way round — which is why `industry` lives at /industries/ (plural
 * archive, plural single) rather than at WordPress's more natural /industry/.
 *
 * `with_front => false` on every rewrite is load-bearing: the permalink
 * structure is /blog/%postname%/, and without it WordPress would helpfully
 * prefix every custom post type with /blog/ too.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function fpc_register_post_types(): void
{
    // /industries/ and /industries/<slug>/
    register_post_type('industry', [
        'labels' => [
            'name'               => 'Industries',
            'singular_name'      => 'Industry',
            'add_new_item'       => 'Add Industry',
            'edit_item'          => 'Edit Industry',
            'not_found'          => 'No industries yet',
        ],
        'public'        => true,
        'show_in_rest'  => true,          // Gutenberg for the long-form body
        'menu_icon'     => 'dashicons-building',
        'menu_position' => 20,
        'supports'      => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
        'has_archive'   => 'industries',
        'rewrite'       => ['slug' => 'industries', 'with_front' => false],
        'template'      => fpc_default_block_template(),
    ]);

    // /services/ and /services/<slug>/
    register_post_type('service', [
        'labels' => [
            'name'          => 'Services',
            'singular_name' => 'Service',
            'add_new_item'  => 'Add Service',
            'edit_item'     => 'Edit Service',
            'not_found'     => 'No services yet',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'menu_icon'     => 'dashicons-portfolio',
        'menu_position' => 21,
        'supports'      => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes'],
        'has_archive'   => 'services',
        'rewrite'       => ['slug' => 'services', 'with_front' => false],
        'template'      => fpc_default_block_template(),
    ]);

    /**
     * Glossary terms have no pages of their own on the live site — they are all
     * rendered on /glossary/. `publicly_queryable => false` keeps it that way:
     * 33 thin single-term pages would be exactly the doorway-page pattern this
     * site's own content gate exists to prevent.
     */
    register_post_type('glossary_term', [
        'labels' => [
            'name'          => 'Glossary',
            'singular_name' => 'Glossary Term',
            'add_new_item'  => 'Add Term',
            'edit_item'     => 'Edit Term',
        ],
        'public'             => false,
        'publicly_queryable' => false,
        'show_ui'            => true,
        'show_in_rest'       => true,
        'menu_icon'          => 'dashicons-book-alt',
        'menu_position'      => 22,
        'supports'           => ['title', 'editor', 'revisions', 'page-attributes'],
        'has_archive'        => false,
        'rewrite'            => false,
    ]);
}
add_action('init', 'fpc_register_post_types', 5);

function fpc_register_taxonomies(): void
{
    /**
     * /blog/industry/<slug>/ — the filtered blog index.
     *
     * A taxonomy rather than a post-to-post relationship because it is exactly
     * what a taxonomy is: a term applied to many posts, with an archive of its
     * own. The rewrite slug carries the /blog/ prefix so the URL matches the
     * static export byte for byte.
     */
    register_taxonomy('post_industry', ['post'], [
        'labels' => [
            'name'          => 'Blog Industries',
            'singular_name' => 'Blog Industry',
            'menu_name'     => 'Industries',
        ],
        'public'            => true,
        'hierarchical'      => true,   // behaves like a category, not a free tag
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => ['slug' => 'blog/industry', 'with_front' => false],
    ]);
}
add_action('init', 'fpc_register_taxonomies', 5);

/**
 * Starter block template for the long-form body.
 *
 * Gives an editor something shaped like the pages we actually publish rather
 * than an empty canvas — and the heading block seeds the answer-first structure
 * the whole site depends on for extraction.
 */
function fpc_default_block_template(): array
{
    return [
        ['core/paragraph', [
            'placeholder' => 'Answer the page’s question in the first two sentences. Everything else supports it.',
        ]],
        ['core/heading', ['level' => 2, 'placeholder' => 'A question a buyer would actually type']],
        ['core/paragraph', ['placeholder' => 'Answer it directly, then support it.']],
    ];
}

/**
 * Trailing slashes on custom post type URLs.
 *
 * next.config.ts sets trailingSlash: true, so /industries/med-spas/ and
 * /industries/med-spas are DIFFERENT URLs to this host, and the one that ranks
 * has the slash. WordPress adds trailing slashes for permalinks ending in a
 * name, but not consistently for post type archives, so it is forced here.
 */
add_filter('user_trailingslashit', static function (string $url, string $type): string {
    if (in_array($type, ['single', 'page', 'category', 'post_type_archive', 'archive'], true)) {
        return trailingslashit($url);
    }
    return $url;
}, 10, 2);

/**
 * Keep the author archive at /author/<nicename>/.
 *
 * The permalink structure is /blog/%postname%/, which makes "/blog" the
 * permalink FRONT — and WordPress prefixes the author permastruct with the
 * front, producing /blog/author/benton-purvis/. The live site publishes
 * /author/benton-purvis/, and that page carries the Person entity every one of
 * the 56 bylines points at, so the URL is not negotiable.
 *
 * Both halves are needed: the rewrite rules so the URL resolves, and the link
 * filter so nothing on the site ever links to the prefixed version.
 */
add_filter('author_rewrite_rules', static function (array $rules): array {
    $out = [];
    foreach ($rules as $pattern => $target) {
        $out[preg_replace('#^blog/#', '', $pattern)] = $target;
    }
    return $out;
});

add_filter('author_link', static function (string $link): string {
    return str_replace('/blog/author/', '/author/', $link);
});
