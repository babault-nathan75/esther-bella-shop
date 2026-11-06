"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Media from "@/components/Media";
import { formatPrice, isConfection, isInStock, isNewArrival, isOrderable, isVideo, stockLeft } from "@/lib/shop";

const BADGE = "rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm md:text-xs";

export default function ProductCard({ product, eager = false, showStock = false }) {
  const soldOut = !isOrderable(product);
  const left = stockLeft(product);
  const secondImage = !soldOut && product.images?.slice(1).find((src) => !isVideo(src));

  return (
    <Link
      href={`/product/${product._id}`}
      className="group rise relative block rounded-[1.25rem] bg-white p-1.5 shadow-[0_2px_14px_rgba(0,0,0,0.07)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(228,21,27,0.2)] hover:ring-brand/50 active:scale-[0.98] md:p-2"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-paper">
        <Media
          src={product.images?.[0]}
          alt={product.title}
          eager={eager}
          className={`h-full w-full object-cover transition-all duration-700 ${soldOut ? "opacity-50 grayscale" : "group-hover:scale-105"} ${secondImage ? "md:group-hover:opacity-0" : ""}`}
        />
        {/* Au survol, la deuxième photo de la tenue */}
        {secondImage && (
          <Media src={secondImage} alt="" className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 md:block" />
        )}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {!soldOut && product.featured && <span className={`${BADGE} bg-ink text-white`}>Article du moment</span>}
          {soldOut && <span className={`${BADGE} bg-ink text-white`}>Épuisé</span>}
          {isNewArrival(product) && <span className={`${BADGE} bg-brand text-white`}>Nouveau</span>}
          {!soldOut && isConfection(product) && <span className={`${BADGE} bg-white text-ink`}>Sur commande</span>}
        </div>
        {showStock && isInStock(product) && (
          <span className={`${BADGE} absolute bottom-2 left-2 bg-black/75 text-white backdrop-blur-sm`}>
            {left !== null ? `${left} en stock` : "En stock"}
          </span>
        )}
        <span aria-hidden="true" className="absolute bottom-2 right-2 hidden h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-brand text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="px-2 pb-2 pt-3">
        <h3 className={`line-clamp-2 min-h-[2.5em] font-serif text-[15px] font-semibold leading-tight transition-colors group-hover:text-brand md:text-lg ${soldOut ? "text-muted" : "text-ink"}`}>{product.title}</h3>
        <p className={`mt-1 text-sm font-bold transition-colors group-hover:text-brand md:text-base ${soldOut ? "text-muted line-through" : "text-ink"}`}>{formatPrice(product.price)}</p>
        {!soldOut && isConfection(product) && product.leadTime && (
          <p className="mt-0.5 text-xs text-muted">Prête en {product.leadTime}</p>
        )}
      </div>
    </Link>
  );
}

export function ProductGrid({ products, showStock = false }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} eager={index < 4} showStock={showStock} />
      ))}
    </div>
  );
}
