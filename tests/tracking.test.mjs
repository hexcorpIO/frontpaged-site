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

// ── Page-scoped context ──────────────────────────────────────────────────
//
// The classifier in PageContext.tsx is a raw JS string, so TypeScript never
// looks at it and a typo there fails silently at runtime. It is extracted and
// executed here for the same reason the pricing formula has tests: it is the
// definition of a dimension that decisions get made on.

import fs from "node:fs";

function loadPageContext() {
  const src = fs.readFileSync("src/components/PageContext.tsx", "utf8");
  const open = "const PAGE_CONTEXT = `";
  const body = src.slice(src.indexOf(open) + open.length, src.indexOf("`;\n\n/** The head half"));
  const sandbox = {
    window: { dataLayer: [] },
    location: { pathname: "/" },
  };
  sandbox.window.window = sandbox.window;
  const run = new Function(
    "window",
    "location",
    `var dataLayer = window.dataLayer;${body}; return window.__fpPageContext;`,
  );
  return { ctx: run(sandbox.window, sandbox.location), pushed: sandbox.window.dataLayer };
}

test("page context classifies every route family", () => {
  const { ctx } = loadPageContext();
  const cases = [
    ["/", "home", "none"],
    ["/industries/", "industry-index", "none"],
    ["/industries/med-spas/", "industry", "med-spas"],
    ["/industries/real-estate-teams/", "industry", "real-estate-teams"],
    ["/services/", "service-index", "none"],
    ["/services/analytics-and-tracking/", "service", "none"],
    ["/pricing/", "pricing", "none"],
    ["/ai-readiness-check/", "check", "none"],
    ["/contact/", "contact", "none"],
    ["/contact/thank-you/", "contact", "none"],
    ["/blog/", "blog", "none"],
    ["/blog/what-is-generative-engine-optimization/", "blog", "none"],
    ["/faq/", "faq", "none"],
    ["/about/", "about", "none"],
  ];
  for (const [path, pageType, industry] of cases) {
    const out = ctx(path);
    assert.equal(out.page_type, pageType, `page_type for ${path}`);
    assert.equal(out.industry, industry, `industry for ${path}`);
  }
});

// /blog/industry/<slug>/ is a filtered blog index whose URL contains a vertical
// slug. The classifier keys off "/industries/", not "/industry/", so it must not
// attribute those pages to the vertical — that would inflate every industry's
// numbers with blog traffic.
test("page context does not read an industry out of the blog industry index", () => {
  const { ctx } = loadPageContext();
  const out = ctx("/blog/industry/med-spas/");
  assert.equal(out.industry, "none");
  assert.equal(out.page_type, "blog");
});

test("page context industry map matches the published vertical slugs", async () => {
  const { getPublishedVerticals } = await import("../src/lib/verticals/index.ts");
  const { ctx } = loadPageContext();
  for (const v of getPublishedVerticals()) {
    assert.equal(
      ctx(`/industries/${v.slug}/`).industry,
      v.slug,
      `${v.slug} is missing from the INDUSTRIES map in PageContext.tsx`,
    );
  }
});

test("page context derives content_group from page_type", () => {
  const { ctx } = loadPageContext();
  assert.equal(ctx("/").content_group, "Home");
  assert.equal(ctx("/industries/med-spas/").content_group, "Industry");
  assert.equal(ctx("/ai-readiness-check/").content_group, "Check");
});

test("page context pushes once for the entry page", () => {
  const { pushed } = loadPageContext();
  assert.equal(pushed.length, 1);
  assert.equal(pushed[0].page_type, "home");
  assert.equal(pushed[0].tier_context, "none");
});

// ── Score buckets ────────────────────────────────────────────────────────
//
// The analytics bucket and the label shown on screen come from one table, so a
// report can never describe a different grade than the visitor was given. These
// pin that, and pin the mapping to the site's real 80/55/30 grading rather than
// the 70/40 the brief suggested before saying to match the actual grading.

