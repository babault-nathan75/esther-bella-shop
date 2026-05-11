import Link from "next/link";
import { Phone, Mail, MessageCircle, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Contactez-nous | Esther Bella Fashion",
  description: "Joignez le service client Esther Bella Fashion : WhatsApp, téléphone et email.",
};

export default function ContactPage() {
  return (
    <main className="bg-black text-yellow-600 min-h-screen font-montserrat">
      <header className="border-b border-yellow-600/20 py-24 px-6 text-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 hover:text-yellow-600 transition mb-10">
          <ChevronLeft size={14} /> Retour aux collections
        </Link>
        <p className="text-[10px] uppercase tracking-[0.5em] text-yellow-600/60 mb-6">Maison Esther Bella</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic font-serif">
          Contactez-nous
        </h1>
        <div className="h-[1px] w-24 bg-yellow-600 mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-24">
        <p className="text-yellow-600/80 leading-loose text-sm mb-12 text-center max-w-2xl mx-auto">
          Notre équipe vous accompagne du choix de votre pièce jusqu&apos;à sa livraison.
          Pour toute question, demande sur-mesure ou conseil styling, écrivez-nous —
          nous répondons sous 24h en jours ouvrés.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <a href="https://wa.me/22587335847" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group">
            <MessageCircle size={20} />
            <div>
              <p className="text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100">WhatsApp</p>
              <p className="text-xs font-black">+225 07 87 33 58 47</p>
            </div>
          </a>
          <a href="tel:+22587335847" className="flex items-center gap-4 border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group">
            <Phone size={20} />
            <div>
              <p className="text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100">Téléphone</p>
              <p className="text-xs font-black">+225 07 87 33 58 47</p>
            </div>
          </a>
          <a href="mailto:contact@estherbellafashion.com" className="flex items-center gap-4 border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group">
            <Mail size={20} />
            <div>
              <p className="text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100">Email</p>
              <p className="text-xs font-black break-all">kimouchiayeesthermorille@gmail.com</p>
            </div>
          </a>
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-600/40 text-center italic">
          Horaires : Lundi – Samedi, 9h – 22h (GMT)
        </p>

        <div className="border-t border-yellow-600/20 mt-20 pt-12">
          <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-600/60 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/livraison-retours" className="border border-yellow-600/20 rounded-2xl p-6 hover:bg-yellow-600 hover:text-black transition-all group text-center">
              <p className="font-black uppercase tracking-[0.3em] text-[10px] mb-2">Livraison & Retours</p>
              <p className="text-yellow-600/60 text-[9px] uppercase tracking-widest group-hover:text-black/70">Modalités et délais</p>
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
