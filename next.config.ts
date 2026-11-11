import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // AVIF first, WebP fallback. Qualities are an allowlist since Next 16.
    formats: ["image/avif", "image/webp"],
    qualities: [60, 72, 80],
    // 1536 is the widest ChatGPT output; larger steps only matter once bigger sources land
    deviceSizes: [480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [96, 160, 256, 384],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
