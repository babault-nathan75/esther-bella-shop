"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown, Clock, Ruler, Share2, ShieldCheck, ShoppingBag, Truck, Wallet } from "lucide-react";
import BackLink from "@/components/BackLink";
import Media from "@/components/Media";
import ClawPoster, { hasPoster } from "@/components/ClawPoster";
import ProductCard from "@/components/ProductCard";
import SnapGallery from "@/components/SnapGallery";
import { CartContext } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { CUSTOM_SIZE, formatPrice, isConfection, isNewArrival, isOrderable, isStockListed, newestInStock, stockLeft } from "@/lib/shop";

export default function ProductClient({ product: initialProduct }) {
  const { addProduct, cartProducts } = useContext(CartContext);
  const { products, categories, zones } = useCatalog();
  const router = useRouter();

  // La fiche suit le catalogue en direct : un passage en rupture s'affiche sans recharger
  const product = products.find((p) => p._id === initialProduct._id) || initialProduct;
  const confection = isConfection(product);
  const soldOut = !isOrderable(product);
  const left = stockLeft(product);
  const sizes = [...(product.sizes || []), ...(confection ? [CUSTOM_SIZE] : [])];

  const [selectedSize, setSelectedSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [notes, setNotes] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState("");

  const images = product.images || [];
  const showPoster = hasPoster(product) && isNewArrival(product);
  const otherColors = showPoster && product.poster.collection
    ? products.filter((p) => p._id !== product._id && hasPoster(p) && isOrderable(p) && p.poster.collection === product.poster.collection)
    : [];
  const category = categories.find((c) => c._id === product.category);
  // Arrivée directe (Google, WhatsApp) : le retour mène à l'univers de la tenue
  const fallback = isNewArrival(product) ? { href: "/nouveautes", label: "Nouveautés" }
    : confection ? { href: "/confection", label: "Sur commande" }
    : isStockListed(product) ? { href: "/en-stock", label: "En stock" }
    : category ? { href: `/category/${category._id}`, label: category.name }
    : { href: "/shop", label: "Prêt à porter" };
  const lowestDelivery = zones.length ? Math.min(...zones.map((z) => z.price)) : null;
  const related = (soldOut ? newestInStock(products) : products.filter((p) => p.category === product.category && isOrderable(p)))
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  const addToCart = () => {
    if (soldOut) return false;
    if (sizes.length > 0 && !selectedSize) {
      setError("Veuillez choisir une taille.");
      return false;
    }
    if (selectedSize === CUSTOM_SIZE && !notes.trim()) {
      setError("Indiquez vos mesures pour une confection sur mesure.");
      return false;
    }
    if (left !== null && cartProducts.filter((item) => item._id === product._id).length >= left) {
      setError(`Il ne reste que ${left} pièce${left > 1 ? "s" : ""} en stock, déjà dans votre panier.`);
      return false;
    }
    setError("");
    addProduct(product, selectedSize, notes.trim());
    return true;
  };

  const handleAdd = () => {
    if (addToCart()) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 4000);
    }
  };

  const handleOrderNow = () => {
    if (addToCart()) router.push("/checkout");
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-32 md:px-6 md:pb-16 md:pt-4">
      <div className="absolute inset-x-3 top-3 z-20 flex items-center justify-between md:static md:mb-4">
        <BackLink
          fallbackHref={fallback.href}
          fallbackLabel={fallback.label}
          className="inline-flex min-h-11 items-center gap-1 rounded-full bg-white/90 px-3 text-sm font-medium shadow-md backdrop-blur-sm hover:text-brand md:-ml-2 md:bg-transparent md:px-2 md:text-muted md:shadow-none"
        />
        <button onClick={shareProduct} aria-label="Partager" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-paper md:bg-transparent md:shadow-none">
          <Share2 size={20} />
        </button>
      </div>

      <div className="grid md:grid-cols-[1.15fr_1fr] md:items-start md:gap-12 lg:gap-16">
        <div className="-mx-4 md:hidden">
          <SnapGallery
            imageClassName={`aspect-[4/5] ${soldOut ? "opacity-60 grayscale" : ""}`}
            items={(images.length ? images : [null]).map((src, index) => ({ key: `${src}-${index}`, src, alt: product.title }))}
            dotsClassName="bottom-9"
          />
        </div>
        <div className={`hidden md:grid md:gap-3 ${images.length > 1 ? "md:grid-cols-[5rem_1fr]" : ""}`}>
          <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl bg-paper shadow-xl ring-1 ring-black/5 ${images.length > 1 ? "order-2" : ""}`}>
            <Media
              src={images[activeImage] || images[0]}
              alt={product.title}
              eager
              className={`h-full w-full object-cover ${soldOut ? "opacity-60 grayscale" : ""}`}
            />
          </div>
          {images.length > 1 && (
            <div className="no-scrollbar order-1 flex max-h-[42rem] flex-col gap-2 overflow-y-auto">
              {images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setActiveImage(idx)}
                  aria-label={`Voir le visuel ${idx + 1}`}
                  aria-pressed={activeImage === idx}
                  className={`aspect-[4/5] w-full shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${activeImage === idx ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <Media src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative -mx-4 -mt-6 rounded-t-3xl bg-white px-4 pt-6 md:sticky md:top-32 md:mx-0 md:mt-0 md:rounded-none md:px-0 md:pt-0">
          {category && <Link href={`/category/${category._id}`} className="mb-1 inline-block font-script text-2xl text-brand md:text-3xl">{category.name}</Link>}
          <h1 className="font-serif text-4xl font-bold leading-[1.05] md:text-6xl">{product.title}</h1>
          <p className={`mt-4 text-3xl font-bold ${soldOut ? "text-muted line-through" : ""}`}>{formatPrice(product.price)}</p>

          {soldOut ? (
            <p className="mt-3 inline-block rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white">Épuisé</p>
          ) : confection ? (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-1.5 text-sm font-medium">
              <Clock size={16} className="text-brand" />
              Confectionnée sur commande{product.leadTime ? `, prête en ${product.leadTime}` : ""}
            </p>
          ) : (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-800"><Check size={16} /> {left !== null && isStockListed(product) ? `${left} en stock` : left === 1 ? "Dernière pièce" : "Disponible"}</p>
          )}

          {!soldOut && sizes.length > 0 && (
            <fieldset className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <legend className="text-sm font-semibold">Taille</legend>
                <Link href="/guide-tailles" className="inline-flex min-h-11 items-center gap-1 text-sm text-muted underline">
                  <Ruler size={14} /> Guide des tailles
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => { setSelectedSize(size); setError(""); }}
                    className={`h-12 min-w-14 rounded-full border px-5 text-sm font-semibold transition-all active:scale-95 ${selectedSize === size ? "border-brand bg-brand text-white shadow-md" : "border-line hover:border-ink"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {!soldOut && confection && (
            <div className="mt-5">
              <label htmlFor="notes" className="mb-2 block text-sm font-semibold">
                Vos mesures et précisions {selectedSize !== CUSTOM_SIZE && <span className="font-normal text-muted">(facultatif)</span>}
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => { setNotes(e.target.value); setError(""); }}
                placeholder="Poitrine, taille, hanches, longueur, couleur souhaitée…"
                className="field resize-none"
              />
            </div>
          )}

          {error && <p role="alert" className="mt-3 text-sm font-medium text-brand">{error}</p>}

          {!soldOut && (
            <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 rounded-t-3xl bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md md:static md:mt-6 md:rounded-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
              <button onClick={handleAdd} aria-label="Ajouter au panier" className="flex h-13 w-14 shrink-0 items-center justify-center gap-2 rounded-full border border-ink text-sm font-semibold transition-colors hover:bg-ink hover:text-white active:scale-[0.98] md:w-auto md:flex-1">
                {isAdded ? <Check size={20} /> : <ShoppingBag size={20} />}
                <span className="hidden md:inline">{isAdded ? "Ajouté" : "Ajouter au panier"}</span>
              </button>
              <button onClick={handleOrderNow} className="h-13 flex-1 rounded-full bg-brand text-sm font-semibold text-white shadow-[0_10px_25px_rgba(228,21,27,0.35)] transition-colors hover:bg-brand-dark active:scale-[0.98]">
                Commander<span className="md:hidden"> · {formatPrice(product.price)}</span>
              </button>
            </div>
          )}

          {isAdded && (
            <Link href="/cart" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand underline">
              Voir le panier
            </Link>
          )}

          {product.description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-muted">{product.description}</p>
          )}

          <ul className="mt-6 grid gap-2 rounded-2xl bg-paper p-4 text-sm">
            <li className="flex items-center gap-3"><Truck size={18} className="shrink-0 text-brand" /> {lowestDelivery !== null ? `Livraison à Abidjan dès ${formatPrice(lowestDelivery)}` : "Livraison à Abidjan"}</li>
            <li className="flex items-center gap-3"><Wallet size={18} className="shrink-0 text-brand" /> Wave, Orange Money, MTN, Moov ou espèces</li>
            <li className="flex items-center gap-3"><ShieldCheck size={18} className="shrink-0 text-brand" /> Commande suivie en ligne, étape par étape</li>
          </ul>

          <div className="mt-3 divide-y divide-line border-y border-line">
            <details className="group/d">
              <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between font-semibold">Confirmer ma commande <ChevronDown size={18} className="transition-transform group-open/d:rotate-180" /></summary>
              <p className="pb-4 text-sm leading-relaxed text-muted">Un dépôt d&apos;au moins 2 000 F confirme votre commande. <Link href="/confirmation" className="font-semibold text-brand underline">Voir les étapes</Link></p>
            </details>
            <details className="group/d">
              <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between font-semibold">Livraison et retours <ChevronDown size={18} className="transition-transform group-open/d:rotate-180" /></summary>
              <p className="pb-4 text-sm leading-relaxed text-muted">Tarifs selon votre lieu et conditions de retour. <Link href="/livraison-retours" className="font-semibold text-brand underline">En savoir plus</Link></p>
            </details>
          </div>
        </div>
      </div>

      {showPoster && (
        <div className="mt-10 md:mt-14">
          <ClawPoster product={product} />
          {otherColors.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 font-serif text-2xl font-bold">Les autres couleurs</h2>
              <div className="no-scrollbar flex gap-3 overflow-x-auto">
                {otherColors.map((p) => (
                  <Link key={p._id} href={`/product/${p._id}`} className="w-28 shrink-0 hover:text-brand">
                    <div className="overflow-hidden rounded-xl p-1.5" style={{ backgroundColor: p.poster.clawColor }}>
                      <Media src={p.images?.[0]} alt="" className="aspect-[3/4] w-full rounded-lg object-cover" />
                    </div>
                    <p className="mt-1 truncate text-sm font-medium">{p.poster.colorName || p.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-14 md:mt-24">
          <h2 className="mb-6 font-serif text-3xl font-bold md:text-5xl">{soldOut ? "Disponibles maintenant" : "Dans le même esprit"}</h2>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-5">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
