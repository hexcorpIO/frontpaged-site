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
  description: string;
  date: string; // ISO yyyy-mm-dd
  author: string;
  tags: string[];
  readingTime: number; // minutes
  quickAnswer: string;
  faqs: Faq[];
};

export type Post = PostMeta & {
  /** Rendered HTML of the Markdown body. */
  html: string;
};

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
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? "The Frontpaged Team"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    quickAnswer: String(data.quickAnswer ?? ""),
    faqs: Array.isArray(data.faqs)
      ? data.faqs.map((f: { q: string; a: string }) => ({ q: String(f.q), a: String(f.a) }))
      : [],
    readingTime: estimateReadingTime(content),
    html: withTrailingSlashes(marked.parse(content, { async: false }) as string),
  };
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

export function getPostBySlug(slug: string): Post | null {
  if (!readSlugs().includes(slug)) return null;
  const post = parsePost(slug);
  return isPublished(post.date) ? post : null;
}
