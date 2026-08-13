<?php
/**
 * Field access.
 *
 * Everything in the theme reads content through these helpers rather than
 * calling get_field() directly, for two reasons.
 *
 * FIRST, a theme that calls get_field() unguarded is a theme that fatals the
 * entire public site the moment ACF is deactivated, updated badly, or hits a
 * licence problem. Every call here degrades to reading the underlying postmeta,
 * which ACF has stored in a documented, stable format since 2012. The site
 * renders without ACF present. It is not as pretty to maintain as calling the
 * API directly, and it is the difference between a plugin problem and an outage.
 *
 * SECOND, it makes the content model testable and seedable without ACF Pro
 * installed, which matters while the licence is being sorted out.
 *
 * ACF stores a repeater as a count under the field name, plus one row of
 * flat keys per index:
 *
 *   pricing_tiers            => "3"
 *   pricing_tiers_0_name     => "Visibility"
 *   pricing_tiers_0_price    => "1500"
 *   pricing_tiers_1_name     => "Authority"
 *
 * so the fallback below reconstructs rows by scanning that shape.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function fpc_has_acf(): bool
{
    static $has = null;
    return $has ??= function_exists('get_field');
}

/**
 * A single field value.
 *
 * @return mixed
 */
function fpc_field(string $name, int|string|null $post_id = null)
{
    $post_id ??= get_the_ID();

    if (fpc_has_acf()) {
        $value = get_field($name, $post_id);
        if ($value !== null && $value !== false && $value !== '') {
            return $value;
        }
    }

    $meta = get_post_meta((int) $post_id, $name, true);
    return $meta === '' ? null : $meta;
}

/**
 * Repeater rows, as a list of associative arrays.
 *
 * Always returns an array, so callers can foreach without guarding. An empty
 * repeater and a missing one are the same thing to a template.
 *
 * @return array<int, array<string, mixed>>
 */
function fpc_rows(string $name, int|string|null $post_id = null): array
{
    $post_id = (int) ($post_id ?? get_the_ID());

    if (fpc_has_acf() && function_exists('have_rows')) {
        $rows = get_field($name, $post_id);
        if (is_array($rows)) {
            return array_values($rows);
        }
    }

    $count = (int) get_post_meta($post_id, $name, true);
    if ($count < 1) {
        return [];
    }

    // One query rather than one per subfield: a vertical has six repeaters and
    // this runs on every industry page.
    $all = get_post_meta($post_id);
    $rows = [];

    foreach ($all as $key => $value) {
        if (!preg_match('/^' . preg_quote($name, '/') . '_(\d+)_(.+)$/', $key, $m)) {
            continue;
        }
        $index = (int) $m[1];
        if ($index >= $count) {
            continue; // stale rows left behind by a shortened repeater
        }
        $rows[$index][$m[2]] = maybe_unserialize($value[0]);
    }

    ksort($rows);
    return array_values($rows);
}

/**
 * A nested repeater inside a repeater row.
 *
 * ACF flattens these as parent_0_child_0_field, so a row's nested list is read
 * from the parent's index rather than from a standalone key.
 *
 * @return array<int, mixed>
 */
function fpc_sub_rows(string $parent, int $index, string $child, int|string|null $post_id = null): array
{
    $post_id = (int) ($post_id ?? get_the_ID());
    $prefix  = "{$parent}_{$index}_{$child}";
    $count   = (int) get_post_meta($post_id, $prefix, true);

    if ($count < 1) {
        return [];
    }

    $out = [];
    for ($i = 0; $i < $count; $i++) {
        // A nested repeater of scalars stores its value under a single subfield.
        $value = get_post_meta($post_id, "{$prefix}_{$i}_value", true);
        if ($value !== '') {
            $out[] = $value;
        }
    }
    return $out;
}

