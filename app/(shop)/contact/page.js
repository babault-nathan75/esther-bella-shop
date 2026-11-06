import Link from "next/link";
import BackLink from "@/components/BackLink";
import { Phone, Mail, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contactez-nous",
  description: "Joignez le service client Esther Bella Shop : WhatsApp, téléphone et email.",
};

export default function ContactPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <header className="border-b border-white/15 py-14 md:py-20 px-6 text-center">
        <BackLink className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 hover:text-brand transition mb-10" />
        <p className="text-xs uppercase tracking-wider text-white/70 mb-6">Maison Esther Bella</p>
        <h1 className="text-5xl md:text-7xl font-bold font-serif">
          Contactez-nous
        </h1>
        <div className="h-[1px] w-24 bg-brand mx-auto mt-10"></div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-14 md:py-20">
        <p className="text-white/70 leading-loose text-sm mb-12 text-center max-w-2xl mx-auto">
          Notre équipe vous accompagne du choix de votre pièce jusqu&apos;à sa livraison.
          Pour toute question, demande sur-mesure ou conseil styling, écrivez-nous —
          nous répondons sous 24h en jours ouvrés.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <a href="https://wa.me/2250787335847" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group">
            <MessageCircle size={20} />
            <div>
              <p className="text-xs uppercase tracking-wide opacity-60 group-hover:opacity-100">WhatsApp</p>
              <p className="text-xs font-black">+225 07 87 33 58 47</p>
            </div>
          </a>
          <a href="tel:+2250787335847" className="flex items-center gap-4 border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group">
            <Phone size={20} />
            <div>
              <p className="text-xs uppercase tracking-wide opacity-60 group-hover:opacity-100">Téléphone</p>
              <p className="text-xs font-black">+225 07 87 33 58 47</p>
            </div>
          </a>
          <a href="mailto:kimouchiayeesthermorille@gmail.com" className="flex items-center gap-4 border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group">
            <Mail size={20} />
            <div>
              <p className="text-xs uppercase tracking-wide opacity-60 group-hover:opacity-100">Email</p>
              <p className="text-xs font-black break-all">kimouchiayeesthermorille@gmail.com</p>
            </div>
          </a>
        </div>

        <p className="text-xs uppercase tracking-wider text-white/55 text-center italic">
          Horaires : Lundi – Samedi, 9h – 22h (GMT)
        </p>

        <div className="border-t border-white/15 mt-20 pt-12">
          <p className="text-xs uppercase tracking-wider text-white/70 text-center mb-8">À découvrir aussi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/livraison-retours" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Livraison & Retours</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">Modalités et délais</p>
            </Link>
            <Link href="/points-vente" className="border border-white/15 rounded-2xl p-6 hover:bg-brand hover:text-white hover:border-brand transition-all group text-center">
              <p className="font-black uppercase tracking-wider text-xs mb-2">Points de Vente</p>
              <p className="text-white/70 text-xs uppercase tracking-wide group-hover:text-white/90">Visiter le showroom</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
