import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbo: {
    resolveAlias: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Allow images from utfs.io
      },
      {
        protocol: "https",
        hostname: "**res.cloudinary.com", // Allow Cloudinary images
      },
    ],
  },
};

export default nextConfig;
