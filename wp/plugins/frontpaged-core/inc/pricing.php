<?php
/**
 * Pricing maths, ported from src/lib/verticals/pricing.ts.
 *
 * These functions decide numbers that are published on the live pricing page
 * AND stated in the Offer schema, so the two can never be allowed to disagree.
 *
 * The floor-to-$5 is not cosmetic. Math.round(2750 * 0.75) is 2063; the rate
 * actually published for the Authority tier is 2060. Rounding instead of
 * flooring would silently reprice a live page and put a number in the schema
 * that no buyer is ever charged, which is the kind of thing that gets an Offer
 * flagged rather than merely being wrong.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

/** Founding rate: 25% off, floored to the nearest $5. */
function fpc_founding_price(int $price): int
{
    return (int) (floor(($price * 0.75) / 5) * 5);
}

/** Annual prepay: ten months for twelve. */
function fpc_annual_price(int $price): int
{
    return $price * 10;
}

/** Whether the founding-client programme is currently advertised. */
function fpc_founding_enabled(): bool
{
    return (bool) fpc_option('founding_enabled', true);
}

/**
 * The price a buyer actually pays right now.
 *
 * Schema must state this rather than the list price — an Offer advertising a
 * number nobody is charged is a misrepresentation, and it is also the number
 * an AI assistant will quote when asked what this costs.
 */
function fpc_effective_price(int $price): int
{
    return fpc_founding_enabled() ? fpc_founding_price($price) : $price;
}

function fpc_usd(int $n): string
{
    return '$' . number_format($n);
}

/**
 * Cheapest and dearest published monthly prices across every industry.
 *
 * Computed rather than stored, so the Organization priceRange cannot drift from
 * the per-industry Offers the way a hand-written string once did — the old site
 * had a priceRange quoting list prices while makesOffer quoted founding rates,
 * which is one document contradicting itself.
 */
function fpc_site_price_range(): string
{
    $prices = [];

    foreach (fpc_all_industries() as $industry) {
        foreach (fpc_industry_tiers($industry->ID) as $tier) {
            $prices[] = fpc_effective_price((int) $tier['price']);
        }
    }

    if ($prices === []) {
        return '';
    }

    return fpc_usd(min($prices)) . '-' . fpc_usd(max($prices));
}
