import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getPublishedVerticals } from "@/lib/verticals";
import { getIndustryBody } from "@/lib/industries";
import { getPublishedAddOnServices } from "@/lib/services";
import { founder } from "@/lib/site";

// Required for output: export — emit as a static file at build time.
export const dynamic = "force-static";

// Trailing slashes match the site's canonical URLs (trailingSlash: true) so
// crawlers don't hit a redirect for every entry.
// Bump this whenever the static pages' content changes — `lastmod` should track
// real edits, not build time, or crawlers learn to ignore it.
const STATIC_DATE = "2026-08-09";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${site.url}/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 1 },
  { url: `${site.url}/industries/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.9 },
  { url: `${site.url}/pricing/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.9 },
  { url: `${site.url}/contact/`, lastModified: STATIC_DATE, changeFrequency: "yearly", priority: 0.9 },
  { url: `${site.url}/about/`, lastModified: STATIC_DATE, changeFrequency: "yearly", priority: 0.8 },
  { url: `${site.url}/faq/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
  { url: `${site.url}/glossary/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
  { url: `${site.url}/services/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.9 },
  // Core service pages. /services/med-spa-seo/ deliberately omitted — superseded by
  // /industries/med-spas/, with the old URL 301'd there in public/.htaccess.
  { url: `${site.url}/services/generative-engine-optimization/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
  { url: `${site.url}/services/google-business-profile/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPost = posts[0]?.date ?? STATIC_DATE;
  // Only industries with a written hub page are linkable in the static export —
  // same filter src/app/industries/page.tsx and llms.txt use. A published
  // vertical without a body (Task 10) has no page to prerender, so it must not
  // appear here either.
  const industries = getPublishedVerticals().filter((v) => getIndustryBody(v.slug) !== null);

  return [
    ...staticRoutes,
    ...industries.map((v) => ({
      url: `${site.url}/industries/${v.slug}/`,
      lastModified: STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getPublishedAddOnServices().map((s) => ({
      url: `${site.url}/services/${s.slug}/`,
      lastModified: STATIC_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Per-industry blog archives — real crawlable routes, only for verticals
    // that actually have posts (same filter as the pages themselves).
    ...getPublishedVerticals()
      .filter((v) => posts.some((p) => p.vertical === v.slug))
      .map((v) => ({
        url: `${site.url}/blog/industry/${v.slug}/`,
        lastModified: latestPost,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...(founder.name
      ? [
          {
            url: `${site.url}/author/benton-purvis/`,
            lastModified: latestPost,
            changeFrequency: "weekly" as const,
            priority: 0.6,
          },
        ]
      : []),
    {
      url: `${site.url}/blog/`,
      lastModified: latestPost,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}/`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
