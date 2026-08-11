# Multi-Vertical Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition frontpaged.io from a med-spa-only SEO/GEO agency to one serving eight high-ticket local verticals, without losing the topical authority the existing med-spa content has earned.

**Architecture:** Hub-and-spoke. A `Vertical` record per industry owns all machine-readable data (pricing, FAQs, schema, compliance); a bespoke Markdown body owns the prose. A single `/industries/[slug]/` route composes the two. The record guarantees pricing cards and `Offer` schema cannot drift; the bespoke bodies plus an automated similarity gate prevent templated doorway pages.

**Tech Stack:** Next.js 16.2.9 (App Router, `output: "export"`, `trailingSlash: true`), React 19.2.4, TypeScript 5, Tailwind 4, `gray-matter` + `marked` for Markdown, `node --test` for unit tests (built in — no new dependency).

**Spec:** `docs/superpowers/specs/2026-08-11-multi-vertical-repositioning-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Read `node_modules/next/dist/docs/01-app` before writing any route or metadata code.** Per `AGENTS.md`, this Next.js version's conventions may differ from training data. Heed deprecation notices.
- **Static export only.** No server, no runtime data fetching, no `next/image` optimization, no route handlers that need Node at request time. Everything resolves at build.
- **Trailing slashes everywhere.** Routes emit `/path/index.html`. All internal links and every schema `@id` must end in `/`.
- **Tailwind utility classes only.** No new CSS files.
- **Components PascalCase, one section per component.**
- **Mobile-first responsive.**
- **Markdown pipeline:** `gray-matter` for frontmatter + `marked` for HTML, exactly as `src/lib/blog.ts` does. **Do not add MDX.**
- **No new runtime dependencies.** Tests use `node --test` with built-in TypeScript type stripping (requires Node ≥22.18; CI's `node-version: 22` resolves to that).
- **Titles ≤60 characters. Meta descriptions 70–155 characters.** Enforced by `scripts/check-seo.mjs`.
- **Schema `provider` is always Frontpaged.** Never emit schema implying Frontpaged is a law firm or medical practice. The vertical goes in `audience`.
- **Compliance copy never promises regulatory compliance.** Pages say Frontpaged *writes to* a client's bar/fair-housing rules and routes final copy through the client's own review. Never "we guarantee compliance." No legal advice.
- **Uncited statistics are removed, not softened**, unless the owner supplies a source (spec §13.2).
- **Founding rate formula:** `Math.floor(price * 0.75 / 5) * 5`. Verified to reproduce the published med-spa rates 1125 / 2060 / 3000.
- **Never change an existing blog post's URL, title, or prose.** Frontmatter
  additions are allowed. One exception, resolved pre-flight: the single internal
  link to `/services/med-spa-seo/` in
  `content/blog/med-spa-service-page-template.md` is repointed at
  `/industries/med-spas/` in Task 9, so no internal link fires a redirect.

---

## File Structure

**New — data layer**
| File | Responsibility |
|---|---|
| `src/lib/verticals/types.ts` | `Vertical`, `PricingBand`, `Tier`, `ComplianceProfile`, `SourceRef`, `EntityRef` |
| `src/lib/verticals/pricing.ts` | `foundingPrice`, `annualPrice`, `bandRange`, `sitePriceRange` |
| `src/lib/verticals/index.ts` | Registry array, `getVertical`, `getPublishedVerticals`, `getPublishedSlugs` |
| `src/lib/verticals/<slug>.ts` × 8 | One record per vertical, data only |
| `src/lib/industries.ts` | Loads `content/industries/*.md`, mirrors `src/lib/blog.ts` |

**New — content**
| File | Responsibility |
|---|---|
| `content/industries/<slug>.md` × 8 | Bespoke prose body, unique structure per vertical |

**New — routes & components**
| File | Responsibility |
|---|---|
| `src/app/industries/page.tsx` | Hub index |
| `src/app/industries/[slug]/page.tsx` | Hub page — composes record + body + schema |
| `src/app/industries/[slug]/opengraph-image.tsx` | Per-vertical OG image |
| `src/components/IndustryGrid.tsx` | Eight cards, registry-driven |
| `src/components/PricingBand.tsx` | Tier cards for one vertical's band |
| `src/components/ComplianceNote.tsx` | Regime summary + disclaimers |

**New — verification**
| File | Responsibility |
|---|---|
| `tests/pricing.test.mjs` | Unit tests for the pricing math |
| `tests/verticals.test.mjs` | Registry integrity + cross-vertical FAQ uniqueness |
| `scripts/check-seo.mjs` | Titles, descriptions, h1, og:image, canonical, JSON-LD over `out/` |
| `scripts/check-duplication.mjs` | Pairwise hub-body similarity gate |
| `scripts/check-links.mjs` | Internal links and anchors over `out/` |

**Modified**
`src/lib/site.ts` (shrinks) · `src/app/page.tsx` · `src/app/pricing/page.tsx` · `src/app/faq/page.tsx` · `src/app/glossary/page.tsx` · `src/app/about/page.tsx` · `src/app/contact/page.tsx` · `src/app/llms.txt/route.ts` · `src/app/sitemap.ts` · `src/components/JsonLd.tsx` · `src/components/SiteHeader.tsx` · `src/components/SiteFooter.tsx` · `src/components/Problem.tsx` · `src/components/StatsBand.tsx` · `src/components/Pricing.tsx` · `src/app/services/generative-engine-optimization/page.tsx` · `src/app/services/google-business-profile/page.tsx` · `scripts/check-content.mjs` · `package.json` · `.github/workflows/deploy.yml` · 28 files in `content/blog/`

**Deleted**
`src/app/services/med-spa-seo/page.tsx` — replaced by a 301 to `/industries/med-spas/`

---

## Task 1: Vertical types and pricing math

**Files:**
- Create: `src/lib/verticals/types.ts`
- Create: `src/lib/verticals/pricing.ts`
- Test: `tests/pricing.test.mjs`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Consumes: nothing — this is the foundation task.
- Produces: `Vertical`, `PricingBand`, `Tier`, `ComplianceProfile`, `ComplianceRegime`, `SourceRef`, `EntityRef` types; `foundingPrice(price: number): number`, `annualPrice(price: number): number`, `bandRange(band: PricingBand): { min: number; max: number }`, `sitePriceRange(verticals: Vertical[]): string`.

- [ ] **Step 1: Write the failing test**

Create `tests/pricing.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node --test tests/pricing.test.mjs
```

Expected: FAIL — `Cannot find module '../src/lib/verticals/pricing.ts'`.

- [ ] **Step 3: Create the types**

Create `src/lib/verticals/types.ts`:

```ts
// Shape of a vertical. Data only — prose lives in content/industries/<slug>.md.
//
// The core invariant: `pricing` is read by BOTH the pricing cards and the Offer
// schema on the same page, so the two can never disagree. That guarantee is the
// reason hub pages are data-driven rather than eight hand-written files.

export type Faq = { q: string; a: string };

/** A citation. Every statistic and every compliance claim carries one. */
export type SourceRef = { label: string; url: string };

