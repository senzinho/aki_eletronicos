import type { NextConfig } from "next";
import path from "node:path";

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
const publicApiHost = publicApiUrl ? new URL(publicApiUrl) : null;

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3012",
        pathname: "/uploads/**",
      },
      ...(publicApiHost
        ? [
            {
              protocol: publicApiHost.protocol.replace(":", "") as "http" | "https",
              hostname: publicApiHost.hostname,
              port: publicApiHost.port || undefined,
              pathname: "/**",
            },
          ]
        : []),
    ],
    // The API runs on localhost in dev; Next 16's SSRF guard blocks optimizing
    // images from private/local IPs unless explicitly allowed. Safe here since
    // it's our own trusted API — production points at the real public host above.
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
