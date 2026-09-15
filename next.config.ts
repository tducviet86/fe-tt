import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.tgdd.vn",
        pathname: "/hoi-dap/906425/**",
      },
    ],
  },
};

export default nextConfig;
