"use client";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { X, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Media from "@/components/Media";
import { useCatalog } from "@/context/CatalogContext";
import { formatPrice, isOrderable, newestInStock, searchProducts } from "@/lib/shop";

// Tri stable : la pertinence est conservée à disponibilité égale
const availableFirst = (list) => [...list].sort((a, b) => Number(isOrderable(b)) - Number(isOrderable(a)));

export default function SearchOverlay({ onClose }) {
  const { products, categories } = useCatalog();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const hasQuery = deferredQuery.trim().length > 0;
  const results = useMemo(
    () => hasQuery
      ? availableFirst(searchProducts(products, categories, deferredQuery)).slice(0, 24)
      : newestInStock(products).slice(0, 6),
    [products, categories, deferredQuery, hasQuery]
  );

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Rechercher une tenue" className="fixed inset-0 z-[70] flex flex-col bg-white">
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Search size={20} className="shrink-0 text-muted" />
          <input
            autoFocus
            type="search"
            enterKeyHint="search"
            placeholder="Robe, ensemble, sac…"
            aria-label="Rechercher"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
                onClose();
              }
            }}
            className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none"
          />
          <button onClick={onClose} aria-label="Fermer la recherche" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-paper">
            <X size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-5">
          {!hasQuery && categories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat._id} href={`/category/${cat._id}`} onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink">
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <p className="mb-3 text-sm text-muted" aria-live="polite">
            {hasQuery ? `${results.length} résultat${results.length > 1 ? "s" : ""}` : "Prêt à porter"}
          </p>

          <ul className="divide-y divide-line">
            {results.map((product) => (
              <li key={product._id}>
                <Link href={`/product/${product._id}`} onClick={onClose} className="flex items-center gap-4 py-3">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-paper">
                    <Media src={product.images?.[0]} alt="" className={`h-full w-full object-cover ${isOrderable(product) ? "" : "opacity-50 grayscale"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{product.title}</p>
                    <p className="mt-1 text-sm font-bold">{formatPrice(product.price)}</p>
                    {!isOrderable(product) && <p className="text-xs text-muted">Épuisé</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {hasQuery && results.length === 0 && (
            <p className="py-12 text-center text-muted">Aucune tenue ne correspond à « {deferredQuery} ».</p>
          )}
        </div>
      </div>
    </div>
  );
}
