import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/site";

// Rendered to a static /rss.xml at build time.
export const dynamic = "force-static";

// Escapes the five XML predefined entities. Post titles and descriptions are
// authored content containing apostrophes and ampersands, which would otherwise
// produce a malformed feed.
function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts(); // already excludes scheduled posts
  const updated = posts[0]?.date;

  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}/`;
      return `    <item>
      <title>${xml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${xml(post.description)}</description>
      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
      ${post.tags.map((t) => `<category>${xml(t)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(site.name)} — SEO &amp; AI-search visibility for medical spas</title>
    <link>${site.url}/blog/</link>
    <description>${xml("Practical guides on med spa SEO, Generative Engine Optimization (GEO), and getting your clinic recommended by Google and AI search.")}</description>
    <language>en-US</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${updated ? `    <lastBuildDate>${new Date(`${updated}T12:00:00Z`).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
