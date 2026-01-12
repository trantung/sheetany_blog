import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    domains: [], // ✅ Thêm domain ở đây
  },
};

export default nextConfig;
