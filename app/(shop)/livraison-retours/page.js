import Link from "next/link";
import BackLink from "@/components/BackLink";
import DeliveryRates from "@/components/DeliveryRates";
import { Truck, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Livraison & Retours",
  description: "Modalités de livraison à Abidjan et hors-zone, politique de retour Esther Bella Shop.",
};

export default function LivraisonRetoursPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <header className="border-b border-white/15 py-14 md:py-20 px-6 text-center">
        <BackLink className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 hover:text-brand transition mb-10" />
        <p className="text-xs uppercase tracking-wider text-white/70 mb-6">Modalités</p>
        <h1 className="text-5xl md:text-7xl font-bold font-serif">
          Livraison <br/> & Retours
        </h1>
        <div className="h-[1px] w-24 bg-brand mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-14 md:py-20">
        <div className="flex items-center gap-4 mb-10">
          <Truck className="text-brand" size={28} />
          <h2 className="text-2xl font-bold font-serif">Livraison</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border border-white/15 rounded-2xl p-8">
            <h3 className="text-white font-black uppercase tracking-wider text-xs mb-6">Abidjan</h3>
            <ul className="space-y-3 text-sm text-white/70 leading-relaxed">
              <li>• Livraison express en <strong className="text-white">24 à 48h</strong></li>
              <li>• Remise en main propre par notre coursier</li>
            </ul>
          </div>
          <div className="border border-white/15 rounded-2xl p-8">
            <h3 className="text-white font-black uppercase tracking-wider text-xs mb-6">Hors Abidjan & International</h3>
            <ul className="space-y-3 text-sm text-white/70 leading-relaxed">
              <li>• Délai : <strong className="text-white">3 à 7 jours</strong></li>
              <li>• Tarif communiqué après confirmation</li>
              <li>• Suivi de colis par WhatsApp</li>
            </ul>
          </div>
        </div>

        <div className="border border-white/15 rounded-2xl p-8 mb-16">
          <h3 className="text-white font-black uppercase tracking-wider text-xs mb-6">Tarifs par lieu</h3>
          <DeliveryRates />
        </div>

        <div className="flex items-center gap-4 mb-10">
          <RefreshCw className="text-brand" size={28} />
          <h2 className="text-2xl font-bold font-serif">Politique de retour</h2>
        </div>

        <div className="border border-white/15 rounded-2xl p-8">
          <p className="text-white/70 text-sm leading-loose">
            Les retours sont acceptés sous <strong className="text-white">48 heures</strong> après réception,
            pour toute pièce non portée, non lavée, dans son emballage d&apos;origine. Les articles soldés et
            sur-mesure ne sont ni repris ni échangés. L&apos;échange ou l&apos;avoir vous est proposé sous 7 jours
            après réception du retour.
          </p>
        </div>

        <div className="border-t border-white/15 mt-20 pt-12">
          <p className="text-xs uppercase tracking-wider text-white/70 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/guide-tailles" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Guide des Tailles</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">Trouvez la coupe parfaite</p>
            </Link>
            <Link href="/contact" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Une question ?</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">Contactez-nous</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
