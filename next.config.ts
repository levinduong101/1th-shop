import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.IMAGE_HOST || "merch-base.prowerb.digital"],
  },
};

export default nextConfig;
