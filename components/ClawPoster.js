import Link from "next/link";
import Media from "@/components/Media";
import { formatPrice } from "@/lib/shop";

// Pelage de panthère : rosettes en anneaux brisés, cœur teinté, petites taches entre elles.
// Tirage à graine fixe : même dessin côté serveur et navigateur.
function randomFrom(seed) {
  let state = seed * 2654435761 % 4294967296;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function point(cx, cy, rx, ry, tilt, angle, scale) {
  const [x, y] = [Math.cos(angle) * rx * scale, Math.sin(angle) * ry * scale];
  return `${(cx + x * Math.cos(tilt) - y * Math.sin(tilt)).toFixed(1)} ${(cy + x * Math.sin(tilt) + y * Math.cos(tilt)).toFixed(1)}`;
}

// Un morceau d'anneau, plus épais au milieu et irrégulier
function arcPath(cx, cy, rx, ry, tilt, start, end, random) {
  const steps = 7;
  const thickness = 0.2 + random() * 0.14;
  const outer = [];
  const inner = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = start + (end - start) * t;
    const swell = thickness * (0.45 + Math.sin(Math.PI * t)) * (0.85 + random() * 0.3);
    outer.push(point(cx, cy, rx, ry, tilt, angle, 1 + swell));
    inner.unshift(point(cx, cy, rx, ry, tilt, angle, 1 - swell));
  }
  return `M${[...outer, ...inner].join("L")}Z`;
}

function rosette(cx, cy, random) {
  const rx = 15 + random() * 9;
  const ry = rx * (0.7 + random() * 0.25);
  const tilt = random() * Math.PI;
  const count = 3 + Math.floor(random() * 3);
  const first = random() * Math.PI * 2;
  const arcs = [];
  for (let i = 0; i < count; i++) {
    const share = (Math.PI * 2) / count;
    const start = first + share * i + random() * 0.12;
    arcs.push(arcPath(cx, cy, rx, ry, tilt, start, start + share * (0.62 + random() * 0.2), random));
  }
  return { center: { cx, cy, rx: rx * 0.72, ry: ry * 0.72, tilt: (tilt * 180) / Math.PI }, arcs };
}

function buildCoat() {
  const random = randomFrom(11);
  const rosettes = [];
  const spots = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 7; col++) {
      const x = col * 72 - 16 + (row % 2) * 36 + random() * 16 - 8;
      const y = row * 64 - 8 + random() * 16 - 8;
      rosettes.push(rosette(x, y, random));
      spots.push({ cx: x + 36 + random() * 8, cy: y + 4 + random() * 10, r: 2.5 + random() * 3 });
    }
  }
  return { rosettes, spots };
}

const COAT = buildCoat();

function PantherMarks({ color }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <g fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round">
        {COAT.rosettes.map(({ center, arcs }) => (
          <g key={`${center.cx}-${center.cy}`}>
            <ellipse cx={center.cx.toFixed(1)} cy={center.cy.toFixed(1)} rx={center.rx.toFixed(1)} ry={center.ry.toFixed(1)} transform={`rotate(${center.tilt.toFixed(1)} ${center.cx.toFixed(1)} ${center.cy.toFixed(1)})`} opacity="0.22" stroke="none" />
            {arcs.map((d) => <path key={d} d={d} />)}
          </g>
        ))}
        {COAT.spots.map(({ cx, cy, r }) => <circle key={`${cx}-${cy}`} cx={cx.toFixed(1)} cy={cy.toFixed(1)} r={r.toFixed(1)} stroke="none" />)}
      </g>
    </svg>
  );
}

// Orchidée originale : trois sépales fins, deux larges pétales, labelle au centre
const PETAL = "M0 0C-20 -14 -46 -50 -34 -82C-26 -102 26 -102 34 -82C46 -50 20 -14 0 0Z";
const SEPAL = "M0 0C-16 -30 -20 -76 0 -108C20 -76 16 -30 0 0Z";
const VEINS = "M0 -6L0 -90M0 -30L-18 -74M0 -30L18 -74M0 -52L-26 -80M0 -52L26 -80";

function Orchid({ x, y, scale, rotate, color, vein }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {[0, 132, 228].map((angle) => <path key={angle} d={SEPAL} fill={color} opacity="0.75" transform={`rotate(${angle})`} />)}
      {[-72, 72].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path d={PETAL} fill={color} />
          <path d={VEINS} fill="none" stroke={vein} strokeWidth="1.8" opacity="0.6" />
        </g>
      ))}
      <path d="M0 -4C-20 6 -22 30 0 44C22 30 20 6 0 -4Z" fill={vein} opacity="0.85" />
      <circle r="7" fill={color} />
    </g>
  );
}

const ORCHIDS = [
  [70, 95, 0.95, -18], [330, 70, 0.7, 25], [205, 245, 0.8, 40],
  [40, 345, 0.65, 70], [355, 300, 0.95, -35], [175, 470, 1, 10], [385, 495, 0.6, 50],
];

function FlowerMarks({ color, vein }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      {ORCHIDS.map(([x, y, scale, rotate]) => <Orchid key={`${x}-${y}`} x={x} y={y} scale={scale} rotate={rotate} color={color} vein={vein} />)}
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
  const { collection, title, text, colorName, motif, clawColor = "#7ec8e3", backgroundColor = "#ffffff" } = product.poster;
  const ink = readableText(backgroundColor);
  const marks = motif === "fleur" ? <FlowerMarks color={clawColor} vein={backgroundColor} /> : <PantherMarks color={clawColor} />;
  const photo = (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/70">
      <Media src={product.images?.[0]} alt={product.title} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
    </div>
  );

  if (compact) {
    return (
      <Link href={`/product/${product._id}`} className="group rise relative block overflow-hidden rounded-3xl p-4 md:p-6" style={{ backgroundColor, color: ink }}>
        {marks}
        <div className="relative">
          {/* Textes sur un aplat de la couleur du fond : le motif ne gêne pas la lecture */}
          <div className="w-fit max-w-full rounded-xl px-3 py-2" style={{ backgroundColor }}>
            {collection && <p className="font-serif text-sm italic">Collection {collection}</p>}
            <h3 className="mt-0.5 font-serif text-xl font-bold leading-tight md:text-3xl">{title || colorName || product.title}</h3>
          </div>
          {/* Photo réduite : le motif reste visible tout autour */}
          <div className="mx-auto my-5 w-[68%]">{photo}</div>
          <p className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 rounded-xl px-3 py-2 font-semibold" style={{ backgroundColor }}>
            <span className="min-w-0 truncate text-sm">{product.title}</span>
            <span className="font-bold">{formatPrice(product.price)}</span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <section aria-label={`Affiche de ${product.title}`} className="group relative overflow-hidden rounded-3xl" style={{ backgroundColor, color: ink }}>
      {marks}
      <div className="relative grid items-center gap-6 p-6 md:grid-cols-2 md:gap-12 md:p-14">
        <div className="rounded-2xl p-5 md:p-7" style={{ backgroundColor }}>
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
