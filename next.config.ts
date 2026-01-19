import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações de Performance
  experimental: {
    // Otimiza CSS - remove CSS não utilizado
    optimizeCss: true,
  },
  
  // Compressão de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 ano de cache
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Headers de cache e segurança
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|mp4|webm)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  async redirects() {
    return [
      // Redirect das URLs antigas de SEO (com hífen) para as novas (com barra)
      {
        source: '/sistema-lava-rapido-:cidade',
        destination: '/sistema-lava-rapido/:cidade',
        permanent: true, // 301 redirect para SEO
      },
    ];
  },
};

export default nextConfig;
