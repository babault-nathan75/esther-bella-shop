'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Shirt, Layers, LogOut, Menu, X, Home, ShoppingBag, Truck } from "lucide-react";

const navGroups = [
  { title: "Pilotage", links: [
    { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Commandes", icon: ShoppingBag, badge: true },
  ] },
  { title: "Catalogue", links: [
    { href: "/admin/products", label: "Tenues", icon: Shirt },
    { href: "/admin/categories", label: "Rubriques", icon: Layers },
  ] },
  { title: "Réglages", links: [
    { href: "/admin/livraison", label: "Livraison", icon: Truck },
  ] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // État pour ouvrir/fermer le menu mobile
  const [pending, setPending] = useState(0);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const load = () => axios.get("/api/admin/orders")
      .then((res) => setPending(res.data.filter((o) => !o.status || o.status === "En attente").length))
      .catch(() => {});
    load();
    const timer = setInterval(() => { if (!document.hidden) load(); }, 30000);
    return () => clearInterval(timer);
  }, []);

  const logout = async () => {
    await axios.post("/api/admin/logout").catch(() => {});
    router.push("/admin/login");
  };

  return (
    <>
      {/* --- BARRE MOBILE --- */}
      <div className="sticky top-0 z-[70] flex h-14 items-center justify-between bg-ink px-2 text-white md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={isOpen} className="relative flex h-11 w-11 items-center justify-center">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
          {pending > 0 && !isOpen && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand" />}
        </button>
        <Image src="/brand/logo.png" alt="Esther Bella Shop" width={640} height={380} className="h-12 w-auto" />
        <Link href="/" aria-label="Retour à la boutique" className="flex h-11 w-11 items-center justify-center"><Home size={20} /></Link>
      </div>

      {/* --- OVERLAY MOBILE --- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* --- LE MENU (DRAWER MOBILE + SIDEBAR DESKTOP) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-[90] flex w-64 shrink-0 flex-col overflow-y-auto bg-ink p-4 text-white transition-transform duration-300
        md:sticky md:top-0 md:h-screen md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Image src="/brand/logo.png" alt="Esther Bella Shop" width={640} height={380} className="mx-auto mb-5 h-24 w-auto" />

        <nav className="space-y-5">
          {navGroups.map(({ title, links }) => (
            <div key={title}>
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">{title}</p>
              <div className="flex flex-col gap-1">
                {links.map(({ href, label, icon: Icon, badge }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                        isActive ? "bg-brand text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1">{label}</span>
                      {badge && pending > 0 && (
                        <span className={`min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-bold ${isActive ? "bg-white text-brand" : "bg-brand text-white"}`}>{pending}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-white/10 pt-3">
          <Link href="/" onClick={closeMenu} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <Home size={18} /> Voir la boutique
          </Link>
          <button onClick={logout} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-white/70 hover:bg-white/10 hover:text-white">
            <LogOut size={18} /> Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}
