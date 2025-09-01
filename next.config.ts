import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.IMAGE_HOST || "merch-base.prowerb.digital"],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/landing",
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