test("score buckets follow the published band thresholds", async () => {
  const { score, questions, MAX_SCORE } = await import("../src/lib/scorecard.ts");

  // Build answers producing an exact target percentage.
  const atPercent = (pct) => {
    const points = Math.round((pct / 100) * MAX_SCORE);
    const answers = {};
    let left = points;
    for (const q of questions) {
      if (left >= 2) { answers[q.id] = "yes"; left -= 2; }
      else if (left === 1) { answers[q.id] = "partly"; left -= 1; }
    }
    return score(answers);
  };

  for (const [pct, bucket, label] of [
    [100, "strong", "Well positioned"],
    [80, "strong", "Well positioned"],
    [75, "some-gaps", "Partly ready"],
    [55, "some-gaps", "Partly ready"],
    [50, "at-risk", "Significant gaps"],
    [30, "at-risk", "Significant gaps"],
    [25, "at-risk", "Not yet legible"],
    [0, "at-risk", "Not yet legible"],
  ]) {
    const r = atPercent(pct);
    assert.equal(r.band.bucket, bucket, `${pct}% -> bucket (got ${r.percent}%)`);
    assert.equal(r.band.label, label, `${pct}% -> label`);
  }
});

// The bucket is only meaningful if it cannot contradict the label. There is one
// table, so this holds by construction — asserted anyway, because a future edit
// adding a fifth band could quietly give it the wrong bucket.
test("every band maps to exactly one bucket, across the whole range", async () => {
  const { score, questions, MAX_SCORE } = await import("../src/lib/scorecard.ts");
  const seen = new Map();
  for (let points = 0; points <= MAX_SCORE; points++) {
    const answers = {};
    let left = points;
    for (const q of questions) {
      if (left >= 2) { answers[q.id] = "yes"; left -= 2; }
      else if (left === 1) { answers[q.id] = "partly"; left -= 1; }
    }
    const { band } = score(answers);
    if (seen.has(band.label)) {
      assert.equal(seen.get(band.label), band.bucket, `band "${band.label}" has two buckets`);
    } else {
      seen.set(band.label, band.bucket);
    }
    assert.ok(
      ["strong", "some-gaps", "at-risk"].includes(band.bucket),
      `unknown bucket "${band.bucket}"`,
    );
  }
  assert.equal(seen.size, 4, "expected four bands");
  assert.equal(new Set(seen.values()).size, 3, "expected three buckets");
});

// check_start must fire once, on the first answer — not on the first CLICK.
// Questions are answerable in any order and an answer can be changed, so a
// naive "question index + 1" counter would re-fire check_start whenever someone
// revised question one, and miss the halfway mark entirely for anyone who
// answered out of order.
test("answer counting fires check_start once and halfway once, in any order", () => {
  const total = 10;
  const halfway = Math.ceil(total / 2);
  const events = [];
  const answers = {};

  const answer = (id) => {
    const wasAnswered = Boolean(answers[id]);
    const answered = Object.keys(answers).length;
    const next = wasAnswered ? answered : answered + 1;
    answers[id] = "yes";
    if (next === 1 && !wasAnswered) events.push("check_start");
    else if (next === halfway && !wasAnswered) events.push("check_progress");
  };

  // Deliberately out of order, with revisions interleaved.
  for (const id of ["q7", "q3", "q7", "q1", "q3", "q9", "q2", "q7"]) answer(id);

  assert.deepEqual(events, ["check_start", "check_progress"]);
  assert.equal(events.filter((e) => e === "check_start").length, 1);
  assert.equal(events.filter((e) => e === "check_progress").length, 1);
});

// ── Click attribution ────────────────────────────────────────────────────

import {
  buildSchedulerUrl,
  mergeAttribution,
  parseAttribution,
  readCookie,
  serializeCookie,
} from "../src/lib/attribution.ts";

test("parseAttribution picks up utm and every ad click id", () => {
  const a = parseAttribution("?utm_source=google&utm_medium=cpc&utm_campaign=medspa&gclid=ABC123");
  assert.deepEqual(a, {
    utm_source: "google", utm_medium: "cpc", utm_campaign: "medspa", gclid: "ABC123",
  });
  assert.equal(parseAttribution("?wbraid=W1").wbraid, "W1");
  assert.equal(parseAttribution("?gbraid=G1").gbraid, "G1");
});

test("parseAttribution returns empty for a direct visit and ignores junk", () => {
  assert.deepEqual(parseAttribution(""), {});
  assert.deepEqual(parseAttribution("?ref=twitter&fbclid=x"), {});
});

