export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import ShopClient from "@/components/ShopClient";
import ShopHeader from "@/components/ShopHeader";
import ScrollProgress from "@/components/ScrollProgress";
// ✅ CORRECTION : Ajout de 'Instagram' ici (Lucide est déjà installé)
import { MapPin, ShieldCheck, ArrowLeft, Instagram } from "lucide-react";
// ❌ SUPPRESSION de la ligne 'simple-icons-react' qui faisait planter le site
import Link from "next/link";

// Métadonnées pour le SEO - Fonctionne car c'est un Server Component
export const metadata = {
  title: "La Galerie | Esther Bella Fashion Luxe",
  description: "Découvrez nos collections exclusives. Pièces uniques conçues pour l'élégance absolue à Abidjan.",
};

async function getShopData() {
  await connectToDB();
  const categories = await Category.find();
  const rawProducts = await Product.find().sort({ createdAt: -1 });

  // --- LOGIQUE ANTI-RÉPÉTITION (GÈRE IMAGES ET VIDÉOS) ---
  const seenMedia = new Set();
  const uniqueProducts = rawProducts.filter(product => {
    const mainMedia = product.images?.[0]; 
    // Si pas de média ou si déjà vu (doublon), on l'écarte
    if (!mainMedia || seenMedia.has(mainMedia)) return false;
    seenMedia.add(mainMedia);
    return true;
  });

  return { 
    categories: JSON.parse(JSON.stringify(categories)), 
    products: JSON.parse(JSON.stringify(uniqueProducts)) 
  };
}

export default async function ShopPage() {
  const { categories, products } = await getShopData();

  return (
    <div className="bg-white min-h-screen font-montserrat selection:bg-yellow-600/30">
      
      {/* --- BOUTON RETOUR ACCUEIL (Flottant) --- */}
      <Link 
        href="/" 
        className="fixed top-8 left-8 z-[110] bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl border border-gray-100 text-black hover:scale-110 transition-all group"
        aria-label="Retour à l'accueil"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* 1. Indicateur de progression ultra-fin */}
      <ScrollProgress />
      
      {/* 2. Header avec effet Parallaxe */}
      <ShopHeader />

      {/* 3. Transition d'ombre douce entre le Header et le Shop */}
      <div className="relative z-30 -mt-10 bg-white rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <main className="pt-10">
          {/* ShopClient recevra la liste unique contenant des liens .jpg ou .mp4 */}
          <ShopClient initialProducts={products} categories={categories} />
        </main>
      </div>

      {/* 4. Footer Éditorial */}
      <footer className="bg-black text-white pt-32 pb-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 text-[15rem] font-black text-white/[0.02] leading-none select-none pointer-events-none translate-x-20 -translate-y-10 uppercase">
          EBF
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mb-32">
            
            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-600">La Maison</h3>
              <p className="text-gray-400 text-xs leading-loose uppercase tracking-widest">
                Esther Bella Fashion redéfinit l&apos;élégance féminine à travers des pièces qui allient tradition africaine et modernité haute couture. Chaque création est un hommage à la femme de pouvoir.
              </p>
            </div>

            <div className="space-y-8 border-l border-white/10 pl-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-600">Promesses</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 group cursor-default">
                  <ShieldCheck size={16} className="text-yellow-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">Authenticité Garantie</span>
                </li>
                <li className="flex items-center gap-4 group cursor-default">
                  <MapPin size={16} className="text-yellow-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">Showroom Abidjan, CI</span>
                </li>
                <li className="flex items-center gap-4 group cursor-default">
                  {/* Correction ici aussi : Utilisation de Instagram au lieu de SimpleInstagram */}
                  <Instagram size={16} className="text-yellow-600" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">@estherbellafashion</span>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-600">Le Cercle Privé</h3>
              <div className="flex flex-col gap-4">
                <input 
                  type="email" 
                  placeholder="VOTRE ADRESSE E-MAIL" 
                  className="bg-transparent border-b border-white/20 py-4 text-[10px] font-black tracking-widest focus:border-yellow-600 outline-none transition-all placeholder:text-gray-600 uppercase"
                />
                <button className="text-[9px] font-black uppercase tracking-[0.4em] text-yellow-600 text-left hover:text-white transition-colors">
                  Rejoindre la liste d&apos;attente &rarr;
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-gray-600">
              © 2026 Esther Bella Fashion Boutique. Tous droits réservés.
            </p>
            <div className="flex gap-10">
              <a href="#" className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-yellow-600 transition-colors">Livraison</a>
              <a href="#" className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-yellow-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}