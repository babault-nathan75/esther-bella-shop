import { Ruler, Scissors, Shirt, Truck, Zap } from "lucide-react";

// Prêt à porter : une couverture de magazine, claire et éditoriale
export function ReadyToWearHero() {
  return (
    <header className="border-b border-ink bg-paper">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 md:px-6 md:pb-12 md:pt-12">
        <div className="flex justify-between border-b border-ink pb-2 text-xs font-semibold uppercase tracking-[0.2em]">
          <span>Esther Bella Shop</span>
          <span>Abidjan</span>
        </div>
        <h1 className="mt-5 font-serif text-[3.4rem] font-black leading-[0.95] tracking-tight sm:text-8xl md:text-[10rem]">
          Prêt <em className="font-semibold text-brand">à</em> porter
        </h1>
        <p className="mt-3 font-script text-3xl md:text-4xl">Votre style, pour toutes vos sorties.</p>
      </div>
    </header>
  );
}

// Sur commande : l'atelier, avec son mètre ruban et ses coutures
export function MadeToOrderHero() {
  const steps = [
    [Shirt, "Choisissez un modèle", "Parmi nos créations"],
    [Ruler, "Donnez vos mesures", "Ou une taille standard"],
    [Scissors, "Nous confectionnons", "Dans le délai indiqué"],
  ];
  return (
    <header className="bg-[#141210] text-white">
      {/* Mètre ruban */}
      <div
        aria-hidden="true"
        className="h-6 bg-[#f6f1e7]"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, #141210 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, #e4151b 0 2px, transparent 2px 60px)", backgroundSize: "100% 40%, 100% 75%", backgroundRepeat: "no-repeat" }}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <p className="font-script text-3xl text-red-400 md:text-4xl">Notre atelier</p>
        <h1 className="mt-1 font-serif text-5xl font-bold leading-none md:text-8xl">Sur commande</h1>
        <p className="mt-4 max-w-xl text-lg text-white/70">Une tenue faite pour vous seule, à vos mesures.</p>
        <ol className="mt-8 grid gap-3 md:grid-cols-3">
          {steps.map(([Icon, title, text], index) => (
            <li key={title} className="flex items-center gap-4 rounded-xl border border-dashed border-white/35 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand"><Icon size={20} /></span>
              <p><strong className="block">{index + 1}. {title}</strong><span className="text-sm text-white/65">{text}</span></p>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}

// En stock : rouge et direct, tout se joue sur l'immédiateté
export function InStockHero() {
  return (
    <header className="relative overflow-hidden bg-brand text-white">
      <p aria-hidden="true" className="pointer-events-none absolute -bottom-10 -right-4 select-none font-serif text-[11rem] font-black leading-none text-black/10 md:text-[22rem]">
        Stock
      </p>
      <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <p className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-sm font-semibold">
          <Zap size={15} /> Disponible tout de suite
        </p>
        <h1 className="mt-4 font-serif text-6xl font-black leading-none md:text-9xl">En stock</h1>
        <p className="mt-4 max-w-xl text-lg font-medium">Pas d&apos;attente : ces tenues sont déjà là, prêtes à être livrées.</p>
        <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"><Truck size={18} /> Livraison dans les communes d&apos;Abidjan</p>
      </div>
    </header>
  );
}
