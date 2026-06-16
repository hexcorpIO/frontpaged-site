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
    html: marked.parse(content, { async: false }) as string,
  };
}

/** All posts, newest first. */
export function getAllPosts(): Post[] {
  return readSlugs()
    .map(parsePost)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSlugs(): string[] {
  return readSlugs();
}

export function getPostBySlug(slug: string): Post | null {
  if (!readSlugs().includes(slug)) return null;
  return parsePost(slug);
}
