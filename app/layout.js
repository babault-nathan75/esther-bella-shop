// app/layout.js
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Manrope, Playfair_Display, Allura } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-display"
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script-face"
});

export const viewport = {
  themeColor: "#000000",
};

// --- CONFIGURATION SEO AVANCÉE (MISE À JOUR VERCEL) ---
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Esther Bella Shop | Boutique de mode feminine",
    template: "%s | Esther Bella Shop"
  },
  description: "Esther Bella Shop : nouveaux arrivages en stock, tenues à confectionner.",
  keywords: [
    "Esther Bella Shop",
    "Esther Bella Abidjan",
    "Boutique de mode Abidjan",
    "Robes Abidjan",
    "Tenues sur mesure Abidjan",
    "Couture sur mesure Abidjan",
    "Nouveaux arrivages mode Abidjan",
    "Mode femme Côte d'Ivoire",
    "Friperie Abidjan",
    "Boutique vêtements femme Abidjan",
    "Acheter robe en ligne Abidjan",
    "Livraison vêtements Abidjan",
    "Tenue sur mesure Côte d'Ivoire",
    "Friperie",
  ],
  authors: [{ name: "Esther Bella Shop" }],
  creator: "Esther Bella Shop",
  publisher: "Esther Bella Shop",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  // Social Media (OpenGraph) - Optimisé pour WhatsApp/Instagram/Facebook
  openGraph: {
    title: "Esther Bella Shop | Mode féminine à Abidjan",
    description: "Nouveaux arrivages en stock et tenues à confectionner, livrés à Abidjan.",
    url: SITE_URL,
    siteName: 'Esther Bella Shop',
    images: [
      {
        url: '/brand/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Logo Esther Bella Shop',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Esther Bella Shop',
    description: 'Nouveaux arrivages et tenues à confectionner à Abidjan.',
    images: ['/brand/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`scroll-smooth ${manrope.variable} ${playfair.variable} ${allura.variable}`}>
      <body className="bg-white antialiased">
        {children}
        <SpeedInsights /> 
      </body>
    </html>
  );
}
