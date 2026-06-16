import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

// Required for output: export — emit as a static file at build time.
export const dynamic = "force-static";

// Trailing slashes match the site's canonical URLs (trailingSlash: true) so
// crawlers don't hit a redirect for every entry.
const STATIC_DATE = "2026-06-16";

const staticRoutes: MetadataRoute.Sitemap = [
  { url: `${site.url}/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 1 },
  { url: `${site.url}/pricing/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.9 },
  // Service (hub-and-spoke) pages
  { url: `${site.url}/services/med-spa-seo/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
  { url: `${site.url}/services/generative-engine-optimization/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
  { url: `${site.url}/services/google-business-profile/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
  // Location pages
  { url: `${site.url}/med-spa-seo-dallas/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.9 },
  { url: `${site.url}/med-spa-seo-plano/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
  { url: `${site.url}/med-spa-seo-fort-worth/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
  { url: `${site.url}/med-spa-seo-frisco/`, lastModified: STATIC_DATE, changeFrequency: "monthly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPost = posts[0]?.date ?? STATIC_DATE;

  return [
    ...staticRoutes,
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
