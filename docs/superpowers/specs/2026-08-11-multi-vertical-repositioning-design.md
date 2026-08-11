# Multi-Vertical Repositioning — Design

- **Date:** 2026-08-11
- **Status:** Approved (design); implementation plan not yet written
- **Scope:** Phase 1 — all eight verticals, core architecture, full site rewrite

---

## 1. Goal

Reposition frontpaged.io from a med-spa-only SEO/GEO agency to one serving eight
high-ticket local verticals, without losing the topical authority the existing
med-spa content has earned.

The eight verticals:

| Slug | Name | Client noun | Audience noun |
|---|---|---|---|
| `med-spas` | Med Spas | clinic | patients |
| `plastic-surgery` | Plastic Surgery | practice | patients |
| `dermatology` | Dermatology | practice | patients |
| `wellness` | Wellness & Longevity (IV, hormone, fertility, LASIK) | clinic | patients |
| `concierge-medicine` | Concierge Medicine | practice | members |
| `personal-injury-law` | Personal Injury Law | firm | clients |
| `estate-law` | Estate & Elder Law | firm | families |
| `real-estate-teams` | Real Estate Teams | team | sellers |

`concierge-medicine` uses "members", not "patients" — concierge practices sell
memberships, and using the wrong noun signals immediately that you don't know
the category.

## 2. Current state

- Next.js 16.2.9, `output: "export"`, `trailingSlash: true`, static export to
  Hostinger/LiteSpeed.
- 27 live pages, 28 markdown posts, ~5,800 lines of TSX/TS.
- Everything is med-spa specific: `site.ts` hardcodes "patients"/"clinics",
  `glossary.ts` (328 lines) and `faqHub.ts` (158 lines) are med-spa-only,
  the tagline is "Be the first answer patients see."
- A production review on 2026-08-11 found nine issues; eight are folded into
  this rewrite (§10).

## 3. Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | **Vertical hub-and-spoke** IA | A category-neutral homepage plus deep per-vertical pages. Preserves the topical depth that earns rankings; a generalist site would dilute the E-E-A-T being sold. |
| D2 | **Keep all 28 posts as-is**, tag to the med-spa hub | Zero ranking risk, zero 301s on the content library. |
| D3 | **Per-vertical pricing bands** | PI law pays multiples of med-spa rates; one ladder either underprices law or overprices wellness. Per-page `Offer` schema stays truthful. |
| D4 | **Neutral master tagline + per-vertical overrides** | "patients" breaks for law and real estate. Mirrors the hub-and-spoke structure. |
| D5 | **All eight verticals in Phase 1** | Shipping legal as "coming soon" fails the business goal of opening those verticals. |
| D6 | **Per-vertical founding slots**, reworded "clinics" → "clients" | A single global pool would let the first vertical to fill exhaust the offer for the other seven. |
| D7 | **Approach C**: data record + bespoke prose | Data guarantees pricing/schema can't drift; bespoke prose prevents doorway pages. Neither a pure template (A) nor eight hand-written pages (B) achieves both. |

## 4. Architecture

### 4.1 The `Vertical` record

```ts
// src/lib/verticals/types.ts
export type Vertical = {
  slug: string;
  name: string;              // plural — nav, headings
  nameSingular: string;      // inline prose
  clientNoun: string;        // clinic | practice | firm | team
  audienceNoun: string;      // patients | members | clients | families | sellers
  heroTagline: string;       // overrides site.tagline in this hero only
  metaTitle: string;         // ≤60 chars including any suffix
  metaDescription: string;   // 70–155 chars
  quickAnswer: string;       // answer-first extraction target for AI engines
  pricing: PricingBand;
  faqs: Faq[];               // ≥6, zero overlap with any other vertical
  knowsAbout: EntityRef[];   // schema.org Things with Wikipedia sameAs
  serviceType: string;
  citationSources: SourceRef[]; // third-party sources AI pulls from in this category
  postTags: string[];
  glossaryTerms: string[];
  compliance: ComplianceProfile;
  foundingSlotsRemaining: number;
  published: boolean;
};
```

