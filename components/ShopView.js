"use client";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { ProductGrid } from "@/components/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import { isConfection, isNewArrival, isOrderable, isStockListed, searchProducts, sortForDisplay } from "@/lib/shop";

// mode : "all" (rubrique via categoryId), "ready" (prêt à porter), "instock", "confection", "arrivals"
export default function ShopView({ title, intro, hero, showStock = false, mode = "all", categoryId }) {
  const { products, categories } = useCatalog();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);

  // Recherche transmise par l'adresse (?q=), depuis le site ou depuis Google
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (query) setSearchTerm(query);
  }, []);

  const { orderable, soldOut } = useMemo(() => {
    let result = products;
    if (mode === "confection") result = result.filter(isConfection);
    if (mode === "arrivals") result = result.filter(isNewArrival);
    if (mode === "ready") result = result.filter((p) => !isConfection(p) && p.inStock !== true);
    if (mode === "instock") result = result.filter(isStockListed);
    // Une nouveauté ne rejoint sa rubrique qu'après sa semaine dans « Nouveautés »
    const rubrique = categoryId || (activeCategory !== "all" ? activeCategory : null);
    if (rubrique) result = result.filter((p) => p.category === rubrique && !isNewArrival(p));
    result = deferredSearch.trim() ? searchProducts(result, categories, deferredSearch) : sortForDisplay(result);

    const available = result.filter(isOrderable);
    if (sortOrder === "asc") available.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") available.sort((a, b) => b.price - a.price);
    return { orderable: available, soldOut: result.filter((p) => !isOrderable(p)) };
  }, [products, categories, mode, categoryId, activeCategory, deferredSearch, sortOrder]);

  const usedCategories = useMemo(() => {
    const pool = products.filter(mode === "confection" ? isConfection : mode === "instock" ? isStockListed : mode === "ready" ? (p) => !isConfection(p) && p.inStock !== true : () => true);
    return categories.filter((c) => pool.some((p) => p.category === c._id));
  }, [products, categories, mode]);

  return (
    <>
    {hero}
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {title && <h1 className="font-serif text-3xl font-bold md:text-5xl">{title}</h1>}
      {intro && <p className="mt-2 max-w-2xl text-muted">{intro}</p>}

      <div className={`${title ? "mt-6 " : ""}flex gap-2 sm:gap-3`}>
        <div className="relative min-w-0 flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            aria-label="Rechercher une tenue"
            placeholder="Rechercher…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="field pl-10!"
          />
        </div>
        <select aria-label="Trier" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="field w-32! shrink-0 sm:w-56!">
          <option value="">Les plus récentes</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
      </div>

      {!categoryId && usedCategories.length > 0 && (
        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {[{ _id: "all", name: "Tout" }, ...usedCategories].map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveCategory(cat._id)}
              aria-pressed={activeCategory === cat._id}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors ${activeCategory === cat._id ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6" />

      {orderable.length > 0 ? (
        <ProductGrid products={orderable} showStock={showStock} />
      ) : (
        <div className="rounded-lg bg-paper p-10 text-center text-muted">
          <p>{mode === "instock" && !searchTerm ? "Aucune tenue en stock pour le moment. Revenez très vite !" : mode === "arrivals" && !searchTerm ? "Pas de nouveauté cette semaine. Revenez très vite !" : "Aucune tenue disponible pour cette sélection."}</p>
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="mt-3 inline-flex min-h-11 items-center gap-1 font-semibold text-brand">
              <X size={16} /> Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* Les pièces épuisées restent consultables, mais repliées et en fin de page */}
      {soldOut.length > 0 && (
        <details className="mt-12 border-t border-line pt-5">
          <summary className="cursor-pointer py-2 text-sm font-semibold text-muted">
            Voir les pièces épuisées ({soldOut.length})
          </summary>
          <div className="mt-5"><ProductGrid products={soldOut} /></div>
        </details>
      )}
    </div>
    </>
  );
}
