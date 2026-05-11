import Link from "next/link";
import { Ruler, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Guide des Tailles | Esther Bella Fashion",
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
    <main className="bg-black text-yellow-600 min-h-screen font-montserrat">
      <header className="border-b border-yellow-600/20 py-24 px-6 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 hover:text-yellow-600 transition mb-10">
          <ChevronLeft size={14} /> Retour aux collections
        </Link>
        <p className="text-[10px] uppercase tracking-[0.5em] text-yellow-600/60 mb-6">Mensurations</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic font-serif">
          Guide <br/> des Tailles
        </h1>
        <div className="h-[1px] w-24 bg-yellow-600 mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-10">
          <Ruler className="text-yellow-600" size={28} />
          <h2 className="text-2xl font-black uppercase tracking-tighter italic font-serif">Comment se mesurer</h2>
        </div>
        <p className="text-yellow-600/80 leading-loose text-sm mb-12">
          Nos pièces suivent les standards européens. Pour une coupe parfaite, mesurez-vous sur les
          sous-vêtements, sans serrer le mètre. Reportez ensuite vos mensurations au tableau ci-dessous.
        </p>

        <div className="overflow-x-auto border border-yellow-600/20 rounded-2xl mb-10">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-yellow-600/10 text-yellow-600 uppercase tracking-widest text-[10px]">
                <th className="p-4 text-left font-black">Taille</th>
                <th className="p-4 font-black">Poitrine (cm)</th>
                <th className="p-4 font-black">Taille (cm)</th>
                <th className="p-4 font-black">Hanches (cm)</th>
              </tr>
            </thead>
            <tbody className="text-yellow-600/80">
              {SIZES.map((row, i) => (
                <tr key={i} className="border-t border-yellow-600/10">
                  <td className="p-4 font-black text-yellow-600">{row[0]}</td>
                  <td className="p-4 text-center">{row[1]}</td>
                  <td className="p-4 text-center">{row[2]}</td>
                  <td className="p-4 text-center">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[10px] uppercase tracking-widest text-yellow-600/40 italic text-center">
          Une hésitation entre deux tailles ?{" "}
          <Link href="/contact" className="underline hover:text-yellow-600 transition">
            Contactez notre service client
          </Link>
          , nous vous conseillerons.
        </p>

        <div className="border-t border-yellow-600/20 mt-20 pt-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/livraison-retours" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Livraison & Retours</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Si la taille ne convient pas</p>
            </Link>
            <Link href="/contact" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Conseil personnalisé</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Contactez-nous</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
