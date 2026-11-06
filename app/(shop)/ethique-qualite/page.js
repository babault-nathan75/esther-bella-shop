import Link from "next/link";
import BackLink from "@/components/BackLink";
import { Leaf } from "lucide-react";

export const metadata = {
  title: "Éthique & Qualité",
  description: "Production responsable, matières premium et séries limitées chez Esther Bella Shop.",
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
    <main className="bg-black text-white min-h-screen">
      <header className="border-b border-white/15 py-14 md:py-20 px-6 text-center">
        <BackLink className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 hover:text-brand transition mb-10" />
        <p className="text-xs uppercase tracking-wider text-white/70 mb-6">Notre engagement</p>
        <h1 className="text-5xl md:text-7xl font-bold font-serif">
          Éthique <br/> & Qualité
        </h1>
        <div className="h-[1px] w-24 bg-brand mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-14 md:py-20">
        <div className="flex items-center gap-4 mb-12">
          <Leaf className="text-brand" size={28} />
          <h2 className="text-2xl font-bold font-serif">Nos trois piliers</h2>
        </div>

        <p className="text-white/70 leading-loose text-sm mb-16">
          La beauté ne se mesure pas qu&apos;à l&apos;apparence. Nos pièces sont créées dans le respect
          des artisans, des matières et de l&apos;environnement.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <div key={i} className="border border-white/15 rounded-2xl p-8">
              <p className="text-white font-black uppercase tracking-wider text-xs mb-6">
                0{i + 1} — {p.title}
              </p>
              <p className="text-white/70 text-xs leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/15 mt-20 pt-12">
          <p className="text-xs uppercase tracking-wider text-white/70 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/notre-histoire" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Notre Histoire</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">L&apos;esprit de la maison</p>
            </Link>
            <Link href="/points-vente" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Points de Vente</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">Voir les pièces en boutique</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
