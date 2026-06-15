import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Single-page marketing site — one canonical URL. Fixed lastModified keeps builds
// deterministic; bump it when the page content meaningfully changes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: "2026-06-15",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
