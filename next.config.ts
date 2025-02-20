import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['media2.dev.to'], // Allow dev.to domain for image loading
  },
};

export default nextConfig;

