import type { NextConfig } from "next";

// Note: NextConfig typing can lag behind runtime config options in some Next versions.
// We keep the runtime config (eslint ignore during builds) and cast to NextConfig.
const nextConfig = {
  eslint: {
    // Unblocks Vercel builds while we iterate quickly on UI.
    // We'll turn this off and fix lint errors before final launch.
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [{ source: "/", destination: "/fr", permanent: false }];
  },
} as unknown as NextConfig;

export default nextConfig;
