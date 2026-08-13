<?php
/**
 * Plugin Name:  Frontpaged Core
 * Description:  Content model, pricing maths, structured data and dataLayer for frontpaged.io. Deliberately separate from the theme so the content survives a redesign.
 * Version:      1.0.0
 * Requires PHP: 8.1
 * Author:       Frontpaged
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

define('FPC_VERSION', '1.0.0');
define('FPC_DIR', plugin_dir_path(__FILE__));
define('FPC_URL', plugin_dir_url(__FILE__));

/**
 * Why a plugin rather than putting all this in the theme.
 *
 * Post types, field definitions and structured data are CONTENT, not
 * presentation. Registering them in a theme is the single most common way a
 * WordPress site loses its content model: switch theme to try a redesign and
 * every industry page 404s because the post type no longer exists, with the
 * rows still sitting in wp_posts, invisible.
 *
 * The split is: this plugin owns what the site *is*, the theme owns what it
 * *looks like*.
 */
require_once FPC_DIR . 'inc/post-types.php';
require_once FPC_DIR . 'inc/pricing.php';
require_once FPC_DIR . 'inc/fields.php';
require_once FPC_DIR . 'inc/acf-fields.php';
require_once FPC_DIR . 'inc/schema.php';
require_once FPC_DIR . 'inc/meta.php';
require_once FPC_DIR . 'inc/tracking.php';
require_once FPC_DIR . 'inc/scorecard.php';
require_once FPC_DIR . 'inc/content.php';

/**
 * Rewrite rules are stored in the database, so a newly registered post type is
 * invisible until they are rebuilt. Flushing on every request is expensive and
 * a well-known performance mistake, so it happens once on activation and then
 * only when the registered version changes.
 */
register_activation_hook(__FILE__, static function (): void {
    fpc_register_post_types();
    fpc_register_taxonomies();
    flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, 'flush_rewrite_rules');

add_action('init', static function (): void {
    if (get_option('fpc_rewrite_version') !== FPC_VERSION) {
        flush_rewrite_rules();
        update_option('fpc_rewrite_version', FPC_VERSION);
    }
}, 99);
