import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  // TypeScript errors must fail production builds. Silencing them here can
  // ship broken server/client code that was never type-checked by Next.js.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Security headers are handled by src/proxy.ts.
  // Only API caching headers remain here as proxy handles the rest.
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
