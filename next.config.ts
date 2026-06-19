import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from trying to bundle Node.js-only packages
  serverExternalPackages: [
    "bullmq",
    "ioredis",
    "pdf-parse",
    "mammoth",
    "@prisma/client",
    "prisma",
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
