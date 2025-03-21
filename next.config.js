/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
    // Required for some newer Next.js features
    // serverExternalPackages: ['ioredis'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: '',
      },
    ],
  },
  transpilePackages: ['geist'],
};

module.exports = nextConfig;
