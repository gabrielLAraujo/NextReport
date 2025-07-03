import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', 'handlebars'],
  },
  webpack: (config: any, { isServer }: any) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('handlebars');
    }
    
    return config;
  },
};

export default nextConfig;
