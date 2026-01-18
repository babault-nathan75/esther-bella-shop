import { connectToDB } from "@/lib/mongoose";
import { Product } from "@/lib/models/Product";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Nouveautés | Esther Bella Fashion",
  description: "Découvrez les dernières créations exclusives de notre Maison.",
};

async function getNewArrivals() {
  await connectToDB();
  // On récupère les 12 derniers produits ajoutés
  const products = await Product.find().sort({ createdAt: -1 }).limit(12);
  return JSON.parse(JSON.stringify(products));
}

export default async function NouveautesPage() {
  const products = await getNewArrivals();

  return (
    <div className="bg-white min-h-screen pt-32 pb-40 font-montserrat">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* En-tête Éditorial */}
        <div className="text-center mb-32">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="h-px w-12 bg-yellow-600"></div>
            <Sparkles className="text-yellow-600" size={24} />
            <div className="h-px w-12 bg-yellow-600"></div>
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black text-black uppercase tracking-tighter leading-[0.8] mb-8">
            New <br/> <span className="text-yellow-600 italic font-serif lowercase font-light">Arrivals</span>
          </h1>
          <p className="max-w-xl mx-auto text-[10px] text-gray-400 uppercase tracking-[0.5em] leading-loose text-center">
            L'expression la plus récente de notre savoir-faire. Des pièces rares, disponibles en quantités limitées.
          </p>
        </div>

        {/* Grille de Prestige */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-32">
          {products.map((product) => {
            const isSoldOut = product.stock <= 0;
            const mainMedia = product.images?.[0];
            
            // --- LOGIQUE DE DÉTECTION AUTOMATIQUE ---
            const isVideo = mainMedia?.match(/\.(mp4|webm|ogg)$/i);
            
            return (
              <Link 
                href={`/product/${product._id}`} 
                key={product._id} 
                className={`group flex flex-col items-center ${isSoldOut ? 'cursor-default pointer-events-none' : ''}`}
              >
                {/* --- MEDIA CONTAINER --- */}
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-gray-50 mb-10 shadow-2xl transition-all duration-700 group-hover:shadow-yellow-600/5">
                  {mainMedia && (
                    isVideo ? (
                      /* LOGIQUE VIDÉO */
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] 
                          ${isSoldOut ? 'grayscale opacity-40' : 'group-hover:scale-110'}`}
                      >
                        <source src={mainMedia} type="video/mp4" />
                      </video>
                    ) : (
                      /* LOGIQUE IMAGE */
                      <Image 
                        src={mainMedia} 
                        alt={product.title}
                        fill
                        className={`object-cover transition-transform duration-[2s] 
                          ${isSoldOut ? 'grayscale opacity-40' : 'group-hover:scale-110'}`}
                      />
                    )
                  )}

                  {/* État : SOLD OUT */}
                  {isSoldOut ? (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-10">
                      <span className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.4em] border border-white/20 transform -rotate-2 shadow-2xl">
                        Épuisé
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700"></div>
                      {/* Badge Nouveauté Dynamique */}
                      <div className="absolute top-8 right-8 z-10">
                        <div className="bg-yellow-600 text-black px-6 py-2 text-[8px] font-black uppercase tracking-[0.4em] rotate-90 origin-right translate-x-2 shadow-lg">
                          Nouveau
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* --- INFOS --- */}
                <div className="text-center space-y-4 px-4">
                  <div className="flex flex-col items-center gap-2">
                    <h3 className={`text-lg font-black uppercase tracking-widest transition-colors duration-500
                      ${isSoldOut ? 'text-gray-300' : 'text-black group-hover:text-yellow-600'}`}>
                      {product.title}
                    </h3>
                    <div className={`h-[1px] bg-yellow-600 transition-all duration-700 ${isSoldOut ? 'w-8 opacity-20' : 'w-0 group-hover:w-20'}`}></div>
                  </div>
                  
                  <p className={`font-bold text-sm tracking-tighter ${isSoldOut ? 'text-gray-200 line-through' : 'text-yellow-600'}`}>
                    {product.price.toLocaleString()} FCFA
                  </p>

                  {isSoldOut && (
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.3em] animate-pulse">
                      Victime de son succès
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer de section */}
        <div className="mt-48 text-center border-t border-gray-100 pt-24">
          <Link href="/shop" className="group inline-flex flex-col items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 group-hover:text-black transition-colors">
              Explorer l'entièreté du Showroom
            </span>
            <div className="h-10 w-px bg-gray-100 group-hover:bg-yellow-600 group-hover:h-20 transition-all duration-700"></div>
          </Link>
        </div>
      </div>
    </div>
  );
}