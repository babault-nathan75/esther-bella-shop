import Link from "next/link";
import { Camera, MessageCircle, Phone, Send, Wallet } from "lucide-react";
import { DEPOSIT_CHANNELS, DEPOSIT_MINIMUM, DEPOSIT_PHONE, DEPOSIT_TEL, depositWhatsApp } from "@/lib/contact";

export const metadata = {
  title: "Confirmation",
  alternates: { canonical: "/confirmation" },
  description: "Comment confirmer votre commande Esther Bella Shop avec un dépôt de validation.",
};

const STEPS = [
  [Wallet, "Faites votre dépôt", `Déposez au moins ${DEPOSIT_MINIMUM} sur ${DEPOSIT_CHANNELS} au ${DEPOSIT_PHONE}.`],
  [Camera, "Faites la capture", "Prenez une capture d'écran de votre dépôt."],
  [Send, "Envoyez la capture", `Envoyez-la sur ce numéro : ${DEPOSIT_PHONE}.`],
];

export default function ConfirmationPage() {
  return (
    <div>
      <header className="bg-ink px-4 py-10 text-center text-white md:py-16">
        <p className="font-script text-3xl text-red-400 md:text-4xl">Dernière étape</p>
        <h1 className="mt-1 font-serif text-5xl font-bold md:text-7xl">Confirmation</h1>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 pb-24 md:py-12">
        <p role="note" className="rounded-2xl border-l-4 border-brand bg-red-50 p-5 text-lg font-semibold leading-relaxed">
          Sans un dépôt de validation de minimum {DEPOSIT_MINIMUM}, aucune commande n&apos;est prise en compte.
        </p>

        <ol className="mt-8 space-y-4">
          {STEPS.map(([Icon, title, text], index) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-line p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-white"><Icon size={20} /></span>
              <div>
                <h2 className="font-semibold">Étape {index + 1} : {title}</h2>
                <p className="mt-1 text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={depositWhatsApp()} target="_blank" rel="noopener noreferrer" className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 font-semibold text-white hover:bg-green-800">
            <MessageCircle size={20} /> Envoyer sur WhatsApp
          </a>
          <a href={DEPOSIT_TEL} className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-xl border border-ink font-semibold hover:bg-paper">
            <Phone size={18} /> {DEPOSIT_PHONE}
          </a>
        </div>

        <p className="mt-8 text-center text-lg">Merci pour la compréhension.</p>
        <p className="mt-2 text-center">
          <Link href="/shop" className="inline-flex min-h-11 items-center font-semibold text-brand hover:underline">Retour à la boutique</Link>
        </p>
      </div>
    </div>
  );
}
