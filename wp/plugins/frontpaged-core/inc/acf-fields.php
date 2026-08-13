<?php
/**
 * ACF field groups, defined in PHP rather than clicked together in the admin.
 *
 * Field groups created through the UI live only in the database. That means
 * they are not in version control, not reviewable in a diff, not deployable,
 * and gone if a database is restored from an older backup. Defining them in
 * code makes the content model a reviewable artefact and makes staging and
 * production provably identical.
 *
 * The trade is that editors cannot add fields through the admin — the group is
 * read-only there. That is the intended behaviour: a field added on production
 * that no template reads is invisible work, and a field renamed on production
 * silently empties whatever the templates were reading.
 *
 * Field keys must be globally unique and must never change once content exists
 * against them — ACF stores the key in a `_fieldname` meta row and looks values
 * up by it. Renaming a key orphans every value already saved.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

add_action('acf/init', 'fpc_register_field_groups');

function fpc_register_field_groups(): void
{
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    fpc_register_industry_fields();
    fpc_register_service_fields();
    fpc_register_glossary_fields();
    fpc_register_post_fields();
    fpc_register_options();
}

/**
 * Shared SEO/AEO block appended to every content type.
 *
 * `quick_answer` is the single most important field on the site: it is the
 * passage an AI assistant lifts when it answers the page's question, and it is
 * rendered before the body on every template. The 45–90 word guidance is not
 * arbitrary — it is what the content gate in scripts/check-content.mjs enforces,
 * and it exists because shorter reads as a fragment and longer stops being
 * liftable as a single quote.
 *
 * @return array<int, array<string, mixed>>
 */
function fpc_seo_fields(string $prefix): array
{
    return [
        [
            'key'   => "field_{$prefix}_seo_tab",
            'label' => 'SEO & AEO',
            'type'  => 'tab',
        ],
        [
            'key'          => "field_{$prefix}_meta_title",
            'name'         => 'meta_title',
            'label'        => 'Meta title',
            'type'         => 'text',
            'maxlength'    => 60,
            'instructions' => 'Up to 60 characters. Falls back to the page title. Google truncates beyond roughly this width.',
        ],
        [
            'key'          => "field_{$prefix}_meta_description",
            'name'         => 'meta_description',
            'label'        => 'Meta description',
            'type'         => 'textarea',
            'rows'         => 2,
            'maxlength'    => 155,
            'instructions' => 'Up to 155 characters. Write it as a claim, not a summary.',
        ],
        [
            'key'          => "field_{$prefix}_quick_answer",
            'name'         => 'quick_answer',
            'label'        => 'Quick answer',
            'type'         => 'textarea',
            'rows'         => 4,
            'instructions' => '45–90 words answering the page’s question on its own, without the surrounding page. This is what an AI assistant lifts and cites, so it must make sense quoted in isolation.',
            'required'     => 0,
        ],
    ];
}

/**
 * FAQ repeater.
 *
 * Rendered visibly AND emitted as FAQPage schema from the same rows, so the
 * structured data can never claim a question the page does not actually answer
 * — which is the specific thing Google penalises FAQ markup for.
 *
 * @return array<string, mixed>
 */
function fpc_faq_repeater(string $prefix): array
{
    return [
        'key'          => "field_{$prefix}_faqs",
        'name'         => 'faqs',
        'label'        => 'FAQs',
        'type'         => 'repeater',
        'layout'       => 'block',
        'button_label' => 'Add FAQ',
        'instructions' => 'Rendered on the page and emitted as FAQPage schema from these same rows. Never add a question here that the page does not visibly answer.',
        'sub_fields'   => [
            [
                'key'          => "field_{$prefix}_faq_q",
                'name'         => 'question',
                'label'        => 'Question',
                'type'         => 'text',
                'required'     => 1,
                'instructions' => 'Phrase it the way a buyer would type it, not the way a brochure would title it.',
            ],
            [
                'key'      => "field_{$prefix}_faq_a",
                'name'     => 'answer',
                'label'    => 'Answer',
                'type'     => 'textarea',
                'rows'     => 4,
                'required' => 1,
            ],
        ],
    ];
}

