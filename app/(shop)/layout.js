import "../globals.css";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Instagram, Facebook, Home, Sparkles, Layers } from "lucide-react";
import { Montserrat, Playfair_Display } from "next/font/google";
import { CartContextProvider } from "@/context/CartContext";
import HeaderCount from "@/components/HeaderCount";

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

export default function ShopLayout({ children }) {
  return (
    <html lang="fr" className={`scroll-smooth ${montserrat.variable} ${playfair.variable}`}>
      <body 
        className={`${montserrat.className} bg-white text-ebf-black antialiased`}
        suppressHydrationWarning={true}
      >
        <CartContextProvider>
          
          {/* --- HEADER LUXE GOLD & BLACK --- */}
          <header className="bg-black border-b border-yellow-600 sticky top-0 z-50 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
              
              {/* Left: Nav - Mobile & Desktop avec Soulignement Animé */}
              <nav className="flex items-center gap-4 md:gap-10 text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-yellow-600">
                <Link href="/shop" className="group relative flex items-center gap-2 hover:text-white transition-colors duration-300 py-2">
                  <Layers size={14} className="md:hidden" /> 
                  <span>Collections</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link href="/nouveautes" className="group relative flex items-center gap-2 hover:text-white transition-colors duration-300 py-2">
                  <Sparkles size={14} className="md:hidden" />
                  <span>Nouveautés</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>

              {/* Center: Logo & Titre Royal */}
              <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
                <div className="relative w-10 h-10 md:w-12 md:h-12 mb-1 transform group-hover:scale-110 transition-transform duration-500 border border-yellow-600/30 rounded-full p-1">
                  <Image src="/logo.jpg" alt="EBF Logo" fill className="object-contain rounded-full" />
                </div>
                <h1 className={`${playfair.className} text-yellow-600 text-sm md:text-2xl font-bold tracking-[0.1em] uppercase leading-none text-center italic hidden sm:block`}>
                  Esther Bella Fashion
                </h1>
              </Link>

              {/* Right: Icons - Doré Premium */}
              <div className="flex items-center gap-4 md:gap-6 text-yellow-600">

                <Link href="/cart" className="relative group">
                  <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-300" />
                  <HeaderCount />
                </Link>
                
                <Link href="/" className="text-yellow-600 hover:text-white transition-colors" aria-label="Retour à l'accueil">
                  <Home size={22} />
                </Link>
              </div>
            </div>
          </header>

          <main>{children}</main>

          {/* --- FOOTER ÉDITORIAL GOLD & BLACK --- */}
          <footer className="bg-black text-white border-t border-yellow-600 pt-20 pb-10 font-light">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 text-center md:text-left">
              
              <div className="md:col-span-1">
                <h2 className={`${playfair.className} text-yellow-600 font-bold text-2xl tracking-[0.1rem] uppercase mb-6 italic`}>
                  Esther Bella Fashion
                </h2>
                <p className={`${playfair.className} text-yellow-600/80 text-sm leading-loose tracking-widest uppercase italic`}>
                  Votre élégance <br/> notre satisfaction.
                </p>
              </div>
              
              <div>
                <h3 className="text-yellow-600 font-bold text-xs uppercase tracking-[0.3em] mb-8 border-b border-yellow-600/20 pb-2 inline-block">Service Client</h3>
                <ul className="space-y-4 text-[10px] uppercase tracking-widest font-medium text-yellow-600/80">
                    <li><Link href="/footer#service-client" className="hover:text-white transition">Contactez-nous</Link></li>
                    <li><Link href="/footer#livraison-retours" className="hover:text-white transition">Livraison & Retours</Link></li>
                    <li><Link href="/footer#guide-tailles" className="hover:text-white transition">Guide des Tailles</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-600 font-bold text-xs uppercase tracking-[0.3em] mb-8 border-b border-yellow-600/20 pb-2 inline-block">La Maison</h3>
                <ul className="space-y-4 text-[10px] uppercase tracking-widest font-medium text-yellow-600/80">
                    <li><Link href="/footer#notre-histoire" className="hover:text-white transition">Notre Histoire</Link></li>
                    <li><Link href="/footer#ethique-qualite" className="hover:text-white transition">Éthique & Qualité</Link></li>
                    <li><Link href="/footer#points-vente" className="hover:text-white transition">Points de Vente</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-yellow-600 font-bold text-xs uppercase tracking-[0.3em] mb-8 border-b border-yellow-600/20 pb-2 inline-block">Newsletter</h3>
                <div className="border-b border-yellow-600/50 pb-2 flex justify-between items-center">
                  <input type="text" placeholder="VOTRE EMAIL" className="bg-transparent text-[10px] outline-none placeholder:text-yellow-600/40 text-yellow-600 w-full tracking-[0.2em]" />
                  <button className="text-yellow-600 text-[10px] font-black hover:text-white transition-colors">OK</button>
                </div>
                <div className="flex gap-4 mt-8 justify-center md:justify-start text-yellow-600">
                  <Instagram size={18} className="hover:text-white cursor-pointer transition-colors" />
                  <Facebook size={18} className="hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            </div>

           <div className="text-center text-[9px] tracking-[0.5em] text-yellow-600/40 uppercase">
            © 2026 
            <Link href="/admin/login" className="hover:text-yellow-600 transition-colors duration-700 mx-1">
              Esther Bella Fashion Boutique
            </Link> 
            • Abidjan
          </div>
          </footer>

        </CartContextProvider>
      </body>
    </html>
  );
}