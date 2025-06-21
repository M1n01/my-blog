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
    const { execSync } = require("child_process");

    try {
      const gitSha = execSync("git rev-parse HEAD").toString().trim();
      return `build-${gitSha}`;
    } catch (error) {
      console.error("Failed to get git SHA:", error);
      throw new Error("Failed to get git SHA");
    }
  },
};

if (process.env.NODE_ENV === "development") {
  (async () => {
    await setupDevPlatform();
  })();
}

export default nextConfig;