test("attribution round-trips through the cookie", () => {
  const a = { utm_source: "google", gclid: "ABC 123&x=1" };
  assert.deepEqual(readCookie(`fp_click=${serializeCookie(a)}`), a);
});

// A truncated or hand-edited cookie must not throw: this is read on the page
// where a booking is about to happen, and an exception would take the scheduler
// down with it.
test("readCookie survives corrupt input", () => {
  for (const c of ["", "fp_click=", "fp_click=%7Bbroken", "fp_click=null",
                   "fp_click=%5B1%2C2%5D", "other=1", "fp_click=%22str%22"]) {
    assert.deepEqual(readCookie(c), {}, `for ${c}`);
  }
});

test("readCookie is not fooled by a similarly named cookie", () => {
  const a = serializeCookie({ utm_source: "real" });
  assert.deepEqual(readCookie(`not_fp_click=${serializeCookie({ utm_source: "decoy" })}; fp_click=${a}`),
                   { utm_source: "real" });
});

// Last touch, but only when the new visit actually carries parameters. An ad
// click followed by a direct return visit must not erase the gclid before the
// person books.
test("mergeAttribution keeps the stored value on a direct return visit", () => {
  const stored = { gclid: "ABC", utm_source: "google" };
  assert.deepEqual(mergeAttribution(stored, {}), stored);
});

test("mergeAttribution lets a newer campaign replace an older one", () => {
  assert.deepEqual(
    mergeAttribution({ gclid: "OLD", utm_source: "google" }, { utm_source: "bing" }),
    { utm_source: "bing" },
  );
});

test("buildSchedulerUrl carries utm through and the click id in utm_content", () => {
  const url = buildSchedulerUrl(
    "https://calendly.com/benton-frontpaged/30min",
    { utm_source: "google", utm_medium: "cpc", utm_campaign: "medspa", gclid: "ABC123" },
    "med-spas",
  );
  const q = new URL(url).searchParams;
  assert.equal(q.get("utm_source"), "google");
  assert.equal(q.get("utm_medium"), "cpc");
  assert.equal(q.get("utm_campaign"), "medspa");
  assert.equal(q.get("utm_content"), "gclid:ABC123");
  assert.equal(q.get("utm_term"), "med-spas");
  assert.ok(url.startsWith("https://calendly.com/benton-frontpaged/30min?"));
});

test("buildSchedulerUrl prefers gclid, then wbraid, then gbraid", () => {
  const at = (a) => new URL(buildSchedulerUrl("https://c.io/x", a, "none")).searchParams.get("utm_content");
  assert.equal(at({ gclid: "G", wbraid: "W", gbraid: "B" }), "gclid:G");
  assert.equal(at({ wbraid: "W", gbraid: "B" }), "gclid:W");
  assert.equal(at({ gbraid: "B" }), "gclid:B");
  assert.equal(at({}), null);
});

test("buildSchedulerUrl always sets utm_term, defaulting to none", () => {
  assert.equal(new URL(buildSchedulerUrl("https://c.io/x", {}, "")).searchParams.get("utm_term"), "none");
  assert.equal(new URL(buildSchedulerUrl("https://c.io/x", {}, "estate-law")).searchParams.get("utm_term"), "estate-law");
});

test("buildSchedulerUrl preserves query already on the configured URL", () => {
  const q = new URL(buildSchedulerUrl("https://c.io/x?hide_gdpr_banner=1", {}, "none")).searchParams;
  assert.equal(q.get("hide_gdpr_banner"), "1");
  assert.equal(q.get("utm_term"), "none");
});

// site.ts imports a directory ("./verticals"), which the bundler resolves and
// Node's ESM loader does not — so the configured URL is read as text rather
// than imported. The assertion is the same: the real value must build cleanly.
test("buildSchedulerUrl produces a valid URL for the configured Calendly link", () => {
  const src = fs.readFileSync("src/lib/site.ts", "utf8");
  const calendly = src.match(/calendly:\s*"([^"]+)"/)?.[1];
  assert.ok(calendly, "site.ts no longer defines a calendly URL");
  const url = buildSchedulerUrl(calendly, { gclid: "X" }, "med-spas");
  assert.doesNotThrow(() => new URL(url));
  assert.ok(url.startsWith(calendly), `${url} does not start with ${calendly}`);
});