**Core invariant:** `pricing` is consumed by both the pricing cards and the
`Offer` schema on the same page. They cannot disagree. This is the property that
justifies approach C over hand-written pages, and it extends the guarantee
`site.ts` already provides today.

### 4.2 Registry and routing

```
src/lib/verticals/
  types.ts            Vertical, PricingBand, ComplianceProfile, SourceRef
  index.ts            registry, getVertical(slug), getPublishedSlugs()
  med-spas.ts  plastic-surgery.ts  dermatology.ts  wellness.ts
  concierge-medicine.ts  personal-injury-law.ts
  estate-law.ts  real-estate-teams.ts

content/industries/
  <slug>.mdx          bespoke prose, unique structure per vertical

src/app/industries/
  page.tsx            index of all published verticals
  [slug]/page.tsx     generateStaticParams() over the registry
  [slug]/opengraph-image.tsx
```

`[slug]/page.tsx` follows the existing pattern in `src/app/blog/[slug]/page.tsx`:
`generateStaticParams`, `params` typed as a Promise, `generateMetadata`,
`notFound()` on miss. No new routing concepts are introduced.

Read `node_modules/next/dist/docs/01-app` before implementing — per `AGENTS.md`,
this Next.js version's conventions may differ from training data.

### 4.3 URL map

`/services/*` answers *what we do*. `/industries/*` answers *who we do it for*.
Without that split, `/services/med-spa-seo/` and `/industries/med-spas/` would
compete for "med spa SEO" — self-cannibalization.

| URL | Action |
|---|---|
| `/` | Rewritten, category-neutral |
| `/industries/` | **New** — hub index |
| `/industries/<slug>/` | **New** — 8 pages |
| `/services/med-spa-seo/` | **301 → `/industries/med-spas/`** |
| `/services/generative-engine-optimization/` | Stays; rewritten vertical-neutral |
| `/services/google-business-profile/` | Stays; rewritten vertical-neutral |
| `/pricing/` | Restructured to a by-industry table |
| `/faq/` `/glossary/` | Split into shared + per-vertical sets |
| `/blog/` and all 28 post URLs | **Unchanged** |
| `/about/` `/contact/` | Rewritten neutral |

Redirects live in `public/.htaccess` (copied into `out/` by the export, honored
by LiteSpeed). Verify existing `public/` contents before writing it.

**Accepted risk:** the 301 costs some equity and takes weeks to settle.
Consolidating two competing pages into one is still correct.

### 4.4 Navigation

`Services ▾` splits into `Industries ▾` (published verticals + "All industries")
and `Services ▾` (three neutral mechanism pages). Footer gains an industries
column. Both render from the registry, filtered on `published`.

## 5. Brand and copy

### 5.1 Taglines

```
MASTER (homepage H1, schema slogan, OG image, footer)
  "Be the first name AI recommends."

PER-VERTICAL HERO
  med-spas             Be the first answer patients see.        (unchanged)
  plastic-surgery      Be the surgeon AI names first.
  dermatology          Be the dermatologist patients are pointed to.
  wellness             Be the clinic AI sends them to.
  concierge-medicine   Be the practice AI recommends.
  personal-injury-law  Be the first firm injured clients are told about.
  estate-law           Be the first answer families see.
  real-estate-teams    Be the first team sellers are pointed to.
```

Med spas keeps its current line — it is on an indexed page that ranks, and
changing it buys nothing.

### 5.2 Homepage

| Section | Change |
|---|---|
| `Hero` | Master tagline; subhead names the categories. AI-test visual kept — already neutral. |
| `AiEnginesStrip` | Unchanged |
| `Problem` | Rewritten neutral; statistics sourced or removed |
| `IndustryGrid` | **New** — 8 cards from the registry |
| `StatsBand` | Rewritten neutral; every stat cited or removed |
| `HowItWorks` | Light edit — already mechanism-level |
| `ReportMockup` | Unchanged |
| `Pricing` | Replaced by a range summary + "See pricing for your industry" → `/industries/` |
| `Faq` | Neutral top-5, distinct from every vertical FAQ set |
| `ContactBand` | Unchanged |

