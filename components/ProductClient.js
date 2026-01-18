"use client";
import { useState, useContext } from "react";
import { ShoppingBag, ChevronLeft, CheckCircle2, Share2, ShieldCheck, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import { CartContext } from "@/context/CartContext";

export default function ProductClient({ product }) {
  const { addProduct } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  
  // LOGIQUE DE STOCK
  const isSoldOut = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const isVideo = (filename) => filename && filename.match(/\.(mp4|webm|ogg|mov)$/i);
  const images = product.images || [];

  const handleAddToCart = () => {
    if (isSoldOut) return;

    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Veuillez sélectionner votre taille, Queen 👸");
      return;
    }
    addProduct(product, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="bg-white min-h-screen selection:bg-yellow-600/30 font-montserrat">
      
      {/* --- NAV BAR ÉPURÉE --- */}
      <nav className="fixed top-0 left-0 right-0 p-6 z-40 flex justify-between items-center pointer-events-none">
        <Link href="/" className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl text-black hover:scale-110 transition-all border border-gray-100">
          <ChevronLeft size={20} />
        </Link>
        <button onClick={shareProduct} className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl text-black hover:scale-110 transition-all border border-gray-100">
          <Share2 size={20} />
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* --- SECTION GAUCHE : VISUELS --- */}
        <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen bg-zinc-50 overflow-hidden">
          <div className="relative h-[65vh] lg:h-full w-full">
            {images.length > 0 ? (
              isVideo(images[activeImage]) ? (
                <video 
                  src={images[activeImage]} 
                  autoPlay loop muted playsInline 
                  className={`w-full h-full object-cover ${isSoldOut ? 'grayscale opacity-60' : ''}`}
                />
              ) : (
                <img 
                  src={images[activeImage]} 
                  alt={product.title} 
                  className={`w-full h-full object-cover animate-in fade-in zoom-in duration-700 ${isSoldOut ? 'grayscale opacity-60' : ''}`}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">Design EBF Luxe</div>
            )}
            
            {/* BADGE SOLD OUT ÉDITORIAL */}
            {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 px-12 py-6 rounded-full transform -rotate-12 shadow-2xl">
                  <span className="text-white text-2xl lg:text-4xl font-black uppercase tracking-[0.4em] italic font-serif">Sold Out</span>
                </div>
              </div>
            )}

            {/* Sélecteur de Galerie (Miniatures) */}
            {!isSoldOut && images.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-3 bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-yellow-600 scale-110' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- SECTION DROITE : DÉTAILS --- */}
        <div className="lg:w-1/2 bg-white px-6 py-12 lg:p-20">
          <div className="max-w-xl mx-auto">
            <header className="mb-10 lg:mb-16">
              <span className="text-[10px] tracking-[0.6em] text-yellow-600 font-black uppercase mb-4 block">Esther Bella Boutique • Abidjan</span>
              <h1 className="text-4xl lg:text-7xl font-black text-black uppercase tracking-tighter leading-[0.9] mb-8 italic font-serif">
                {product.title}
              </h1>
              <div className="flex items-center gap-6">
                <span className={`text-3xl font-black ${isSoldOut ? 'text-gray-300 line-through' : 'text-black'}`}>
                  {product.price?.toLocaleString()} FCFA
                </span>
                
                {isSoldOut ? (
                  <span className="text-[10px] bg-gray-100 text-gray-400 px-4 py-2 rounded-full font-black uppercase tracking-widest">Épuisé</span>
                ) : isLowStock ? (
                  <span className="text-[10px] bg-red-50 text-red-600 px-4 py-2 rounded-full font-black uppercase tracking-widest animate-pulse">
                    Plus que {product.stock} pièces
                  </span>
                ) : (
                  <span className="text-[10px] text-green-600 uppercase tracking-widest font-bold">Disponible</span>
                )}
              </div>
            </header>

            {/* --- TAILLES (Désactivées si Sold Out) --- */}
            {product.sizes && product.sizes.length > 0 && (
              <div className={`mb-12 ${isSoldOut ? 'opacity-20 pointer-events-none' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black text-black uppercase tracking-widest">Choisir la Mesure</h3>
                  <button className="text-[10px] text-gray-400 uppercase border-b border-gray-200 hover:text-yellow-600 transition">Guide des tailles</button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        h-14 w-14 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2
                        ${selectedSize === size 
                          ? 'bg-black border-yellow-600 text-yellow-600 shadow-2xl scale-110' 
                          : 'bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black'}
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- DESCRIPTION --- */}
            <div className="space-y-12 mb-20">
              <div className="group">
                <h3 className="text-[10px] font-black text-black mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-yellow-600"></span> L'Éditorial
                </h3>
                <p className={`leading-relaxed font-serif italic text-xl ${isSoldOut ? 'text-gray-300' : 'text-gray-500'}`}>
                  "{product.description || "Une pièce d'exception conçue pour les femmes de pouvoir et d'élégance."}"
                </p>
              </div>

              {/* Réassurance */}
              <div className="grid grid-cols-2 gap-6 pt-10 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-yellow-600" size={20} />
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-black">Prestige</h4>
                    <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Certifié Maison EBF</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="text-yellow-600" size={20} />
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-black">Concision</h4>
                    <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Livraison VIP Abidjan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BOUTON DESKTOP --- */}
            <div className="hidden lg:block">
              <button 
                onClick={handleAddToCart}
                disabled={isAdded || isSoldOut}
                className={`
                  w-full h-24 rounded-3xl flex items-center justify-center gap-4 shadow-2xl transition-all duration-700 font-black uppercase text-xs tracking-[0.4em]
                  ${isSoldOut 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none' 
                    : isAdded 
                    ? 'bg-green-600 text-white' 
                    : 'bg-black text-white hover:bg-zinc-800 hover:scale-[1.02]'}
                `}
              >
                {isSoldOut ? (
                  <><XCircle size={24} /> PIÈCE ÉPUISÉE</>
                ) : isAdded ? (
                  <><CheckCircle2 size={24} /> AJOUTÉ AU PANIER</>
                ) : (
                  <><ShoppingBag size={20} /> COMMANDER CETTE PIÈCE</>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* --- BARRE D'ACHAT STICKY MOBILE --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-6 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <div className="flex flex-col pr-4 border-r border-gray-100">
            <span className="text-[8px] text-gray-400 uppercase font-black">Prix</span>
            <span className={`text-lg font-black ${isSoldOut ? 'text-gray-300' : 'text-black'}`}>
              {product.price?.toLocaleString()}
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isAdded || isSoldOut}
            className={`
              flex-1 h-16 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all duration-500 font-black uppercase text-[10px] tracking-[0.2em]
              ${isSoldOut 
                ? 'bg-gray-100 text-gray-300 shadow-none' 
                : isAdded 
                ? 'bg-green-600 text-white' 
                : 'bg-black text-white active:scale-95'}
            `}
          >
            {isSoldOut ? 'ÉPUISÉ' : isAdded ? <CheckCircle2 size={18} /> : <ShoppingBag size={18} />}
            {isSoldOut ? '' : isAdded ? 'SUCCÈS' : 'AJOUTER'}
          </button>
        </div>
      </div>

    </div>
  );
}