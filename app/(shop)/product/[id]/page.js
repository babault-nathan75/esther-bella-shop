export const dynamic = "force-dynamic";
export const revalidate = 0;

import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import ProductClient from "@/components/ProductClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// --- 1. GÉNÉRATION DYNAMIQUE DES MÉTADONNÉES SEO ---
export async function generateMetadata({ params }) {
  await connectToDB();
  const { id } = await params;
  
  try {
    const product = await Product.findById(id);
    if (!product) return { title: "Pièce introuvable" };

    return {
      title: product.title,
      description: `${product.title} par Esther Bella Fashion. ${product.description?.substring(0, 150)}...`,
      openGraph: {
        title: `${product.title} | Maison Esther Bella`,
        description: product.description?.substring(0, 160),
        images: [{ url: product.images?.[0] }],
      },
    };
  } catch (e) {
    return { title: "Boutique Prestige" };
  }
}

export default async function ProductPage({ params }) {
  // 1. Connexion à la base de données
  await connectToDB();
  
  // 2. Récupération sécurisée de l'ID
  const { id } = await params; 
  
  let productDoc;
  try {
    // 3. Recherche du produit
    productDoc = await Product.findById(id);
  } catch (error) {
    return notFound();
  }

  // --- 4. DESIGN MAGNIFIQUE POUR L'ÉTAT "INTROUVABLE" ---
  if (!productDoc) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center bg-white">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <h1 className="text-[20vw] font-black uppercase tracking-tighter">Esther</h1>
        </div>

        <div className="relative z-10">
          <div className="w-20 h-[1px] bg-yellow-600 mx-auto mb-12 opacity-50"></div>
          
          <h2 className="text-4xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none mb-6">
            Pièce <br/> 
            <span className="font-serif italic text-yellow-600 lowercase tracking-normal font-light">
              indisponible
            </span>
          </h2>
          
          <p className="max-w-sm mx-auto text-[10px] md:text-xs text-gray-400 uppercase tracking-[0.4em] leading-loose mb-12">
            Cette création exclusive a été retirée de nos salons privés ou est victime de son succès.
          </p>
          
          <Link 
            href="/shop" 
            className="group inline-flex items-center gap-4 bg-black text-yellow-600 px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-yellow-600 hover:text-black transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            Retour à la Collection
          </Link>
        </div>
      </div>
    );
  }

  // 5. Conversion Prestige des données
  const product = JSON.parse(JSON.stringify(productDoc));

  // 6. Rendu du composant Client
  return (
    <div className="bg-white animate-in fade-in duration-1000">
      <ProductClient product={product} />
    </div>
  );
}