/** A schema.org Thing with a Wikipedia sameAs, for `knowsAbout` entity linking. */
export type EntityRef = { name: string; sameAs: string };

export type Tier = {
  name: string;
  /** Monthly list price in USD. Founding and annual rates are derived, never stored. */
  price: number;
  featured?: boolean;
  for: string;
  features: string[];
  cta: string;
};

export type PricingBand = {
  /** Exactly three tiers, cheapest first. Exactly one carries `featured: true`. */
  tiers: Tier[];
  /** Floor of the sales-led Enterprise band for this vertical. */
  enterpriseFrom: number;
};

export type ComplianceRegime = "medical" | "legal" | "real-estate";

export type ComplianceProfile = {
  regime: ComplianceRegime;
  /** Rendered as a trust section on the hub. Never promises compliance. */
  summary: string;
  /** Claims we refuse to write for a client in this vertical. */
  weWillNot: string[];
  /** Rendered verbatim in the hub page footer. */
  requiredDisclaimers: string[];
  /** Primary sources for the rules above. Required — no uncited claims. */
  sources: SourceRef[];
};

export type Vertical = {
  slug: string;
  /** Plural. Nav and headings. */
  name: string;
  /** Singular, lowercase. Inline prose. */
  nameSingular: string;
  /** What we call the client: clinic | practice | firm | team. */
  clientNoun: string;
  /** What the client calls their customer: patients | members | clients | families | sellers. */
  audienceNoun: string;
  /** Overrides site.tagline in this hero only. */
  heroTagline: string;
  /** <=60 chars including any suffix. */
  metaTitle: string;
  /** 70-155 chars. */
  metaDescription: string;
  /** Answer-first block. The extraction target for AI engines. 45-90 words. */
  quickAnswer: string;
  pricing: PricingBand;
  /** >=6, and no question may repeat across verticals. */
  faqs: Faq[];
  knowsAbout: EntityRef[];
  serviceType: string;
  /** Third-party sources AI engines pull from in THIS category. >=2. */
  citationSources: SourceRef[];
  /** Blog tags surfaced on this hub. */
  postTags: string[];
  glossaryTerms: string[];
  compliance: ComplianceProfile;
  foundingSlotsRemaining: number;
  /** False hides the vertical from nav, sitemap, the index, and llms.txt. */
  published: boolean;
};
```

- [ ] **Step 4: Implement the pricing math**

Create `src/lib/verticals/pricing.ts`:

```ts
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
```

- [ ] **Step 5: Add the test script**

In `package.json`, add to `scripts`:

```json
"test": "node --test tests/"
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
pnpm test
```

Expected: PASS — 4 tests, 0 failures.

- [ ] **Step 7: Commit**

```bash
git add src/lib/verticals/types.ts src/lib/verticals/pricing.ts tests/pricing.test.mjs package.json
git commit -m "feat(verticals): add Vertical types and derived pricing math

Founding rate floors to the nearest \$5 so the three published med-spa
rates (1125/2060/3000) fall out of the formula. Math.round would return
2063 for the \$2,750 tier and silently reprice a live page."
```

---

## Task 2: Registry and the first two vertical records

Two records, deliberately the most dissimilar pair (`med-spas` and `personal-injury-law`), so the types are exercised across both compliance regimes and both ends of the pricing range before the other six are written.

**Files:**
- Create: `src/lib/verticals/index.ts`
- Create: `src/lib/verticals/med-spas.ts`
- Create: `src/lib/verticals/personal-injury-law.ts`
- Test: `tests/verticals.test.mjs`

**Interfaces:**
- Consumes: all types from `src/lib/verticals/types.ts`; `sitePriceRange` from `pricing.ts`.
- Produces: `verticals: Vertical[]`, `getVertical(slug: string): Vertical | undefined`, `getPublishedVerticals(): Vertical[]`, `getPublishedSlugs(): string[]`.

- [ ] **Step 1: Write the failing test**

Create `tests/verticals.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node --test tests/verticals.test.mjs
```

Expected: FAIL — `Cannot find module '../src/lib/verticals/index.ts'`.

- [ ] **Step 3: Write the med-spas record**

Create `src/lib/verticals/med-spas.ts`. Prices and the hero tagline are unchanged from the live site on purpose — that page ranks, and changing it buys nothing.

```ts
import type { Vertical } from "./types";

