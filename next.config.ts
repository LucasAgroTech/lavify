import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
