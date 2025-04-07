import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'example.com',
      'raw.githubusercontent.com',
      'github.com',
      'avatars.githubusercontent.com',
      'cdn.example.com',
      'images.unsplash.com',
      'storage.googleapis.com',
      'lh3.googleusercontent.com',
      's3.amazonaws.com',
      'xmfcfqpkkvtekljidvfh.supabase.co', // Your Supabase instance
      'xmfcfqpkkvtekljidvfh.supabase.in', // Alternative Supabase domain
    ],
  },
};

export default nextConfig;
