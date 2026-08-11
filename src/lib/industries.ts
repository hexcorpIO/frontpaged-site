import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Bespoke prose for each industry hub. Deliberately Markdown files rather than
// generated sections: eight pages built from one template with substituted nouns
// are doorway pages, and this is a site that sells SEO quality.
//
// Same pipeline as src/lib/blog.ts — gray-matter for frontmatter, marked for HTML.

const INDUSTRY_DIR = path.join(process.cwd(), "content", "industries");

export type IndustryBody = {
  slug: string;
  /** Rendered HTML of the Markdown body. */
  html: string;
  words: number;
  /** `##` headings in document order. Two hubs must not share a section sequence. */
  sections: string[];
};

export function getIndustryBody(slug: string): IndustryBody | null {
  const file = path.join(INDUSTRY_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { content } = matter(fs.readFileSync(file, "utf8"));
  const sections = [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());

  return {
    slug,
    html: marked.parse(content, { async: false }) as string,
    words: content.split(/\s+/).filter(Boolean).length,
    sections,
  };
}

export function getIndustrySlugs(): string[] {
  if (!fs.existsSync(INDUSTRY_DIR)) return [];
  return fs
    .readdirSync(INDUSTRY_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
