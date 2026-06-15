import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next.js walks up and
  // finds a stray lockfile in the home directory, inferring the wrong root.
  turbopack: {
    root: fileURLToPath(new URL(".", import.meta.url)),
  },

  // Emit each route with a trailing slash (kept from the original config).
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
