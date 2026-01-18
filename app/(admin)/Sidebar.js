'use client';
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shirt, Layers, Menu, X, Home } from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Catégories", icon: Layers },
  { href: "/admin/products", label: "Produits", icon: Shirt },
];

export default function Sidebar({ playfairClass }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // État pour ouvrir/fermer le menu mobile

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* --- BOUTON MENU MOBILE (Placé en haut à gauche pour la Queen) --- */}
      <div className="md:hidden fixed top-4 left-2.5 z-[100]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white text-black p-2 rounded-full shadow-2xl border border-gray-100 active:scale-90 transition-all flex items-center justify-center"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- OVERLAY MOBILE --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* --- LE MENU (DRAWER MOBILE + SIDEBAR DESKTOP) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[90] w-72 bg-black text-white p-6 border-r border-primary/20 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex md:flex-col md:h-screen md:sticky md:top-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* Logo / Header Sidebar */}
        <div className="mb-12 text-center mt-12 md:mt-0">
          <h1 className={`${playfairClass} text-4xl font-bold text-primary tracking-widest leading-none`}>
            EBF
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 mt-2">
            L&apos;espace privé d&apos;Esther
          </p>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`flex items-center gap-4 p-4 text-sm uppercase tracking-[0.2em] transition-all rounded-xl ${
                  isActive
                    ? "text-primary font-bold bg-white/10 border-l-4 border-primary shadow-inner"
                    : "text-gray-400 hover:text-primary hover:bg-white/5"
                }`}
              >
                <Icon size={20} /> {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="mt-auto pt-6 border-t border-primary/10">
          <Link 
            href="/" 
            onClick={closeMenu}
            className="flex items-center gap-3 p-3 text-[10px] text-gray-500 uppercase tracking-[0.3em] hover:text-primary transition-colors"
          >
            <Home size={16} /> Retour Boutique
          </Link>
        </div>
      </aside>
    </>
  );
}