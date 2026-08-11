import type { PricingBand, Vertical } from "./types";

/**
 * Founding-client rate: 25% off, floored to the nearest $5.
 *
 * The floor is load-bearing. A plain Math.round(price * 0.75) returns 2063 for
 * the $2,750 Authority tier, but the rate already published on the pricing page
 * and in the Offer schema is 2060 — rounded down by hand to a cleaner number.
 * Flooring to $5 makes all three published med-spa rates fall out of the formula
 * (1500 -> 1125, 2750 -> 2060, 4000 -> 3000), which is what lets the three
 * hand-maintained `foundingPrice` fields be deleted without changing any price.
 */
export const foundingPrice = (price: number): number =>
  Math.floor((price * 0.75) / 5) * 5;

/** Annual prepay: ten months' fee for twelve months of work. */
export const annualPrice = (price: number): number => price * 10;

/** Cheapest founding rate to dearest list price within one band. */
export function bandRange(band: PricingBand): { min: number; max: number } {
  const prices = band.tiers.map((t) => t.price);
  return {
    min: foundingPrice(Math.min(...prices)),
    max: Math.max(...prices),
  };
}

/**
 * Sitewide priceRange for the Organization schema.
 *
 * Spans the cheapest founding rate to the dearest Domination list price across
 * published verticals. Schema must state what a buyer actually pays, so the
 * bottom of the range is a founding rate, not a list price. Enterprise is
 * excluded — it is custom and sales-led, not a published offering.
 */
export function sitePriceRange(verticals: Vertical[]): string {
  const published = verticals.filter((v) => v.published);
  if (published.length === 0) return "";
  const ranges = published.map((v) => bandRange(v.pricing));
  const min = Math.min(...ranges.map((r) => r.min));
  const max = Math.max(...ranges.map((r) => r.max));
  return `$${min.toLocaleString("en-US")}–$${max.toLocaleString("en-US")}/mo`;
}
