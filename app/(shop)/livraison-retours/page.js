import Link from "next/link";
import { Truck, RefreshCw, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Livraison & Retours | Esther Bella Fashion",
  description: "Modalités de livraison à Abidjan et hors-zone, politique de retour Esther Bella Fashion.",
};

export default function LivraisonRetoursPage() {
  return (
    <main className="bg-black text-yellow-600 min-h-screen font-montserrat">
      <header className="border-b border-yellow-600/20 py-24 px-6 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 hover:text-yellow-600 transition mb-10">
          <ChevronLeft size={14} /> Retour aux collections
        </Link>
        <p className="text-[10px] uppercase tracking-[0.5em] text-yellow-600/60 mb-6">Modalités</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic font-serif">
          Livraison <br/> & Retours
        </h1>
        <div className="h-[1px] w-24 bg-yellow-600 mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-10">
          <Truck className="text-yellow-600" size={28} />
          <h2 className="text-2xl font-black uppercase tracking-tighter italic font-serif">Livraison</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border border-yellow-600/20 rounded-2xl p-8">
            <h3 className="text-yellow-600 font-black uppercase tracking-[0.3em] text-xs mb-6">Abidjan</h3>
            <ul className="space-y-3 text-sm text-yellow-600/80 leading-relaxed">
              <li>• Livraison express en <strong className="text-yellow-600">24 à 48h</strong></li>
              <li>• Tarif fixe : <strong className="text-yellow-600">1 500 FCFA</strong></li>
              <li>• Remise en main propre par notre coursier</li>
            </ul>
          </div>
          <div className="border border-yellow-600/20 rounded-2xl p-8">
            <h3 className="text-yellow-600 font-black uppercase tracking-[0.3em] text-xs mb-6">Hors Abidjan & International</h3>
            <ul className="space-y-3 text-sm text-yellow-600/80 leading-relaxed">
              <li>• Délai : <strong className="text-yellow-600">3 à 7 jours</strong></li>
              <li>• Tarif communiqué après confirmation</li>
              <li>• Suivi de colis par WhatsApp</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <RefreshCw className="text-yellow-600" size={28} />
          <h2 className="text-2xl font-black uppercase tracking-tighter italic font-serif">Politique de retour</h2>
        </div>

        <div className="border border-yellow-600/20 rounded-2xl p-8">
          <p className="text-yellow-600/80 text-sm leading-loose">
            Les retours sont acceptés sous <strong className="text-yellow-600">48 heures</strong> après réception,
            pour toute pièce non portée, non lavée, dans son emballage d&apos;origine. Les articles soldés et
            sur-mesure ne sont ni repris ni échangés. L&apos;échange ou l&apos;avoir vous est proposé sous 7 jours
            après réception du retour.
          </p>
        </div>

        <div className="border-t border-yellow-600/20 mt-20 pt-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/guide-tailles" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Guide des Tailles</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Trouvez la coupe parfaite</p>
            </Link>
            <Link href="/contact" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Une question ?</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Contactez-nous</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
