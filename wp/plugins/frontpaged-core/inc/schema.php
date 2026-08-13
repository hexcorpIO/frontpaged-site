<?php
/**
 * JSON-LD, ported from the Next.js site's entity graph.
 *
 * This is the part of the site that most directly does the job the business
 * sells, so it is worth stating what it is actually doing.
 *
 * It emits ONE @graph per page rather than several loose script tags. That
 * matters because the nodes reference each other by @id — the Person who wrote
 * an article is the same Person who founded the Organization that offers the
 * Service — and an engine can only follow those references if the nodes arrive
 * together. Loose scripts describing the same entity twice, slightly
 * differently, is precisely the incoherence that makes a model hedge instead of
 * naming you.
 *
 * Stable @ids, all derived from the home URL so they survive a domain change:
 *
 *   {home}/#org                Organization      — the company
 *   {home}/#website            WebSite           — the site itself
 *   {home}/about/#founder      Person            — the founder, bylines point here
 *   {permalink}#page           WebPage           — this page
 *   {permalink}#service        Service           — what an industry page sells
 *   {permalink}#faq            FAQPage
 *   {permalink}#breadcrumb     BreadcrumbList
 *
 * No SEO plugin is installed, deliberately. Yoast and RankMath emit their own
 * competing graph, and two graphs describing the same entity differently is
 * worse than either alone.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

function fpc_id(string $fragment = ''): string
{
    return trailingslashit(home_url('/')) . ltrim($fragment, '/');
}

function fpc_founder_id(): string
{
    return fpc_id('about/') . '#founder';
}

/** The company. Referenced by everything else. */
function fpc_organization_node(): array
{
    $sameAs = array_values(array_filter([
        fpc_option('linkedin'),
        fpc_option('instagram'),
    ]));

    $node = [
        '@type'       => 'Organization',
        '@id'         => fpc_id('#org'),
        'name'        => fpc_option('brand_name'),
        'url'         => fpc_id(),
        'description' => fpc_option('description'),
        'slogan'      => fpc_option('tagline'),
        'email'       => fpc_option('email'),
        'founder'     => ['@id' => fpc_founder_id()],
        'areaServed'  => [
            '@type' => 'Country',
            'name'  => 'United States',
        ],
        'contactPoint' => [
            '@type'             => 'ContactPoint',
            'contactType'       => 'sales',
            'email'             => fpc_option('email'),
            'telephone'         => fpc_option('phone'),
            'availableLanguage' => 'English',
        ],
    ];

    if ($sameAs !== []) {
        $node['sameAs'] = $sameAs;
    }

    // Computed from the live tiers, so it cannot contradict the per-industry
    // Offers the way a hand-written range once did.
    $range = fpc_site_price_range();
    if ($range !== '') {
        $node['priceRange'] = $range;
    }

    if ($phone = fpc_option('phone')) {
        $node['telephone'] = $phone;
    }

    return $node;
}

function fpc_website_node(): array
{
    return [
        '@type'     => 'WebSite',
        '@id'       => fpc_id('#website'),
        'url'       => fpc_id(),
        'name'      => fpc_option('brand_name'),
        'publisher' => ['@id' => fpc_id('#org')],
        'inLanguage'=> 'en-US',
    ];
}

/**
 * The founder.
 *
 * This node is what lets an engine tie 56 bylines to a real, verifiable
 * individual rather than to a name string — which is most of what E-E-A-T
 * amounts to in practice for a one-person agency.
 */
function fpc_person_node(): array
{
    $node = [
        '@type'      => 'Person',
        '@id'        => fpc_founder_id(),
        'name'       => fpc_option('founder_name'),
        'jobTitle'   => fpc_option('founder_role'),
        'worksFor'   => ['@id' => fpc_id('#org')],
        'url'        => fpc_id('about/'),
    ];

    if ($bio = fpc_option('founder_bio')) {
        $node['description'] = $bio;
    }

    if ($linkedin = fpc_option('founder_linkedin')) {
        $node['sameAs'] = [$linkedin];
    }

    $credentials = fpc_option_rows('credentials');
    if ($credentials !== []) {
        $issuer = fpc_option('credential_issuer');
        $node['hasCredential'] = array_map(
            static fn(string $name): array => [
                '@type'                => 'EducationalOccupationalCredential',
                'credentialCategory'   => 'certificate',
                'name'                 => $name,
                'recognizedBy'         => ['@type' => 'Organization', 'name' => $issuer],
            ],
            $credentials
        );
    }

    return $node;
}

