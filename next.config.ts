import { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

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
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizeCss: true,
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

if (process.env.NODE_ENV === "development") {
  (async () => {
    await setupDevPlatform();
  })();
}

export default nextConfig;
