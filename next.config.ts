import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para Vercel
  output: 'standalone',
  
  // Configurações de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configurações experimentais
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Configurações de webpack
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'handlebars': 'commonjs handlebars',
        'puppeteer': 'commonjs puppeteer'
      });
      config.externals.push('@prisma/client');
    }
    
    // Ignorar warnings do handlebars
    config.ignoreWarnings = [
      /require\.extensions is not supported by webpack/,
    ];
    
    return config;
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-API-Key',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
