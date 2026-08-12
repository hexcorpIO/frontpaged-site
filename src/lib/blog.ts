import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Blog content lives as Markdown files with frontmatter in content/blog/.
// Parsed at build time — works with the static export (no runtime server).

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type Faq = { q: string; a: string };

export type PostMeta = {
  slug: string;
  title: string;
  /**
   * Optional `<title>`-tag override. The H1 always renders `title` — this only
   * changes what search engines and social shares show, for posts whose
   * headline reads well as an H1 but runs past the ~60-char SERP title limit.
   * Falls back to `title` when absent, so existing posts are unaffected.
   */
  metaTitle?: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  tags: string[];
  /**
   * Slug of the industry vertical this post was written for. Required in
   * frontmatter (scripts/check-content.mjs enforces it) and now read rather
   * than merely validated: it is what lets an industry hub link to its own
   * cluster without pulling a med-spa post onto a probate firm's page.
   */
  vertical: string;
  /**
   * Optional yyyy-mm-dd review date. Distinct from `date`, which is when the post
   * first published and must never change. Search engines read `dateModified`,
   * and on a site writing about a field that shifts monthly a visible review date
   * is a trust signal as much as a freshness one. Absent on most posts.
   */
  updated?: string;
  readingTime: number; // minutes
  quickAnswer: string;
  faqs: Faq[];
};

/** One `##` heading, for the in-post table of contents. */
export type Heading = { id: string; text: string };

export type Post = PostMeta & {
  /** Rendered HTML of the Markdown body, with `id` attributes on every h2. */
  html: string;
  /** The h2s in document order, matching the ids injected into `html`. */
  headings: Heading[];
};

/**
 * Stable, readable anchor for a heading.
 *
 * Deliberately not a hash: these ids are public URLs the moment someone shares a
 * jump link, and they are what Google surfaces as "jump to" links in a result. A
 * slug survives a rebuild; a content hash would change every time the heading is
 * edited and silently break every link anyone had saved.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function readSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Scheduled publishing. A post dated in the future is excluded from the build
// entirely — not hidden with CSS, not emitted as HTML — and a daily CI rebuild
// picks it up on its publish date. Compared in the business's timezone because
// the cron runs in UTC: without an explicit zone, a post dated Sep 3 would go
// live during the evening of Sep 2 in Central time.
const PUBLISH_TZ = "America/Chicago";

// `en-CA` formats as yyyy-mm-dd, which string-compares correctly against the
// ISO dates in post frontmatter.
function todayInPublishTz(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PUBLISH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isPublished(date: string): boolean {
  // Escape hatch for reviewing scheduled drafts locally. Never set in CI, so it
  // cannot leak a future-dated post into production.
  if (process.env.SHOW_SCHEDULED_POSTS === "1") return true;
  return date <= todayInPublishTz();
}

// The site is built with `trailingSlash: true`, so an in-content link written as
// `/blog/some-post` costs the reader (and crawlers) a 301 hop. Normalize every
// root-relative link to the canonical trailing-slash form, leaving anchors,
// query strings, and file paths (e.g. /icon.svg) alone.
function withTrailingSlashes(html: string): string {
  return html.replace(
    /href="(\/[^"#?]*?)"/g,
    (match, pathname: string) =>
      pathname.endsWith("/") || path.extname(pathname) ? match : `href="${pathname}/"`,
  );
}

function parsePost(slug: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? ""),
    metaTitle: data.metaTitle ? String(data.metaTitle) : undefined,
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? "The Frontpaged Team"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    vertical: String(data.vertical ?? ""),
    quickAnswer: String(data.quickAnswer ?? ""),
    faqs: Array.isArray(data.faqs)
      ? data.faqs.map((f: { q: string; a: string }) => ({ q: String(f.q), a: String(f.a) }))
      : [],
    updated: data.updated ? String(data.updated) : undefined,
    readingTime: estimateReadingTime(content),
    ...renderBody(content),
  };
}

/**
 * Render the Markdown body and collect its h2s, injecting a matching `id` on each.
 *
 * Both halves come from one pass so the table of contents cannot reference an
 * anchor the body does not contain — the failure mode where a TOC link scrolls
 * nowhere, which is worse than having no TOC.
 *
 * Duplicate headings get a numeric suffix rather than colliding, because two
 * anchors sharing an id means one of them is unreachable.
 */
function renderBody(content: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();

  const html = withTrailingSlashes(marked.parse(content, { async: false }) as string).replace(
    /<h2(?![^>]*\bid=)([^>]*)>([\s\S]*?)<\/h2>/g,
    (_match, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const base = slugifyHeading(text);
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      const id = n === 1 ? base : `${base}-${n}`;
      headings.push({ id, text });
      return `<h2 id="${id}"${attrs}>${inner}</h2>`;
    }
  );

  return { html, headings };
}

/**
 * Other published posts worth reading after this one.
 *
 * Same vertical first — a reader finishing a probate article wants more probate,
 * not Botox — then shared tags, then recency. Falls back to filling the remainder
 * from other verticals only if the post's own cluster is too small, since a
 * related-posts block with one entry looks broken and a dead end is what this
 * exists to fix.
 */
export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const all = getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  const tags = new Set(current.tags.map((t) => t.toLowerCase()));
  const others = all.filter((p) => p.slug !== slug);

  const score = (p: PostMeta) =>
    (p.vertical === current.vertical ? 100 : 0) +
    p.tags.filter((t) => tags.has(t.toLowerCase())).length;

  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}

/** All published posts, newest first. Anything dated in the future is excluded. */
export function getAllPosts(): Post[] {
  return readSlugs()
    .map(parsePost)
    .filter((post) => isPublished(post.date))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Slugs to prerender. Derived from `getAllPosts` rather than the raw directory
 * listing so the two can never drift: if an unpublished slug reached
 * `generateStaticParams`, Next would emit a live, crawlable, indexable page for
 * a post that hasn't been published yet — the exact thing scheduling prevents.
 */
export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

/**
 * Published posts to surface on an industry hub, most relevant first.
 *
 * Scoped to `post.vertical === slug` deliberately. Selecting on tag overlap
 * alone would put "How to Rank Your Med Spa for 'Botox Near Me'" on the estate
 * law hub — every vertical's `postTags` contains "SEO" and "GEO" — which is a
 * worse internal-link signal than no link at all. `postTags` ranks within the
 * vertical's own cluster instead, so the posts closest to what the hub sells
 * lead. A vertical with no posts yet renders no section; the hub still links to
 * /blog/ from its prose and footer.
 */
export function getPostsForVertical(slug: string, postTags: string[], limit = 6): PostMeta[] {
  const wanted = new Set(postTags.map((t) => t.toLowerCase()));
  return getAllPosts()
    .filter((post) => post.vertical === slug)
    .map((post) => ({
      post,
      score: post.tags.filter((t) => wanted.has(t.toLowerCase())).length,
    }))
    // Score first, then date — getAllPosts is already newest-first, so a stable
    // sort keeps recency as the tiebreak within an equal-relevance group.
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getPostBySlug(slug: string): Post | null {
  if (!readSlugs().includes(slug)) return null;
  const post = parsePost(slug);
  return isPublished(post.date) ? post : null;
}
