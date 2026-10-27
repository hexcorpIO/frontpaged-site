import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Standalone editorial pages (today: the privacy policy) authored as markdown in
// content/pages/, same pipeline as content/blog/ and content/industries/. One
// source feeds both renderers: this module for the Next.js build, and
// wp/migration/export.mjs for the WordPress import, so the policy a visitor
// reads on the live site is the policy in git.

const PAGES = path.join(process.cwd(), "content/pages");

export type EditorialPage = {
  slug: string;
  title: string;
  description: string;
  /** ISO date the page was last materially changed. */
  updated: string;
  html: string;
};

export function getPageSlugs(): string[] {
  if (!fs.existsSync(PAGES)) return [];
  return fs
    .readdirSync(PAGES)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

export function getEditorialPage(slug: string): EditorialPage | null {
  const file = path.join(PAGES, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    updated: String(data.updated ?? ""),
    html: marked.parse(content, { async: false }) as string,
  };
}