## 6. Pricing

### 6.1 Bands

Monthly list prices. Only `med-spas` reflects existing real-world pricing; the
other seven were set during design and approved by the owner on 2026-08-11.

| Vertical | Visibility | Authority (featured) | Domination | Enterprise from |
|---|---|---|---|---|
| med-spas | 1,500 | 2,750 | 4,000 | 8,000 |
| wellness | 1,500 | 2,750 | 4,000 | 8,000 |
| real-estate-teams | 1,500 | 2,750 | 4,000 | 8,000 |
| dermatology | 2,000 | 3,500 | 5,500 | 8,000 |
| plastic-surgery | 2,500 | 4,500 | 7,000 | 10,000 |
| concierge-medicine | 2,500 | 4,500 | 6,500 | 10,000 |
| estate-law | 3,000 | 5,000 | 8,000 | 12,000 |
| personal-injury-law | 5,000 | 8,500 | 14,000 | 20,000 |

### 6.2 Derived values

- `foundingPrice = Math.round(price * 0.75)` — removes the three hand-maintained
  `foundingPrice` fields in `site.ts` and makes that class of drift impossible.
- `annualPrice = price * 10` — ten months' fee for twelve months of work.
- Sitewide `priceRange` = computed span at **founding** rates across published
  verticals → `$1,125–$14,000/mo`. Schema must state what a buyer actually pays.
- The `$500` AI Visibility Audit is flat across all verticals — fixed effort,
  deliberately low-friction entry.

### 6.3 Deliverables scale with the band

Prices differ because the work differs. `Tier.features` lives in the vertical
record, not a shared default, so a prospect comparing two industry pages sees
different scopes rather than the same list at two prices.

Example — Authority tier:

```
med-spas  $2,750  6 articles · 2 service pages · 8 GBP posts
                  · 2 refreshes · 30-min call
pi-law    $8,500  12 articles · 6 practice-area + venue pages
                  · case-result content · 8 GBP posts
                  · bar-compliant review generation · 60-min call
```

### 6.4 `site.ts` after the change

Shrinks to genuine brand facts: name, domain, url, email, phone, socials,
calendly, master tagline, `areaServed`, computed `priceRange`, plus the shared
`guarantee`, `auditOffer`, and `founder`. The `tiers` array, med-spa `faqs`, and
`founding.headline` move into vertical records. `founding` keeps `enabled`
(the global kill switch), `slotsPerVertical: 5` (the initial allocation each
vertical starts with), and neutral `terms` wording ("clients", not "clinics").
Each vertical's `foundingSlotsRemaining` tracks its own current count and is the
value rendered on that hub; `founding.enabled = false` still retires the banner,
struck-through prices, and schema discount everywhere in one edit. `usd()` stays.

## 7. Content differentiation (anti-doorway)

Eight pages generated from one skeleton with swapped nouns are doorway pages —
named explicitly in Google's spam policy, and the most likely way this rewrite
loses rankings. Enforced two ways.

**Structural requirements per hub body:**

- No shared section skeleton — section count and order differ between verticals
- ≥900 words of unique prose
- ≥6 FAQs, zero question overlap with any other vertical
- Unique `quickAnswer`
- ≥2 cited vertical-specific external sources

**Automated:** `scripts/check-duplication.mjs` computes pairwise shingle
similarity across the eight rendered hub bodies and fails the build above 35%.

**What makes the bodies genuinely different:** AI engines assemble answers from
different third-party sources per category. Each hub explains which sources
matter in that vertical — content a template cannot fake.

```
med-spas / plastic-surgery   RealSelf · ASPS · ABPS board certification
dermatology                  AAD directory · Healthgrades · payer directories
wellness                     ZocDoc · state telehealth rules
concierge-medicine           Castle Connolly · physician referral networks
personal-injury-law          Avvo · Justia · Super Lawyers · Martindale
estate-law                   NAELA · state bar directories
real-estate-teams            Zillow · Realtor.com · MLS syndication
```

