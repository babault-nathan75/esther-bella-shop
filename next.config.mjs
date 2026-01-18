/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 1. Pour vos produits (Stockés sur AWS S3)
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
      // 2. Pour les images de design (Unsplash) - C'est ce qui bloquait !
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 3. (Optionnel) Pour les avatars Google Auth
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;