function fpc_register_industry_fields(): void
{
    acf_add_local_field_group([
        'key'      => 'group_fpc_industry',
        'title'    => 'Industry',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'industry']]],
        'position' => 'normal',
        'style'    => 'default',
        'fields'   => [
            ['key' => 'field_ind_tab_basics', 'label' => 'Basics', 'type' => 'tab'],
            [
                'key'          => 'field_ind_name_singular',
                'name'         => 'name_singular',
                'label'        => 'Singular name',
                'type'         => 'text',
                'required'     => 1,
                'instructions' => 'e.g. "med spa" for the post titled "Med Spas". Used in running copy: "articles for {singular} owners".',
            ],
            [
                'key'          => 'field_ind_audience_noun',
                'name'         => 'audience_noun',
                'label'        => 'Audience noun',
                'type'         => 'text',
                'instructions' => 'What this industry’s buyers are called — "patients", "clients", "buyers". Used in the citation-sources copy.',
            ],
            [
                'key'          => 'field_ind_client_noun',
                'name'         => 'client_noun',
                'label'        => 'Client noun',
                'type'         => 'text',
                'instructions' => 'What we call a business in this industry — "clinic", "firm", "practice", "team".',
            ],
            [
                'key'      => 'field_ind_hero_tagline',
                'name'     => 'hero_tagline',
                'label'    => 'Hero tagline',
                'type'     => 'textarea',
                'rows'     => 2,
                'required' => 1,
            ],

            ['key' => 'field_ind_tab_pricing', 'label' => 'Pricing', 'type' => 'tab'],
            [
                'key'          => 'field_ind_tiers',
                'name'         => 'pricing_tiers',
                'label'        => 'Tiers',
                'type'         => 'repeater',
                'layout'       => 'block',
                'min'          => 3,
                'max'          => 3,
                'button_label' => 'Add tier',
                'instructions' => 'Exactly three. The founding rate and annual prepay price are CALCULATED from the list price — do not type them, or the cards and the Offer schema will disagree.',
                'sub_fields'   => [
                    ['key' => 'field_ind_tier_name', 'name' => 'name', 'label' => 'Name', 'type' => 'text', 'required' => 1],
                    [
                        'key'          => 'field_ind_tier_price',
                        'name'         => 'price',
                        'label'        => 'List price / month',
                        'type'         => 'number',
                        'required'     => 1,
                        'min'          => 0,
                        'prepend'      => '$',
                        'instructions' => 'Whole dollars. Founding rate = 25% off floored to the nearest $5.',
                    ],
                    ['key' => 'field_ind_tier_for', 'name' => 'for', 'label' => 'Who it is for', 'type' => 'text'],
                    ['key' => 'field_ind_tier_cta', 'name' => 'cta', 'label' => 'Button label', 'type' => 'text', 'default_value' => 'Get started'],
                    [
                        'key'           => 'field_ind_tier_featured',
                        'name'          => 'featured',
                        'label'         => 'Most popular',
                        'type'          => 'true_false',
                        'ui'            => 1,
                        'instructions'  => 'Exactly one tier should have this.',
                    ],
                    [
                        'key'          => 'field_ind_tier_features',
                        'name'         => 'features',
                        'label'        => 'What is included',
                        'type'         => 'repeater',
                        'layout'       => 'table',
                        'button_label' => 'Add line',
                        'sub_fields'   => [
                            ['key' => 'field_ind_tier_feature', 'name' => 'value', 'label' => 'Line', 'type' => 'text'],
                        ],
                    ],
                ],
            ],
            [
                'key'          => 'field_ind_enterprise_from',
                'name'         => 'enterprise_from',
                'label'        => 'Enterprise floor / month',
                'type'         => 'number',
                'prepend'      => '$',
                'instructions' => 'Sales-led band, shown as "from $X" rather than as a card. Not emitted as an Offer, because there is no fixed price to offer.',
            ],

            ['key' => 'field_ind_tab_sources', 'label' => 'Sources & compliance', 'type' => 'tab'],
            [
                'key'          => 'field_ind_citations',
                'name'         => 'citation_sources',
                'label'        => 'Citation sources',
                'type'         => 'repeater',
                'layout'       => 'table',
                'button_label' => 'Add source',
                'instructions' => 'The third-party sources AI engines lean on for this category. These are the sources we align the client’s entity against.',
                'sub_fields'   => [
                    ['key' => 'field_ind_citation_label', 'name' => 'label', 'label' => 'Label', 'type' => 'text', 'required' => 1],
                    ['key' => 'field_ind_citation_url', 'name' => 'url', 'label' => 'URL', 'type' => 'url', 'required' => 1],
                ],
            ],
            [
                'key'        => 'field_ind_compliance',
                'name'       => 'compliance',
                'label'      => 'Compliance profile',
                'type'       => 'group',
                'sub_fields' => [
                    [
                        'key'          => 'field_ind_compliance_note',
                        'name'         => 'note',
                        'label'        => 'Note',
                        'type'         => 'textarea',
                        'rows'         => 3,
                        'instructions' => 'What the advertising rules in this field actually constrain.',
                    ],
                    [
                        'key'          => 'field_ind_compliance_disclaimers',
                        'name'         => 'required_disclaimers',
                        'label'        => 'Required disclaimers',
                        'type'         => 'repeater',
                        'layout'       => 'table',
                        'sub_fields'   => [
                            ['key' => 'field_ind_compliance_disclaimer', 'name' => 'value', 'label' => 'Disclaimer', 'type' => 'text'],
                        ],
                    ],
                    [
                        'key'          => 'field_ind_compliance_sources',
                        'name'         => 'sources',
                        'label'        => 'Sources',
                        'type'         => 'repeater',
                        'layout'       => 'table',
                        'instructions' => 'A compliance claim whose source exists only in our own records is, to a reader and to an AI engine quoting the page, an uncited claim.',
                        'sub_fields'   => [
                            ['key' => 'field_ind_compliance_source_label', 'name' => 'label', 'label' => 'Label', 'type' => 'text'],
                            ['key' => 'field_ind_compliance_source_url', 'name' => 'url', 'label' => 'URL', 'type' => 'url'],
                        ],
                    ],
                ],
            ],

            ['key' => 'field_ind_tab_faq', 'label' => 'FAQs', 'type' => 'tab'],
            fpc_faq_repeater('ind'),

            ...fpc_seo_fields('ind'),
        ],
    ]);
}

