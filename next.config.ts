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
    serverComponentsExternalPackages: ['@prisma/client', 'puppeteer', 'handlebars'],
  },
  
  // Configurações de webpack
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize packages for server-side rendering
      config.externals.push('@prisma/client');
      
      // Handle Handlebars require.extensions warning
      config.resolve.alias = {
        ...config.resolve.alias,
        handlebars: 'handlebars/dist/handlebars.min.js',
      };
    }
    
    // Ignore require.extensions warnings
    config.ignoreWarnings = [
      { message: /require\.extensions/ },
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
