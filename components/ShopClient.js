"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

export default function ShopClient({ initialProducts, categories }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];
    if (activeCategory !== "all") result = result.filter(p => p.category === activeCategory);
    if (searchTerm) result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
    else if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [activeCategory, searchTerm, sortOrder, initialProducts]);

  return (
    <div className="pt-20 pb-40 px-6">
      {/* --- FILTRES --- */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-gray-100 pb-12">
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={() => setActiveCategory("all")} 
              className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeCategory === "all" ? "border-yellow-600 text-black" : "border-transparent text-gray-300 hover:text-black"}`}
            >
              Tout voir
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id} 
                onClick={() => setActiveCategory(cat._id)} 
                className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${activeCategory === cat._id ? "border-yellow-600 text-black" : "border-transparent text-gray-300 hover:text-black"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input 
              type="text" 
              placeholder="RECHERCHER..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full bg-transparent border-b border-gray-200 py-2 pl-6 text-[10px] font-black tracking-widest outline-none focus:border-yellow-600 uppercase" 
            />
          </div>
        </div>
      </div>

      {/* --- GRILLE --- */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory + searchTerm}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20"
          >
            {filteredProducts.map((product) => {
              const isSoldOut = product.stock <= 0;
              const mainMedia = product.images?.[0];
              // LOGIQUE DE DÉTECTION AUTOMATIQUE
              const isVideo = mainMedia?.match(/\.(mp4|webm|ogg)$/i);

              return (
                <motion.div key={product._id} variants={itemVariants}>
                  <Link href={`/product/${product._id}`} className="group block">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-gray-50 mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                      
                      {mainMedia && (
                        isVideo ? (
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className={`w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 ${isSoldOut ? 'grayscale opacity-50' : ''}`}
                          >
                            <source src={mainMedia} type="video/mp4" />
                          </video>
                        ) : (
                          <Image 
                            src={mainMedia} 
                            alt={product.title} 
                            fill 
                            className={`object-cover transition-transform duration-[2s] group-hover:scale-110 ${isSoldOut ? 'grayscale opacity-50' : ''}`} 
                          />
                        )
                      )}

                      {isSoldOut && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                          <span className="bg-black text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em]">Sold Out</span>
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="text-black text-[11px] font-black tracking-[0.2em] uppercase group-hover:text-yellow-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-[13px] font-bold text-gray-400">
                        {product.price.toLocaleString()} FCFA
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}