function fpc_register_service_fields(): void
{
    acf_add_local_field_group([
        'key'      => 'group_fpc_service',
        'title'    => 'Service',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'service']]],
        'fields'   => [
            ['key' => 'field_svc_tab_basics', 'label' => 'Basics', 'type' => 'tab'],
            ['key' => 'field_svc_lead', 'name' => 'lead', 'label' => 'Lead paragraph', 'type' => 'textarea', 'rows' => 3],
            [
                'key'          => 'field_svc_deliverables',
                'name'         => 'deliverables',
                'label'        => 'What you get',
                'type'         => 'repeater',
                'layout'       => 'table',
                'button_label' => 'Add deliverable',
                'sub_fields'   => [
                    ['key' => 'field_svc_deliverable', 'name' => 'value', 'label' => 'Deliverable', 'type' => 'text'],
                ],
            ],
            [
                'key'          => 'field_svc_reasons',
                'name'         => 'reasons',
                'label'        => 'Why it matters',
                'type'         => 'repeater',
                'layout'       => 'block',
                'sub_fields'   => [
                    ['key' => 'field_svc_reason_heading', 'name' => 'heading', 'label' => 'Heading', 'type' => 'text'],
                    ['key' => 'field_svc_reason_body', 'name' => 'body', 'label' => 'Body', 'type' => 'textarea', 'rows' => 3],
                ],
            ],
            [
                'key'          => 'field_svc_sales_led',
                'name'         => 'sales_led',
                'label'        => 'Sales-led (no published price)',
                'type'         => 'true_false',
                'ui'           => 1,
                'default_value'=> 1,
                'instructions' => 'On means no Offer schema is emitted for this service. Only turn it off when there is a real, fixed, published price — schema must never state a price a buyer cannot actually pay.',
            ],

            ['key' => 'field_svc_tab_faq', 'label' => 'FAQs', 'type' => 'tab'],
            fpc_faq_repeater('svc'),

            ...fpc_seo_fields('svc'),
        ],
    ]);
}

function fpc_register_glossary_fields(): void
{
    acf_add_local_field_group([
        'key'      => 'group_fpc_glossary',
        'title'    => 'Glossary term',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'glossary_term']]],
        'fields'   => [
            [
                'key'          => 'field_gls_definition',
                'name'         => 'definition',
                'label'        => 'Definition',
                'type'         => 'textarea',
                'rows'         => 4,
                'required'     => 1,
                'instructions' => 'One self-contained paragraph. Emitted as DefinedTerm schema, so it has to stand alone when quoted.',
            ],
            [
                'key'   => 'field_gls_aka',
                'name'  => 'also_known_as',
                'label' => 'Also known as',
                'type'  => 'text',
            ],
        ],
    ]);
}

function fpc_register_post_fields(): void
{
    acf_add_local_field_group([
        'key'      => 'group_fpc_post',
        'title'    => 'Article',
        'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'post']]],
        'fields'   => [
            ...fpc_seo_fields('post'),
            [
                'key'          => 'field_post_updated',
                'name'         => 'updated',
                'label'        => 'Last substantively updated',
                'type'         => 'date_picker',
                'return_format'=> 'Y-m-d',
                'instructions' => 'Only set this when the article changed in substance. Emitted as dateModified — bumping it for a typo teaches engines the signal is meaningless.',
            ],
            fpc_faq_repeater('post'),
        ],
    ]);
}

/**
 * Sitewide settings.
 *
 * Options pages are ACF Pro. Without Pro the settings screen is absent and
 * fpc_option() falls through to the defaults in fields.php, so the site still
 * renders correct brand information — it just cannot be edited from the admin.
 */
