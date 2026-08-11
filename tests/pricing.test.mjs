import test from "node:test";
import assert from "node:assert/strict";
import { foundingPrice, annualPrice } from "../src/lib/verticals/pricing.ts";

// These three values are already published on the live pricing page and in the
// Offer schema. A formula change that moves them is a regression, not a refactor.
test("foundingPrice reproduces the published med-spa rates", () => {
  assert.equal(foundingPrice(1500), 1125);
  assert.equal(foundingPrice(2750), 2060);
  assert.equal(foundingPrice(4000), 3000);
});

// Math.round(2750 * 0.75) is 2063, not 2060. The floor-to-$5 is what makes the
// published value fall out of the formula instead of needing a hand-maintained field.
test("foundingPrice floors to the nearest $5", () => {
  assert.equal(foundingPrice(2750), 2060);
  assert.notEqual(foundingPrice(2750), Math.round(2750 * 0.75));
});

test("foundingPrice divides cleanly for every band in the spec", () => {
  const listPrices = [
    1500, 2750, 4000, 2000, 3500, 5500, 2500, 4500,
    7000, 6500, 3000, 5000, 8000, 8500, 14000,
  ];
  for (const p of listPrices) {
    const f = foundingPrice(p);
    assert.equal(f % 5, 0, `${p} -> ${f} is not a multiple of 5`);
    assert.ok(f < p, `${p} -> ${f} is not a discount`);
    assert.ok(f >= p * 0.74, `${p} -> ${f} discounts more than 26%`);
  }
});

test("annualPrice is ten months' fee", () => {
  assert.equal(annualPrice(1500), 15000);
  assert.equal(annualPrice(2750), 27500);
  assert.equal(annualPrice(4000), 40000);
});
