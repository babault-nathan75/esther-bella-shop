/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com', // Vos uploads S3
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Les images par défaut
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com', // ✅ AJOUTÉ : Miniatures Google Images
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Avatars Google
      },
    ],
  },
};

export default nextConfig;