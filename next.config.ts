import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel provides its own production runtime. Keep the standard Next.js
  // output so deployment remains compatible with Next.js 16.
  reactStrictMode: false,
  poweredByHeader: false,
  // Do not hide TypeScript failures during production builds. A green deploy
  // must mean the application actually type-checks.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Keep the canonical Home HTML synchronized with the active deployment.
  // This prevents a stale cached document from referencing JS chunks from an
  // older deployment after a production release.
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
