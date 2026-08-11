// Internal link integrity for the static export. Run with `pnpm check:links`,
// AFTER `pnpm build`, against every out/**/*.html.
//
// `next build` only checks links it can statically trace through <Link>; a
// hand-written href string (nav copy, inline prose, a footer link) that
// typos a slug or drops a trailing slash builds clean and 404s in
// production. next.config.ts sets trailingSlash: true, so a path and its
// slash-less variant are DIFFERENT URLs on this host — the only way to catch
// that class of bug is to check the exact string a browser will request
// against the exact files the export produced.

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");

const errors = [];
const warnings = [];

function walk(dir, isMatch) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full, isMatch));
    else if (isMatch(entry.name)) results.push(full);
  }
  return results;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("out/ not found — run `pnpm build` before `pnpm check:links`.");
  process.exit(1);
}

const htmlFiles = walk(OUT_DIR, (name) => name.endsWith(".html")).sort();

// Cache file contents: an anchor href like "/pricing/#pricing-table" needs to
// read the TARGET page's markup to confirm the id exists there, not just the
// linking page's, so the same file can get read from more than one source page.
const contentCache = new Map();
function read(diskPath) {
  if (!contentCache.has(diskPath)) contentCache.set(diskPath, fs.readFileSync(diskPath, "utf8"));
  return contentCache.get(diskPath);
}

// Resolve a site-absolute path ("/", "/foo/", "/favicon.ico") to a file on
// disk the same way the export/host resolves it: a directory's index.html
// (the shape every route takes under trailingSlash: true), or a real file at
// that exact path (favicon.ico, llms.txt, the opengraph-image route, hashed
// _next/static assets, ...).
function resolveTarget(urlPath) {
  const clean = urlPath.replace(/\/+$/, "") || "/";
  const asIndex = path.join(OUT_DIR, clean, "index.html");
  if (fs.existsSync(asIndex) && fs.statSync(asIndex).isFile()) return asIndex;
  const asFile = path.join(OUT_DIR, clean);
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) return asFile;
  return null;
}

function splitHash(raw) {
  const i = raw.indexOf("#");
  return i === -1 ? [raw, ""] : [raw.slice(0, i), raw.slice(i + 1)];
}

function hasId(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\bid="${escaped}"`).test(html);
}

// Matches href="/..." (site-absolute) and href="#..." (same-page fragment).
// Deliberately not matching mailto:, tel:, or absolute https:// hrefs — those
// aren't internal routes this export controls.
const HREF_RE = /href="(\/[^"]*|#[^"]*)"/g;

for (const file of htmlFiles) {
  const where = path.relative(OUT_DIR, file);
  const html = read(file);

  for (const [, raw] of html.matchAll(HREF_RE)) {
    if (raw.startsWith("#")) {
      const id = raw.slice(1);
      if (id && !hasId(html, id)) {
        errors.push(`${where}: href="${raw}" has no matching id="${id}" on this page`);
      }
      continue;
    }

    const [pathAndQuery, hash] = splitHash(raw);
    const urlPath = pathAndQuery.split("?")[0];

    const target = resolveTarget(urlPath);
    if (!target) {
      errors.push(`${where}: href="${raw}" — no page or file at ${urlPath} in out/`);
      continue;
    }

    if (hash && target.endsWith(".html")) {
      const targetHtml = read(target);
      if (!hasId(targetHtml, hash)) {
        errors.push(
          `${where}: href="${raw}" links to id="${hash}" on ${path.relative(OUT_DIR, target)}, which has no matching id`,
        );
      }
    }
  }
}

// --- report ---
console.log(`${htmlFiles.length} page(s) scanned for links\n`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\nAll checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
