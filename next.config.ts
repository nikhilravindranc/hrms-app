import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.pravatar.cc" }],
  },
  compiler: {
    emotion: {
      sourceMap: process.env.NODE_ENV === "development",
      autoLabel: "dev-only",
      labelFormat: "[local]",
    },
  },
}

export default nextConfig
