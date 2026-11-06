/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
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