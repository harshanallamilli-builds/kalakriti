import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        // Google profile avatars from OAuth
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy URL redirects
      { source: "/products", destination: "/marketplace", permanent: true },
      { source: "/products/:id", destination: "/marketplace/:id", permanent: true },
      { source: "/store/:id", destination: "/creators/:id", permanent: true },
      // Auth error convenience
      { source: "/auth/login", has: [{ type: "query", key: "error", value: "oauth_failed" }], destination: "/auth/error", permanent: false },
    ];
  },
};

export default nextConfig;