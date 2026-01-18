// app/layout.js
import "./globals.css";
import { Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-montserrat"
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic"],
  variable: "--font-playfair"
});

// --- CONFIGURATION SEO AVANCÉE (MISE À JOUR VERCEL) ---
export const metadata = {
  metadataBase: new URL('https://esther-bella-shop.vercel.app'), 
  title: {
    default: "Esther Bella Fashion | Luxe & Haute Couture Abidjan",
    template: "%s | Esther Bella Fashion"
  },
  description: "Découvrez l'univers d'Esther Bella Fashion, la référence du luxe à Abidjan. Robes de soirée exclusives, prêt-à-porter haute couture et pièces de prestige pour Queens & Kings.",
  keywords: [
    "Esther Bella Fashion", 
    "Esther Bella Abidjan",
    "Mode de luxe Abidjan", 
    "Haute couture Côte d'Ivoire", 
    "Maison de couture Abidjan", 
    "Robes de soirée prestige", 
    "EBF Boutique Luxe"
  ],
  authors: [{ name: "Esther Bella Fashion" }],
  creator: "Esther Bella Fashion",
  publisher: "Esther Bella Fashion",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  // Social Media (OpenGraph) - Optimisé pour WhatsApp/Instagram/Facebook
  openGraph: {
    title: "Esther Bella Fashion | L'Art du Prestige à Abidjan",
    description: "L'élégance redéfinie à travers des créations uniques. Explorez nos collections exclusives.",
    url: 'https://esther-bella-shop.vercel.app',
    siteName: 'Esther Bella Fashion',
    images: [
      {
        url: '/logo.jpg', // Utilise votre logo comme image de partage par défaut
        width: 800,
        height: 800,
        alt: 'Maison Esther Bella Fashion Luxe',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Esther Bella Fashion Boutique',
    description: 'Le luxe absolu à Abidjan.',
    images: ['/logo.jpg'],
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
    <html lang="fr" className={`scroll-smooth ${montserrat.variable} ${playfair.variable}`}>
      <body className={`${montserrat.className} bg-white antialiased`}>
        {children}
      </body>
    </html>
  );
}