import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel provides its own production runtime. Keeping the Vercel deployment
  // on the standard Next.js output avoids standalone tracing artifacts that
  // are not produced consistently by Next.js 16/Turbopack.
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Security headers are handled by middleware.ts
  // Only API caching headers remain here as middleware handles the rest
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