## 8. Compliance

```ts
type ComplianceProfile = {
  regime: "medical" | "legal" | "real-estate";
  summary: string;               // rendered as a trust section on the hub
  weWillNot: string[];           // claims we refuse to write for a client
  requiredDisclaimers: string[]; // rendered in the page footer
  sources: SourceRef[];          // citations to the actual rules
};
```

| Regime | Verticals | Governs |
|---|---|---|
| medical | med-spas, plastic-surgery, dermatology, wellness, concierge-medicine | FTC truth-in-advertising; FDA rules on device/drug claims; before/after photo standards; HIPAA on testimonials |
| legal | personal-injury-law, estate-law | State bar advertising rules (ABA Model Rules 7.1–7.3); past-results disclaimers; restrictions on "specialist" claims and testimonials |
| real-estate | real-estate-teams | Fair Housing Act advertising prohibitions; MLS/NAR rules |

**Liability boundary — non-negotiable.** Pages state that Frontpaged *writes to*
a client's state bar advertising rules and routes final copy through the
client's own compliance review. Pages never state or imply that Frontpaged
*guarantees* compliance, and the site does not give legal advice. Promising
regulatory compliance to regulated buyers converts a content retainer into a
malpractice-adjacent claim.

Handled correctly this is a differentiator: most SEO vendors selling to law
firms do not know Rule 7.1 exists.

Rules must be researched against primary sources during implementation, not
written from intuition.

## 9. AEO/GEO layer

### 9.1 Schema

Each hub emits `Service` + `FAQPage` + `BreadcrumbList`. The provider is always
Frontpaged; the vertical goes in `audience`:

```json
{ "@type": "Service",
  "provider": { "@id": "https://frontpaged.io/#org" },
  "audience": { "@type": "BusinessAudience",
                "name": "Personal injury law firms" } }
```

Frontpaged is a marketing agency. Schema must never imply it is a law firm or a
medical practice.

Sitewide `ProfessionalService` → `Organization` (fixes the addressless
LocalBusiness-subtype finding). `BlogPosting.author` becomes a `Person` node
once `founder.name` is supplied, falling back to `Organization` while blank.

### 9.2 Machine-readable files

- **llms.txt** — rewritten for all eight verticals with per-vertical bands.
  Resolves the list-vs-founding price drift. This is the file most likely to be
  quoted verbatim by the engines being optimized for.
- **sitemap.ts** — registry-driven; includes published verticals only.
- **robots.ts** — unchanged (AI crawler allowlist is already correct).
- **rss.xml** — unchanged.

### 9.3 Content structures

- **Blog** frontmatter gains `vertical: <slug>`. All 28 posts get
  `vertical: med-spas`. Bodies and URLs unchanged. Hubs surface tagged posts.
- **Glossary** splits into shared-neutral terms plus per-vertical terms; each
  vertical emits its own `DefinedTermSet`.
- **FAQ hub** becomes an index routing to per-vertical sets, each emitting its
  own `FAQPage`.

## 10. Production-review fixes folded in

Numbering follows the 2026-08-11 production review. Items marked "—" were
listed there as smaller items rather than numbered findings.

| # | Finding | Fix |
|---|---|---|
| 1 | `og:image` missing on 26/27 pages | Route-segment `opengraph-image.tsx`; per-vertical OG images |
| 2 | 16 titles >62 chars | Cap at 60; drop the `· Frontpaged` suffix on posts; enforced by `check-seo.mjs` |
| 3 | Four uncited statistics | Sourced if the owner supplies sources, otherwise removed (§13.2) |
| 5 | `priceRange` contradicts `makesOffer` | Computed from founding rates (§6.2) |
| 6 | llms.txt publishes list prices only | Rewritten from the same records as the cards |
| — | Homepage meta description 219 chars | Rewritten to ≤155 |
| — | `/favicon.ico` 404s | Add `public/favicon.ico` |
| — | Publisher logo is SVG | Raster PNG ≥112×112 |
| — | `ProfessionalService` has no address | Switch to `Organization` (§9.1) |
| — | Offer `category` misused for feature lists | Move features out of `category` |

