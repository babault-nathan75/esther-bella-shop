import Link from "next/link";
import { Sparkles, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Notre Histoire | Esther Bella Fashion",
  description: "L'histoire d'Esther Bella Fashion, la maison de couture née à Abidjan.",
};

export default function NotreHistoirePage() {
  return (
    <main className="bg-black text-yellow-600 min-h-screen font-montserrat">
      <header className="border-b border-yellow-600/20 py-24 px-6 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 hover:text-yellow-600 transition mb-10">
          <ChevronLeft size={14} /> Retour aux collections
        </Link>
        <p className="text-[10px] uppercase tracking-[0.5em] text-yellow-600/60 mb-6">La Maison</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic font-serif">
          Notre Histoire
        </h1>
        <div className="h-[1px] w-24 bg-yellow-600 mx-auto mt-10"></div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-12">
          <Sparkles className="text-yellow-600" size={28} />
          <h2 className="text-2xl font-black uppercase tracking-tighter italic font-serif">L&apos;esprit Esther Bella</h2>
        </div>

        <div className="space-y-8 text-yellow-600/80 leading-loose text-sm">
          <p>
            Esther Bella Fashion est née à Abidjan d&apos;une vision : redéfinir l&apos;élégance féminine
            africaine, là où l&apos;héritage rencontre la haute couture contemporaine. Chaque création
            est pensée pour la femme qui ne se contente pas — celle qui exige la perfection dans la coupe,
            le tissu, le détail.
          </p>
          <p>
            De l&apos;atelier au showroom, nous travaillons avec des artisans locaux, sélectionnons nos
            étoffes auprès de maisons reconnues, et limitons volontairement nos séries pour préserver
            le caractère unique de chaque pièce.
          </p>
          <p>
            Notre signature : un style éditorial, des matières nobles, une féminité affirmée. Chaque
            collection raconte une histoire, chaque modèle est un hommage à la femme de pouvoir, à la
            Queen qui porte ses couleurs avec assurance.
          </p>

          <blockquote className="font-serif italic text-yellow-600 text-xl border-l-2 border-yellow-600 pl-8 my-12 leading-relaxed">
            &laquo; Le vêtement est le reflet d&apos;une âme qui s&apos;exprime sans un mot. À Abidjan, nous
            créons l&apos;exception pour les Queens et les Kings qui n&apos;acceptent que la perfection. &raquo;
          </blockquote>
        </div>

        <div className="border-t border-yellow-600/20 mt-20 pt-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/ethique-qualite" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Éthique & Qualité</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Nos engagements</p>
            </Link>
            <Link href="/points-vente" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Points de Vente</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Visiter le showroom</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
