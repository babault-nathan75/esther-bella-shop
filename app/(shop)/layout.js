import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Instagram, Facebook, Home, Sparkles, Layers } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { CartContextProvider } from "@/context/CartContext";
import HeaderCount from "@/components/HeaderCount";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic"],
  variable: "--font-playfair"
});

// Lucide n'expose pas TikTok / Snapchat — SVG inline (Simple Icons, licence CC0)
const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.12z"/>
  </svg>
);

const SnapchatIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.654.305-4.857C7.394 1.077 10.739.807 11.732.807l.41-.014h.063z"/>
  </svg>
);

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/kimouchiayeesthermorille?igsh=MTY3b3hhamFjYjUxMQ%3D%3D&utm_source=qr", Icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/share/18NsnXTCpy/", Icon: Facebook },
  { label: "TikTok", href: "https://www.snapchat.com/add/chiayeestherm24?share_id=KRt9xM1Gk5w&locale=fr-FR", Icon: TikTokIcon },
  { label: "Snapchat", href: "https://www.snapchat.com/add/chiayeestherm24?share_id=KRt9xM1Gk5w&locale=fr-FR", Icon: SnapchatIcon },
];

export default function ShopLayout({ children }) {
  return (
    <div className={`${playfair.variable} bg-white text-ebf-black`}>
      <CartContextProvider>

        {/* --- HEADER LUXE GOLD & BLACK --- */}
        <header className="bg-black border-b border-yellow-600 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">

            {/* Left: Nav - Icônes sur Mobile / Texte sur Desktop */}
            <nav className="flex items-center gap-6 md:gap-10 text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold text-yellow-600">
              <Link href="/shop" className="group relative flex items-center gap-2 hover:text-white transition-colors duration-300 py-2">
                <Layers size={20} className="md:hidden" />
                <span className="hidden md:inline">Collections</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-600 transition-all duration-300 group-hover:w-full hidden md:block"></span>
              </Link>

              <Link href="/nouveautes" className="group relative flex items-center gap-2 hover:text-white transition-colors duration-300 py-2">
                <Sparkles size={20} className="md:hidden" />
                <span className="hidden md:inline">Nouveautés</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-yellow-600 transition-all duration-300 group-hover:w-full hidden md:block"></span>
              </Link>
            </nav>

            {/* Center: Logo & Titre Royal */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 mb-1 transform group-hover:scale-110 transition-transform duration-500 border border-yellow-600/30 rounded-full p-1">
                <Image src="/logo.jpg" alt="EBF Logo" fill className="object-contain rounded-full" />
              </div>
              <h1 className={`${playfair.className} text-yellow-600 text-sm md:text-2xl font-bold tracking-[0.1em] uppercase leading-none text-center italic`}>
                Esther Bella Fashion
              </h1>
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-5 md:gap-6 text-yellow-600">
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

        {/* --- FOOTER --- */}
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
                  <li><Link href="/contact" className="hover:text-white transition">Contactez-nous</Link></li>
                  <li><Link href="/livraison-retours" className="hover:text-white transition">Livraison & Retours</Link></li>
                  <li><Link href="/guide-tailles" className="hover:text-white transition">Guide des Tailles</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-yellow-600 font-bold text-xs uppercase tracking-[0.3em] mb-8 border-b border-yellow-600/20 pb-2 inline-block">La Maison</h3>
              <ul className="space-y-4 text-[10px] uppercase tracking-widest font-medium text-yellow-600/80">
                  <li><Link href="/notre-histoire" className="hover:text-white transition">Notre Histoire</Link></li>
                  <li><Link href="/ethique-qualite" className="hover:text-white transition">Éthique & Qualité</Link></li>
                  <li><Link href="/points-vente" className="hover:text-white transition">Points de Vente</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-yellow-600 font-bold text-xs uppercase tracking-[0.3em] mb-8 border-b border-yellow-600/20 pb-2 inline-block">Newsletter</h3>
              <div className="border-b border-yellow-600/50 pb-2 flex justify-between items-center">
                <input type="text" placeholder="VOTRE EMAIL" className="bg-transparent text-[10px] outline-none placeholder:text-yellow-600/40 text-yellow-600 w-full tracking-[0.2em]" />
                <button className="text-yellow-600 text-[10px] font-black hover:text-white transition-colors">Envoyer</button>
              </div>
              <div className="flex gap-4 mt-8 justify-center md:justify-start text-yellow-600">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="hover:text-white transition-colors inline-flex"
                  >
                    <Icon width={18} height={18} />
                  </a>
                ))}
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
    </div>
  );
}
