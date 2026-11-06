"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Scissors, ShieldCheck, Sparkles, Star, Truck, Wallet, Zap, Shirt } from "lucide-react";
import Media from "@/components/Media";
import SnapGallery from "@/components/SnapGallery";
import { ProductGrid } from "@/components/ProductCard";
import { useCatalog } from "@/context/CatalogContext";
import { formatPrice, isConfection, isNewArrival, isOrderable, isStockListed, newestInStock } from "@/lib/shop";

function SectionTitle({ eyebrow, title, href }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="font-script text-2xl leading-none text-brand md:text-3xl">{eyebrow}</p>
        <h2 className="mt-1 font-serif text-3xl font-bold md:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold hover:text-brand">
          Tout voir <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export default function HomeView() {
  const { products, categories, zones } = useCatalog();
  const inStock = newestInStock(products);
  // Les trois dernières publications : la plus récente au milieu, puis à gauche, puis à droite.
  // Elles restent ici même après leur semaine, tant qu'aucune nouvelle ne les remplace.
  // L'admin peut imposer une tenue à chaque place ; les places libres restent automatiques.
  const pinned = (slot) => inStock.find((p) => p.heroSlot === slot);
  const autoPieces = inStock.filter((p) => !["left", "center", "right"].includes(p.heroSlot));
  const heroCenter = pinned("center") || autoPieces.shift();
  const heroLeft = pinned("left") || autoPieces.shift();
  const heroRight = pinned("right") || autoPieces.shift();
  const heroPieces = [heroLeft, heroCenter, heroRight].filter(Boolean);
  const spotlight = products.find((p) => p.featured === true && isOrderable(p));
  const readyToWear = inStock.filter((p) => !isStockListed(p));
  const confection = products.filter((p) => isConfection(p) && isOrderable(p));
  const lowestDelivery = zones.length ? Math.min(...zones.map((z) => z.price)) : null;
  const deliveryText = lowestDelivery !== null ? `Livraison à Abidjan dès ${formatPrice(lowestDelivery)}` : "Livraison à Abidjan";
  const band = [deliveryText, "Commande en quelques instants", "Mobile Money ou espèces", "Tenues faites à vos mesures"];
  const universes = [
    { href: "/nouveautes", title: "Nouveautés", text: "Les exclusivités de la semaine", Icon: Sparkles, cover: inStock.find(isNewArrival)?.images?.[0] || inStock[0]?.images?.[0] },
    { href: "/shop", title: "Prêt à porter", text: "Notre sélection", Icon: Shirt, cover: readyToWear[1]?.images?.[0] || readyToWear[0]?.images?.[0] },
    { href: "/en-stock", title: "En stock", text: "Disponible tout de suite", Icon: Zap, cover: inStock.find(isStockListed)?.images?.[0] || readyToWear[2]?.images?.[0] },
    { href: "/confection", title: "Sur commande", text: "Fait à vos mesures", Icon: Scissors, cover: confection[0]?.images?.[0] || readyToWear[3]?.images?.[0] },
  ];
  const liveCategories = categories.map((cat) => ({
    ...cat,
    cover: cat.image || products.find((p) => p.category === cat._id && isOrderable(p))?.images?.[0],
  }));

  return (
    <div>
      {/* --- HERO --- */}
      <section className="relative flex min-h-[calc(100svh-5rem)] items-end overflow-hidden bg-ink text-white md:block md:min-h-0">
        {/* Mobile : les dernières tenues en plein écran, à faire glisser au pouce */}
        {inStock.length > 0 && (
          <div className="absolute inset-0 md:hidden">
            <SnapGallery
              className="h-full"
              imageClassName="h-full"
              items={[heroCenter, heroLeft, heroRight].filter(Boolean).map((p) => ({ key: p._id, src: p.images?.[0], alt: p.title }))}
              dotsClassName="top-4"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
          </div>
        )}
        <div aria-hidden="true" className="absolute -right-32 -top-32 hidden md:block h-[32rem] w-[32rem] rounded-full bg-brand/30 blur-[120px]" />
        <div aria-hidden="true" className="absolute -bottom-40 -left-20 hidden md:block h-80 w-80 rounded-full bg-brand/15 blur-[100px]" />

        <div className="pointer-events-none relative w-full md:pointer-events-auto mx-auto grid max-w-7xl items-center gap-10 px-4 pb-28 pt-10 md:grid-cols-[1fr_1.1fr] md:px-6 md:py-14">
          <div className="rise">
            <p className="font-script text-4xl text-red-400 md:text-5xl">Tout juste arrivé</p>
            <h1 className="mt-2 font-serif text-[3rem] font-bold leading-[1.02] md:text-6xl lg:text-7xl">
              Les nouveautés sont <em className="font-serif text-brand">arrivées.</em>
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/70">
              Choisissez votre tenue et commandez en quelques instants, directement ici.
            </p>
            <div className="pointer-events-auto mt-6 flex flex-col gap-2.5 sm:flex-row md:mt-8 md:gap-3">
              <Link href="/shop" className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand active:scale-[0.98] px-7 font-semibold transition-colors hover:bg-brand-dark">
                Voir le prêt à porter <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/confection" className="inline-flex h-13 items-center justify-center rounded-full border border-white/30 active:scale-[0.98] px-7 font-semibold transition-colors hover:bg-white hover:text-ink">
                Faire confectionner
              </Link>
            </div>
          </div>

          {heroPieces.length > 0 && (
            <div className="hidden items-center gap-2.5 md:grid md:gap-4" style={{ gridTemplateColumns: heroPieces.length === 3 ? "1fr 1.25fr 1fr" : `repeat(${heroPieces.length}, minmax(0, 1fr))` }}>
              {heroPieces.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className={`group relative block overflow-hidden rounded-[1.5rem] ring-1 transition-transform duration-500 hover:-translate-y-2 ${product._id === heroCenter?._id ? "ring-brand/70 shadow-[0_30px_80px_rgba(228,21,27,0.45)]" : "ring-white/20 md:mt-12"}`}
                >
                  <Media src={product.images?.[0]} alt={product.title} eager className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/85 to-transparent p-3 pt-10 text-sm md:block">
                    <span className="block truncate font-medium">{product.title}</span>
                    <span className="font-bold">{formatPrice(product.price)}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- BANDEAU --- */}
      <div className="overflow-hidden bg-brand py-3 text-sm font-semibold text-white" aria-label={band.join(", ")}>
        <div className="marquee flex w-max" aria-hidden="true">
          {[...band, ...band, ...band, ...band].map((text, index) => (
            <span key={index} className="flex items-center gap-8 pr-8 whitespace-nowrap">{text}<span>✦</span></span>
          ))}
        </div>
      </div>

      {/* --- LES QUATRE UNIVERS --- */}
      <section aria-label="Nos univers" className="bg-ink pb-3 pt-3 md:pb-5 md:pt-5">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2.5 px-2.5 md:grid-cols-4 md:gap-4 md:px-6">
          {universes.map(({ href, title, text, Icon, cover }) => (
            <Link key={href} href={href} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 active:scale-[0.98]">
              {cover && <Media src={cover} alt="" className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3 pt-16 text-white md:p-5 md:pt-24">
                <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand"><Icon size={17} /></span>
                <span className="block font-serif text-xl font-bold leading-tight md:text-3xl">{title}</span>
                <span className="mt-0.5 block text-xs text-white/75 md:text-sm">{text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- ARTICLE DU MOMENT --- */}
      {spotlight && (
        <section aria-label="Article du moment" className="relative overflow-hidden bg-gradient-to-b from-paper to-white">
          <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-10 md:grid-cols-2 md:gap-14 md:px-6 md:py-20">
            <Link href={`/product/${spotlight._id}`} className="group block overflow-hidden rounded-3xl bg-white p-2 shadow-xl ring-1 ring-line md:p-3">
              <div className="overflow-hidden rounded-2xl">
                <Media src={spotlight.images?.[0]} alt={spotlight.title} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </Link>
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white"><Star size={15} fill="currentColor" /> Article du moment</p>
              <p className="mt-4 font-script text-3xl text-brand md:text-4xl">Notre coup de cœur</p>
              <h2 className="mt-1 font-serif text-4xl font-bold leading-tight md:text-6xl">{spotlight.title}</h2>
              <p className="mt-3 text-2xl font-bold">{formatPrice(spotlight.price)}</p>
              {spotlight.description && <p className="mt-3 line-clamp-4 max-w-md leading-relaxed text-muted">{spotlight.description}</p>}
              <Link href={`/product/${spotlight._id}`} className="group mt-6 inline-flex h-13 items-center gap-2 rounded-full bg-ink px-7 font-semibold text-white transition-colors hover:bg-brand active:scale-[0.98]">
                Découvrir <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* --- PRÊT À PORTER --- */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <SectionTitle eyebrow="Notre sélection" title="Prêt à porter" href="/shop" />
        {readyToWear.length > 0 ? (
          <ProductGrid products={readyToWear.slice(0, 8)} />
        ) : (
          <p className="rounded-2xl bg-paper p-8 text-center text-muted">Les prochaines tenues apparaîtront ici dès leur mise en ligne.</p>
        )}
      </section>

      {/* --- RUBRIQUES --- */}
      {liveCategories.length > 0 && (
        <section className="bg-paper py-12 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <SectionTitle eyebrow="Explorer" title="Nos rubriques" />
            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:px-0 lg:grid-cols-4">
              {liveCategories.map((cat) => (
                <Link key={cat._id} href={`/category/${cat._id}`} className="group relative block aspect-[4/5] w-[68vw] shrink-0 snap-center overflow-hidden rounded-2xl bg-ink sm:w-[40vw] md:w-auto">
                  {cat.cover && <Media src={cat.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/85 to-transparent p-4 pt-16 text-white">
                    <span className="font-serif text-xl font-semibold leading-tight">{cat.name}</span>
                    <ArrowUpRight size={20} className="shrink-0 transition-colors group-hover:text-red-400" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --- CONFECTION --- */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
        <div className="relative grid overflow-hidden rounded-3xl bg-[#141210] text-white md:grid-cols-2">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-4 bg-[#f6f1e7] md:col-span-2"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, #141210 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, #e4151b 0 2px, transparent 2px 60px)", backgroundSize: "100% 40%, 100% 75%", backgroundRepeat: "no-repeat" }}
          />
          <div className="p-7 pt-10 md:p-14">
            <Scissors className="text-brand" size={28} />
            <h2 className="mt-4 font-serif text-3xl font-bold md:text-5xl">À confectionner pour vous</h2>
            <p className="mt-3 max-w-md text-white/70">Choisissez un modèle, indiquez vos mesures, nous le réalisons.</p>
            <Link href="/confection" className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-ink transition-colors hover:bg-brand hover:text-white">
              Découvrir les modèles <ArrowRight size={18} />
            </Link>
          </div>
          {confection.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5 p-1.5 pt-5">
              {confection.slice(0, 2).map((product) => (
                <Link key={product._id} href={`/product/${product._id}`} className="block overflow-hidden rounded-2xl">
                  <Media src={product.images?.[0]} alt={product.title} className="h-full max-h-96 w-full object-cover transition-transform duration-700 hover:scale-105" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- PRÉSENTATION : le texte que lisent aussi les moteurs de recherche --- */}
      <section className="mx-auto max-w-3xl px-4 pb-12 text-center md:px-6">
        <h2 className="font-serif text-2xl font-bold md:text-3xl">Votre boutique de mode femme à Abidjan</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Esther Bella Shop vous propose du prêt à porter, des tenues disponibles en stock et des modèles confectionnés sur commande,
          à vos mesures. Commandez en ligne et faites-vous livrer à Abobo, Adjamé, Attécoubé, Cocody, Koumassi, Marcory,
          au Plateau, à Port-Bouët, à Treichville ou à Yopougon. Et si vous êtes en dehors d&apos;Abidjan, contactez-nous pour connaître les options d&apos;expédition.
        </p>
      </section>

      {/* --- REPÈRES PRATIQUES --- */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-9 sm:grid-cols-3 md:px-6">
          {[
            [Truck, "Livraison à Abidjan", lowestDelivery !== null ? `À partir de ${formatPrice(lowestDelivery)}` : "Tarif selon votre commune"],
            [Wallet, "Paiement simple", "Mobile Money ou espèces"],
            [ShieldCheck, "Commande suivie", "Suivez chaque étape en ligne"],
          ].map(([Icon, title, text]) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white"><Icon size={20} /></span>
              <p className="text-sm"><strong className="block">{title}</strong><span className="text-muted">{text}</span></p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
