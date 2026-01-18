import "../globals.css";
import { Montserrat, Playfair_Display } from "next/font/google";
import Sidebar from "./Sidebar";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "700", "900"],
  variable: "--font-montserrat" 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  weight: ["700"],
  style: ["italic"],
  variable: "--font-playfair"
});

export const metadata = {
  title: 'Admin - Esther Bella Fashion',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className={`${montserrat.className} antialiased bg-gray-100`}>
        <div className="flex min-h-screen">
          
          {/* Sidebar gère maintenant son propre bouton mobile */}
          <Sidebar playfairClass={playfair.className} />

          <div className="flex-1 flex flex-col min-w-0">
            {/* Header Mobile avec message personnalisé */}
            <div className="md:hidden bg-black text-white py-4 px-12 font-bold text-center tracking-wide border-b-2 border-yellow-600 shadow-xl flex items-center justify-center min-h-[70px]">
              <span className="text-sm md:text-base italic leading-tight">
                Bienvenue 👑<span className="text-yellow-500 font-serif">Queen Mooooo</span>👑, voici ton espace d&apos;administration
              </span>
            </div>
            
            <main className="p-4 md:p-10 flex-1">
              {/* Conteneur pour un rendu irréprochable */}
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}