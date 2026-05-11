import Link from "next/link";
import { MapPin, MessageCircle, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Points de Vente | Esther Bella Fashion",
  description: "Showroom Abidjan et boutique en ligne Esther Bella Fashion.",
};

export default function PointsVentePage() {
  return (
    <main className="bg-black text-yellow-600 min-h-screen font-montserrat">
      <header className="border-b border-yellow-600/20 py-24 px-6 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 hover:text-yellow-600 transition mb-10">
          <ChevronLeft size={14} /> Retour aux collections
        </Link>
        <p className="text-[10px] uppercase tracking-[0.5em] text-yellow-600/60 mb-6">Où nous trouver</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic font-serif">
          Points de Vente
        </h1>
        <div className="h-[1px] w-24 bg-yellow-600 mx-auto mt-10"></div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-10">
          <MapPin className="text-yellow-600" size={28} />
          <h2 className="text-2xl font-black uppercase tracking-tighter italic font-serif">Showroom Abidjan</h2>
        </div>

        <p className="text-yellow-600/80 leading-loose text-sm mb-12">
          Découvrez nos pièces dans notre showroom privé à Abidjan. Visite sur rendez-vous uniquement,
          pour un essayage personnalisé et un accompagnement styling dédié.
        </p>

        <div className="border border-yellow-600/20 rounded-2xl p-8 mb-10">
          <p className="text-yellow-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Adresse</p>
          <p className="text-yellow-600/80 text-sm mb-6 leading-relaxed">
            Abidjan, Côte d&apos;Ivoire<br/>
            <span className="text-yellow-600/40 text-[10px] uppercase tracking-widest">Adresse précise communiquée lors de la prise de rendez-vous</span>
          </p>
          <a
            href="https://wa.me/22587335847?text=Bonjour%2C%20je%20souhaite%20prendre%20rendez-vous%20au%20showroom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-yellow-600 text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
          >
            <MessageCircle size={14} /> Prendre rendez-vous
          </a>
        </div>

        <div className="border border-yellow-600/20 rounded-2xl p-8 text-center">
          <p className="text-yellow-600 font-black uppercase tracking-[0.3em] text-xs mb-4">Vous êtes loin ?</p>
          <p className="text-yellow-600/80 text-sm mb-6 leading-relaxed">
            Toutes nos pièces sont disponibles en ligne avec livraison partout en Côte d&apos;Ivoire
            et à l&apos;international.
          </p>
          <Link
            href="/shop"
            className="inline-block border border-yellow-600/40 text-yellow-600 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-yellow-600 hover:text-black transition-all"
          >
            Découvrir la boutique en ligne
          </Link>
        </div>

        <div className="border-t border-yellow-600/20 mt-20 pt-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/notre-histoire" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Notre Histoire</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">L&apos;esprit de la maison</p>
            </Link>
            <Link href="/livraison-retours" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Livraison & Retours</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Modalités et délais</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
