import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'xmfcfqpkkvtekljidvfh.supabase.co', // Your Supabase instance
      },
      {
        protocol: 'https',
        hostname: 'xmfcfqpkkvtekljidvfh.supabase.in', // Alternative Supabase domain
      },
    ],
    // Handle local image unoptimization for logo handling
    unoptimized: true,
  },
  // Add base path and asset prefix for proper static asset loading
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL : '',
  // Adjust caching for static assets
  experimental: {
    // Now we have the critters package installed
    optimizeCss: true,
    optimizeServerReact: true,
  },
};

export default nextConfig;
