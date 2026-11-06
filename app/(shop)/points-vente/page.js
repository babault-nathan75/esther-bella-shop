import Link from "next/link";
import { MapPin, MessageCircle, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Points de Vente",
  description: "Showroom Abidjan et boutique en ligne Esther Bella Shop.",
};

export default function PointsVentePage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <header className="border-b border-white/15 py-14 md:py-20 px-6 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 hover:text-brand transition mb-10">
          <ChevronLeft size={14} /> Retour aux collections
        </Link>
        <p className="text-xs uppercase tracking-wider text-white/70 mb-6">Où nous trouver</p>
        <h1 className="text-5xl md:text-7xl font-bold font-serif">
          Points de Vente
        </h1>
        <div className="h-[1px] w-24 bg-brand mx-auto mt-10"></div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <div className="flex items-center gap-4 mb-10">
          <MapPin className="text-brand" size={28} />
          <h2 className="text-2xl font-bold font-serif">Showroom Abidjan</h2>
        </div>

        <p className="text-white/70 leading-loose text-sm mb-12">
          Découvrez nos pièces dans notre showroom privé à Abidjan. Visite sur rendez-vous uniquement,
          pour un essayage personnalisé et un accompagnement styling dédié.
        </p>

        <div className="border border-white/15 rounded-2xl p-8 mb-10">
          <p className="text-white font-black uppercase tracking-wider text-xs mb-4">Adresse</p>
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            Abidjan, Côte d&apos;Ivoire<br/>
            <span className="text-white/55 text-xs uppercase tracking-wide">Adresse précise communiquée lors de la prise de rendez-vous</span>
          </p>
          <a
            href="https://wa.me/2250787335847?text=Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous%20au%20showroom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-brand text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-brand-dark transition-all"
          >
            <MessageCircle size={14} /> Prendre rendez-vous
          </a>
        </div>

        <div className="border border-white/15 rounded-2xl p-8 text-center">
          <p className="text-white font-black uppercase tracking-wider text-xs mb-4">Vous êtes loin ?</p>
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            Toutes nos pièces sont disponibles en ligne avec livraison partout en Côte d&apos;Ivoire
            et à l&apos;international.
          </p>
          <Link
            href="/shop"
            className="inline-block border border-white/15 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider hover:bg-brand hover:text-white hover:border-brand transition-all"
          >
            Découvrir la boutique en ligne
          </Link>
        </div>

        <div className="border-t border-white/15 mt-20 pt-12">
          <p className="text-xs uppercase tracking-wider text-white/70 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/notre-histoire" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Notre Histoire</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">L&apos;esprit de la maison</p>
            </Link>
            <Link href="/livraison-retours" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Livraison & Retours</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">Modalités et délais</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
