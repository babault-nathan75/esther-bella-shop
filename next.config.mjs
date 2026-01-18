/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Autorise tous les domaines (pratique pour le dév)
      },
    ],
  },
};

export default nextConfig;