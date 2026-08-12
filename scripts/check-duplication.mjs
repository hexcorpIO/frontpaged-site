// Anti-doorway gate. Run with `pnpm check:duplication`, BEFORE the build,
// straight against the Markdown source — no need to wait on `next build` to
// catch this class of defect, and it's the check most worth running first.
//
// Covers two bodies of content:
//
//   1. The eight industry hub bodies (content/industries/*.md). A template with
//      the noun swapped is the single most likely way a one-industry -> eight
//      repositioning tanks rankings, and it's the mistake a template-driven
//      multi-vertical site makes almost by default.
//
//   2. Every blog post (content/blog/*.md). Added when the library grew past 50
//      posts heading for ~99 across eight verticals. Every post here argues some
//      version of "structure your content so AI can cite it", so convergence is
//      the natural drift, not an unlikely accident.
//
// FOUR signals, because whole-document similarity alone provably misses the
// realistic failure mode. When the hub closings genuinely were a fill-in-the-
// blank template, whole-body 5-gram Jaccard still read under 2% — a shared
// 100-word section is diluted to nothing across a 1,100-word document. The
// structural checks are what actually caught it.
//
//   A. Pairwise 5-gram Jaccard on body text.
//   B. Identical heading sequences between any two documents.
//   C. The same heading text reused across many documents.
//   D. The same FAQ question on two different posts.
//
// Thresholds are set from measured baselines rather than guessed, so they have
// real headroom and won't cry wolf. At the time of writing: hub bodies peaked at
// 0.3% pairwise, posts at 3.25% across 1,225 pairs (median 0.045%), 385 distinct
// post headings with 5 repeats, and zero duplicate FAQ questions in 250.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getIndustrySlugs, getIndustryBody } from "../src/lib/industries.ts";

const HUB_SIMILARITY_MAX = 0.35;
// Posts within one vertical legitimately share vocabulary, so this sits higher
// than the hub gate in spirit — but 20% is still ~6x the measured maximum, which
// means it fires on a genuine rewrite and stays quiet on normal variation.
const POST_SIMILARITY_MAX = 0.2;
// A generic heading recurring a few times is fine. Past this it signals a
// house template forming across the library, which is the slow version of the
// doorway problem. Warning, not error — it needs a human read, not a build stop.
const HEADING_REUSE_WARN = 4;
const NGRAM_SIZE = 5;

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const errors = [];
const warnings = [];

const words = (text) =>
  text.replace(/<[^>]+>/g, " ").toLowerCase().match(/[a-z0-9']+/g) ?? [];

function ngramSet(tokens, n) {
  const set = new Set();
  for (let i = 0; i + n <= tokens.length; i++) set.add(tokens.slice(i, i + n).join(" "));
  return set;
}

function jaccard(a, b) {
  let intersection = 0;
  for (const gram of a) if (b.has(gram)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

const norm = (s) => String(s).toLowerCase().replace(/\s+/g, " ").trim();

/** Signals A and B over any set of {id, grams, headings}. */
function comparePairwise(docs, label, maxSimilarity) {
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const a = docs[i];
      const b = docs[j];
      const where = `${a.id} vs ${b.id}`;

      const sim = jaccard(a.grams, b.grams);
      if (sim > maxSimilarity) {
        errors.push(
          `${label} ${where}: ${(sim * 100).toFixed(1)}% ${NGRAM_SIZE}-gram similarity, max ${(maxSimilarity * 100).toFixed(0)}% — reads as the same piece rewritten`,
        );
      }

      if (
        a.headings.length > 0 &&
        JSON.stringify(a.headings.map(norm)) === JSON.stringify(b.headings.map(norm))
      ) {
        errors.push(
          `${label} ${where}: identical heading sequence [${a.headings.join(" | ")}] — same structure is a template signal even when the wording differs`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------- hub bodies

const hubs = [];
for (const slug of getIndustrySlugs()) {
  const body = getIndustryBody(slug);
  if (!body) {
    warnings.push(`${slug}: no content/industries/${slug}.md yet — skipped`);
    continue;
  }
  hubs.push({
    id: slug,
    grams: ngramSet(words(body.html), NGRAM_SIZE),
    headings: body.sections,
  });
}
comparePairwise(hubs, "hub", HUB_SIMILARITY_MAX);

// --------------------------------------------------------------- blog posts

const posts = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
    return {
      id: file.replace(/\.md$/, ""),
      grams: ngramSet(words(content), NGRAM_SIZE),
      headings: [...content.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim()),
      faqs: Array.isArray(data.faqs) ? data.faqs.map((f) => String(f.q)) : [],
    };
  });

comparePairwise(posts, "post", POST_SIMILARITY_MAX);

// C. Heading text reused across the library.
const headingUse = new Map();
for (const post of posts) {
  for (const heading of post.headings) {
    const key = norm(heading);
    if (!headingUse.has(key)) headingUse.set(key, []);
    headingUse.get(key).push(post.id);
  }
}
for (const [heading, used] of headingUse) {
  if (used.length >= HEADING_REUSE_WARN) {
    warnings.push(
      `heading "${heading}" appears in ${used.length} posts (${used.slice(0, 3).join(", ")}…) — a house template may be forming`,
    );
  }
}

// D. FAQ questions must be unique across the whole library. Same rule the
// vertical records are already held to in tests/verticals.test.mjs: duplicated
// Q&A across pages is self-competing content on a site that sells SEO, and it
// gives an AI engine two sources disagreeing about which page owns an answer.
const faqUse = new Map();
for (const post of posts) {
  for (const question of post.faqs) {
    const key = norm(question);
    if (!faqUse.has(key)) faqUse.set(key, []);
    faqUse.get(key).push(post.id);
  }
}
for (const [question, used] of faqUse) {
  if (used.length > 1) {
    errors.push(`FAQ question "${question}" appears in ${used.length} posts: ${used.join(", ")}`);
  }
}

// ------------------------------------------------------------------- report

console.log(
  `${hubs.length} industry bod${hubs.length === 1 ? "y" : "ies"} and ${posts.length} posts compared pairwise\n`,
);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\nAll checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
