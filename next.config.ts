// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 他の設定がある場合はそれらも含める
  // async headers() {
  //   return [
  //     {
  //       source: "/blog",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "*",
  //         },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET, OPTIONS",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value: "Content-Type, Authorization",
  //         }
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
