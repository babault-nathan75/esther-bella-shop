"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";

const HISTORY_KEY = "eb_nav_history";
const MAX_ENTRIES = 30;

const PAGE_LABELS = {
  "/": "Accueil",
  "/nouveautes": "Nouveautés",
  "/shop": "Prêt à porter",
  "/en-stock": "En stock",
  "/confection": "Sur commande",
  "/recherche": "Recherche",
  "/cart": "Panier",
  "/suivi": "Suivi de commande",
  "/confirmation": "Confirmation",
  "/contact": "Contact",
  "/livraison-retours": "Livraison et retours",
  "/guide-tailles": "Guide des tailles",
  "/notre-histoire": "Notre histoire",
  "/ethique-qualite": "Éthique et qualité",
  "/points-vente": "Points de vente",
};

// Pile du parcours dans cet onglet. Revenir sur l'avant-dernière page la dépile.
export function recordNavigation(pathname) {
  try {
    const stack = JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]");
    if (stack.at(-1) === pathname) return;
    if (stack.at(-2) === pathname) stack.pop();
    else stack.push(pathname);
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(stack.slice(-MAX_ENTRIES)));
  } catch {
    // Stockage bloqué : le bouton utilisera sa destination par défaut
  }
}

function previousPage() {
  try {
    return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || "[]").at(-2) || null;
  } catch {
    return null;
  }
}

export default function BackLink({ fallbackHref = "/shop", fallbackLabel = "Prêt à porter", className = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const { categories } = useCatalog();
  const [previous, setPrevious] = useState(null);

  // Lu après l'enregistrement de la page courante par l'en-tête
  useEffect(() => {
    const timer = setTimeout(() => setPrevious(previousPage()), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const labelOf = (path) => {
    if (path.startsWith("/product/")) return "Article précédent";
    if (path.startsWith("/category/")) {
      return categories.find((c) => path.endsWith(c._id))?.name || "Rubrique";
    }
    return PAGE_LABELS[path] || "Retour";
  };

  return (
    <Link
      href={previous || fallbackHref}
      onClick={(event) => {
        if (!previous) return;
        // Vrai retour : la page précédente retrouve sa position et ses filtres d'adresse
        event.preventDefault();
        router.back();
      }}
      className={className}
    >
      <ChevronLeft size={18} /> {previous ? labelOf(previous) : fallbackLabel}
    </Link>
  );
}
