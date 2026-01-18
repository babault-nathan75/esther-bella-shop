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

export const metadata = {
  title: "Esther Bella Fashion Boutique",
  description: "Luxe et élégance à Abidjan",
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