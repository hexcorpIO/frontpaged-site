<?php
/**
 * Import the exported JSON into WordPress.
 *
 *   wp eval-file wp-content/migration/import.php
 *
 * Idempotent: every object is matched by slug and updated in place, so this can
 * be re-run after a content change without creating duplicates. That matters
 * more than it sounds — a migration you can only run once is a migration you
 * cannot rehearse, and rehearsal is the whole point of doing this before
 * cutover rather than during it.
 *
 * Values are written as ACF's own storage format (a count under the field name
 * plus flat per-row keys, and a `_field` reference row pointing at the field
 * key). Doing it this way rather than through update_field() means the import
 * runs with or without ACF Pro installed, which is what lets the content model
 * be tested before the licence is in place.
 */

// No declare(strict_types=1) here: `wp eval-file` eval()s this file, and a
// declare must be the first statement in a script — inside eval it never is.
if (!defined('WP_CLI')) {
    fwrite(STDERR, "Run via: wp eval-file wp-content/migration/import.php\n");
    exit(1);
}

// __DIR__ is unreliable inside eval(); anchor on the content dir instead.
define('FPC_DATA', WP_CONTENT_DIR . '/migration/data');

function fpc_read(string $name): array
{
    $file = FPC_DATA . "/{$name}.json";
    if (!file_exists($file)) {
        WP_CLI::error("Missing {$file} — run: node wp/migration/export.mjs");
    }
    return json_decode((string) file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
}

/** Write a single ACF-backed value plus its field-key reference. */
function fpc_set(int $post_id, string $name, mixed $value, string $field_key): void
{
    update_post_meta($post_id, $name, $value);
    update_post_meta($post_id, '_' . $name, $field_key);
}

/**
 * Write a repeater.
 *
 * @param array<int, array<string,mixed>> $rows
 * @param array<string,string>            $sub_keys  subfield name => ACF field key
 */
function fpc_set_repeater(int $post_id, string $name, array $rows, string $field_key, array $sub_keys): void
{
    // Clear any longer previous run before writing, or a shortened repeater
    // leaves orphan rows that ACF will happily read back.
    $previous = (int) get_post_meta($post_id, $name, true);
    for ($i = 0; $i < max($previous, count($rows)) + 5; $i++) {
        foreach (array_keys($sub_keys) as $sub) {
            delete_post_meta($post_id, "{$name}_{$i}_{$sub}");
            delete_post_meta($post_id, "_{$name}_{$i}_{$sub}");
        }
    }

    fpc_set($post_id, $name, count($rows), $field_key);

    foreach ($rows as $i => $row) {
        foreach ($sub_keys as $sub => $sub_key) {
            if (!array_key_exists($sub, $row)) {
                continue;
            }
            update_post_meta($post_id, "{$name}_{$i}_{$sub}", $row[$sub]);
            update_post_meta($post_id, "_{$name}_{$i}_{$sub}", $sub_key);
        }
    }
}

/** A repeater of plain strings, stored under a single `value` subfield. */
function fpc_set_string_repeater(int $post_id, string $name, array $values, string $field_key, string $sub_key): void
{
    fpc_set_repeater(
        $post_id,
        $name,
        array_map(static fn($v): array => ['value' => (string) $v], array_values($values)),
        $field_key,
        ['value' => $sub_key]
    );
}

function fpc_upsert(string $post_type, string $slug, string $title, string $content, array $extra = []): int
{
    // Statuses are listed explicitly rather than using 'any'. WordPress
    // registers `future` as a protected status, which 'any' EXCLUDES — so a
    // re-run could not find the 36 scheduled posts, decided they were new, and
    // inserted them again under slug-2, slug-3. The import silently produced 72
    // duplicates before this was caught. 'any' is a trap wherever scheduled or
    // draft content exists.
    $existing = get_posts([
        'post_type'      => $post_type,
        'name'           => $slug,
        'post_status'    => ['publish', 'future', 'draft', 'pending', 'private'],
        'posts_per_page' => 1,
    ]);

    $args = array_merge([
        'post_type'    => $post_type,
        'post_name'    => $slug,
        'post_title'   => $title,
        'post_content' => $content,
        'post_status'  => 'publish',
    ], $extra);

    if ($existing) {
        $args['ID'] = $existing[0]->ID;
        return (int) wp_update_post($args, true);
    }

    return (int) wp_insert_post($args, true);
}

/* ── Settings ─────────────────────────────────────────────────────────── */

/**
 * ACF resolves an options value by looking up a `_options_<name>` row holding
 * the FIELD KEY, then reading `options_<name>`. A scalar still reads back
 * without the reference because ACF falls through to the raw option — but a
 * repeater does not: with no key it cannot find the sub-field definitions, and
 * get_field() returns nothing while the rows sit in wp_options untouched.
 * The credentials repeater imported as zero rows before this was added.
 */
$option_keys = [
    'brand_name'        => 'field_opt_brand_name',
    'tagline'           => 'field_opt_tagline',
    'description'       => 'field_opt_description',
    'email'             => 'field_opt_email',
    'phone'             => 'field_opt_phone',
    'phone_href'        => 'field_opt_phone_href',
    'linkedin'          => 'field_opt_linkedin',
    'instagram'         => 'field_opt_instagram',
    'calendly'          => 'field_opt_calendly',
    'form_endpoint'     => 'field_opt_form',
    'gtm_id'            => 'field_opt_gtm',
    'founding_enabled'  => 'field_opt_founding_enabled',
    'founding_slots'    => 'field_opt_founding_slots',
    'founding_headline' => 'field_opt_founding_headline',
    'founding_terms'    => 'field_opt_founding_terms',
    'guarantee'         => 'field_opt_guarantee',
    'founder_name'      => 'field_opt_founder_name',
    'founder_role'      => 'field_opt_founder_role',
    'founder_bio'       => 'field_opt_founder_bio',
    'founder_linkedin'  => 'field_opt_founder_linkedin',
    'credentials'       => 'field_opt_credentials',
    'credential_issuer' => 'field_opt_credential_issuer',
];

$settings = fpc_read('settings');
foreach ($settings as $key => $value) {
    $field_key = $option_keys[$key] ?? null;

    if (is_array($value)) {
        if (!array_is_list($value)) {
            continue; // nested objects (audit_offer) have no field group yet
        }
        update_option("options_{$key}", count($value));
        if ($field_key) {
            update_option("_options_{$key}", $field_key);
        }
        foreach ($value as $i => $v) {
            update_option("options_{$key}_{$i}_value", $v);
            if ($key === 'credentials') {
                update_option("_options_{$key}_{$i}_value", 'field_opt_credential');
            }
        }
        continue;
    }

    update_option("options_{$key}", $value);
    if ($field_key) {
        update_option("_options_{$key}", $field_key);
    }
}
WP_CLI::log('Settings written.');

/* ── Industries ───────────────────────────────────────────────────────── */

$industries = fpc_read('industries');
$industry_ids = [];

foreach ($industries as $i => $row) {
    $id = fpc_upsert('industry', $row['slug'], $row['title'], '', ['menu_order' => $i]);
    if (is_wp_error($id) || $id === 0) {
        WP_CLI::warning("industry {$row['slug']} failed");
        continue;
    }
    $industry_ids[$row['slug']] = $id;

    fpc_set($id, 'name_singular', $row['name_singular'], 'field_ind_name_singular');
    fpc_set($id, 'audience_noun', $row['audience_noun'], 'field_ind_audience_noun');
    fpc_set($id, 'client_noun', $row['client_noun'], 'field_ind_client_noun');
    fpc_set($id, 'hero_tagline', $row['hero_tagline'], 'field_ind_hero_tagline');
    fpc_set($id, 'meta_title', $row['meta_title'], 'field_ind_meta_title');
    fpc_set($id, 'meta_description', $row['meta_description'], 'field_ind_meta_description');
    fpc_set($id, 'quick_answer', $row['quick_answer'], 'field_ind_quick_answer');
    fpc_set($id, 'enterprise_from', $row['enterprise_from'], 'field_ind_enterprise_from');

    fpc_set_repeater($id, 'pricing_tiers', $row['pricing_tiers'], 'field_ind_tiers', [
        'name'     => 'field_ind_tier_name',
        'price'    => 'field_ind_tier_price',
        'for'      => 'field_ind_tier_for',
        'cta'      => 'field_ind_tier_cta',
        'featured' => 'field_ind_tier_featured',
    ]);
    foreach ($row['pricing_tiers'] as $t => $tier) {
        fpc_set_string_repeater(
            $id,
            "pricing_tiers_{$t}_features",
            $tier['features'] ?? [],
            'field_ind_tier_features',
            'field_ind_tier_feature'
        );
    }

    fpc_set_repeater($id, 'faqs', $row['faqs'], 'field_ind_faqs', [
        'question' => 'field_ind_faq_q',
        'answer'   => 'field_ind_faq_a',
    ]);

    fpc_set_repeater($id, 'citation_sources', $row['citation_sources'], 'field_ind_citations', [
        'label' => 'field_ind_citation_label',
        'url'   => 'field_ind_citation_url',
    ]);

    if (!empty($row['compliance'])) {
        $c = $row['compliance'];
        fpc_set($id, 'compliance_note', $c['note'], 'field_ind_compliance_note');
        fpc_set_string_repeater($id, 'compliance_required_disclaimers', $c['required_disclaimers'] ?? [], 'field_ind_compliance_disclaimers', 'field_ind_compliance_disclaimer');
        fpc_set_string_repeater($id, 'compliance_we_will_not', $c['we_will_not'] ?? [], 'field_ind_compliance_disclaimers', 'field_ind_compliance_disclaimer');
        fpc_set_repeater($id, 'compliance_sources', $c['sources'] ?? [], 'field_ind_compliance_sources', [
            'label' => 'field_ind_compliance_source_label',
            'url'   => 'field_ind_compliance_source_url',
        ]);
    }

    // The blog taxonomy term mirrors the industry, so /blog/industry/<slug>/
    // matches /industries/<slug>/ exactly as it does on the live site.
    if (!term_exists($row['slug'], 'post_industry')) {
        wp_insert_term($row['title'], 'post_industry', ['slug' => $row['slug']]);
    }
}
WP_CLI::log(sprintf('Industries: %d.', count($industry_ids)));

/* ── Services ─────────────────────────────────────────────────────────── */

$services = fpc_read('services');
foreach ($services as $i => $row) {
    $id = fpc_upsert('service', $row['slug'], $row['title'], '', ['menu_order' => $i]);
    if (is_wp_error($id) || $id === 0) {
        continue;
    }
    fpc_set($id, 'lead', $row['lead'], 'field_svc_lead');
    fpc_set($id, 'meta_title', $row['meta_title'], 'field_svc_meta_title');
    fpc_set($id, 'meta_description', $row['meta_description'], 'field_svc_meta_description');
    fpc_set($id, 'quick_answer', $row['quick_answer'], 'field_svc_quick_answer');
    fpc_set($id, 'sales_led', 1, 'field_svc_sales_led');
    fpc_set_string_repeater($id, 'deliverables', $row['deliverables'] ?? [], 'field_svc_deliverables', 'field_svc_deliverable');
    fpc_set_repeater($id, 'reasons', $row['reasons'] ?? [], 'field_svc_reasons', [
        'heading' => 'field_svc_reason_heading',
        'body'    => 'field_svc_reason_body',
    ]);
    fpc_set_repeater($id, 'faqs', $row['faqs'] ?? [], 'field_svc_faqs', [
        'question' => 'field_svc_faq_q',
        'answer'   => 'field_svc_faq_a',
    ]);
}
WP_CLI::log(sprintf('Services: %d.', count($services)));

/* ── Glossary ─────────────────────────────────────────────────────────── */

$glossary = fpc_read('glossary');
foreach ($glossary as $i => $row) {
    $id = fpc_upsert('glossary_term', $row['slug'], $row['title'], '', ['menu_order' => $i]);
    if (is_wp_error($id) || $id === 0) {
        continue;
    }
    fpc_set($id, 'definition', $row['definition'], 'field_gls_definition');
    fpc_set($id, 'also_known_as', $row['also_known_as'], 'field_gls_aka');
}
WP_CLI::log(sprintf('Glossary: %d.', count($glossary)));

/**
 * The byline everything attributes to.
 *
 * Matched on the nicename that forms the /author/<slug>/ URL rather than on ID
 * 1, so an install where the admin account is someone else still attributes
 * correctly.
 */
function fpc_author_id(): int
{
    $user = get_user_by('slug', 'benton-purvis');
    return $user ? (int) $user->ID : 1;
}

/* ── Posts ────────────────────────────────────────────────────────────── */

$posts = fpc_read('posts');
$imported = 0;

foreach ($posts as $row) {
    $date = $row['date'] ? date('Y-m-d H:i:s', strtotime((string) $row['date'])) : current_time('mysql');

    // Scheduled posts must stay scheduled. Publishing 18 future-dated articles
    // on migration day would flood the feed and destroy the publishing cadence
    // the content gate enforces.
    $status = strtotime((string) $row['date']) > time() ? 'future' : 'publish';

    $id = fpc_upsert('post', $row['slug'], $row['title'], $row['blocks'], [
        // Without this every post is authored by user 0: the author archive is
        // empty, and the BlogPosting author node points at nobody — which
        // breaks the single strongest E-E-A-T signal the site has.
        'post_author'   => fpc_author_id(),
        'post_status'   => $status,
        'post_date'     => $date,
        'post_date_gmt' => get_gmt_from_date($date),
        'post_excerpt'  => $row['meta_description'],
    ]);
    if (is_wp_error($id) || $id === 0) {
        WP_CLI::warning("post {$row['slug']} failed");
        continue;
    }
    $imported++;

    fpc_set($id, 'meta_title', $row['meta_title'], 'field_post_meta_title');
    fpc_set($id, 'meta_description', $row['meta_description'], 'field_post_meta_description');
    fpc_set($id, 'quick_answer', $row['quick_answer'], 'field_post_quick_answer');
    if ($row['updated']) {
        fpc_set($id, 'updated', $row['updated'], 'field_post_updated');
    }
    fpc_set_repeater($id, 'faqs', $row['faqs'] ?? [], 'field_post_faqs', [
        'question' => 'field_post_faq_q',
        'answer'   => 'field_post_faq_a',
    ]);

    if ($row['industry']) {
        wp_set_object_terms($id, [$row['industry']], 'post_industry');
    }
}
WP_CLI::log(sprintf('Posts: %d (%d scheduled).', $imported, count(array_filter($posts, static fn($p) => strtotime((string) $p['date']) > time()))));

/* ── Pages ────────────────────────────────────────────────────────────── */
//
// Slugs are the URLs the live site already ranks for. Any change here is a 404
// on cutover, so they are listed explicitly rather than derived from titles.

$pages = [
    ['home',                'Home'],
    ['blog',                'Blog'],
    ['pricing',             'Pricing'],
    ['contact',             'Contact'],
    ['faq',                 'FAQ'],
    ['glossary',            'Glossary'],
    ['about',               'About'],
    ['ai-readiness-check',  'AI Readiness Check'],
];

$page_ids = [];
foreach ($pages as [$slug, $title]) {
    $page_ids[$slug] = fpc_upsert('page', $slug, $title, '');
}

// /contact/thank-you/ is a child page, so the URL nests exactly as it does now.
fpc_upsert('page', 'thank-you', 'Message received', '', ['post_parent' => $page_ids['contact']]);

update_option('show_on_front', 'page');
update_option('page_on_front', $page_ids['home']);
update_option('page_for_posts', $page_ids['blog']);

WP_CLI::log(sprintf('Pages: %d.', count($pages) + 1));

flush_rewrite_rules();
WP_CLI::success('Import complete.');
