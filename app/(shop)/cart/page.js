"use client";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { Trash2, ArrowRight, ShoppingBag, ChevronLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cartProducts, removeProduct } = useContext(CartContext);

  // --- LOGIQUE DE VÉRIFICATION DES STOCKS ---
  // Cette variable devient 'true' si au moins un article a un stock de 0 ou moins
  const hasOutOfStockItems = cartProducts.some(item => item.stock <= 0);
  
  // Calcul du total
  const subtotal = cartProducts.reduce((acc, item) => acc + (item.price || 0), 0);
  const shipping = subtotal > 0 ? 1500 : 0; 
  const total = subtotal + shipping;

  // Cas où le panier est vide
  if (cartProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 font-montserrat text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 animate-in fade-in zoom-in duration-700">
          <ShoppingBag size={40} className="text-gray-200" />
        </div>
        <h2 className="text-3xl font-serif italic text-black mb-4">Votre sélection est vide</h2>
        <p className="text-gray-400 text-sm uppercase tracking-[0.2em] mb-10">
          L'élégance n'attend que vous.
        </p>
        <Link href="/shop" className="bg-black text-white px-12 py-4 rounded-full font-black uppercase text-xs tracking-[0.3em] hover:bg-yellow-600 hover:text-black hover:scale-105 transition-all shadow-2xl">
          Découvrir la Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-montserrat">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* --- EN-TÊTE ÉDITORIAL --- */}
        <div className="mb-16 border-b border-gray-100 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none mb-4">
              Votre <span className="font-serif italic text-yellow-600 font-light">Sélection</span>
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-[0.5em] font-bold">Esther Bella Fashion • Abidjan</p>
          </div>
          <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 hover:text-yellow-600 transition-colors">
            <ChevronLeft size={14} /> Continuer le shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* --- LISTE DES PRODUITS (COL 8) --- */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* BANDEAU D'ALERTE SI STOCK ÉPUISÉ */}
            {hasOutOfStockItems && (
              <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-600 mb-10 animate-in slide-in-from-top-4 duration-500">
                <AlertCircle size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  Certaines pièces de votre sélection ne sont plus disponibles. <br/>
                  Veuillez les retirer pour pouvoir procéder au paiement.
                </p>
              </div>
            )}

            {cartProducts.map((item) => {
              const isSoldOut = item.stock <= 0;
              return (
                <div key={item.cartId} className={`flex gap-6 md:gap-10 group relative pb-10 border-b border-gray-50 transition-opacity duration-500 ${isSoldOut ? 'opacity-50' : ''}`}>
                  
                  {/* Miniature Image */}
                  <div className="relative w-24 h-32 md:w-32 md:h-44 bg-gray-100 overflow-hidden rounded-sm shadow-md flex-shrink-0">
                    <img 
                      src={item.images?.[0]} 
                      alt={item.title} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${!isSoldOut && 'group-hover:scale-110'} ${isSoldOut ? 'grayscale' : ''}`} 
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="text-[8px] font-black text-white uppercase tracking-[0.3em] border border-white/20 px-2 py-1 transform -rotate-2">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Détails Produit */}
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-lg md:text-xl font-bold uppercase tracking-tight ${isSoldOut ? 'text-gray-400 line-through' : 'text-black'}`}>
                          {item.title}
                        </h3>
                        <button 
                          onClick={() => removeProduct(item.cartId)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      {isSoldOut ? (
                        <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-4 italic">
                          Victime de son succès — Indisponible
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-4">Maison Esther Bella</p>
                      )}
                      
                      <div className="inline-flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Taille:</span>
                        <span className="text-xs font-black text-black">{item.selectedSize || "Unique"}</span>
                      </div>
                    </div>

                    <div className={`text-lg font-black mt-4 ${isSoldOut ? 'text-gray-300' : 'text-black'}`}>
                      {item.price?.toLocaleString()} <span className="text-[10px] ml-1 uppercase">FCFA</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- RÉSUMÉ DE LA COMMANDE (COL 4) --- */}
          <div className="lg:col-span-4">
            <div className="bg-black text-white p-8 md:p-10 rounded-3xl sticky top-32 shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
              <h2 className="text-xl font-bold uppercase tracking-[0.2em] mb-10 border-b border-white/10 pb-6">Votre Commande</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-sm uppercase tracking-widest text-white/60">
                  <span>Sous-total</span>
                  <span className="text-white font-bold">{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm uppercase tracking-widest text-white/60">
                  <span>Livraison</span>
                  <span className="text-white font-bold">{shipping.toLocaleString()} FCFA</span>
                </div>
                <div className="h-px bg-white/10 my-6"></div>
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase tracking-[0.3em] font-black text-yellow-600">Total TTC</span>
                  <span className="text-3xl font-black text-white tracking-tighter">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              {/* --- BOUTON DE PAIEMENT BLOQUÉ --- */}
              {hasOutOfStockItems ? (
                <div className="w-full bg-zinc-800 text-zinc-500 h-16 rounded-full font-black uppercase text-[9px] tracking-[0.2em] flex items-center justify-center text-center px-6 cursor-not-allowed border border-white/5 opacity-80">
                  Retirer les articles "Sold Out" pour payer
                </div>
              ) : (
                <Link 
                  href="/checkout" 
                  className="w-full bg-yellow-600 text-black h-16 rounded-full font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-white hover:scale-[1.02] transition-all shadow-xl"
                >
                  Passer au paiement <ArrowRight size={18} />
                </Link>
              )}

              <div className="mt-8 flex flex-col items-center gap-4 text-[9px] text-white/40 uppercase tracking-[0.2em]">
                <p>Abidjan : Livraison Express disponible</p>
              </div>
            </div>
            
            <p className="mt-8 text-center text-gray-400 text-[10px] uppercase tracking-[0.2em] italic leading-relaxed px-4">
              "L'élégance est la seule beauté qui ne se fane jamais."
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}