import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.habbo.com",
      },
      {
        protocol: "https",
        hostname: "**.habbo.com.br",
      },
      {
        protocol: "https",
        hostname: "**.habbo.de",
      },
      {
        protocol: "https",
        hostname: "**.habbo.fr",
      },
      {
        protocol: "https",
        hostname: "**.habbo.fi",
      },
      {
        protocol: "https",
        hostname: "**.habbo.it",
      },
      {
        protocol: "https",
        hostname: "**.habbo.nl",
      },
      {
        protocol: "https",
        hostname: "**.habbo.es",
      },
      {
        protocol: "https",
        hostname: "**.habbo.com.tr",
      },
      {
        protocol: "https",
        hostname: "images.habbo.com",
      },
    ],
  },
};

export default nextConfig;
