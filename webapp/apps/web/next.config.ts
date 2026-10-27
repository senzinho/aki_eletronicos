import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3012",
        pathname: "/uploads/**",
      },
    ],
    // The API runs on localhost in dev; Next 16's SSRF guard blocks optimizing
    // images from private/local IPs unless explicitly allowed. Safe here since
    // it's our own trusted API — production will point at a real hostname.
    dangerouslyAllowLocalIP: true,
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
