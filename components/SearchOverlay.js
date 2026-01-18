"use client";
import { useState, useEffect } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // Recherche en temps réel
  useEffect(() => {
    if (query.length > 2) {
      axios.get(`/api/products?search=${query}`).then(res => {
        setResults(res.data);
      });
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl animate-in fade-in duration-500 flex flex-col">
      
      {/* Bouton Fermer */}
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 text-primary hover:rotate-90 transition-transform duration-500"
      >
        <X size={40} strokeWidth={1} />
      </button>

      <div className="max-w-5xl mx-auto w-full px-6 pt-32">
        {/* Input de Recherche Géant */}
        <div className="relative border-b border-primary/30 pb-4 mb-20 group">
          <input
            autoFocus
            type="text"
            placeholder="Quelle pièce cherchez-vous ?"
            className="w-full bg-transparent text-4xl md:text-6xl font-serif italic text-white outline-none placeholder:text-white/10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-primary opacity-20 group-focus-within:opacity-100 transition-opacity" size={40} />
        </div>

        {/* Résultats Rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar">
          {results.map(product => (
            <Link 
              key={product._id} 
              href={`/product/${product._id}`}
              onClick={onClose}
              className="group flex items-center gap-6 p-4 border border-white/5 hover:border-primary/20 transition-all rounded-2xl"
            >
              <div className="w-20 h-24 relative overflow-hidden rounded-lg">
                <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] text-primary uppercase tracking-[0.3em] mb-1">EBF Collection</h4>
                <p className="text-white font-bold uppercase tracking-tighter">{product.title}</p>
                <p className="text-primary/60 text-xs mt-2">{product.price.toLocaleString()} FCFA</p>
              </div>
              <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
          
          {query.length > 2 && results.length === 0 && (
            <p className="text-white/30 italic font-serif text-xl">Aucune pièce ne correspond à votre désir...</p>
          )}
        </div>

        {/* Suggestions de catégories si vide */}
        {query.length === 0 && (
          <div className="animate-in slide-in-from-bottom-10 duration-700">
            <h3 className="text-[10px] text-primary uppercase tracking-[0.5em] mb-8 font-black">Suggestions Royales</h3>
            <div className="flex flex-wrap gap-4">
              {['Nouvelle Collection', 'Robes de Soirée', 'Ensembles Luxe', 'Accessoires Or'].map(cat => (
                <button key={cat} className="px-6 py-3 border border-white/10 rounded-full text-white text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}