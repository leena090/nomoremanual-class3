import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 빌드 시 ESLint 검사 건너뛰기 (Next.js 15 호환)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
