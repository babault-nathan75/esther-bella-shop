import Link from "next/link";
import { Leaf, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Éthique & Qualité | Esther Bella Fashion",
  description: "Production responsable, matières premium et séries limitées chez Esther Bella Fashion.",
};

const PILLARS = [
  {
    title: "Production responsable",
    body: "Ateliers locaux, conditions de travail dignes et rémunérations justes pour chaque couturier·ère partenaire.",
  },
  {
    title: "Matières premium",
    body: "Tissus sélectionnés pour leur tenue, leur tomber et leur durabilité — soie, lin, wax premium, dentelle française.",
  },
  {
    title: "Séries limitées",
    body: "Chaque modèle est édité en petite quantité pour garantir l'exclusivité et limiter le gaspillage textile.",
  },
];

export default function EthiqueQualitePage() {
  return (
    <main className="bg-black text-yellow-600 min-h-screen font-montserrat">
      <header className="border-b border-yellow-600/20 py-24 px-6 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 hover:text-yellow-600 transition mb-10">
          <ChevronLeft size={14} /> Retour aux collections
        </Link>
        <p className="text-[10px] uppercase tracking-[0.5em] text-yellow-600/60 mb-6">Notre engagement</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic font-serif">
          Éthique <br/> & Qualité
        </h1>
        <div className="h-[1px] w-24 bg-yellow-600 mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-12">
          <Leaf className="text-yellow-600" size={28} />
          <h2 className="text-2xl font-black uppercase tracking-tighter italic font-serif">Nos trois piliers</h2>
        </div>

        <p className="text-yellow-600/80 leading-loose text-sm mb-16">
          La beauté ne se mesure pas qu&apos;à l&apos;apparence. Nos pièces sont créées dans le respect
          des artisans, des matières et de l&apos;environnement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <div key={i} className="border border-yellow-600/20 rounded-2xl p-8">
              <p className="text-yellow-600 font-black uppercase tracking-[0.2em] text-[10px] mb-6">
                0{i + 1} — {p.title}
              </p>
              <p className="text-yellow-600/80 text-xs leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-yellow-600/20 mt-20 pt-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/notre-histoire" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Notre Histoire</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">L&apos;esprit de la maison</p>
            </Link>
            <Link href="/points-vente" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Points de Vente</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Voir les pièces en boutique</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
