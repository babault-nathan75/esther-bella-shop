"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import HeaderCount from "./HeaderCount";
import SearchOverlay from "./SearchOverlay";

export default function Header({ playfairClass }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-black border-b border-yellow-600 sticky top-0 z-[100] shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          
          <nav className="hidden md:flex gap-10 text-[11px] uppercase tracking-[0.3em] font-bold text-yellow-600">
            <Link href="/shop" className="hover:text-white transition">Collections</Link>
            <Link href="/nouveautes" className="hover:text-white transition">Nouveautés</Link>
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
            <h1 className={`${playfairClass} text-yellow-600 text-xl md:text-3xl font-bold tracking-[0.1em] uppercase leading-none text-center italic`}>
              Esther Bella Fashion
            </h1>
          </Link>

          <div className="flex items-center gap-6 text-yellow-600">
            {/* Clic sur la loupe ouvre l'overlay */}
            <button onClick={() => setIsSearchOpen(true)} className="hover:text-white transition">
              <Search size={22} />
            </button>
            <Link href="/cart" className="relative group">
              <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
              <HeaderCount />
            </Link>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}