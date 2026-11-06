import Link from "next/link";
import Media from "@/components/Media";
import { formatPrice } from "@/lib/shop";

// Griffure déchirée : queues très fines, ventre large, bords hérissés d'éclats.
// Tirage à graine fixe : même dessin côté serveur et navigateur.
function randomFrom(seed) {
  let state = seed * 2654435761 % 4294967296;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function slashPath(x0, y0, x1, y1, width, seed) {
  const random = randomFrom(seed);
  const steps = 150;
  const length = Math.hypot(x1 - x0, y1 - y0);
  const [ux, uy] = [(x1 - x0) / length, (y1 - y0) / length];
  const [nx, ny] = [-uy, ux];
  const belly = 0.42 + random() * 0.16;
  const edge = (side) => {
    const points = [];
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const profile = t < belly ? t / belly : (1 - t) / (1 - belly);
      const half = width * profile ** 1.7;
      // Un éclat de temps en temps, couché dans le sens du coup de griffe
      const shard = random() < 0.16 ? 1.15 + random() * 0.55 : 0.72 + random() * 0.28;
      const along = length * t + (shard > 1 ? length * 0.009 : 0);
      const offset = side * half * shard;
      points.push(`${(x0 + ux * along + nx * offset).toFixed(1)} ${(y0 + uy * along + ny * offset).toFixed(1)}`);
    }
    return points;
  };
  return `M${x0} ${y0}L${edge(1).join("L")}L${x1} ${y1}L${edge(-1).reverse().join("L")}Z`;
}

// Un seul coup de griffe, quatre griffes : du bas à gauche vers le haut à droite
const SLASHES = [
  [10, 330, 170, 45, 7],
  [40, 470, 265, 50, 14],
  [150, 495, 345, 75, 13],
  [225, 515, 395, 130, 12],
].map(([x0, y0, x1, y1, width], index) => slashPath(x0, y0, x1, y1, width, index + 3));

function ClawMarks({ color }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <g fill={color}>
        {SLASHES.map((d) => <path key={d} d={d} />)}
      </g>
    </svg>
  );
}

// Noir ou blanc selon le fond choisi par l'admin, pour rester lisible
function readableText(hex) {
  const n = parseInt(String(hex).replace("#", ""), 16);
  const luminance = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return luminance > 0.55 ? "#000000" : "#ffffff";
}

export function hasPoster(product) {
  return product?.poster?.enabled === true;
}

export default function ClawPoster({ product, compact = false }) {
  const { collection, title, text, colorName, clawColor = "#7ec8e3", backgroundColor = "#ffffff" } = product.poster;
  const ink = readableText(backgroundColor);
  const photo = (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/70">
      <Media src={product.images?.[0]} alt={product.title} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
  );

  if (compact) {
    return (
      <Link href={`/product/${product._id}`} className="group rise relative block overflow-hidden rounded-3xl p-4 md:p-6" style={{ backgroundColor, color: ink }}>
        <ClawMarks color={clawColor} />
        <div className="relative">
          {collection && <p className="font-serif text-sm italic">Collection {collection}</p>}
          <h3 className="mb-3 mt-0.5 font-serif text-xl font-bold leading-tight md:text-3xl">{title || colorName || product.title}</h3>
          {photo}
          <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 font-semibold">
            <span className="min-w-0 truncate text-sm">{product.title}</span>
            <span className="font-bold">{formatPrice(product.price)}</span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <section aria-label={`Affiche de ${product.title}`} className="group relative overflow-hidden rounded-3xl" style={{ backgroundColor, color: ink }}>
      <ClawMarks color={clawColor} />
      <div className="relative grid items-center gap-6 p-6 md:grid-cols-2 md:gap-12 md:p-14">
        <div>
          {collection && <p className="font-serif text-xl italic md:text-2xl">Collection {collection}</p>}
          <h2 className="mt-1 font-serif text-5xl font-black leading-none md:text-7xl">{title || product.title}</h2>
          {colorName && <p className="mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold" style={{ backgroundColor: ink, color: backgroundColor }}>{colorName}</p>}
          {text && <p className="mt-4 max-w-md whitespace-pre-line text-lg font-medium leading-relaxed">{text}</p>}
          <p className="mt-4 text-2xl font-bold">{formatPrice(product.price)}</p>
        </div>
        <div className="mx-auto w-full max-w-sm">{photo}</div>
      </div>
    </section>
  );
}
