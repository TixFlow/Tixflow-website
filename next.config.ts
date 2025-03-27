import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn-images.vtv.vn", "giadinh.mediacdn.vn"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
        port: "",
        pathname: "/account123/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
