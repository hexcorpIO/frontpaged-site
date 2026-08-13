import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyDestination,
  deriveClickId,
  normalizeText,
  pageContext,
  slugify,
} from "../src/lib/tracking.ts";

// The point of these is that reporting IDs are stable. A click_id that changes
// shape splits a metric in GA4 without anything visibly breaking, so the rules
// that generate them are pinned here rather than left to be re-derived.

test("slugify produces lowercase hyphenated ASCII", () => {
  assert.equal(slugify("Get your free visibility check"), "get-your-free-visibility-check");
  assert.equal(slugify("Pricing & Plans"), "pricing-plans");
  assert.equal(slugify("  spaced  out  "), "spaced-out");
});

test("slugify keeps contractions readable rather than splitting them", () => {
  assert.equal(slugify("Don't guess"), "dont-guess");
  assert.equal(slugify("It’s free"), "its-free");
});

test("slugify strips accents instead of dropping the whole word", () => {
  assert.equal(slugify("Café Cosmétique"), "cafe-cosmetique");
});

test("slugify truncates on a word boundary and never trails a hyphen", () => {
  const long = slugify("the quick brown fox jumps over the lazy dog again and again", 24);
  assert.ok(long.length <= 24, `${long} is longer than 24`);
  assert.doesNotMatch(long, /-$/);
  assert.equal(long, "the-quick-brown-fox");
});

test("slugify falls back to a hard cut when there is no usable boundary", () => {
  const noBoundary = slugify("supercalifragilisticexpialidocious", 10);
  assert.equal(noBoundary, "supercalif");
});

test("classifyDestination separates the five link kinds", () => {
  const origin = "https://frontpaged.io";
  assert.equal(classifyDestination("/pricing/", origin), "internal");
  assert.equal(classifyDestination("#contact", origin), "anchor");
  assert.equal(classifyDestination("mailto:hello@frontpaged.io", origin), "mailto");
  assert.equal(classifyDestination("tel:+16159051857", origin), "tel");
  assert.equal(classifyDestination("https://tageasy.io", origin), "external");
});

test("classifyDestination treats our own absolute URLs as internal", () => {
  const origin = "https://frontpaged.io";
  assert.equal(classifyDestination("https://frontpaged.io/about/", origin), "internal");
  assert.equal(classifyDestination("https://frontpaged.io/#how-ai-decides", origin), "anchor");
});

test("classifyDestination treats protocol-relative URLs as external", () => {
  assert.equal(classifyDestination("//cdn.example.com/x.js", "https://frontpaged.io"), "external");
});

// Page context is derived from the URL rather than passed down as a prop, so
// these assertions are the contract that keeps GA4's page_type honest. Every
// route in the static export is represented.
test("pageContext classifies every route family", () => {
  const cases = [
    ["/", "home", "home"],
    ["/pricing/", "pricing", "pricing"],
    ["/industries/", "industry-index", "industries"],
    ["/industries/personal-injury-law/", "industry", "personal-injury-law"],
    ["/services/", "service-index", "services"],
    ["/services/analytics-and-tracking/", "service", "analytics-and-tracking"],
    ["/blog/", "blog-index", "blog"],
    ["/blog/what-is-generative-engine-optimization/", "blog-post", "what-is-generative-engine-optimization"],
    ["/blog/industry/med-spas/", "blog-industry", "med-spas"],
    ["/contact/", "contact", "contact"],
    ["/contact/thank-you/", "thank-you", "thank-you"],
    ["/ai-readiness-check/", "scorecard", "ai-readiness-check"],
    ["/about/", "about", "about"],
    ["/author/benton-purvis/", "author", "benton-purvis"],
    ["/faq/", "faq", "faq"],
    ["/glossary/", "glossary", "glossary"],
  ];
  for (const [path, pageType, pageSlug] of cases) {
    assert.deepEqual(pageContext(path), { pageType, pageSlug }, `for ${path}`);
  }
});

// /blog/industry/<slug>/ is a filtered index. Reading it as a post would put
// eight index pages into the blog-post metric and overstate article reads.
test("pageContext does not mistake the blog industry index for a post", () => {
  assert.equal(pageContext("/blog/industry/med-spas/").pageType, "blog-industry");
  assert.notEqual(pageContext("/blog/industry/med-spas/").pageType, "blog-post");
});

test("pageContext tolerates missing trailing slashes", () => {
  assert.deepEqual(pageContext("/pricing"), { pageType: "pricing", pageSlug: "pricing" });
  assert.deepEqual(pageContext(""), { pageType: "home", pageSlug: "home" });
});

test("deriveClickId prefers an explicit id over anything derived", () => {
  assert.equal(
    deriveClickId({ explicit: "hero-primary-cta", section: "hero", text: "Get started" }),
    "hero-primary-cta",
  );
});

test("deriveClickId composes section and text when nothing is declared", () => {
  assert.equal(
    deriveClickId({ section: "pricing", text: "See plans" }),
    "pricing-see-plans",
  );
});

test("deriveClickId falls back to the href for icon-only links", () => {
  const id = deriveClickId({ section: "header", text: "", href: "https://instagram.com/frontpaged_io" });
  assert.ok(id.startsWith("header-"), id);
  assert.notEqual(id, "unidentified");
});

// The guarantee the whole approach rests on: a click is never pushed without an
// identifier, even when the element has no text, no href and no declared id.
test("deriveClickId always returns something", () => {
  assert.equal(deriveClickId({}), "unidentified");
  assert.equal(deriveClickId({ explicit: "   " }), "unidentified");
  assert.equal(deriveClickId({ section: "", text: "", href: "" }), "unidentified");
});

test("normalizeText collapses the whitespace that JSX leaves in buttons", () => {
  assert.equal(normalizeText("\n  Free\n  visibility   check\n "), "Free visibility check");
});

test("normalizeText truncates with an ellipsis", () => {
  const out = normalizeText("a".repeat(200), 20);
  assert.equal(out.length, 20);
  assert.ok(out.endsWith("…"));
});
