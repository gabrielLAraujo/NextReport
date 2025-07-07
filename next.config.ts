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
    serverComponentsExternalPackages: ['@prisma/client', 'handlebars', 'puppeteer-core'],
  },
  
  // Configurações de webpack
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize packages for server-side rendering
      config.externals.push('@prisma/client');
      
      // Externalizar handlebars para evitar warnings do webpack
      config.externals.push({
        handlebars: 'commonjs handlebars',
      });
      
      // Externalizar puppeteer-core para ambientes serverless
      config.externals.push({
        'puppeteer-core': 'commonjs puppeteer-core',
      });
    }
    
    // Ignorar warnings específicos do handlebars e outros
    config.ignoreWarnings = [
      { message: /require\.extensions/ },
      { module: /node_modules\/handlebars\/lib\/index\.js/ },
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
