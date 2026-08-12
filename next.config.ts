import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel provides its own production runtime. Keep the standard Next.js
  // output so deployment remains compatible with Next.js 16.
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Security headers and API rate limiting are handled by src/proxy.ts.
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
    ];
  },
};

export default nextConfig;