/**
 * What an industry page sells.
 *
 * `audience` is the node that makes eight industry pages genuinely distinct
 * entities rather than one service described eight times — which is the
 * difference between a legitimate vertical strategy and a doorway-page pattern.
 */
function fpc_service_node(WP_Post $industry): array
{
    $permalink = get_permalink($industry);
    $singular  = (string) (fpc_field('name_singular', $industry->ID) ?: $industry->post_title);

    $node = [
        '@type'       => 'Service',
        '@id'         => $permalink . '#service',
        'name'        => sprintf('SEO & Generative Engine Optimization for %s', $industry->post_title),
        'serviceType' => 'Generative Engine Optimization',
        'provider'    => ['@id' => fpc_id('#org')],
        'areaServed'  => ['@type' => 'Country', 'name' => 'United States'],
        'audience'    => [
            '@type'         => 'BusinessAudience',
            'name'          => $industry->post_title,
            'audienceType'  => $singular,
        ],
        'description' => (string) (fpc_field('hero_tagline', $industry->ID) ?: get_the_excerpt($industry)),
    ];

    $offers = fpc_offer_nodes($industry);
    if ($offers !== []) {
        $node['offers'] = $offers;
    }

    return $node;
}

/**
 * Offers.
 *
 * States the price a buyer actually pays today — the founding rate while the
 * programme runs, the list price after. An Offer advertising a number nobody is
 * charged is a misrepresentation, and it is also the number an assistant will
 * quote when asked what this costs.
 *
 * The enterprise band is deliberately NOT an Offer: "from $8,000" is a starting
 * point for a negotiation, not a price, and schema has no honest way to say so.
 */
function fpc_offer_nodes(WP_Post $industry): array
{
    $offers = [];

    foreach (fpc_industry_tiers($industry->ID) as $tier) {
        $list = (int) ($tier['price'] ?? 0);
        if ($list <= 0) {
            continue;
        }

        $offers[] = [
            '@type'         => 'Offer',
            'name'          => (string) ($tier['name'] ?? ''),
            'price'         => (string) fpc_effective_price($list),
            'priceCurrency' => 'USD',
            'availability'  => 'https://schema.org/InStock',
            'url'           => get_permalink($industry),
            'priceSpecification' => [
                '@type'          => 'UnitPriceSpecification',
                'price'          => (string) fpc_effective_price($list),
                'priceCurrency'  => 'USD',
                'unitCode'       => 'MON',
                'billingDuration'=> 1,
                'billingIncrement' => 1,
            ],
        ];
    }

    return $offers;
}

/**
 * FAQPage, built from the same rows the page renders visibly.
 *
 * Not from a separate field, on purpose: marking up a question the page does
 * not visibly answer is the specific thing Google issues manual actions for.
 */
function fpc_faq_node(int $post_id, string $permalink): ?array
{
    $faqs = fpc_faqs($post_id);
    if ($faqs === []) {
        return null;
    }

    return [
        '@type'      => 'FAQPage',
        '@id'        => $permalink . '#faq',
        'mainEntity' => array_map(
            static fn(array $f): array => [
                '@type'          => 'Question',
                'name'           => (string) ($f['question'] ?? ''),
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => (string) ($f['answer'] ?? ''),
                ],
            ],
            $faqs
        ),
    ];
}

/** @param array<int, array{name:string,url?:string}> $crumbs */
function fpc_breadcrumb_node(array $crumbs, string $permalink): array
{
    return [
        '@type'           => 'BreadcrumbList',
        '@id'             => $permalink . '#breadcrumb',
        'itemListElement' => array_values(array_map(
            static fn(int $i, array $c): array => array_filter([
                '@type'    => 'ListItem',
                'position' => $i + 1,
                'name'     => $c['name'],
                'item'     => $c['url'] ?? null,
            ]),
            array_keys($crumbs),
            $crumbs
        )),
    ];
}

function fpc_blogposting_node(WP_Post $post): array
{
    $permalink = get_permalink($post);
    $updated   = fpc_field('updated', $post->ID);

    return array_filter([
        '@type'            => 'BlogPosting',
        '@id'              => $permalink . '#article',
        'headline'         => get_the_title($post),
        'description'      => fpc_meta_description($post),
        'datePublished'    => get_the_date('c', $post),
        'dateModified'     => $updated ? date('c', strtotime((string) $updated)) : get_the_modified_date('c', $post),
        'author'           => ['@id' => fpc_founder_id()],
        'publisher'        => ['@id' => fpc_id('#org')],
        'isPartOf'         => ['@id' => fpc_id('#website')],
        'mainEntityOfPage' => ['@id' => $permalink . '#page'],
        'inLanguage'       => 'en-US',
    ]);
}

