import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "avatars.githubusercontent.com",
      port: "",
      pathname: "/u/**",
    },
    {
      protocol: "https",
      hostname: "cdn.discordapp.com",
      port: "",
      pathname: "/avatars/**",
    }]
  },
  output: "standalone",
};

export default nextConfig;
