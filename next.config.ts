import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next.js walks up and
  // finds a stray lockfile in the home directory, inferring the wrong root.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },

  // Static HTML/CSS/JS export — deploys to any web host (Hostinger public_html).
  // Produces an `out/` folder after `next build`. No Node.js server required.
  output: "export",

  // Emit each route as a folder with `index.html` (e.g. /about/ -> /about/index.html).
  // This routes cleanly on Apache/LiteSpeed without custom rewrite rules.
  trailingSlash: true,

  images: {
    // The default Image Optimization API needs a server, which a static export
    // does not have. Serve images as-is. (Swap to a custom `loader` later if you
    // want optimization via a CDN like Cloudinary.)
    unoptimized: true,
  },
};

export default nextConfig;