/**
 * Assemble and print the graph for whatever is currently being rendered.
 */
function fpc_print_schema(): void
{
    $graph = [fpc_organization_node(), fpc_website_node(), fpc_person_node()];
    $permalink = fpc_current_url();
    $crumbs = [['name' => 'Home', 'url' => fpc_id()]];

    if (is_singular('industry')) {
        $post = get_post();
        $graph[] = fpc_service_node($post);
        $crumbs[] = ['name' => 'Industries', 'url' => fpc_id('industries/')];
        $crumbs[] = ['name' => get_the_title($post)];
    } elseif (is_singular('service')) {
        $post = get_post();
        $crumbs[] = ['name' => 'Services', 'url' => fpc_id('services/')];
        $crumbs[] = ['name' => get_the_title($post)];
    } elseif (is_singular('post')) {
        $post = get_post();
        $graph[] = fpc_blogposting_node($post);
        $crumbs[] = ['name' => 'Blog', 'url' => fpc_id('blog/')];
        $crumbs[] = ['name' => get_the_title($post)];
    } elseif (is_page()) {
        $crumbs[] = ['name' => get_the_title()];
    } elseif (is_post_type_archive('industry')) {
        $crumbs[] = ['name' => 'Industries'];
    } elseif (is_post_type_archive('service')) {
        $crumbs[] = ['name' => 'Services'];
    }

    // The glossary is a DefinedTermSet rather than 32 thin pages. Each term is
    // a node inside it, so an engine can quote one definition and attribute it,
    // without the site publishing a page per term — which is the doorway
    // pattern its own content gate exists to prevent.
    if (is_page('glossary')) {
        $terms = get_posts([
            'post_type' => 'glossary_term', 'posts_per_page' => -1,
            'orderby' => 'title', 'order' => 'ASC',
        ]);
        if ($terms !== []) {
            $graph[] = [
                '@type'       => 'DefinedTermSet',
                '@id'         => $permalink . '#glossary',
                'name'        => 'Frontpaged Glossary',
                'url'         => $permalink,
                'hasDefinedTerm' => array_map(
                    static fn(WP_Post $t): array => [
                        '@type'       => 'DefinedTerm',
                        '@id'         => $permalink . '#' . $t->post_name,
                        'name'        => get_the_title($t),
                        'description' => (string) fpc_field('definition', $t->ID),
                        'inDefinedTermSet' => ['@id' => $permalink . '#glossary'],
                    ],
                    $terms
                ),
            ];
        }
    }

    if (is_singular()) {
        $faq = fpc_faq_node(get_the_ID(), $permalink);
        if ($faq !== null) {
            $graph[] = $faq;
        }

        $graph[] = [
            '@type'       => 'WebPage',
            '@id'         => $permalink . '#page',
            'url'         => $permalink,
            'name'        => fpc_meta_title(get_post()),
            'description' => fpc_meta_description(get_post()),
            'isPartOf'    => ['@id' => fpc_id('#website')],
            'about'       => ['@id' => fpc_id('#org')],
        ];
    }

    if (count($crumbs) > 1) {
        $graph[] = fpc_breadcrumb_node($crumbs, $permalink);
    }

    printf(
        "<script type=\"application/ld+json\">%s</script>\n",
        wp_json_encode(
            ['@context' => 'https://schema.org', '@graph' => $graph],
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        )
    );
}
add_action('wp_head', 'fpc_print_schema', 20);

/**
 * Sitewide option repeaters (credentials), with the same no-ACF fallback as
 * post fields.
 *
 * @return string[]
 */
function fpc_option_rows(string $name): array
{
    if (fpc_has_acf()) {
        $rows = get_field($name, 'option');
        if (is_array($rows)) {
            return array_values(array_filter(array_map(
                static fn($r) => is_array($r) ? (string) reset($r) : (string) $r,
                $rows
            )));
        }
    }

    $count = (int) get_option('options_' . $name, 0);
    $out = [];
    for ($i = 0; $i < $count; $i++) {
        $value = get_option("options_{$name}_{$i}_value", '');
        if ($value !== '') {
            $out[] = (string) $value;
        }
    }

    // No hardcoded fallback here, deliberately. There was one, returning the two
    // Google certificates when the option was empty — and it hid a real bug: the
    // credentials repeater was importing as zero rows for want of a field-key
    // reference, while the schema went on emitting two credentials as though
    // everything worked. A default that makes a broken import look successful is
    // worse than an empty node.
    return $out;
}
