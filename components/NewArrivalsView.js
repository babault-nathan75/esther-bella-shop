"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ClawPoster, { hasPoster } from "@/components/ClawPoster";
import Media from "@/components/Media";
import { useCatalog } from "@/context/CatalogContext";
import { NEW_ARRIVAL_DAYS, arrivalTime, formatPrice, isNewArrival, newestInStock, stockLeft } from "@/lib/shop";

const BAND = ["Inédit", "Exclusif", "À ne pas manquer", `${NEW_ARRIVAL_DAYS} jours seulement`];

// Heure lue après le montage : le rendu serveur et le premier rendu navigateur restent identiques
function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);
  return now;
}

const remaining = (product, now) => Math.max(0, arrivalTime(product) + NEW_ARRIVAL_DAYS * 86400000 - now);

function Countdown({ product, now }) {
  const ms = now === null ? null : remaining(product, now);
  const units = ms === null ? [] : [
    [Math.floor(ms / 86400000), "jours"],
    [Math.floor(ms / 3600000) % 24, "heures"],
    [Math.floor(ms / 60000) % 60, "min"],
    [Math.floor(ms / 1000) % 60, "sec"],
  ];
  return (
    <div className="min-h-[4.5rem]" role="timer" aria-label="Temps restant dans les Nouveautés">
      {ms !== null && (
        <dl className="flex gap-2">
          {units.map(([value, label]) => (
            <div key={label} className="w-16 rounded-xl border border-white/15 bg-white/5 py-2 text-center">
              <dd className="font-serif text-2xl font-bold tabular-nums">{String(value).padStart(2, "0")}</dd>
              <dt className="text-[11px] text-white/60">{label}</dt>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function daysLabel(product, now) {
  if (now === null) return null;
  const days = Math.ceil(remaining(product, now) / 86400000);
  return days <= 1 ? "Dernier jour" : `Encore ${days} jours`;
}

function stockLabel(left) {
  if (left === null) return null;
  return left === 1 ? "Dernière pièce" : `Plus que ${left} pièces`;
}

const arrivalDate = (product) =>
  new Date(arrivalTime(product)).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

// Une salle de musée : l'œuvre encadrée sous son faisceau, le cartel posé à côté
function Artwork({ product, now, number, featured, reversed }) {
  const left = stockLeft(product);
  const href = `/product/${product._id}`;

  return (
    <article className={`group relative grid items-center gap-8 py-14 md:gap-16 md:py-24 ${featured ? "md:grid-cols-[1.25fr_1fr]" : "md:grid-cols-[1fr_1fr]"}`}>
      <div className={`relative ${reversed ? "md:order-2" : ""}`}>
        {/* Faisceau du projecteur sur le mur */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -bottom-10 -top-24 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
          style={{ background: "radial-gradient(ellipse 60% 75% at 50% 0%, rgba(255,244,224,0.3), rgba(255,244,224,0.07) 55%, transparent 75%)" }}
        />
        <Link href={href} aria-label={`Voir ${product.title}`} className={`relative mx-auto block ${featured ? "max-w-xl" : "max-w-md"}`}>
          {/* Cadre, puis passe-partout, puis l'œuvre */}
          <div
            className="p-2.5 transition-transform duration-700 group-hover:-translate-y-1 md:p-3.5"
            style={{
              background: "linear-gradient(145deg, #3a3a3a, #0b0b0b 45%, #2a2a2a)",
              boxShadow: "0 40px 70px rgba(0,0,0,0.85), 0 8px 18px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.14)",
            }}
          >
            <div className="bg-[#f6f1e7] p-5 md:p-9" style={{ boxShadow: "inset 0 3px 10px rgba(0,0,0,0.45)" }}>
              <div className="overflow-hidden" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.3)" }}>
                <Media src={product.images?.[0]} alt={product.title} eager={featured} className="aspect-[4/5] w-full object-cover" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Cartel */}
      <div className={`relative ${reversed ? "md:order-1 md:text-right" : ""}`}>
        <p className="font-serif text-lg italic text-red-400">N° {String(number).padStart(2, "0")}{featured ? ", la toute dernière" : ""}</p>
        <h2 className={`mt-2 font-serif font-bold leading-tight ${featured ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"}`}>{product.title}</h2>
        <div className={`mt-5 h-px w-16 bg-brand ${reversed ? "md:ml-auto" : ""}`} />
        <p className="mt-5 text-sm leading-relaxed text-white/60">
          Esther Bella Shop, Abidjan
          <br />
          Exposée depuis le {arrivalDate(product)}
          {!featured && daysLabel(product, now) && <><br />{daysLabel(product, now)}</>}
        </p>
        <p className="mt-4 text-2xl font-bold">{formatPrice(product.price)}</p>
        {stockLabel(left) && <p className="mt-1 font-semibold text-red-400">{stockLabel(left)}</p>}
        {featured && (
          <>
            <p className="mb-3 mt-7 text-sm text-white/60">Quitte les Nouveautés dans</p>
            <Countdown product={product} now={now} />
          </>
        )}
        <Link href={href} className="group/cta mt-7 inline-flex h-13 items-center gap-2 rounded-full bg-brand px-7 font-semibold transition-colors hover:bg-brand-dark">
          Je la veux <ArrowRight size={20} className="transition-transform group-hover/cta:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export default function NewArrivalsView() {
  const { products } = useCatalog();
  const now = useNow();
  const allPieces = newestInStock(products).filter(isNewArrival);
  // Les tenues à affiche sont regroupées par collection, les autres restent exposées une à une
  const pieces = allPieces.filter((p) => !hasPoster(p));
  const posters = allPieces.filter(hasPoster);
  const collections = [...new Set(posters.map((p) => p.poster.collection))];

  return (
    <div className="relative overflow-hidden bg-ink pb-16 text-white">
      <div aria-hidden="true" className="absolute left-1/2 top-0 h-[34rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/40 blur-[130px]" />

      <header className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 text-center md:px-6 md:pt-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand/60 bg-brand/15 px-4 py-1.5 text-sm font-semibold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand" /> Accès exclusif
        </p>
        <p className="mt-5 font-script text-4xl text-red-400 md:text-5xl">Inédit, tout juste arrivé</p>
        <h1 className="font-serif text-6xl font-black leading-none tracking-tight sm:text-7xl md:text-[9rem]">Nouveautés</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
          A ne surtout pas rater
        </p>
      </header>

      <div className="relative overflow-hidden border-y border-white/15 py-3" aria-hidden="true">
        <div className="marquee flex w-max font-serif text-lg italic">
          {[...BAND, ...BAND, ...BAND, ...BAND, ...BAND, ...BAND].map((text, index) => (
            <span key={index} className="flex items-center gap-8 whitespace-nowrap pr-8">{text}<span className="text-brand">✦</span></span>
          ))}
        </div>
      </div>

      {collections.map((name) => (
        <section key={name || "affiches"} className="relative mx-auto max-w-7xl px-4 pt-12 md:px-6 md:pt-20">
          {name && (
            <div className="mb-7 text-center">
              <p className="font-script text-3xl text-red-400 md:text-4xl">La collection</p>
              <h2 className="font-serif text-5xl font-black md:text-8xl">{name}</h2>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {posters.filter((p) => p.poster.collection === name).map((p) => <ClawPoster key={p._id} product={p} compact />)}
          </div>
        </section>
      ))}

      {allPieces.length > 0 ? (
        <div className="relative mx-auto max-w-7xl divide-y divide-white/10 px-6">
          {pieces.map((product, index) => (
            <Artwork key={product._id} product={product} now={now} number={index + 1} featured={index === 0} reversed={index % 2 === 1} />
          ))}
        </div>
      ) : (
        <section className="relative mx-auto max-w-xl px-6 py-20 text-center">
          <h2 className="font-serif text-3xl font-bold md:text-5xl">La prochaine exclusivité se prépare</h2>
          <p className="mt-3 text-white/70">Soyez prêtes mes clients caviars</p>
          <Link href="/shop" className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-ink transition-colors hover:bg-brand hover:text-white">
            Voir le prêt à porter <ArrowRight size={18} />
          </Link>
        </section>
      )}
    </div>
  );
}