Finding #4 (named authorship) is blocked on owner input (§13.1).
Findings #7 (analytics) and #8 (contact form) are out of scope (§11).

## 11. Out of scope

- Seed blog content for the seven new verticals — follow-on program
- Contact form; analytics install — independent of repositioning
- Case studies / results pages — no real ones exist; fabricating proof for
  regulated verticals is the wrong move
- CMS, i18n, per-vertical subdomains

**Stated limitation:** eight hub pages with no supporting content behind seven
of them will not rank on their own. Med spas has 28 posts of depth; PI law
launches with one page. This relaunch opens the business — sales conversations,
direct traffic, a credible site — but organic rankings in the new verticals
depend on the content program that follows.

## 12. Verification

```
pnpm build                     static export succeeds; 35 content routes
                               (27 live today − 1 migrated + 8 hubs
                                + 1 /industries/ index), plus 404
scripts/check-duplication.mjs  pairwise hub similarity < 35%
scripts/check-seo.mjs          titles ≤60 · descriptions 70–155 · exactly one h1
                               · og:image · canonical · JSON-LD parses
                               · no cross-vertical FAQ duplicates
scripts/check-links.mjs        zero broken internal links or anchors
```

Regression set:

- All 28 blog URLs return 200 with unchanged content
- All 27 currently-live URLs return 200 or 301 to a documented target
- `/services/med-spa-seo/` → `/industries/med-spas/` in exactly one hop
- Re-run the 2026-08-11 production crawl against the build output and diff

## 13. Open inputs

1. **`founder.name`, `bio`, `credentials`** — blocks named authorship, the last
   E-E-A-T gap. Weighs heaviest in the YMYL verticals being entered.
2. **Sources for four statistics** — "80% of patients still find clinics on
   Google", the "2025 study … 47% of health and beauty searches", "over 65%
   mobile", "40–60% map pack". Cited if sources are supplied; **removed by
   default** if not.
3. **TagEasy banner** — currently sitewide. Reads oddly on a page selling
   $8,500/mo to a law firm. Default assumption: restrict to medical verticals.

## 14. Risks

| Risk | Mitigation |
|---|---|
| Doorway pages across 8 hubs | `check-duplication.mjs` gate + structural requirements (§7) |
| 301 of a ranking page | Single-hop redirect; industry page inherits H1/keyword intent; monitored post-launch |
| Cannibalization services vs industries | Strict split: services = mechanism, industries = audience (§4.3) |
| Unresearched legal/real-estate claims | Primary-source research required; liability boundary in §8 |
| New verticals rank poorly at launch | Stated explicitly in §11; content program scoped separately |
| Pricing bands unvalidated by market | Owner-approved; per-vertical records make repricing a one-line change |

## 15. Change inventory

```
NEW       src/lib/verticals/{types,index}.ts + 8 records
          content/industries/*.mdx  (8 bespoke bodies)
          src/app/industries/{page,[slug]/page,[slug]/opengraph-image}.tsx
          src/components/{IndustryGrid,ComplianceNote,PricingBand}.tsx
          public/.htaccess · public/favicon.ico
          scripts/check-{duplication,seo,links}.mjs

REWRITE   src/lib/site.ts (shrinks) · src/app/page.tsx · pricing · faq
          glossary · llms.txt · sitemap · JsonLd · SiteHeader · SiteFooter
          services/{generative-engine-optimization,google-business-profile}
          about · contact · Problem · StatsBand

MIGRATE   services/med-spa-seo → 301 → industries/med-spas
          28 posts gain `vertical:` frontmatter (bodies unchanged)

UNTOUCHED all 28 blog post bodies · blog routes · robots · rss
          Hero · AiEnginesStrip · ReportMockup · Reveal · Container · Button
```

Approximately 6,000 lines touched.
