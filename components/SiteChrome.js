"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, PackageCheck, Scissors, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { recordNavigation } from "@/components/BackLink";
import HeaderCount from "@/components/HeaderCount";
import Media from "@/components/Media";
import SearchOverlay from "@/components/SearchOverlay";
import { useCatalog } from "@/context/CatalogContext";
import { formatPrice } from "@/lib/shop";

const NAV = [
  { href: "/nouveautes", label: "Nouveautés" },
  { href: "/shop", label: "Prêt à porter" },
  { href: "/en-stock", label: "En stock" },
  { href: "/confection", label: "Sur commande" },
];

function NavLink({ href, label, active }) {
  const [phase, setPhase] = useState("idle");
  const shown = active ? "in" : phase;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onMouseEnter={() => setPhase("in")}
      onMouseLeave={() => setPhase("out")}
      className="relative py-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 hover:text-brand"
    >
      {label}
      <span
        aria-hidden="true"
        className="nav-line"
        data-phase={shown}
        // Sortie terminée : le trait se replace à gauche, prêt pour le prochain passage
        onTransitionEnd={(e) => { if (e.propertyName === "left") setPhase((p) => (p === "out" ? "idle" : p)); }}
      />
    </Link>
  );
}

// Mesure d'audience maison : identifiant anonyme, stocké seulement dans ce navigateur
function useVisitTracking(pathname) {
  const lastPath = useRef(null);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    try {
      let visitorId = localStorage.getItem("eb_visitor");
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("eb_visitor", visitorId);
      }
      const landing = !sessionStorage.getItem("eb_session");
      sessionStorage.setItem("eb_session", "1");
      navigator.sendBeacon?.("/api/track", JSON.stringify({
        visitorId,
        path: pathname,
        landing,
        referrer: landing ? document.referrer : "",
      }));
    } catch {
      // Navigation privée ou stockage bloqué : la visite n'est simplement pas comptée
    }
  }, [pathname]);
}

// Toute page s'ouvre en haut. Seuls les boutons Précédent et Suivant retrouvent la position quittée.
function useScrollToTopOnArrival(pathname) {
  const isHistoryNavigation = useRef(false);

  useEffect(() => {
    const onPopState = () => { isHistoryNavigation.current = true; };
    window.addEventListener("popstate", onPopState);
    const entry = performance.getEntriesByType("navigation")[0];
    if (entry?.type === "back_forward") return () => window.removeEventListener("popstate", onPopState);
    // Rechargement : le navigateur ne doit pas restaurer l'ancienne position
    history.scrollRestoration = "manual";
    const timer = setTimeout(() => { history.scrollRestoration = "auto"; }, 500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
}

function LiveArrivalToast() {
  const { arrivals, dismissArrivals } = useCatalog();

  useEffect(() => {
    if (!arrivals.length) return;
    const timer = setTimeout(dismissArrivals, 10000);
    return () => clearTimeout(timer);
  }, [arrivals, dismissArrivals]);

  if (!arrivals.length) return null;
  const first = arrivals[0];

  return (
    <div role="status" className="rise fixed inset-x-3 bottom-24 z-[60] mx-auto flex max-w-sm items-center gap-3 rounded-xl bg-ink p-2.5 text-white shadow-2xl md:bottom-6">
      <Link
        href={arrivals.length > 1 ? "/nouveautes" : `/product/${first._id}`}
        onClick={dismissArrivals}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="h-14 w-11 shrink-0 overflow-hidden rounded bg-white/10">
          <Media src={first.images?.[0]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-red-300">
            {arrivals.length > 1 ? `${arrivals.length} nouveautés` : "Nouveauté"}
          </p>
          <p className="truncate text-sm font-medium">{first.title}</p>
        </div>
      </Link>
      <button onClick={dismissArrivals} aria-label="Fermer" className="flex h-11 w-11 shrink-0 items-center justify-center">
        <X size={18} />
      </button>
    </div>
  );
}

export default function SiteChrome() {
  const pathname = usePathname();
  const { zones } = useCatalog();
  const lowestDelivery = zones.length ? Math.min(...zones.map((z) => z.price)) : null;
  useVisitTracking(pathname);
  useEffect(() => recordNavigation(pathname), [pathname]);
  const [searchOpen, setSearchOpen] = useState(false);
  useScrollToTopOnArrival(pathname);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // La fiche produit et la commande ont leur propre barre d'action en bas d'écran
  const hideBottomNav = pathname.startsWith("/product/") || pathname === "/checkout";
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const bottomLinks = [
    { href: "/", label: "Accueil", Icon: Home },
    { href: "/nouveautes", label: "Nouveautés", Icon: Sparkles },
    { href: "/shop", label: "Prêt à porter", Icon: LayoutGrid },
    { href: "/en-stock", label: "Stock", Icon: PackageCheck },
    { href: "/confection", label: "Commande", Icon: Scissors },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b-4 border-brand bg-ink text-white shadow-lg">
        <div className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 h-16 px-4 md:h-24 md:grid-cols-[1fr_auto_1fr] md:px-6`}>
          <Link href="/" aria-label="Esther Bella Shop, accueil" className="w-fit">
            <Image src="/brand/logo.png" alt="Esther Bella Shop" width={640} height={380} priority className="h-14 w-auto md:h-[5.25rem]" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-5 md:flex lg:gap-9">
            {NAV.map(({ href, label }) => <NavLink key={href} href={href} label={label} active={isActive(href)} />)}
          </nav>

          <div className="flex items-center justify-end gap-1 md:gap-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Rechercher" className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10 lg:w-auto lg:gap-2 lg:border lg:border-white/20 lg:px-4 lg:text-sm lg:text-white/70">
              <Search size={20} /><span className="hidden lg:inline">Rechercher</span>
            </button>
            <Link href="/cart" aria-label="Voir le panier" className="flex h-11 w-11 items-center justify-center gap-3.5 rounded-full bg-white text-ink transition-colors hover:bg-brand hover:text-white lg:w-auto lg:px-5">
              <span className="relative">
                <ShoppingBag size={20} />
                <HeaderCount />
              </span>
              <span className="hidden text-sm font-semibold lg:inline">Panier</span>
            </Link>
          </div>
        </div>
      </header>

      {!hideBottomNav && (
        <nav aria-label="Navigation mobile" className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 rounded-[1.75rem] bg-black/90 p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.45)] ring-1 ring-white/15 backdrop-blur-lg md:hidden">
          <div className="grid grid-cols-5">
            {bottomLinks.map(({ href, label, Icon }) => (
              <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className={`flex h-14 flex-col items-center justify-center gap-0.5 text-center text-[10px] font-medium leading-tight transition-colors active:scale-95 ${isActive(href) ? "text-white" : "text-white/60"}`}>
                <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${isActive(href) ? "bg-brand" : ""}`}><Icon size={18} /></span>
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {searchOpen && <SearchOverlay onClose={closeSearch} />}
      <LiveArrivalToast />
    </>
  );
}
