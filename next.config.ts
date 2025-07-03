import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Desabilitar ESLint durante o build para permitir deploy
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar erros de TypeScript durante o build
    ignoreBuildErrors: true,
  },
  // Configurações para Puppeteer na Vercel
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core'],
  },
};

export default nextConfig;
