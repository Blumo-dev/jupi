import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_GIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  },
};

export default nextConfig;