/**
 * A sitewide setting.
 *
 * ACF options live in wp_options prefixed with `options_`, which is what the
 * fallback reads. Brand facts have defaults in code so a fresh install renders
 * correctly before anyone has visited the settings screen.
 *
 * @return mixed
 */
function fpc_option(string $name, mixed $default = null)
{
    if (fpc_has_acf()) {
        $value = get_field($name, 'option');
        if ($value !== null && $value !== false && $value !== '') {
            return $value;
        }
    }

    $value = get_option('options_' . $name, null);
    if ($value !== null && $value !== '') {
        return $value;
    }

    return $default ?? fpc_brand_default($name);
}

/**
 * Brand facts, ported from src/lib/site.ts.
 *
 * These are defaults rather than the source of truth — the settings screen wins
 * — but they exist so the site is never rendering placeholder text, and so a
 * deployment that loses its options table degrades to correct information
 * rather than to blanks.
 *
 * @return mixed
 */
function fpc_brand_default(string $name)
{
    static $defaults = [
        'brand_name'        => 'Frontpaged',
        'domain'            => 'frontpaged.io',
        'tagline'           => 'Be the first name AI recommends.',
        'email'             => 'hello@frontpaged.io',
        'phone'             => '(615) 905-1857',
        'phone_href'        => 'tel:+16159051857',
        'linkedin'          => 'https://www.linkedin.com/company/frontpaged-io/',
        'instagram'         => 'https://www.instagram.com/frontpaged_io/',
        'calendly'          => 'https://calendly.com/benton-frontpaged/30min',
        'form_endpoint'     => 'https://formspree.io/f/mppadnvo',
        'gtm_id'            => 'GTM-NBL9BS2M',
        'area_served'       => 'the United States',
        'founding_enabled'  => true,
        'founding_slots'    => 5,
        'founding_headline' => 'Founding client rate',
        'founding_terms'    => '25% off any plan, locked for 12 months, in exchange for documented before-and-after results and permission to write it up as a case study.',
        'founder_name'      => 'Benton Purvis',
        'founder_role'      => 'Founder',
        'founder_linkedin'  => 'https://www.linkedin.com/in/benton-purvis/',
        'credential_issuer' => 'Google',
        'description'       => 'Frontpaged gets high-ticket local businesses found on Google and cited by AI search (ChatGPT, Perplexity, Google AI Overviews). Done-for-you SEO + GEO content for medical, legal, and premium service practices nationwide.',
        'guarantee'         => 'Cited by at least one AI engine for a target question within 90 days, or month four is free.',
    ];

    return $defaults[$name] ?? null;
}

/* -------------------------------------------------------------------------
 * Content queries
 * ---------------------------------------------------------------------- */

/** @return WP_Post[] */
function fpc_all_industries(): array
{
    static $cache = null;

    return $cache ??= get_posts([
        'post_type'      => 'industry',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'menu_order title',
        'order'          => 'ASC',
    ]);
}

/** @return WP_Post[] */
function fpc_all_services(): array
{
    static $cache = null;

    return $cache ??= get_posts([
        'post_type'      => 'service',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'menu_order title',
        'order'          => 'ASC',
    ]);
}

/** @return array<int, array<string, mixed>> */
function fpc_industry_tiers(int $post_id): array
{
    return fpc_rows('pricing_tiers', $post_id);
}

/** @return array<int, array<string, mixed>> */
function fpc_faqs(int $post_id): array
{
    return fpc_rows('faqs', $post_id);
}

/**
 * Cheapest and dearest effective price within one industry, for the "from $X"
 * label on cards.
 *
 * @return array{min:int,max:int}|null
 */
function fpc_industry_price_range(int $post_id): ?array
{
    $prices = array_map(
        static fn(array $t): int => fpc_effective_price((int) ($t['price'] ?? 0)),
        fpc_industry_tiers($post_id)
    );
    $prices = array_filter($prices);

    return $prices === [] ? null : ['min' => min($prices), 'max' => max($prices)];
}
