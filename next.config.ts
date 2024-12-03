// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  output: "export",
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
