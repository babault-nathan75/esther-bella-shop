import Link from "next/link";
import { Ruler, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Guide des Tailles",
  description: "Tableau des mensurations XS à XXL pour choisir la coupe parfaite.",
};

const SIZES = [
  ["XS", "82-86", "62-66", "88-92"],
  ["S", "86-90", "66-70", "92-96"],
  ["M", "90-94", "70-74", "96-100"],
  ["L", "94-100", "74-80", "100-106"],
  ["XL", "100-108", "80-88", "106-114"],
  ["XXL", "108-116", "88-96", "114-122"],
];

export default function GuideTaillesPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <header className="border-b border-white/15 py-14 md:py-20 px-6 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 hover:text-brand transition mb-10">
          <ChevronLeft size={14} /> Retour aux collections
        </Link>
        <p className="text-xs uppercase tracking-wider text-white/70 mb-6">Mensurations</p>
        <h1 className="text-5xl md:text-7xl font-bold font-serif">
          Guide <br/> des Tailles
        </h1>
        <div className="h-[1px] w-24 bg-brand mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-14 md:py-20">
        <div className="flex items-center gap-4 mb-10">
          <Ruler className="text-brand" size={28} />
          <h2 className="text-2xl font-bold font-serif">Comment se mesurer</h2>
        </div>
        <p className="text-white/70 leading-loose text-sm mb-12">
          Nos pièces suivent les standards européens. Pour une coupe parfaite, mesurez-vous sur les
          sous-vêtements, sans serrer le mètre. Reportez ensuite vos mensurations au tableau ci-dessous.
        </p>

        <div className="overflow-x-auto border border-white/15 rounded-2xl mb-10">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-white/5 text-white uppercase tracking-wide text-xs">
                <th className="p-4 text-left font-black">Taille</th>
                <th className="p-4 font-black">Poitrine (cm)</th>
                <th className="p-4 font-black">Taille (cm)</th>
                <th className="p-4 font-black">Hanches (cm)</th>
              </tr>
            </thead>
            <tbody className="text-white/70">
              {SIZES.map((row, i) => (
                <tr key={i} className="border-t border-white/15">
                  <td className="p-4 font-black text-white">{row[0]}</td>
                  <td className="p-4 text-center">{row[1]}</td>
                  <td className="p-4 text-center">{row[2]}</td>
                  <td className="p-4 text-center">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs uppercase tracking-wide text-white/55 italic text-center">
          Une hésitation entre deux tailles ?{" "}
          <Link href="/contact" className="underline hover:text-brand transition">
            Contactez notre service client
          </Link>
          , nous vous conseillerons.
        </p>

        <div className="border-t border-white/15 mt-20 pt-12">
          <p className="text-xs uppercase tracking-wider text-white/70 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/livraison-retours" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Livraison & Retours</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">Si la taille ne convient pas</p>
            </Link>
            <Link href="/contact" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Conseil personnalisé</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">Contactez-nous</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
