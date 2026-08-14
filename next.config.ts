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
  // Public HTML can be prerendered by Next/Vercel. API responses remain
  // uncached because they may contain personalized learning state.
  async headers() {
    return [
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
