// Analytics instrumentation integrity for the static export.
// Run with `pnpm check:tracking`, AFTER `pnpm build`, against every out/**/*.html.
//
// Tracking rots more quietly than almost anything else in a codebase. A renamed
// button, a duplicated component, a page that stops rendering a CTA — none of
// these break a build, and none of them are visible on the page. What you get
// instead is a number in GA4 that is subtly wrong for months, which is worse
// than no number, because decisions get made on it.
//
// So the rules that reporting depends on are asserted here against the HTML the
// export actually produced, alongside check-links and check-seo.

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");

const errors = [];
const warnings = [];

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.name.endsWith(".html")) results.push(full);
  }
  return results;
}

/**
 * Strip <script> blocks before inspecting markup.
 *
 * Next serialises the React tree into inline scripts at the bottom of every
 * page, so every attribute in the DOM also appears there as flight data.
 * Counting without stripping reports exactly double and looks like a real
 * duplicate-id bug — which cost an afternoon once already.
 */
const stripScripts = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");

const routeOf = (file) =>
  `/${path.relative(OUT_DIR, file).replace(/index\.html$/, "").replace(/\\/g, "/")}`;

// Commercially load-bearing IDs, and where each must appear. If a redesign drops
// one of these the funnel loses a step silently, so the build stops instead.
const REQUIRED = [
  { route: "/", ids: ["hero-primary-visibility-check", "hero-secondary-see-plans"] },
  { route: "/", ids: ["how-ai-decides-scorecard-cta"] },
  { route: "/contact/", ids: ["contact-form-submit"] },
  { route: "/industries/", ids: ["industry-card-med-spas", "industry-card-personal-injury-law"] },
  { route: "/industries/med-spas/", ids: ["pricing-tier-med-spas-authority"] },
];

// Every page carries the shell, so these must be on all of them.
const REQUIRED_EVERYWHERE = [
  "header-cta-visibility-check",
  "header-logo-home",
  "footer-email",
];

const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

const files = walk(OUT_DIR);
const seenRequired = new Set();

for (const file of files) {
  const route = routeOf(file);
  const raw = fs.readFileSync(file, "utf8");
  const html = stripScripts(raw);

  // 0. Head script ordering. Invisible when wrong — the page looks and behaves
  //    identically while the data is quietly missing from the first hit.
  // Next serialises the React tree into inline flight data at the foot of the
  // page, so every one of these strings ALSO appears there. Presence is checked
  // against the head slice only — searching the whole document would find the
  // flight copy and report a deleted head script as merely misplaced.
  const headEnd = raw.indexOf("</head>");
  const head = headEnd === -1 ? "" : raw.slice(0, headEnd);
  const containerAt = raw.indexOf("gtm.start");

  if (headEnd === -1) {
    errors.push(`${route}: no </head> found`);
  } else {
    // Page context must be in <head> and run before the container, or the first
    // page_view lands with no page_type or industry on it.
    const pageCtxInHead = head.indexOf("__fpPageContext");
    if (pageCtxInHead === -1) {
      errors.push(`${route}: page context script is missing from <head>`);
    } else if (containerAt !== -1 && pageCtxInHead > containerAt) {
      errors.push(`${route}: page context runs AFTER the GTM container`);
    }
  }

  const ids = [...html.matchAll(/data-track-id="([^"]*)"/g)].map((m) => m[1]);

  // 1. Malformed ids. An unresolved template literal or a stray uppercase turns
  //    into a distinct row in every GA4 report it appears in.
  for (const id of new Set(ids)) {
    if (!id) errors.push(`${route}: empty data-track-id`);
    else if (!ID_PATTERN.test(id)) errors.push(`${route}: malformed data-track-id "${id}"`);
    if (id.includes("undefined") || id.includes("[object")) {
      errors.push(`${route}: data-track-id "${id}" contains an unresolved value`);
    }
  }

  // 2. Duplicate ids within one page. Two elements reporting under one name
  //    merge two behaviours into a single metric with no warning.
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);
  for (const [id, n] of counts) {
    if (n > 1) errors.push(`${route}: data-track-id "${id}" appears ${n} times`);
  }

  // 3. Duplicated page shell. This is how the two-<header> bug on
  //    /blog/industry/<slug>/ went unnoticed: a page rendering its own banner,
  //    header and footer inside a layout that already supplies them. It doubles
  //    every nav link in the page's link graph and breaks the one-<main> rule
  //    this site sells as part of its own semantic-HTML pitch.
  const mains = (html.match(/<main[\s>]/g) ?? []).length;
  const headers = (html.match(/<header[\s>]/g) ?? []).length;
  const footers = (html.match(/<footer[\s>]/g) ?? []).length;
  if (mains !== 1) errors.push(`${route}: ${mains} <main> landmarks, expected exactly 1`);
  if (headers !== 1) errors.push(`${route}: ${headers} <header> landmarks, expected exactly 1`);
  if (footers !== 1) errors.push(`${route}: ${footers} <footer> landmarks, expected exactly 1`);

  for (const id of REQUIRED_EVERYWHERE) {
    if (!counts.has(id)) errors.push(`${route}: missing sitewide data-track-id "${id}"`);
  }

  for (const req of REQUIRED) {
    if (req.route !== route) continue;
    seenRequired.add(req.route + req.ids.join());
    for (const id of req.ids) {
      if (!counts.has(id)) errors.push(`${route}: missing required data-track-id "${id}"`);
    }
  }

  // 4. Coverage. Anything without an explicit id still gets a derived one at
  //    runtime, so this is a nudge rather than a failure — but a page where most
  //    links are unlabelled is one where the report will read as a wall of
  //    section-plus-link-text strings.
  const anchors = (html.match(/<a\s[^>]*href=/g) ?? []).length;
  if (anchors > 12 && ids.length / anchors < 0.25) {
    warnings.push(
      `${route}: only ${ids.length} of ~${anchors} links carry an explicit id ` +
        `(${Math.round((ids.length / anchors) * 100)}%) — derived ids will dominate this page's report`,
    );
  }
}

// A required route that no longer exists is as much a regression as a missing id.
for (const req of REQUIRED) {
  if (!seenRequired.has(req.route + req.ids.join())) {
    errors.push(`route ${req.route} was not found in the export, so its required ids went unchecked`);
  }
}

console.log(`\n${files.length} page(s) checked for tracking integrity\n`);

for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} error(s).\n`);
  process.exit(1);
}
console.log(
  warnings.length ? `\nAll checks passed (${warnings.length} warning(s)).\n` : "\nAll checks passed.\n",
);
