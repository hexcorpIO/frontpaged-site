// Content integrity checks for the blog. Run with `pnpm check:content`.
//
// The build only ever contains *published* posts, so `next build` cannot catch a
// link from one scheduled post to another: neither is emitted today, but the
// earlier one publishes first and its link 404s until the later one catches up.
// These checks read the markdown source instead, so they see the whole calendar.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Routes that always exist, so a post may link to them from any date.
const STATIC_ROUTES = new Set([
  "/",
  "/pricing",
  "/contact",
  "/blog",
  "/industries",
  "/industries/med-spas",
  "/industries/plastic-surgery",
  "/industries/dermatology",
  "/industries/wellness",
  "/industries/concierge-medicine",
  "/industries/personal-injury-law",
  "/industries/estate-law",
  "/industries/real-estate-teams",
  "/ai-readiness-check",
  "/author/benton-purvis",
  "/blog/industry/med-spas",
  "/blog/industry/personal-injury-law",
  "/services",
  "/services/generative-engine-optimization",
  "/services/google-business-profile",
  "/services/google-ads",
  "/services/social-media-ads",
  "/services/analytics-and-tracking",
  "/services/website-hosting",
  "/services/website-design-and-maintenance",
  "/services/marketing-automation",
]);

// Word-count bands. Too thin reads as low-value to search engines; too long and
// the answer stops being extractable. Pillars get their own ceiling.
const MIN_WORDS = 1_000;
const MAX_WORDS = 1_800;
const PILLAR_MAX_WORDS = 2_600;
const PILLARS = new Set(["med-spa-service-page-template", "med-spa-seo-2027-guide"]);

const TODAY = new Date().toISOString().slice(0, 10);

const errors = [];
const warnings = [];

const posts = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const slug = f.replace(/\.md$/, "");
    const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
    return { slug, data, content, words: content.split(/\s+/).filter(Boolean).length };
  });

const bySlug = new Map(posts.map((p) => [p.slug, p]));

for (const post of posts) {
  const { slug, data, content, words } = post;
  const where = `${slug}.md`;

  // --- frontmatter ---
  for (const field of ["title", "description", "date", "author", "tags", "vertical", "quickAnswer", "faqs"]) {
    if (!data[field]) errors.push(`${where}: missing frontmatter field "${field}"`);
  }
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) {
    errors.push(`${where}: date "${data.date}" is not yyyy-mm-dd`);
  }
  if (Array.isArray(data.tags) && data.tags.length !== 3) {
    warnings.push(`${where}: ${data.tags.length} tags (every other post has 3)`);
  }
  if (Array.isArray(data.faqs) && data.faqs.length !== 5) {
    errors.push(`${where}: ${data.faqs.length} FAQs, expected exactly 5`);
  }

  // The quickAnswer is the block AI engines lift verbatim — it has to stand alone
  // as a complete answer, which empirically lands between 50 and 80 words.
  const qaWords = String(data.quickAnswer ?? "").split(/\s+/).filter(Boolean).length;
  if (qaWords < 45 || qaWords > 90) {
    errors.push(`${where}: quickAnswer is ${qaWords} words, want 45-90`);
  }

  for (const [i, faq] of (data.faqs ?? []).entries()) {
    const n = String(faq.a ?? "").split(/\s+/).filter(Boolean).length;
    if (n < 35 || n > 80) warnings.push(`${where}: FAQ ${i + 1} answer is ${n} words, want 35-80`);
    if (!String(faq.q ?? "").trim().endsWith("?")) {
      warnings.push(`${where}: FAQ ${i + 1} question is not phrased as a question`);
    }
  }

  // Meta descriptions get truncated in SERPs past ~160 characters.
  const desc = String(data.description ?? "");
  if (desc.length > 165) errors.push(`${where}: description is ${desc.length} chars, max 165`);
  if (desc.length < 70) warnings.push(`${where}: description is ${desc.length} chars, quite short`);

  // --- body ---
  const max = PILLARS.has(slug) ? PILLAR_MAX_WORDS : MAX_WORDS;
  if (words < MIN_WORDS || words > max) {
    errors.push(`${where}: ${words} words, want ${MIN_WORDS}-${max}`);
  }

  const h2s = content.match(/^## .+$/gm) ?? [];
  if (h2s.length < 6) errors.push(`${where}: ${h2s.length} H2 sections, want at least 6`);

  if (!/^## /m.test(content)) errors.push(`${where}: body has no H2 headings`);
  if (/^# /m.test(content)) errors.push(`${where}: body contains an H1 (the title renders as the page H1)`);

  // --- internal links ---
  // Markdown may escape characters in the destination (e.g. `/\#pricing`); strip
  // the backslashes so we validate the URL the renderer actually emits.
  const links = [...content.matchAll(/\]\((\/[^)\s]*)\)/g)].map((m) => m[1].replace(/\\/g, ""));
  if (links.length < 2) warnings.push(`${where}: only ${links.length} internal link(s)`);

  for (const link of links) {
    const target = link.split("#")[0].replace(/\/$/, "") || "/";
    if (STATIC_ROUTES.has(target)) continue;

    const m = target.match(/^\/blog\/(.+)$/);
    if (!m) {
      errors.push(`${where}: link "${link}" does not match any known route`);
      continue;
    }
    const dest = bySlug.get(m[1]);
    if (!dest) {
      errors.push(`${where}: link "${link}" points at a post that does not exist`);
      continue;
    }
    // A forward link is dead for the window between the source publishing and the
    // target publishing. That only matters if the window is still open: when the
    // target is already live, the gap closed in the past and nobody can hit it.
    // So flag forward links only to targets that are still unpublished.
    const destDate = String(dest.data.date);
    if (destDate > String(data.date) && destDate > TODAY) {
      errors.push(
        `${where} (${data.date}): links forward to unpublished "${m[1]}" (${destDate}) — ` +
          `dead link for ${daysBetween(data.date, destDate)} days`,
      );
    }
  }
}

// --- calendar-level checks ---
const dates = posts.map((p) => String(p.data.date)).sort();
const dupes = dates.filter((d, i) => dates[i + 1] === d);
if (dupes.length) errors.push(`duplicate publish dates: ${[...new Set(dupes)].join(", ")}`);

const slugs = posts.map((p) => p.slug);
if (new Set(slugs).size !== slugs.length) errors.push("duplicate slugs");

const titles = posts.map((p) => String(p.data.title).toLowerCase());
if (new Set(titles).size !== titles.length) errors.push("duplicate titles");

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86_400_000);
}

// --- report ---
const published = posts.filter((p) => String(p.data.date) <= TODAY);
console.log(
  `${posts.length} posts — ${published.length} published, ${posts.length - published.length} scheduled\n`,
);
for (const w of warnings) console.log(`  warn  ${w}`);
for (const e of errors) console.log(`  ERROR ${e}`);

if (errors.length) {
  console.log(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(`\nAll checks passed${warnings.length ? ` (${warnings.length} warning(s))` : ""}.`);
