// SEO/GEO integrity checks for the static export. Run with `pnpm check:seo`,
// AFTER `pnpm build`, against every out/**/index.html — this reads the actual
// bytes a browser or crawler receives, not the React source, so it catches
// anything that goes wrong in rendering (a metadata field silently omitted, a
// template inheriting the wrong title) as well as content that was wrong to
// begin with.
//
// The site sells SEO/GEO to prospects; every page here is a portfolio piece,
// so the bar is "would this pass an audit we'd run for a client."

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");

// Google truncates SERP titles past ~60 characters; a title cut mid-word is
// also a title an AI engine's crawler quotes incompletely.
const TITLE_MAX = 60;

// Meta descriptions render as the SERP snippet. Too short wastes the space
// engines give you; too long gets truncated. The band matches Google's
// rendered snippet length in both directions.
const DESC_MIN = 70;
const DESC_MAX = 155;

const errors = [];
const warnings = [];

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.isFile() && entry.name === "index.html") results.push(full);
  }
  return results;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// Recursively hunts a parsed JSON-LD tree for @type: "ProfessionalService".
// That subtype requires a postal address (see src/components/JsonLd.tsx) this
// remote, nationwide business doesn't have — one slipping back in would
// misrepresent the business to every engine that reads the schema.
function containsProfessionalService(node) {
  if (Array.isArray(node)) return node.some(containsProfessionalService);
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "@type") {
        const types = Array.isArray(value) ? value : [value];
        if (types.includes("ProfessionalService")) return true;
      }
      if (containsProfessionalService(value)) return true;
    }
  }
  return false;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("out/ not found — run `pnpm build` before `pnpm check:seo`.");
  process.exit(1);
}

const files = walk(OUT_DIR).sort();

for (const file of files) {
  const where = path.relative(OUT_DIR, file);
  const html = fs.readFileSync(file, "utf8");

  // --- exactly one <h1> ---
  // The single H1 is the page-topic anchor both AI engines and screen readers
  // key off; zero or several makes "what is this page about" ambiguous.
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) {
    errors.push(`${where}: ${h1Count} <h1> element(s), want exactly 1`);
  }

  // --- <title> ---
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  if (!titleMatch) {
    errors.push(`${where}: no <title> element`);
  } else {
    const title = decodeEntities(titleMatch[1]);
    if (title.length > TITLE_MAX) {
      errors.push(`${where}: title is ${title.length} chars (max ${TITLE_MAX}): "${title}"`);
    }
  }

  // --- meta description ---
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  if (!descMatch) {
    errors.push(`${where}: no meta description`);
  } else {
    const desc = decodeEntities(descMatch[1]);
    if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
      errors.push(
        `${where}: description is ${desc.length} chars, want ${DESC_MIN}-${DESC_MAX}: "${desc}"`,
      );
    }
  }

  // --- og:image ---
  // Missing og:image means a share to Slack/LinkedIn/iMessage renders as a
  // bare link — a credibility drag for a site whose product is visibility.
  if (!/<meta property="og:image" content="[^"]+"/.test(html)) {
    errors.push(`${where}: missing og:image meta tag`);
  }

  // --- canonical, trailing-slashed ---
  // next.config.ts sets trailingSlash: true, so every real URL on this host
  // ends in "/". A canonical missing the slash points at a URL that 301s
  // instead of the URL actually served, diluting the signal it exists to
  // consolidate.
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonicalMatch) {
    errors.push(`${where}: no canonical link`);
  } else if (!canonicalMatch[1].endsWith("/")) {
    errors.push(`${where}: canonical "${canonicalMatch[1]}" is not trailing-slashed`);
  }

  // --- application/ld+json blocks ---
  // Not every page needs structured data (the 404 page has nothing to
  // describe), but every block that IS emitted must parse — a syntax error
  // here means Google/AI crawlers silently drop the whole schema for the
  // page — and none may declare ProfessionalService.
  const scripts = [
    ...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ];
  scripts.forEach(([, raw], i) => {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      errors.push(`${where}: ld+json block ${i + 1} does not parse (${e.message})`);
      return;
    }
    if (containsProfessionalService(parsed)) {
      errors.push(`${where}: ld+json block ${i + 1} declares @type "ProfessionalService"`);
    }
  });
}

// --- report ---
console.log(`${files.length} page(s) checked\n`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\nAll checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
