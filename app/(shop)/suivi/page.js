"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { AlertCircle, Check, Loader2, MessageCircle, XCircle } from "lucide-react";
import Media from "@/components/Media";
import { DEPOSIT_CHANNELS, DEPOSIT_MINIMUM, DEPOSIT_PHONE, depositWhatsApp } from "@/lib/contact";
import { formatPrice } from "@/lib/shop";

const POLL_INTERVAL = 30000;
const STAGES = [
  ["En attente", "Commande reçue", "Elle attend votre dépôt de confirmation."],
  ["Confirmée", "Confirmée", "Votre dépôt est validé."],
  ["En préparation", "En préparation", "Nous préparons votre tenue."],
  ["En livraison", "En livraison", "Votre commande est en route."],
  ["Livrée", "Livrée", "Merci pour votre confiance !"],
];

function Timeline({ status }) {
  const current = STAGES.findIndex(([value]) => value === status);
  return (
    <ol className="mt-5">
      {STAGES.map(([value, label, text], index) => {
        const done = index < current || status === "Livrée";
        const active = index === current;
        return (
          <li key={value} aria-current={active ? "step" : undefined} className="relative flex gap-4 pb-6 last:pb-0">
            {index < STAGES.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 left-[15px] top-8 w-0.5 ${index < current ? "bg-brand" : "bg-line"}`} />}
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done || active ? "bg-brand text-white" : "bg-paper text-muted"} ${active && status !== "Livrée" ? "ring-4 ring-red-100" : ""}`}>
              {done ? <Check size={16} /> : index + 1}
            </span>
            <div>
              <p className={`font-semibold ${done || active ? "" : "text-muted"}`}>{label}</p>
              {active && <p className="text-sm text-muted">{text}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function TrackingPage() {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("commande");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (fromUrl) setNumber(fromUrl);
  }, []);

  const lookup = useCallback(async () => {
    const { data } = await axios.post("/api/order-status", { orderNumber: number, phone });
    setOrder(data);
  }, [number, phone]);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      await lookup();
    } catch (err) {
      setError(err.response?.data?.error || "Connexion impossible. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Le statut change sous les yeux de la cliente, sans recharger
  useEffect(() => {
    if (!order) return;
    const timer = setInterval(() => { if (!document.hidden) lookup().catch(() => {}); }, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [order, lookup]);

  return (
    <div className="bg-paper">
      <header className="bg-ink px-4 py-10 text-center text-white md:py-14">
        <p className="font-script text-3xl text-red-400 md:text-4xl">Où en est-elle ?</p>
        <h1 className="mt-1 font-serif text-4xl font-bold md:text-6xl">Suivre ma commande</h1>
      </header>

      <div className="mx-auto max-w-xl space-y-4 px-4 py-8 pb-28">
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div>
            <label htmlFor="number" className="mb-1 block text-sm font-medium">Numéro de commande</label>
            <input id="number" required placeholder="EB-XXXXXX" autoCapitalize="characters" value={number} onChange={(e) => setNumber(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="track-phone" className="mb-1 block text-sm font-medium">Téléphone utilisé pour la commande</label>
            <input id="track-phone" type="tel" required inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="field" />
          </div>
          {error && <p role="alert" className="flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-brand-dark"><AlertCircle size={18} className="shrink-0" /> {error}</p>}
          <button disabled={loading} className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Voir le statut"}
          </button>
        </form>

        {order && (
          <section aria-live="polite" className="rise rounded-2xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-bold tracking-wide">{order.orderNumber}</h2>
              <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleDateString("fr-FR", { dateStyle: "medium" })}</p>
            </div>

            {order.status === "Annulée" ? (
              <p className="mt-4 flex gap-2 rounded-xl bg-red-50 p-3 font-semibold text-brand-dark"><XCircle size={20} className="shrink-0" /> Cette commande a été annulée.</p>
            ) : (
              <Timeline status={order.status} />
            )}

            {order.status === "En attente" && (
              <div className="mt-5 rounded-xl border-l-4 border-brand bg-red-50 p-4 text-sm">
                <p>Déposez au moins {DEPOSIT_MINIMUM} sur {DEPOSIT_CHANNELS} au {DEPOSIT_PHONE}, puis envoyez la capture à ce numéro.</p>
                <a href={depositWhatsApp(order.orderNumber)} target="_blank" rel="noopener noreferrer" className="mt-3 flex h-11 items-center justify-center gap-2 rounded-full bg-green-700 font-semibold text-white">
                  <MessageCircle size={18} /> Envoyer ma capture
                </a>
              </div>
            )}

            <ul className="mt-5 space-y-3 border-t border-line pt-4">
              {order.items.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-paper"><Media src={item.image} alt="" className="h-full w-full object-cover text-xs" /></div>
                  <span>{item.title}<span className="block text-muted">{item.selectedSize}</span></span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex justify-between border-t border-line pt-3 font-bold">
              <span>{order.shippingPending ? "Total hors livraison" : "Total"}</span>{formatPrice(order.total)}
            </p>
            <p className="mt-1 text-sm text-muted">Livraison à {order.city}</p>
          </section>
        )}

        <p className="text-center text-sm text-muted">
          Numéro perdu ? <Link href="/contact" className="font-semibold text-brand underline">Contactez-nous</Link>
        </p>
      </div>
    </div>
  );
}
