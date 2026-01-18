"use client";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  // Logique de stock
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <Link 
      href={`/product/${product._id}`} 
      className={`group flex flex-col animate-in fade-in duration-1000 ${isSoldOut ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}
      onClick={(e) => isSoldOut && e.preventDefault()} // Empêche le clic si Sold Out (Optionnel)
    >
      {/* --- IMAGE CONTAINER (Ratio 2/3 Éditorial) --- */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-100 mb-8 shadow-sm group-hover:shadow-2xl transition-all duration-700">
        
        {/* Image avec traitement spécifique si épuisé */}
        {product.images?.[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.title} 
            className={`w-full h-full object-cover transition-transform duration-[2s] ease-out 
              ${isSoldOut ? 'grayscale contrast-75 opacity-40' : 'group-hover:scale-110'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 uppercase tracking-widest">
            Maison EBF
          </div>
        )}
        
        {/* --- OVERLAYS D'ÉTAT --- */}
        
        {/* Cas : SOLD OUT (Impact Visuel Maximum) */}
        {isSoldOut ? (
          <div className="absolute inset-0 bg-zinc-900/10 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.5em] border border-white/20 shadow-2xl transform -rotate-2">
                Sold Out
              </span>
              <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">
                Victime de son succès
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Cas : STOCK FAIBLE */}
            {isLowStock && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse shadow-lg">
                  Plus que {product.stock}
                </span>
              </div>
            )}

            {/* Overlay au hover (Subtile) */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-700"></div>
            
            {/* Badge "VOIR LA PIÈCE" au hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <span className="bg-white/95 backdrop-blur-md px-6 py-3 text-[9px] font-black tracking-[0.3em] text-black border border-gray-100 translate-y-4 group-hover:translate-y-0 transition-transform">
                VOIR LA PIÈCE
              </span>
            </div>
          </>
        )}
      </div>

      {/* --- INFOS PRODUIT --- */}
      <div className="space-y-3 text-center px-4">
        <div className="flex flex-col items-center gap-1">
          <div className={`h-[1px] transition-all duration-700 mb-2 ${isSoldOut ? 'w-8 bg-gray-200' : 'w-0 bg-yellow-600 group-hover:w-12'}`}></div>
          
          <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] leading-tight transition-colors duration-300 
            ${isSoldOut ? 'text-gray-300' : 'text-black group-hover:text-yellow-600'}`}>
            {product.title}
          </h3>
        </div>

        <div className="flex flex-col gap-1">
          <p className={`text-[14px] font-bold tracking-tighter transition-colors ${isSoldOut ? 'text-gray-200 line-through' : 'text-black'}`}>
            {product.price?.toLocaleString()} <span className="text-[10px] font-medium uppercase tracking-normal">FCFA</span>
          </p>
          
          {!isSoldOut && (
            <span className="text-[8px] text-yellow-600/50 font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              Édition Limitée
            </span>
          )}

          {isSoldOut && (
            <span className="text-[8px] text-gray-200 font-black uppercase tracking-[0.3em] mt-1">
              Bientôt de retour ?
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}