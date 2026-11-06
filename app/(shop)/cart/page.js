"use client";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { AlertCircle, ArrowRight, ShoppingBag, Trash2, Truck } from "lucide-react";
import Link from "next/link";
import CheckoutSteps from "@/components/CheckoutSteps";
import Media from "@/components/Media";
import { useCatalog } from "@/context/CatalogContext";
import { formatPrice, isConfection, isOrderable } from "@/lib/shop";

export default function CartPage() {
  const { cartProducts, removeProduct, ready } = useContext(CartContext);
  const { zones } = useCatalog();

  if (!ready) return <div className="min-h-[60vh]" />;

  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-brand"><ShoppingBag size={34} /></span>
        <h1 className="mt-5 font-serif text-3xl font-bold md:text-4xl">Votre panier est vide</h1>
        <p className="mt-2 text-muted">Votre prochaine tenue vous attend.</p>
        <Link href="/nouveautes" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 font-semibold text-white hover:bg-brand-dark">
          Voir les nouveautés <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const hasSoldOut = cartProducts.some((item) => !isOrderable(item));
  const subtotal = cartProducts.filter(isOrderable).reduce((sum, item) => sum + (item.price || 0), 0);
  const lowestDelivery = zones.length ? Math.min(...zones.map((z) => z.price)) : null;

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8 pb-28 md:px-6 md:py-12">
        <CheckoutSteps current={0} />
        <h1 className="mb-6 font-serif text-4xl font-bold md:text-5xl">Votre panier</h1>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            {hasSoldOut && (
              <p role="alert" className="mb-4 flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-brand-dark">
                <AlertCircle size={18} className="shrink-0" />
                Une pièce de votre panier vient d&apos;être épuisée. Retirez-la pour continuer.
              </p>
            )}

            <ul className="space-y-3">
              {cartProducts.map((item) => {
                const soldOut = !isOrderable(item);
                return (
                  <li key={item.cartId} className="flex gap-4 rounded-2xl border border-line bg-white p-3 shadow-sm">
                    <Link href={`/product/${item._id}`} className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-paper md:h-40 md:w-32">
                      <Media src={item.images?.[0]} alt={item.title} className={`h-full w-full object-cover ${soldOut ? "opacity-50 grayscale" : ""}`} />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${item._id}`} className={`font-serif text-lg font-semibold leading-snug hover:text-brand ${soldOut ? "text-muted line-through" : ""}`}>{item.title}</Link>
                        <button onClick={() => removeProduct(item.cartId)} aria-label={`Retirer ${item.title}`} className="-mr-1 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-paper hover:text-brand">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                        {item.selectedSize && <span className="rounded-full bg-paper px-2.5 py-1">Taille : {item.selectedSize}</span>}
                        {isConfection(item) && <span className="rounded-full bg-paper px-2.5 py-1">Sur commande{item.leadTime ? `, ${item.leadTime}` : ""}</span>}
                        {soldOut && <span className="rounded-full bg-ink px-2.5 py-1 font-semibold text-white">Épuisé</span>}
                      </div>
                      {item.notes && <p className="mt-2 line-clamp-2 text-sm text-muted">{item.notes}</p>}
                      <p className="mt-auto pt-2 text-lg font-bold">{formatPrice(item.price)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="rounded-2xl bg-ink p-6 text-white lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl font-semibold">Total du panier</h2>
            <div className="mt-5 flex items-end justify-between gap-3 border-b border-white/15 pb-4">
              <span className="text-white/70">Sous-total</span>
              <span className="text-2xl font-bold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-4 flex gap-2 text-sm text-white/70">
              <Truck size={18} className="shrink-0" />
              {lowestDelivery !== null ? `Livraison à partir de ${formatPrice(lowestDelivery)} sur Abidjan.` : "Livraison calculée selon votre lieu."}
            </p>
            {hasSoldOut ? (
              <p className="mt-5 flex h-13 items-center justify-center rounded-xl bg-white/15 text-center text-sm font-semibold">Retirez les pièces épuisées</p>
            ) : (
              <Link href="/checkout" className="group mt-5 flex h-13 items-center justify-center gap-2 rounded-xl bg-brand font-semibold transition-colors hover:bg-brand-dark">
                Passer la commande <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            )}
            <Link href="/shop" className="mt-2 flex min-h-11 items-center justify-center text-sm font-medium text-white/70 hover:text-white">
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
