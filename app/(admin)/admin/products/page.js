"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, Search, Sparkles, Star, Trash2 } from "lucide-react";
import Media from "@/components/Media";
import { NEW_ARRIVAL_DAYS, arrivalTime, formatPrice, isConfection, isInStock, isNewArrival, searchProducts } from "@/lib/shop";

const HERO_SLOTS = [["left", "À gauche"], ["center", "Au milieu"], ["right", "À droite"]];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  const fetchProducts = () => {
    axios.get("/api/products").then(response => {
      setProducts(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProducts();
    axios.get("/api/categories").then(res => setCategories(res.data));
  }, []);

  const deleteProduct = async (product) => {
    if (window.confirm(`Supprimer définitivement « ${product.title} » ?`)) {
      try {
        await axios.delete(`/api/products?id=${product._id}`);
        fetchProducts();
      } catch (error) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const toggleAvailability = async (product) => {
    const next = product.available === false;
    setTogglingId(product._id);
    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, available: next } : p));
    try {
      await axios.patch("/api/products", { _id: product._id, available: next });
    } catch (error) {
      alert("Erreur lors de la mise à jour de la disponibilité.");
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, available: !next } : p));
    } finally {
      setTogglingId(null);
    }
  };

  const patchProduct = async (changes, fallback) => {
    try {
      await axios.patch("/api/products", changes);
      fetchProducts();
    } catch (error) {
      alert(fallback);
    }
  };

  const daysLeft = (product) =>
    Math.max(1, Math.ceil((arrivalTime(product) + NEW_ARRIVAL_DAYS * 86400000 - Date.now()) / 86400000));

  const visible = searchProducts(products, categories, search);
  const categoryName = (id) => categories.find(c => c._id === id)?.name;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold">Tenues</h1>
        <Link href="/admin/products/new" className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus size={18} /> Nouvelle tenue
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input type="search" aria-label="Rechercher une tenue" placeholder="Rechercher une tenue…" value={search} onChange={e => setSearch(e.target.value)} className="field pl-10!" />
      </div>

      {/* --- VITRINE DE L'ACCUEIL --- */}
      <section className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
        <h2 className="font-semibold">Vitrine de l&apos;accueil</h2>
        <p className="mb-3 text-sm text-muted">Choisissez la tenue de chaque place. Sur « Automatique », la plus récente est au milieu, puis à gauche, puis à droite.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {HERO_SLOTS.map(([slot, label]) => {
            const current = products.find((p) => p.heroSlot === slot);
            return (
              <div key={slot}>
                <label htmlFor={`slot-${slot}`} className="mb-1 block text-sm font-medium">{label}</label>
                <select
                  id={`slot-${slot}`}
                  value={current?._id || ""}
                  onChange={async (e) => {
                    if (current) await patchProduct({ _id: current._id, heroSlot: null }, "Impossible de modifier la vitrine.");
                    if (e.target.value) await patchProduct({ _id: e.target.value, heroSlot: slot }, "Impossible de modifier la vitrine.");
                  }}
                  className="field"
                >
                  <option value="">Automatique</option>
                  {products.filter(isInStock).map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      </section>

      {!loading && visible.length === 0 && (
        <p className="rounded-xl bg-white p-10 text-center text-muted">Aucune tenue à afficher.</p>
      )}

      <ul className="space-y-2">
        {visible.map(product => {
          const isAvailable = product.available !== false;
          return (
            <li key={product._id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white shadow-sm p-3">
              <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-paper">
                <Media src={product.images?.[0]} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-[10rem] flex-1">
                <p className="font-medium">{product.title}</p>
                <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                <p className="text-xs text-muted">
                  {[isConfection(product) ? "Sur commande" : product.inStock ? "En stock" : "Prêt à porter", ...(typeof product.quantity === "number" ? [`${product.quantity} pièces`] : []), categoryName(product.category) || "Sans rubrique"].join(" · ")}
                </p>
              </div>
              {isInStock(product) && (
                <button
                  type="button"
                  onClick={() => patchProduct({ _id: product._id, renew: true }, "Impossible de remettre cette tenue en Nouveautés.")}
                  title={`Remettre ${NEW_ARRIVAL_DAYS} jours dans Nouveautés`}
                  className={`inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-xs font-semibold ${isNewArrival(product) ? "bg-red-50 text-brand-dark" : "border border-line hover:border-ink"}`}
                >
                  <Sparkles size={15} />
                  {isNewArrival(product) ? `Nouveauté, ${daysLeft(product)} j` : "Remettre en Nouveautés"}
                </button>
              )}
              <button
                type="button"
                onClick={() => patchProduct({ _id: product._id, featured: !product.featured }, "Impossible de modifier l'article du moment.")}
                aria-pressed={Boolean(product.featured)}
                className={`inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-xs font-semibold ${product.featured ? "bg-ink text-white" : "border border-line hover:border-ink"}`}
              >
                <Star size={15} fill={product.featured ? "currentColor" : "none"} />
                Article du moment
              </button>
              <button
                type="button"
                onClick={() => toggleAvailability(product)}
                disabled={togglingId === product._id}
                title="Changer la disponibilité"
                className={`h-11 rounded-full px-4 text-xs font-semibold disabled:opacity-50 ${isAvailable ? "bg-green-50 text-green-800" : "bg-red-50 text-brand-dark"}`}
              >
                {isAvailable ? "Disponible" : "Épuisée"}
              </button>
              <div className="flex">
                <Link href={'/admin/products/edit/' + product._id} aria-label={`Modifier ${product.title}`} className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-paper hover:text-ink">
                  <Pencil size={18} />
                </Link>
                <button onClick={() => deleteProduct(product)} aria-label={`Supprimer ${product.title}`} className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-paper hover:text-brand">
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
