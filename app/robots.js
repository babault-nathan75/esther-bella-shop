// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/', // On cache l'administration des recherches Google
    },
    sitemap: 'https://esther-bella-shop.vercel.app/sitemap.xml',
  }
}