function fpc_register_options(): void
{
    if (!function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page([
        'page_title' => 'Frontpaged Settings',
        'menu_title' => 'Frontpaged',
        'menu_slug'  => 'frontpaged-settings',
        'capability' => 'manage_options',
        'icon_url'   => 'dashicons-megaphone',
        'position'   => 3,
        'redirect'   => false,
    ]);

    acf_add_local_field_group([
        'key'      => 'group_fpc_options',
        'title'    => 'Settings',
        'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'frontpaged-settings']]],
        'fields'   => [
            ['key' => 'field_opt_tab_brand', 'label' => 'Brand', 'type' => 'tab'],
            ['key' => 'field_opt_brand_name', 'name' => 'brand_name', 'label' => 'Name', 'type' => 'text'],
            ['key' => 'field_opt_tagline', 'name' => 'tagline', 'label' => 'Tagline', 'type' => 'text'],
            ['key' => 'field_opt_description', 'name' => 'description', 'label' => 'Default description', 'type' => 'textarea', 'rows' => 3],
            ['key' => 'field_opt_email', 'name' => 'email', 'label' => 'Email', 'type' => 'email'],
            ['key' => 'field_opt_phone', 'name' => 'phone', 'label' => 'Phone (display)', 'type' => 'text'],
            ['key' => 'field_opt_phone_href', 'name' => 'phone_href', 'label' => 'Phone (tel: link)', 'type' => 'text'],
            ['key' => 'field_opt_linkedin', 'name' => 'linkedin', 'label' => 'LinkedIn (company)', 'type' => 'url'],
            ['key' => 'field_opt_instagram', 'name' => 'instagram', 'label' => 'Instagram', 'type' => 'url'],
            ['key' => 'field_opt_calendly', 'name' => 'calendly', 'label' => 'Calendly URL', 'type' => 'url'],
            ['key' => 'field_opt_form', 'name' => 'form_endpoint', 'label' => 'Form endpoint', 'type' => 'url', 'instructions' => 'Third-party form POST target. Empty renders the mailto fallback instead of a form that posts nowhere.'],

            ['key' => 'field_opt_tab_founding', 'label' => 'Founding programme', 'type' => 'tab'],
            [
                'key'          => 'field_opt_founding_enabled',
                'name'         => 'founding_enabled',
                'label'        => 'Advertise founding rate',
                'type'         => 'true_false',
                'ui'           => 1,
                'instructions' => 'Off retires the banner, the struck-through prices AND the schema discount everywhere at once. Turn it off when the slots are gone — schema must state the price a buyer actually pays.',
            ],
            ['key' => 'field_opt_founding_slots', 'name' => 'founding_slots', 'label' => 'Slots per industry', 'type' => 'number'],
            ['key' => 'field_opt_founding_headline', 'name' => 'founding_headline', 'label' => 'Headline', 'type' => 'text'],
            ['key' => 'field_opt_founding_terms', 'name' => 'founding_terms', 'label' => 'Terms', 'type' => 'textarea', 'rows' => 3],
            ['key' => 'field_opt_guarantee', 'name' => 'guarantee', 'label' => 'Guarantee', 'type' => 'textarea', 'rows' => 2, 'instructions' => 'Never promise rankings.'],

            ['key' => 'field_opt_tab_founder', 'label' => 'Founder', 'type' => 'tab'],
            ['key' => 'field_opt_founder_name', 'name' => 'founder_name', 'label' => 'Name', 'type' => 'text'],
            ['key' => 'field_opt_founder_role', 'name' => 'founder_role', 'label' => 'Role', 'type' => 'text'],
            ['key' => 'field_opt_founder_bio', 'name' => 'founder_bio', 'label' => 'Bio', 'type' => 'textarea', 'rows' => 5],
            ['key' => 'field_opt_founder_linkedin', 'name' => 'founder_linkedin', 'label' => 'LinkedIn (personal)', 'type' => 'url', 'instructions' => 'The Person node’s sameAs. This is what ties 56 bylines to a verifiable individual rather than to a name string.'],
            [
                'key'          => 'field_opt_credentials',
                'name'         => 'credentials',
                'label'        => 'Credentials',
                'type'         => 'repeater',
                'layout'       => 'table',
                'sub_fields'   => [
                    ['key' => 'field_opt_credential', 'name' => 'value', 'label' => 'Credential', 'type' => 'text'],
                ],
            ],
            ['key' => 'field_opt_credential_issuer', 'name' => 'credential_issuer', 'label' => 'Issuer', 'type' => 'text'],

            ['key' => 'field_opt_tab_tracking', 'label' => 'Tracking', 'type' => 'tab'],
            ['key' => 'field_opt_gtm', 'name' => 'gtm_id', 'label' => 'GTM container ID', 'type' => 'text', 'instructions' => 'Empty removes the container sitewide.'],
        ],
    ]);
}
