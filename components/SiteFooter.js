"use client";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useCatalog } from "@/context/CatalogContext";

const LINK = "inline-flex min-h-10 items-center text-sm text-white/70 transition-colors hover:text-red-400";

export default function SiteFooter({ socials }) {
  const { categories } = useCatalog();

  const columns = [
    { title: "Boutique", links: [["/nouveautes", "Nouveautés"], ["/shop", "Prêt à porter"], ["/en-stock", "En stock"], ["/confection", "Sur commande"], ...categories.slice(0, 3).map((c) => [`/category/${c._id}`, c.name])] },
    { title: "Service client", links: [["/confirmation", "Confirmer ma commande"], ["/suivi", "Suivre ma commande"], ["/contact", "Contactez-nous"], ["/livraison-retours", "Livraison et retours"], ["/guide-tailles", "Guide des tailles"]] },
    { title: "La maison", links: [["/notre-histoire", "Notre histoire"], ["/ethique-qualite", "Éthique et qualité"], ["/points-vente", "Points de vente"]] },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink pb-28 text-white md:pb-0">
      <div className="h-1 bg-brand" />
      <div aria-hidden="true" className="absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-brand/20 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-6 md:py-16">
        <div>
          <Image src="/brand/logo.png" alt="Esther Bella Shop" width={640} height={380} className="h-28 w-auto" />
          <p className="mt-3 font-script text-2xl text-red-400">Votre élégance, notre satisfaction.</p>
          <div className="mt-4 flex gap-2">
            {socials.map(({ label, href, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-brand hover:bg-brand">
                {icon}
              </a>
            ))}
          </div>
        </div>

        {columns.map(({ title, links }) => (
          <div key={title}>
            <h2 className="mb-2 font-serif text-lg font-semibold">{title}</h2>
            <ul>
              {links.map(([href, label]) => (
                <li key={href}><Link href={href} className={LINK}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-white/60 md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {new Date().getFullYear()} <Link href="/admin/login" className="hover:text-white">Esther Bella Shop</Link>
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> Abidjan</span>
            <a href="tel:+2250787335847" className="inline-flex items-center gap-1.5 hover:text-white"><Phone size={14} /> +225 07 87 33 58 47</a>
            <a href="mailto:kimouchiayeesthermorille@gmail.com" className="inline-flex items-center gap-1.5 hover:text-white"><Mail size={14} /> Écrire</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
