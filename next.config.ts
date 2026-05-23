import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ["next-intl"],

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 1080, 1920, 2560],
    remotePatterns: [
      { protocol:"https", hostname:"lh3.googleusercontent.com" },
      { protocol:"https", hostname:"drive.google.com" },
      { protocol:"https", hostname:"*.googleusercontent.com" },
      { protocol:"https", hostname:"sqdvkfcghdjxtyuybxpy.supabase.co" },
    ],
  },
};

export default nextConfig;
