import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
  // 純粋なSSG設定（Cloudflare Pages対応）
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

if (process.env.NODE_ENV === "development") {
  (async () => {
    await setupDevPlatform();
  })();
}

export default nextConfig;
