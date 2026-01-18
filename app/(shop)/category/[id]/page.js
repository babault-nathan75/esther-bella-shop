import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function CategoryPage({ params }) {
  await connectToDB();
  const { id } = await params;

  const category = await Category.findById(id);
  const productsDoc = await Product.find({ category: id }, null, { sort: { _id: -1 } });
  const products = JSON.parse(JSON.stringify(productsDoc));

  if (!category) return (
    <div className="min-h-screen flex items-center justify-center font-montserrat">
      <p className="uppercase tracking-[0.5em] text-gray-400">Collection introuvable</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-montserrat selection:bg-yellow-600/30">
      
      {/* --- HERO ÉDITORIAL --- */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        {category.image && (
          <Image 
            src={category.image} 
            alt={category.name}
            fill
            className="absolute inset-0 object-cover opacity-60 grayscale-[20%] scale-105 animate-slow-zoom"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 mt-20">
          <Link href="/shop" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-yellow-600 mb-8 hover:text-white transition-all group">
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
            Retour aux collections
          </Link>
          
          <h1 className="text-6xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-none italic font-serif animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {category.name}
          </h1>
          
          <div className="flex justify-center items-center gap-4 mt-8 opacity-50">
            <div className="h-[1px] w-12 bg-yellow-600"></div>
            <Sparkles className="text-yellow-600" size={18} />
            <div className="h-[1px] w-12 bg-yellow-600"></div>
          </div>
        </div>
      </div>

      {/* --- GRILLE DE PRODUITS --- */}
      <section className="max-w-[1600px] mx-auto px-6 py-24 md:py-32">
        
        {/* Barre d'info Prestige */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-6 border-b border-gray-100 pb-10">
          <div className="flex items-center gap-4">
            <span className="text-black font-black text-xs uppercase tracking-widest">Filtres</span>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {products.length} Pièces sélectionnées
            </p>
          </div>
          
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-black bg-gray-50 px-6 py-3 rounded-full">
            Trier par: <span className="text-yellow-600 ml-2 cursor-pointer hover:underline">Derniers Arrivages</span>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-24">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
            <h2 className="font-serif italic text-3xl text-gray-300 mb-8">
              Le showroom {category.name} est en cours de réassort...
            </h2>
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-2 hover:text-yellow-600 hover:border-yellow-600 transition-colors">
              Découvrir nos autres univers
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}