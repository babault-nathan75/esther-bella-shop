/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com', // ✅ Autorise tous les buckets AWS S3
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // (Optionnel) Pour les photos de profil Google
      },
    ],
  },
};

export default nextConfig;