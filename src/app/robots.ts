import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for output: export — emit as a static file at build time.
export const dynamic = "force-static";

// Generated as a static robots.txt at build time (works with output: export).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