export const medSpas: Vertical = {
  slug: "med-spas",
  name: "Med Spas",
  nameSingular: "med spa",
  clientNoun: "clinic",
  audienceNoun: "patients",
  heroTagline: "Be the first answer patients see.",
  metaTitle: "Med Spa SEO & AI Search Visibility",
  metaDescription:
    "Done-for-you SEO and Generative Engine Optimization for medical spas — content engineered to rank on Google and get cited by ChatGPT and AI Overviews.",
  quickAnswer:
    "Med spa SEO is the work of getting a clinic to appear when patients search for treatments like Botox, filler, or body contouring — and, increasingly, when they ask an AI assistant for a recommendation. It combines optimized service pages, treatment FAQs, schema markup, and Google Business Profile management, because AI engines and the local map pack draw on different signals and a clinic needs both.",
  serviceType: "SEO & Generative Engine Optimization for medical spas",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 1500,
        for: "Newer or single-location clinics getting found.",
        features: [
          "4 GEO/SEO articles / month",
          "1 optimized service page",
          "FAQ + schema markup",
          "4 Google Business posts",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 2750,
        featured: true,
        for: "Established clinics ready to own their market.",
        features: [
          "6 GEO/SEO articles / month",
          "2 optimized service pages",
          "FAQ + schema markup",
          "8 Google Business posts",
          "2 old-page refreshes / month",
          "30-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 4000,
        for: "Multi-service or multi-location practices.",
        features: [
          "10 GEO/SEO articles / month",
          "3 optimized service pages",
          "Neighborhood-level targeting",
          "12 Google Business posts",
          "4 old-page refreshes / month",
          "60-min monthly strategy call",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 8000,
  },
  faqs: [
    {
      q: "How long until my med spa shows up in AI answers?",
      a: "Expect first movement in 60–90 days. AI engines re-crawl and re-rank on their own schedule, and citations tend to follow traditional ranking gains rather than lead them.",
    },
    {
      q: "Do you write about injectables and lasers accurately?",
      a: "Yes. Treatment content is written to reflect your providers' protocols and reviewed against manufacturer indications. We never claim outcomes a device or drug is not indicated for.",
    },
    {
      q: "Can you work with my existing website?",
      a: "Yes. We publish into whatever platform you already use, or hand you finished pages to publish yourself if you prefer to keep control of the CMS.",
    },
    {
      q: "How do you handle before-and-after photos?",
      a: "We advise on alt text, structured data, and page placement so the images support the page's ranking, and on the consent and disclosure practices that keep them compliant. We do not shoot or retouch them.",
    },
    {
      q: "Will you work with a competing med spa in my city?",
      a: "No. One clinic per market. That exclusivity is the reason the content can target the specific treatments and neighborhoods you compete in.",
    },
    {
      q: "What happens if I want to pause?",
      a: "Plans are month to month with no contract. Everything produced is yours and stays on your site if you stop.",
    },
  ],
  knowsAbout: [
    { name: "Medical spa", sameAs: "https://en.wikipedia.org/wiki/Medical_spa" },
    { name: "Botulinum toxin", sameAs: "https://en.wikipedia.org/wiki/Botulinum_toxin" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "RealSelf", url: "https://www.realself.com/" },
    { label: "Google Business Profile", url: "https://www.google.com/business/" },
    { label: "Yelp", url: "https://www.yelp.com/" },
  ],
  postTags: ["med-spa", "GEO", "SEO", "Local SEO", "Schema", "E-E-A-T", "Trust"],
  glossaryTerms: ["generative-engine-optimization", "ai-overviews", "map-pack", "schema-markup"],
  compliance: {
    regime: "medical",
    summary:
      "Aesthetic marketing sits under FTC truth-in-advertising rules, and device and drug claims are further constrained by their FDA-cleared indications. We write to those limits and route final copy through your medical director.",
    weWillNot: [
      "Promise a specific clinical outcome or a number of units",
      "Claim a device or drug does something outside its cleared indications",
      "Publish a patient photo or testimonial without your documented consent",
      "Describe a provider as board-certified in a specialty they do not hold",
    ],
    requiredDisclaimers: ["Individual results vary. Content is not medical advice."],
    sources: [
      { label: "FTC — Health Products Compliance Guidance", url: "https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
```

- [ ] **Step 4: Write the personal-injury-law record**

Create `src/lib/verticals/personal-injury-law.ts`. Note the compliance regime, the different `audienceNoun`, and the substantially larger deliverables that justify the band.

```ts
import type { Vertical } from "./types";

export const personalInjuryLaw: Vertical = {
  slug: "personal-injury-law",
  name: "Personal Injury Law",
  nameSingular: "personal injury firm",
  clientNoun: "firm",
  audienceNoun: "clients",
  heroTagline: "Be the first firm injured clients are told about.",
  metaTitle: "Personal Injury Law Firm SEO & AI Search",
  metaDescription:
    "SEO and Generative Engine Optimization for personal injury firms — practice-area and venue pages written to your state bar's advertising rules and built to be cited by AI.",
  quickAnswer:
    "Personal injury SEO is the work of ranking a firm for the searches injured people actually run — accident type, injury, and venue — and getting the firm named when someone asks an AI assistant which lawyer to call. It differs from most local SEO in two ways: the searches are high-intent and fiercely contested, and every published claim is governed by state bar advertising rules.",
  serviceType: "SEO & Generative Engine Optimization for personal injury law firms",
  pricing: {
    tiers: [
      {
        name: "Visibility",
        price: 5000,
        for: "Single-attorney and boutique firms entering a contested market.",
        features: [
          "8 GEO/SEO articles / month",
          "3 practice-area pages",
          "FAQ + schema markup",
          "8 Google Business posts",
          "Bar-rule review on every page",
          "Monthly visibility report",
        ],
        cta: "Start with Visibility",
      },
      {
        name: "Authority",
        price: 8500,
        featured: true,
        for: "Established firms competing across a metro.",
        features: [
          "12 GEO/SEO articles / month",
          "6 practice-area + venue pages",
          "Case-result content, bar-compliant",
          "8 Google Business posts",
          "Review generation within bar rules",
          "4 old-page refreshes / month",
          "60-min monthly strategy call",
        ],
        cta: "Choose Authority",
      },
      {
        name: "Domination",
        price: 14000,
        for: "Multi-office firms contesting an entire state.",
        features: [
          "20 GEO/SEO articles / month",
          "12 practice-area + venue pages",
          "County-level venue targeting",
          "Attorney authority profiles",
          "16 Google Business posts",
          "8 old-page refreshes / month",
          "Weekly strategy access",
        ],
        cta: "Choose Domination",
      },
    ],
    enterpriseFrom: 20000,
  },
  faqs: [
    {
      q: "Do you understand attorney advertising rules?",
      a: "We write to the ABA Model Rules 7.1–7.3 framework and to your state's variations, including past-result disclaimers and restrictions on specialization claims. Final copy always goes to your firm for approval — we support your compliance, we do not certify it.",
    },
    {
      q: "Can you publish case results?",
      a: "In most states, yes, with the disclaimer your jurisdiction requires and without implying a comparable outcome. Some states impose extra conditions, so we confirm the rule for your bar before the first result goes live.",
    },
    {
      q: "How competitive is personal injury search really?",
      a: "It is among the most contested categories in local search, which is why the plans carry far more content volume than our other verticals. Expect a longer runway than a less contested market.",
    },
    {
      q: "Do you build venue pages for each county?",
      a: "From the Authority plan up, yes. Venue and practice-area pages are the backbone of PI search, and they are also what AI engines quote when someone asks about filing in a specific jurisdiction.",
    },
    {
      q: "Which directories affect whether AI recommends my firm?",
      a: "Avvo, Justia, Super Lawyers, and Martindale-Hubbell are the sources these engines lean on most in legal queries. We align your profiles with your site so the engines see one consistent entity.",
    },
    {
      q: "Will you take a competing firm in my market?",
      a: "No. One firm per practice area per market, for the same reason we hold that line everywhere: the content has to name the venues and case types you actually contest.",
    },
  ],
  knowsAbout: [
    { name: "Personal injury", sameAs: "https://en.wikipedia.org/wiki/Personal_injury" },
    { name: "Legal advertising", sameAs: "https://en.wikipedia.org/wiki/Legal_advertising" },
    { name: "Search engine optimization", sameAs: "https://en.wikipedia.org/wiki/Search_engine_optimization" },
  ],
  citationSources: [
    { label: "Avvo", url: "https://www.avvo.com/" },
    { label: "Justia", url: "https://www.justia.com/" },
    { label: "Super Lawyers", url: "https://www.superlawyers.com/" },
    { label: "Martindale-Hubbell", url: "https://www.martindale.com/" },
  ],
  postTags: ["legal", "GEO", "SEO", "Local SEO"],
  glossaryTerms: ["generative-engine-optimization", "ai-overviews", "map-pack", "entity-seo"],
  compliance: {
    regime: "legal",
    summary:
      "Attorney advertising is governed by your state bar, built on the ABA Model Rules 7.1–7.3 prohibition on false or misleading communications. We write to your jurisdiction's requirements and route every page through your firm for approval before it publishes.",
    weWillNot: [
      "Promise, predict, or imply a case outcome",
      "Publish a past result without your jurisdiction's required disclaimer",
      "Describe an attorney as a specialist or expert where the bar restricts it",
      "Write client testimonials in a form your state prohibits",
      "Represent that Frontpaged certifies your compliance",
    ],
    requiredDisclaimers: [
      "Attorney advertising. Prior results do not guarantee a similar outcome.",
    ],
    sources: [
      { label: "ABA Model Rule 7.1 — Communications Concerning a Lawyer's Services", url: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_1_communication_concerning_a_lawyer_s_services/" },
    ],
  },
  foundingSlotsRemaining: 5,
  published: true,
};
```

- [ ] **Step 5: Write the registry**

Create `src/lib/verticals/index.ts`:

```ts
import type { Vertical } from "./types";
import { medSpas } from "./med-spas";
import { personalInjuryLaw } from "./personal-injury-law";

// Display order. Drives the nav, the /industries/ index, and IndustryGrid.
// Medical-adjacent verticals lead because they carry the existing content depth.
export const verticals: Vertical[] = [medSpas, personalInjuryLaw];

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}

export function getPublishedVerticals(): Vertical[] {
  return verticals.filter((v) => v.published);
}

export function getPublishedSlugs(): string[] {
  return getPublishedVerticals().map((v) => v.slug);
}

export type { Vertical } from "./types";
```

- [ ] **Step 6: Run the tests to verify they pass**

```bash
pnpm test
```

Expected: PASS — all tests in `pricing.test.mjs` and `verticals.test.mjs`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/verticals/ tests/verticals.test.mjs
git commit -m "feat(verticals): add registry with med-spas and personal-injury-law

Two most-dissimilar records first, exercising both compliance regimes
and both ends of the pricing range before the other six are written.
Tests enforce band shape, published med-spa prices, and the
cross-vertical FAQ uniqueness rule that keeps hubs from converging."
```

---

## Task 3: The remaining six vertical records

**Files:**
- Create: `src/lib/verticals/{plastic-surgery,dermatology,wellness,concierge-medicine,estate-law,real-estate-teams}.ts`
- Modify: `src/lib/verticals/index.ts`

**Interfaces:**
- Consumes: `Vertical` from `types.ts`; the record shape established in Task 2.
- Produces: six more `Vertical` records exported into `verticals`.

Each record follows the exact structure of `med-spas.ts` (Task 2, Step 3). Values below are mandatory; everything else follows that template.

- [ ] **Step 1: Write the six records**

| Slug | name / nameSingular | clientNoun | audienceNoun | heroTagline | Tiers | Ent. | Regime |
|---|---|---|---|---|---|---|---|
| `plastic-surgery` | Plastic Surgery / plastic surgery practice | practice | patients | Be the surgeon AI names first. | 2500 / **4500** / 7000 | 10000 | medical |
| `dermatology` | Dermatology / dermatology practice | practice | patients | Be the dermatologist patients are pointed to. | 2000 / **3500** / 5500 | 8000 | medical |
| `wellness` | Wellness & Longevity / wellness clinic | clinic | patients | Be the clinic AI sends them to. | 1500 / **2750** / 4000 | 8000 | medical |
| `concierge-medicine` | Concierge Medicine / concierge practice | practice | **members** | Be the practice AI recommends. | 2500 / **4500** / 6500 | 10000 | medical |
| `estate-law` | Estate & Elder Law / estate law firm | firm | **families** | Be the first answer families see. | 3000 / **5000** / 8000 | 12000 | legal |
| `real-estate-teams` | Real Estate Teams / real estate team | team | **sellers** | Be the first team sellers are pointed to. | 1500 / **2750** / 4000 | 8000 | real-estate |

Bold price is the `featured: true` tier. Tier names stay Visibility / Authority / Domination throughout.

`concierge-medicine` uses **members**, not patients — concierge practices sell memberships, and the wrong noun signals immediately that you do not know the category.

Required `citationSources` per vertical:

```
plastic-surgery     RealSelf · American Society of Plastic Surgeons
                    · American Board of Plastic Surgery
dermatology         American Academy of Dermatology directory · Healthgrades
wellness            Zocdoc · state telehealth directories
concierge-medicine  Castle Connolly · physician referral networks
estate-law          NAELA · state bar directories · Avvo
real-estate-teams   Zillow · Realtor.com · local MLS syndication
```

Compliance content by regime:

- **medical** (`plastic-surgery`, `dermatology`, `wellness`, `concierge-medicine`) — same shape as `med-spas`. `plastic-surgery` adds a `weWillNot` entry on board-certification claims (ABPS vs. non-ABPS boards is a live consumer-deception issue). `wellness` adds one on hormone, IV, and fertility claims not supported by cleared indications. Disclaimer: `"Individual results vary. Content is not medical advice."`
- **legal** (`estate-law`) — same shape as `personal-injury-law`, cited to ABA Model Rule 7.1. Disclaimer: `"Attorney advertising. Prior results do not guarantee a similar outcome."`
- **real-estate** (`real-estate-teams`) — cited to HUD's Fair Housing advertising guidance. `weWillNot` must include: describing a neighborhood in terms that signal a protected class; using language that steers buyers toward or away from an area; publishing claims about schools or "safety" that function as proxies for protected characteristics. Disclaimer: `"Equal Housing Opportunity."`

**Research requirement:** the legal and fair-housing rules must be verified against primary sources during implementation, not written from memory. Each `compliance.sources` entry must resolve to a real, current URL.

- [ ] **Step 2: Register them**

Rewrite `src/lib/verticals/index.ts`'s import block and array.

**Keep the `.ts` extensions.** Task 2 established them and they are load-bearing:
`node --test` resolves these relative specifiers at runtime, and bare specifiers
to `.ts` files fail with `ERR_MODULE_NOT_FOUND`. `tsconfig.json` carries
`allowImportingTsExtensions: true` for exactly this reason. Dropping the
extensions reverts the registry to a state where `pnpm test` cannot load it.

```ts
import { medSpas } from "./med-spas.ts";
import { plasticSurgery } from "./plastic-surgery.ts";
import { dermatology } from "./dermatology.ts";
import { wellness } from "./wellness.ts";
import { conciergeMedicine } from "./concierge-medicine.ts";
import { personalInjuryLaw } from "./personal-injury-law.ts";
import { estateLaw } from "./estate-law.ts";
import { realEstateTeams } from "./real-estate-teams.ts";

export const verticals: Vertical[] = [
  medSpas,
  plasticSurgery,
  dermatology,
  wellness,
  conciergeMedicine,
  personalInjuryLaw,
  estateLaw,
  realEstateTeams,
];
```

- [ ] **Step 3: Run the tests**

```bash
pnpm test
```

Expected: PASS. The cross-vertical FAQ uniqueness test now covers 48+ questions — if it fails, two records share a question and one must be rewritten, not deleted.

- [ ] **Step 4: Verify the computed site price range**

```bash
node --input-type=module -e "
import { verticals } from './src/lib/verticals/index.ts';
import { sitePriceRange } from './src/lib/verticals/pricing.ts';
console.log(sitePriceRange(verticals));
"
```

Expected: `$1,125–$14,000/mo` — matches spec §6.2.

- [ ] **Step 5: Commit**

```bash
git add src/lib/verticals/
git commit -m "feat(verticals): add remaining six vertical records

Completes all eight bands. Legal and fair-housing compliance profiles
cite primary sources. Computed sitewide priceRange is \$1,125-\$14,000/mo."
```

---

## Task 4: Industry body loader

**Files:**
- Create: `src/lib/industries.ts`
- Create: `content/industries/med-spas.md` (first body — the rest land in Task 10)

**Interfaces:**
- Consumes: `gray-matter`, `marked`, and the pattern in `src/lib/blog.ts`.
- Produces: `getIndustryBody(slug: string): IndustryBody | null` where `IndustryBody = { slug: string; html: string; words: number; sections: string[] }`. `sections` holds the `##` headings in document order — `check-duplication.mjs` uses it to prove structures differ.

- [ ] **Step 1: Write the loader**

Create `src/lib/industries.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Bespoke prose for each industry hub. Deliberately Markdown files rather than
// generated sections: eight pages built from one template with substituted nouns
// are doorway pages, and this is a site that sells SEO quality.
//
// Same pipeline as src/lib/blog.ts — gray-matter for frontmatter, marked for HTML.

const INDUSTRY_DIR = path.join(process.cwd(), "content", "industries");

export type IndustryBody = {
  slug: string;
  /** Rendered HTML of the Markdown body. */
  html: string;
  words: number;
  /** `##` headings in document order. Two hubs must not share a section sequence. */
  sections: string[];
};

export function getIndustryBody(slug: string): IndustryBody | null {
  const file = path.join(INDUSTRY_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { content } = matter(fs.readFileSync(file, "utf8"));
  const sections = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());

  return {
    slug,
    html: marked.parse(content, { async: false }) as string,
    words: content.split(/\s+/).filter(Boolean).length,
    sections,
  };
}

export function getIndustrySlugs(): string[] {
  if (!fs.existsSync(INDUSTRY_DIR)) return [];
  return fs
    .readdirSync(INDUSTRY_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
```

- [ ] **Step 2: Write the med-spas body**

Create `content/industries/med-spas.md`. Requirements: ≥900 words, `##` sections whose sequence is unique to this vertical, ≥2 cited external sources rendered as Markdown links, and no reuse of any FAQ question already in the record.

Section sequence for this vertical (do **not** reuse for any other hub):

```
## What patients actually search for
## Where AI engines look when they recommend a clinic
## Why treatment pages beat blog posts for booking
## What we publish in a typical month
## How we handle before-and-after imagery
```

- [ ] **Step 3: Verify the loader**

```bash
node --input-type=module -e "
import { getIndustryBody } from './src/lib/industries.ts';
const b = getIndustryBody('med-spas');
console.log({ words: b.words, sections: b.sections });
console.log('missing slug ->', getIndustryBody('nope'));
"
```

Expected: `words` ≥ 900, five sections in the order above, `null` for the missing slug.

- [ ] **Step 4: Commit**

```bash
git add src/lib/industries.ts content/industries/med-spas.md
git commit -m "feat(industries): add Markdown body loader and med-spas body

Bodies are hand-written Markdown, not generated sections. Eight pages
from one template with swapped nouns would be doorway pages."
```

---

## Task 5: Hub route and index

**Files:**
- Create: `src/app/industries/[slug]/page.tsx`
- Create: `src/app/industries/page.tsx`
- Create: `src/components/PricingBand.tsx`
- Create: `src/components/ComplianceNote.tsx`

**Interfaces:**
- Consumes: `getVertical`, `getPublishedVerticals`, `getPublishedSlugs`; `getIndustryBody`; `foundingPrice`, `annualPrice`; `site`, `founding`, `guarantee` from `src/lib/site.ts`.
- Produces: routes `/industries/` and `/industries/<slug>/`; components `<PricingBand vertical={v} />` and `<ComplianceNote profile={v.compliance} />`.

- [ ] **Step 1: Read the routing docs**

```bash
ls node_modules/next/dist/docs/01-app
```

Read the dynamic-routes, `generateStaticParams`, and metadata guides before writing the route. Confirm the `params`-as-Promise convention still matches `src/app/blog/[slug]/page.tsx`.

- [ ] **Step 2: Write the hub route**

Create `src/app/industries/[slug]/page.tsx`, following the structure of `src/app/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import PricingBand from "@/components/PricingBand";
import ComplianceNote from "@/components/ComplianceNote";
import { getVertical, getPublishedSlugs } from "@/lib/verticals";
import { foundingPrice } from "@/lib/verticals/pricing";
import { getIndustryBody } from "@/lib/industries";
import { site } from "@/lib/site";

type Params = { slug: string };

// Published AND has a body. A published vertical whose content/industries/<slug>.md
// has not been written yet is skipped rather than prerendered into a notFound(),
// which would fail the static export outright.
export function generateStaticParams(): Params[] {
  return getPublishedSlugs()
    .filter((slug) => getIndustryBody(slug) !== null)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) return {};

  const url = `/industries/${v.slug}/`;
  return {
    title: v.metaTitle,
    description: v.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: v.metaTitle,
      description: v.metaDescription,
    },
    twitter: { card: "summary_large_image", title: v.metaTitle, description: v.metaDescription },
  };
}

export default async function IndustryHub({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const v = getVertical(slug);
  if (!v) notFound();

  const body = getIndustryBody(slug);
  if (!body) notFound();

  const canonical = `${site.url}/industries/${v.slug}/`;

  // Service + FAQPage + BreadcrumbList. `provider` is always Frontpaged and the
  // vertical goes in `audience` — the schema must never imply we are a law firm
  // or a medical practice.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: v.metaTitle,
        description: v.metaDescription,
        serviceType: v.serviceType,
        provider: { "@id": `${site.url}/#org` },
        audience: { "@type": "BusinessAudience", name: v.name },
        areaServed: { "@type": "Country", name: "United States" },
        offers: v.pricing.tiers.map((t) => ({
          "@type": "Offer",
          name: `${t.name} plan`,
          description: t.for,
          url: canonical,
          price: foundingPrice(t.price),
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: foundingPrice(t.price),
            priceCurrency: "USD",
            unitText: "MONTH",
          },
          availability: "https://schema.org/InStock",
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: v.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
          { "@type": "ListItem", position: 2, name: "Industries", item: `${site.url}/industries/` },
          { "@type": "ListItem", position: 3, name: v.name, item: canonical },
        ],
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServiceHero
        eyebrow={v.name}
        title={v.heroTagline}
        intro={v.metaDescription}
      />

      <Container>
        {/* Answer-first: the extraction target for AI engines, first real
            content on the page. Mirrors the QUICK ANSWER block on /pricing/. */}
        <section aria-labelledby="quick-answer">
          <h2 id="quick-answer" className="sr-only">Quick answer</h2>
          <p>{v.quickAnswer}</p>
        </section>

        {/* Bespoke prose. Rendered HTML from content/industries/<slug>.md. */}
        <article
          className="prose"
          dangerouslySetInnerHTML={{ __html: body.html }}
        />

        <PricingBand vertical={v} />

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading">Questions {v.clientNoun} owners ask</h2>
          {v.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>

        <ComplianceNote profile={v.compliance} />
      </Container>

      <CtaPanel />
    </main>
  );
}
```

Add the corresponding imports for `ServiceHero` and `CtaPanel` from
`@/components/`. Both already exist and are used by the current service pages —
match how `src/app/services/google-business-profile/page.tsx` composes them.

The FAQ answers rendered here must be the same strings the `FAQPage` schema
emits above. Both read `v.faqs`, so they cannot drift — this is the same
guarantee the pricing cards get.

- [ ] **Step 3: Write PricingBand and ComplianceNote**

`PricingBand` renders `v.pricing.tiers` as three cards using `foundingPrice()` and `annualPrice()` — never a stored discount. It reuses the visual treatment already in `src/components/Pricing.tsx` (struck-through list price, founding rate, "most popular" ribbon on `featured`).

`ComplianceNote` renders `profile.summary`, the `weWillNot` list, and `requiredDisclaimers`. The disclaimers render as visible page text, not `title` attributes — a disclaimer that only exists in markup does not satisfy a bar rule.

- [ ] **Step 4: Write the index**

Create `src/app/industries/page.tsx` — an H1, a short neutral intro, and `<IndustryGrid />` (Task 7). Metadata title ≤60 chars.

- [ ] **Step 5: Build and verify**

```bash
pnpm build
ls out/industries/
```

Expected: `med-spas/index.html` present; `personal-injury-law/` absent until its body exists (Task 10). Confirm the page renders the founding price `$1,125` for Visibility and that the JSON-LD `Offer.price` for the same tier is also `1125`.

- [ ] **Step 6: Commit**

```bash
git add src/app/industries src/components/PricingBand.tsx src/components/ComplianceNote.tsx
git commit -m "feat(industries): add hub route, index, pricing band and compliance note

Offer schema and pricing cards both read foundingPrice() from the
vertical record, so they cannot disagree."
```

---

## Task 6: Shrink site.ts to brand facts

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/components/Pricing.tsx` (consume a passed-in band)
- Modify: `src/app/pricing/page.tsx` (by-industry table)

**Interfaces:**
- Consumes: `sitePriceRange`, `getPublishedVerticals`.
- Produces: `site` without `tiers`/`faqs`/`priceRange` literals; `founding` with `slotsPerVertical`; `site.priceRange` computed.

- [ ] **Step 1: Rewrite site.ts**

Remove `tiers`, `enterprise`, and the med-spa `faqs` (they now live in vertical records). Change:

```ts
tagline: "Be the first name AI recommends.",
description:
  "Frontpaged gets high-ticket local businesses found on Google and cited by " +
  "AI search (ChatGPT, Perplexity, Google AI Overviews). Done-for-you SEO + GEO " +
  "content for medical, legal, and premium service practices nationwide.",
```

Replace the hardcoded `priceRange` with a computed export:

```ts
import { getPublishedVerticals } from "./verticals";
import { sitePriceRange } from "./verticals/pricing";

export const priceRange = sitePriceRange(getPublishedVerticals());
```

Update `founding` to neutral wording:

```ts
export const founding = {
  enabled: true,
  slotsPerVertical: 5,
  headline: "Founding client rate",
  terms:
    "25% off any plan, locked for 12 months, in exchange for documented " +
    "before-and-after results and permission to write it up as a case study.",
} as const;
```

Keep `guarantee`, `auditOffer`, `founder`, and `usd()` unchanged.

- [ ] **Step 2: Restructure the pricing page**

`/pricing/` becomes a by-industry table: one row per published vertical showing its three tiers at founding rates, linking to that hub. The quick-answer block updates to state the full span (`$1,125–$14,000/mo`) and explains that the number depends on industry and market competition.

- [ ] **Step 3: Build and check for type errors**

```bash
pnpm build && pnpm lint
```

Expected: clean. Any remaining import of `tiers` from `site.ts` is a compile error — fix it to read from the vertical record.

- [ ] **Step 4: Commit**

```bash
git add src/lib/site.ts src/components/Pricing.tsx src/app/pricing/page.tsx
git commit -m "refactor(site): shrink site.ts to brand facts, compute priceRange

Kills the priceRange-vs-makesOffer contradiction found in the
2026-08-11 production review: the range is now derived from the same
records the Offer schema reads."
```

---

## Task 7: Homepage, IndustryGrid, and navigation

**Files:**
- Create: `src/components/IndustryGrid.tsx`
- Modify: `src/app/page.tsx`, `src/components/Problem.tsx`, `src/components/StatsBand.tsx`, `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`

**Interfaces:**
- Consumes: `getPublishedVerticals()`.
- Produces: `<IndustryGrid />`; nav rendering `Industries ▾` and `Services ▾`.

- [ ] **Step 1: Write IndustryGrid**

One card per published vertical: name, one-line positioning, starting founding price, link to the hub. Registry-driven, so unpublishing a vertical removes its card with no edit here.

- [ ] **Step 2: Rewrite the homepage**

Per spec §5.2. `Hero` takes the master tagline. `Pricing` is replaced by a range summary plus "See pricing for your industry" → `/industries/`. `IndustryGrid` slots between `Problem` and `StatsBand`.

- [ ] **Step 3: Remove or source every statistic**

`Problem.tsx` and `StatsBand.tsx` currently carry four uncited claims: "80% of patients still find clinics on Google", "a 2025 study found … 47% of health and beauty searches", "over 65% of med spa searches happen on phones", "roughly 40–60% by most estimates".

Unless the owner has supplied sources (spec §13.2), **delete them and rewrite the surrounding copy to make its point without a number.** Do not soften them to "most" or "the majority" — that is the same unsourced claim in weaker words.

- [ ] **Step 4: Split the navigation**

`SiteHeader` renders two menus: `Industries ▾` (published verticals + "All industries") and `Services ▾` (the two neutral mechanism pages). The existing `lg:hidden` mobile button and `aria-expanded` handling stay. `SiteFooter` gains an industries column.

- [ ] **Step 5: Build and verify**

```bash
pnpm build
grep -c "80% of patients" out/index.html || echo "statistic removed"
```

Expected: build clean; the uncited statistic is gone.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/
git commit -m "feat(home): reposition homepage, add IndustryGrid, split nav

Removes four uncited statistics flagged in the production review
rather than softening them — this site sells E-E-A-T."
```

---

## Task 8: Schema, llms.txt, and sitemap

**Files:**
- Modify: `src/components/JsonLd.tsx`, `src/app/llms.txt/route.ts`, `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `getPublishedVerticals()`, `priceRange`, `foundingPrice`.
- Produces: an `Organization` node at `@id: ${site.url}/#org` that every hub's `Service.provider` references.

- [ ] **Step 1: Switch ProfessionalService to Organization**

In `JsonLd.tsx`, change `"@type": "ProfessionalService"` to `"Organization"` and `@id` to `${site.url}/#org`. `ProfessionalService` is a `LocalBusiness` subtype and requires an address the business does not have — it is remote and nationwide. Keep `email`, `telephone`, `slogan`, `logo`, `sameAs`, `knowsAbout`, `areaServed`. Set `priceRange` from the computed export.

Replace the homepage `makesOffer` array with `hasOfferCatalog` linking to the hubs, so tier-level offers live on the pages that state them.

- [ ] **Step 2: Fix the publisher logo**

`logo` currently points at `icon.svg`. Google's structured-data guidance does not accept SVG. Add `public/logo-512.png` (512×512, matching the teal "F" mark) and point `logo` at it.

- [ ] **Step 3: Rewrite llms.txt**

Generate the plans section from the registry rather than hardcoding it — this is the file most likely to be quoted verbatim by AI engines, and it currently publishes list prices while the pricing page leads with founding rates.

```ts
const plans = getPublishedVerticals()
  .map((v) => {
    const t = v.pricing.tiers;
    return `- ${v.name}: ${t.map((x) => `${x.name} ${usd(foundingPrice(x.price))}/mo`).join(", ")} (founding rates; list ${usd(t[0].price)}–${usd(t[2].price)})`;
  })
  .join("\n");
```

Add every published hub to the "Core pages" list.

- [ ] **Step 4: Make the sitemap registry-driven**

Add `/industries/` and each published hub. Remove `/services/med-spa-seo/` (Task 9 redirects it).

- [ ] **Step 5: Build and verify**

```bash
pnpm build
curl -s file://$(pwd)/out/llms.txt 2>/dev/null || cat out/llms.txt | head -30
grep -o '"@type":"Organization"' out/index.html | head -1
```

Expected: `llms.txt` shows founding rates per vertical; homepage emits `Organization`, not `ProfessionalService`.

- [ ] **Step 6: Commit**

```bash
git add src/components/JsonLd.tsx src/app/llms.txt src/app/sitemap.ts public/logo-512.png
git commit -m "fix(schema): Organization over ProfessionalService, raster logo, registry-driven llms.txt

Resolves three production-review findings: addressless LocalBusiness
subtype, SVG publisher logo, and llms.txt publishing list prices while
the site advertises founding rates."
```

---

## Task 9: Redirects, favicon, and blog tagging

**Files:**
- Create: `public/.htaccess`, `public/favicon.ico`
- Delete: `src/app/services/med-spa-seo/page.tsx`
- Modify: 28 files in `content/blog/`, `scripts/check-content.mjs`

**Interfaces:**
- Consumes: nothing new.
- Produces: a 301 from `/services/med-spa-seo/` to `/industries/med-spas/`; `vertical:` frontmatter on every post.

- [ ] **Step 1: Write the redirect**

Create `public/.htaccess` (copied into `out/` by the export; LiteSpeed honors it):

```apache
# Consolidated into the med-spa industry hub. /services/* now describes what we
# do; /industries/* describes who we do it for. Keeping both would have had two
# of our own pages competing for "med spa SEO".
Redirect 301 /services/med-spa-seo/ /industries/med-spas/
Redirect 301 /services/med-spa-seo /industries/med-spas/
```

- [ ] **Step 2: Delete the old page and add the favicon**

```bash
git rm -r src/app/services/med-spa-seo
```

Add `public/favicon.ico` (the teal "F" mark, 32×32 + 16×16). `/favicon.ico` currently 404s.

- [ ] **Step 3: Tag every post**

Add `vertical: med-spas` to the frontmatter of all 28 files in `content/blog/`. **Bodies and filenames unchanged** — these URLs rank.

- [ ] **Step 4: Update the content checker**

In `scripts/check-content.mjs`, `STATIC_ROUTES` still contains `/services/med-spa-seo`. Replace it with `/industries/med-spas` and add the other seven hubs plus `/industries`. Add `vertical` to the required-frontmatter loop.

- [ ] **Step 5: Verify**

```bash
pnpm check:content && pnpm build
test -f out/.htaccess && echo "htaccess shipped"
test -f out/favicon.ico && echo "favicon shipped"
grep -L "vertical:" content/blog/*.md || echo "all posts tagged"
```

Expected: all four pass.

- [ ] **Step 6: Commit**

```bash
git add -A public content/blog scripts/check-content.mjs
git commit -m "feat(migration): 301 med-spa-seo to hub, add favicon, tag posts

All 28 post URLs and bodies unchanged — frontmatter additions only."
```

---

## Task 10: The remaining seven industry bodies

**Files:**
- Create: `content/industries/{plastic-surgery,dermatology,wellness,concierge-medicine,personal-injury-law,estate-law,real-estate-teams}.md`

**Interfaces:**
- Consumes: `getIndustryBody` (Task 4).
- Produces: bodies for every published vertical, unlocking their routes.

- [ ] **Step 1: Write each body**

Per body: ≥900 words, a `##` section sequence **unique to that vertical**, ≥2 cited external sources as Markdown links, zero reuse of that record's FAQ questions.

The substantive differentiator — and the reason these are not eight paraphrases — is that **AI engines draw on different third-party sources per category**. Each body's core section explains which sources matter in that vertical and why (spec §7). Do not reuse the `med-spas` section sequence from Task 4.

Suggested distinct sequences:

```
plastic-surgery      ## The board-certification signal
                     ## What RealSelf tells AI engines about you
                     ## Procedure pages that survive a second opinion
                     ## Consultation-stage content
                     ## What a month looks like

personal-injury-law  ## The searches injured people actually run
                     ## Venue pages and why they compound
                     ## What your bar's advertising rules change
                     ## The directories AI leans on in legal queries
                     ## Case results, published safely
                     ## What a month looks like

real-estate-teams    ## Why portals outrank you on your own listings
                     ## Neighborhood content without fair-housing risk
                     ## Where AI sources local market claims
                     ## Listing-cycle content
```

Give the remaining four equally distinct sequences.

- [ ] **Step 2: Build and confirm every hub emits**

```bash
pnpm build
ls out/industries/
```

Expected: eight directories plus `index.html`.

- [ ] **Step 3: Commit**

```bash
git add content/industries
git commit -m "content: add the seven remaining industry hub bodies"
```

---

## Task 11: Verification scripts and CI

**Files:**
- Create: `scripts/check-seo.mjs`, `scripts/check-duplication.mjs`, `scripts/check-links.mjs`
- Modify: `package.json`, `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: the built `out/` directory; `getIndustryBody` for section sequences.
- Produces: `pnpm check:seo`, `pnpm check:duplication`, `pnpm check:links`, `pnpm verify`.

- [ ] **Step 1: Write check-seo.mjs**

Walk every `out/**/index.html` and assert, following the errors/warnings pattern already in `scripts/check-content.mjs`: exactly one `<h1>`; `<title>` ≤60 chars; meta description 70–155; `og:image` present; canonical present and trailing-slashed; every `application/ld+json` block parses; no `@type: "ProfessionalService"`. Exit 1 on any error.

- [ ] **Step 2: Write check-duplication.mjs**

Compute pairwise 5-gram Jaccard similarity across the eight bodies from `getIndustryBody`. Fail above **0.35**. Separately fail if any two verticals share an identical `sections` array — identical structure is the doorway signal even when wording differs.

- [ ] **Step 3: Write check-links.mjs**

Extract every `href="/..."` and `href="#..."` from `out/**/*.html`. Assert each internal path exists as a directory with `index.html` (or is a real file), and each anchor target exists as an `id` on the same page. Exit 1 on any failure.

- [ ] **Step 4: Wire the scripts**

```json
"check:seo": "node scripts/check-seo.mjs",
"check:duplication": "node scripts/check-duplication.mjs",
"check:links": "node scripts/check-links.mjs",
"verify": "pnpm test && pnpm check:content && pnpm check:duplication && pnpm build && pnpm check:seo && pnpm check:links"
```

Order matters: source-level checks run before the build; `out/`-level checks run after.

- [ ] **Step 5: Add verification to CI**

In `.github/workflows/deploy.yml`, replace the `Build static export` step with `pnpm verify`. A failing check must block the deploy — the current workflow force-pushes `out/` to the `deploy` branch, so an unverified build ships straight to production.

- [ ] **Step 6: Run the full suite**

```bash
pnpm verify
```

Expected: PASS at every stage.

- [ ] **Step 7: Commit**

```bash
git add scripts package.json .github/workflows/deploy.yml
git commit -m "test: add SEO, duplication and link gates; run them in CI

check-duplication is the anti-doorway gate: eight near-identical hub
pages are the most likely way this rewrite loses rankings, and CI
force-pushes to the deploy branch, so an unverified build ships live."
```

---

## Task 12: Remaining page rewrites and production diff

**Files:**
- Modify: `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/faq/page.tsx`, `src/app/glossary/page.tsx`, `src/app/services/generative-engine-optimization/page.tsx`, `src/app/services/google-business-profile/page.tsx`, `src/lib/glossary.ts`, `src/lib/faqHub.ts`

**Interfaces:**
- Consumes: `getPublishedVerticals()`.
- Produces: no new exports — this is the copy pass plus the final regression check.

- [ ] **Step 1: Rewrite the two service pages vertical-neutral**

Remove med-spa-specific framing. These describe the mechanism and now serve all eight verticals. URLs unchanged — no redirects.

- [ ] **Step 2: Split the FAQ hub and glossary**

`faqHub.ts` gains per-vertical sets; `/faq/` becomes an index routing to them, each emitting its own `FAQPage`. `glossary.ts` splits into shared-neutral terms plus per-vertical terms, each vertical emitting its own `DefinedTermSet`.

- [ ] **Step 3: Rewrite about and contact**

Neutral positioning. If `founder.name` is still empty (spec §13.1), attribution stays organization-level and nothing renders half-finished — the existing fallback already handles this.

- [ ] **Step 4: Decide the TagEasy banner**

`TopBanner` currently renders sitewide from `layout.tsx`, which has no vertical
context on the homepage, `/pricing/`, or a blog post. So gate it by *exclusion*
rather than by regime: the banner renders everywhere **except** the legal and
real-estate hubs, where a "need tagging & analytics?" cross-promo reads oddly
next to an $8,500/mo engagement (spec §13.3).

Implement by having the hub route set a flag the layout reads — or, simpler and
preferred in a static export, render `TopBanner` from the pages that want it
rather than from `layout.tsx`. Do not add client-side route detection.

- [ ] **Step 5: Run the full verification**

```bash
pnpm verify
```

- [ ] **Step 6: Diff against the live production crawl**

Confirm no live URL was silently dropped:

```bash
curl -s https://frontpaged.io/sitemap.xml | tr '<>' '\n\n' | grep '^https' \
  | sed 's|https://frontpaged.io||' | sort > /tmp/live-urls.txt
find out -name index.html | sed 's|^out||; s|/index.html|/|' | sort > /tmp/new-urls.txt
comm -23 /tmp/live-urls.txt /tmp/new-urls.txt
```

Expected output: exactly `/services/med-spa-seo/` — the one intentional removal, covered by the 301 in Task 9. **Any other line is a page that disappeared without a redirect.** Add one or restore the page.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "content: neutral service pages, split FAQ hub and glossary

Production URL diff shows /services/med-spa-seo/ as the only removal,
covered by its 301."
```

---

## Self-Review

**Spec coverage.** §4.1 → T1; §4.2 → T2,3,5; §4.3 → T5,9; §4.4 → T7; §5.1 → T2,3,6; §5.2 → T7; §6.1–6.3 → T1,2,3; §6.4 → T6; §7 → T4,10,11; §8 → T2,3,5; §9.1 → T5,8; §9.2 → T8; §9.3 → T9,12; §10 → T6,7,8,9; §12 → T11,12. No uncovered requirement.

**Known gaps, deliberate.** Spec §13's three open inputs (founder identity, statistic sources, TagEasy banner) are handled by documented defaults — remove statistics, organization-level attribution, medical-only banner — so no task blocks on an answer. Seed blog content for the seven new verticals is out of scope per §11.

**Type consistency.** `foundingPrice`/`annualPrice`/`bandRange`/`sitePriceRange` (T1) are consumed with matching signatures in T2, 3, 5, 6, 8. `Vertical` field names are identical across T1's type, T2's two records, and T3's six. `getIndustryBody` returns the same `IndustryBody` shape in T4 that T5 and T11 consume. The `Organization` `@id` is `${site.url}/#org` in both T5's `Service.provider` and T8's node.
