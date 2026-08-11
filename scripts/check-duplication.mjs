// Anti-doorway gate for the eight industry hub bodies. Run with
// `pnpm check:duplication`, BEFORE the build, straight against the Markdown
// source via getIndustryBody — no need to wait on `next build` to catch this
// class of defect, and it's the check most worth running first: a template
// with the noun swapped is the single most likely way this repositioning
// (one industry -> eight) tanks rankings, and it's the one mistake a
// template-driven multi-vertical site makes almost by default.
//
// Two independent signals, because a page can dodge one and not the other:
//
//  1. Pairwise 5-gram Jaccard similarity of the rendered body text, capped at
//     0.35. High word-sequence overlap means the same sentences with nouns
//     swapped, even when section headings differ.
//  2. Identical `sections` (##) sequences between any two verticals. Prose
//     can differ page to page while the underlying argument is still a
//     template — same claims, same order, same section count — and that
//     structural sameness is itself a doorway-page signal, independent of
//     how much the wording overlaps.

import { getIndustrySlugs, getIndustryBody } from "../src/lib/industries.ts";

const SIMILARITY_MAX = 0.35;
const NGRAM_SIZE = 5;

const errors = [];
const warnings = [];

function words(html) {
  return html.replace(/<[^>]+>/g, " ").toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

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

const slugs = getIndustrySlugs();

const bodies = [];
for (const slug of slugs) {
  const body = getIndustryBody(slug);
  if (!body) {
    warnings.push(`${slug}: no content/industries/${slug}.md yet — skipped`);
    continue;
  }
  bodies.push({ slug, grams: ngramSet(words(body.html), NGRAM_SIZE), sections: body.sections });
}

for (let i = 0; i < bodies.length; i++) {
  for (let j = i + 1; j < bodies.length; j++) {
    const a = bodies[i];
    const b = bodies[j];
    const where = `${a.slug} vs ${b.slug}`;

    const sim = jaccard(a.grams, b.grams);
    if (sim > SIMILARITY_MAX) {
      errors.push(
        `${where}: ${(sim * 100).toFixed(1)}% 5-gram similarity, max ${(SIMILARITY_MAX * 100).toFixed(0)}% — reads as a template with the noun swapped`,
      );
    }

    if (a.sections.length > 0 && JSON.stringify(a.sections) === JSON.stringify(b.sections)) {
      errors.push(
        `${where}: identical section sequence [${a.sections.join(" | ")}] — same structure is a doorway-page signal even with different wording`,
      );
    }
  }
}

// --- report ---
console.log(`${bodies.length} industry bod${bodies.length === 1 ? "y" : "ies"} compared pairwise\n`);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\nAll checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
