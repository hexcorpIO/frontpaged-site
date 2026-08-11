import test from "node:test";
import assert from "node:assert/strict";
import { verticals, getVertical, getPublishedSlugs } from "../src/lib/verticals/index.ts";
import { foundingPrice } from "../src/lib/verticals/pricing.ts";

test("every slug is unique", () => {
  const slugs = verticals.map((v) => v.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("getVertical resolves a known slug and rejects an unknown one", () => {
  assert.equal(getVertical("med-spas")?.slug, "med-spas");
  assert.equal(getVertical("no-such-vertical"), undefined);
});

test("every band has three tiers with exactly one featured", () => {
  for (const v of verticals) {
    assert.equal(v.pricing.tiers.length, 3, `${v.slug} has ${v.pricing.tiers.length} tiers`);
    const featured = v.pricing.tiers.filter((t) => t.featured);
    assert.equal(featured.length, 1, `${v.slug} has ${featured.length} featured tiers`);
  }
});

test("tiers ascend in price and enterprise sits above them", () => {
  for (const v of verticals) {
    const prices = v.pricing.tiers.map((t) => t.price);
    assert.deepEqual(prices, [...prices].sort((a, b) => a - b), `${v.slug} tiers out of order`);
    assert.ok(v.pricing.enterpriseFrom > Math.max(...prices), `${v.slug} enterprise too low`);
  }
});

test("med-spas still prices exactly as published today", () => {
  const med = getVertical("med-spas");
  assert.deepEqual(med.pricing.tiers.map((t) => t.price), [1500, 2750, 4000]);
  assert.deepEqual(med.pricing.tiers.map((t) => foundingPrice(t.price)), [1125, 2060, 3000]);
});

// The anti-doorway rule that is cheapest to enforce and easiest to violate.
test("no FAQ question is reused across verticals", () => {
  const seen = new Map();
  for (const v of verticals) {
    for (const { q } of v.faqs) {
      const key = q.toLowerCase().replace(/\s+/g, " ").trim();
      assert.equal(seen.has(key), false, `"${q}" appears in both ${seen.get(key)} and ${v.slug}`);
      seen.set(key, v.slug);
    }
  }
});

test("every vertical meets the minimum content requirements", () => {
  for (const v of verticals) {
    assert.ok(v.faqs.length >= 6, `${v.slug} has ${v.faqs.length} FAQs, want >=6`);
    assert.ok(v.citationSources.length >= 2, `${v.slug} has <2 citation sources`);
    assert.ok(v.compliance.sources.length >= 1, `${v.slug} compliance is uncited`);
    assert.ok(v.metaTitle.length <= 60, `${v.slug} metaTitle is ${v.metaTitle.length} chars`);
    assert.ok(
      v.metaDescription.length >= 70 && v.metaDescription.length <= 155,
      `${v.slug} metaDescription is ${v.metaDescription.length} chars`
    );
    const qaWords = v.quickAnswer.split(/\s+/).filter(Boolean).length;
    assert.ok(qaWords >= 45 && qaWords <= 90, `${v.slug} quickAnswer is ${qaWords} words`);
  }
});

test("published slugs are a subset of all slugs", () => {
  const all = new Set(verticals.map((v) => v.slug));
  for (const s of getPublishedSlugs()) assert.ok(all.has(s));
});
