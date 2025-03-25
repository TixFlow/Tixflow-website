import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["i.ytimg.com", "encrypted-tbn0.gstatic.com"],
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
