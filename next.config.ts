import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // ✅ Allow external avatar images
  },
};

export default nextConfig;
