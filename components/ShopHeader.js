"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function ShopHeader() {
  const { scrollY } = useScroll();
  
  // Le titre descend plus lentement que le scroll (effet parallaxe)
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  // L'opacité diminue à mesure qu'on descend
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-gray-50 bg-white pt-20">
      {/* Élément de décor parallaxe */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="absolute top-0 right-0 w-1/3 h-full bg-yellow-600/5 -skew-x-12 translate-x-20 pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center items-center gap-3 mb-8"
        >
          <Sparkles className="text-yellow-600" size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.6em] text-yellow-600">
            Maison Esther Bella Abidjan
          </span>
        </motion.div>
        
        <motion.h1 
          style={{ y: y1, opacity }}
          className="text-7xl md:text-[13rem] font-black text-black uppercase tracking-tighter leading-[0.8] mb-12 select-none"
        >
          The <br/> 
          <span className="text-yellow-600 font-serif italic lowercase font-light">Gallery</span>
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-xl mx-auto"
        >
          <p className="text-[11px] md:text-xs text-gray-400 uppercase tracking-[0.4em] leading-loose">
            Explorez une sélection rigoureuse de pièces conçues pour l&apos;exception. 
            Chaque visuel est une promesse d&apos;élégance.
          </p>
        </motion.div>
      </div>
    </div>
  );
}