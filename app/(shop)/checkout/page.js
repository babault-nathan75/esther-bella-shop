"use client";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { useCatalog } from "@/context/CatalogContext";
import { AlertCircle, ArrowRight, Check, ChevronLeft, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import CheckoutSteps from "@/components/CheckoutSteps";
import Media from "@/components/Media";
import { DEPOSIT_CHANNELS, DEPOSIT_MINIMUM, DEPOSIT_PHONE, depositWhatsApp } from "@/lib/contact";
import { PAYMENT_METHODS, formatPrice, isOrderable } from "@/lib/shop";

const DRAFT_KEY = "eb_checkout";
const EMPTY_FORM = { name: "", phone: "", zoneId: "", customCity: "", address: "", paymentMethod: PAYMENT_METHODS[0] };

function Section({ number, title, children }) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-sm md:p-6">
      <h2 className="mb-5 flex items-center gap-3 font-serif text-xl font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-sans text-sm font-bold text-white">{number}</span>
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function OrderPlaced({ order }) {
  const steps = [
    `Faites un dépôt d'au moins ${DEPOSIT_MINIMUM} sur ${DEPOSIT_CHANNELS} au ${DEPOSIT_PHONE}.`,
    "Faites une capture d'écran du dépôt.",
    `Envoyez-la à ce même numéro avec votre numéro de commande.`,
  ];
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24 md:py-12">
        <CheckoutSteps current={2} />
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
          <div className="bg-ink p-7 text-center text-white">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand"><Check size={28} /></span>
            <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">Merci, commande reçue</h1>
            <p className="mt-3 text-sm text-white/70">Votre numéro de commande</p>
            <p className="mt-1 text-3xl font-bold tracking-wider">{order.orderNumber}</p>
          </div>

          <div className="p-5 md:p-7">
            <div className="rounded-2xl border-l-4 border-brand bg-red-50 p-4">
              <h2 className="font-semibold">Votre commande n&apos;est pas encore confirmée</h2>
              <ol className="mt-3 space-y-2 text-sm">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <a href={depositWhatsApp(order.orderNumber)} target="_blank" rel="noopener noreferrer" className="mt-4 flex h-13 items-center justify-center gap-2 rounded-xl bg-green-700 font-semibold text-white hover:bg-green-800">
              <MessageCircle size={20} /> Envoyer ma capture sur WhatsApp
            </a>
            <Link href="/confirmation" className="mt-1 flex min-h-11 items-center justify-center text-sm font-semibold text-brand hover:underline">
              Voir la page Confirmation
            </Link>
            <Link href={`/suivi?commande=${order.orderNumber}`} className="flex min-h-11 items-center justify-center text-sm font-semibold hover:text-brand">
              Suivre ma commande
            </Link>

            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted">Livraison à {order.city}</dt><dd className="font-medium">{order.shippingPending ? "À confirmer" : formatPrice(order.shippingCost)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Paiement</dt><dd className="font-medium">{order.paymentMethod}</dd></div>
              <div className="flex justify-between gap-4 border-t border-line pt-3 text-lg font-bold"><dt>{order.shippingPending ? "Total hors livraison" : "Total"}</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>

            <Link href="/nouveautes" className="mt-4 flex min-h-11 items-center justify-center text-sm font-medium text-muted hover:text-ink">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cartProducts, clearCart, ready } = useContext(CartContext);
  const { zones } = useCatalog();
  const [form, setForm] = useState(EMPTY_FORM);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");

  // Le formulaire survit à un aller-retour vers le panier, jusqu'à la validation de la commande
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setForm({ ...EMPTY_FORM, ...saved });
    } catch {
      // Brouillon illisible ou stockage bloqué : on repart d'un formulaire vide
    }
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded || confirmation) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // Stockage bloqué : le formulaire fonctionne quand même, sans brouillon
    }
  }, [form, draftLoaded, confirmation]);

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const zone = zones.find((z) => z._id === form.zoneId);
  const isOther = form.zoneId === "other";
  // Un lieu enregistré puis retiré par l'admin ne reste pas sélectionné
  const zoneValue = zone || isOther ? form.zoneId : "";
  const subtotal = cartProducts.reduce((sum, item) => sum + (item.price || 0), 0);
  const total = subtotal + (zone?.price || 0);
  const hasSoldOut = cartProducts.some((item) => !isOrderable(item));

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");

    if (hasSoldOut) {
      setError("Une pièce de votre panier vient d'être épuisée. Retirez-la depuis le panier.");
      return;
    }
    if (!zoneValue || (isOther && !form.customCity.trim())) {
      setError("Merci d'indiquer votre lieu de livraison.");
      return;
    }

    setIsProcessing(true);
    try {
      const { data } = await axios.post('/api/checkout', {
        ...form,
        items: cartProducts.map(({ _id, selectedSize, notes }) => ({ _id, selectedSize, notes })),
      });
      setConfirmation(data);
      clearCart();
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Stockage bloqué : rien à effacer
      }
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err.response?.data?.error || "Connexion impossible. Votre panier est conservé, merci de réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (confirmation) return <OrderPlaced order={confirmation} />;

  if (!ready) return <div className="min-h-[60vh]" />;

  if (cartProducts.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-3xl font-bold">Votre panier est vide</h1>
        <Link href="/shop" className="mt-6 inline-flex h-12 items-center rounded-full bg-brand px-7 font-semibold text-white hover:bg-brand-dark">
          Voir le prêt à porter
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <form onSubmit={handleCheckout} className="mx-auto max-w-6xl px-4 pb-32 pt-6 md:px-6 md:py-10">
        <CheckoutSteps current={1} />
        <Link href="/cart" className="-ml-2 inline-flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft size={18} /> Retour au panier
        </Link>
        <h1 className="mb-6 mt-1 font-serif text-4xl font-bold md:text-5xl">Finaliser la commande</h1>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <Section number={1} title="Vos coordonnées">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium">Nom complet</label>
                  <input id="name" required autoComplete="name" value={form.name} onChange={update("name")} className="field" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium">Téléphone</label>
                  <input id="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="07 00 00 00 00" value={form.phone} onChange={update("phone")} className="field" />
                </div>
              </div>
            </Section>

            <Section number={2} title="Livraison">
              <div>
                <label htmlFor="zone" className="mb-1 block text-sm font-medium">Lieu de livraison</label>
                <select id="zone" required value={zoneValue} onChange={update("zoneId")} className="field">
                  <option value="" disabled>Choisir un lieu</option>
                  {zones.map((z) => (
                    <option key={z._id} value={z._id}>{z.name} : {formatPrice(z.price)}</option>
                  ))}
                  <option value="other">Autre lieu (tarif à confirmer)</option>
                </select>
              </div>
              {isOther && (
                <div>
                  <label htmlFor="customCity" className="mb-1 block text-sm font-medium">Votre ville ou commune</label>
                  <input id="customCity" required value={form.customCity} onChange={update("customCity")} className="field" />
                  <p className="mt-1 text-sm text-muted">Nous vous communiquerons le tarif au moment de la confirmation.</p>
                </div>
              )}
              <div>
                <label htmlFor="address" className="mb-1 block text-sm font-medium">Quartier et repère</label>
                <textarea id="address" required rows={2} autoComplete="street-address" value={form.address} onChange={update("address")} className="field resize-none" />
              </div>
            </Section>

            <Section number={3} title="Mode de paiement">
              <fieldset className="grid gap-2 sm:grid-cols-2">
                <legend className="sr-only">Mode de paiement</legend>
                {PAYMENT_METHODS.map((method) => (
                  <label key={method} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm font-medium transition-colors ${form.paymentMethod === method ? "border-brand bg-red-50" : "border-line hover:border-ink"}`}>
                    <input type="radio" name="payment" value={method} checked={form.paymentMethod === method} onChange={update("paymentMethod")} className="h-4 w-4 accent-[var(--color-brand)]" />
                    {method}
                  </label>
                ))}
              </fieldset>
            </Section>
          </div>

          <div className="space-y-3 lg:sticky lg:top-28">
            <aside className="rounded-2xl bg-ink p-5 text-white md:p-6">
              <h2 className="mb-4 font-serif text-2xl font-semibold">Récapitulatif</h2>
              <ul className="space-y-3 border-b border-white/15 pb-4 text-sm">
                {cartProducts.map((item) => (
                  <li key={item.cartId} className="flex items-center gap-3">
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10">
                      <Media src={item.images?.[0]} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className={`min-w-0 flex-1 ${isOrderable(item) ? "" : "text-white/50 line-through"}`}>
                      {item.title}
                      {item.selectedSize && <span className="block text-xs text-white/60">{item.selectedSize}</span>}
                    </span>
                    <span className="shrink-0 font-medium">{formatPrice(item.price)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-white/70">Sous-total</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-white/70">Livraison</dt>
                  <dd>{zone ? formatPrice(zone.price) : isOther ? "À confirmer" : "Choisir un lieu"}</dd>
                </div>
                <div className="flex items-end justify-between border-t border-white/15 pt-3">
                  <dt className="font-semibold">{isOther ? "Total hors livraison" : "Total"}</dt>
                  <dd className="text-2xl font-bold">{formatPrice(total)}</dd>
                </div>
              </dl>

              {error && (
                <p role="alert" className="mt-4 hidden lg:flex gap-2 rounded-xl bg-red-50 p-3 text-sm text-brand-dark">
                  <AlertCircle size={18} className="shrink-0" /> {error}
                </p>
              )}

              <button disabled={isProcessing} className="group mt-5 hidden h-13 w-full items-center lg:flex justify-center gap-2 rounded-xl bg-brand font-semibold transition-colors hover:bg-brand-dark disabled:opacity-60">
                {isProcessing
                  ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours…</>
                  : <>Valider ma commande <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
              </button>
            </aside>

            <p className="rounded-2xl border-l-4 border-brand bg-white p-4 text-sm leading-relaxed shadow-sm">
              Pour que votre commande soit confirmée, suivez les indications de cette page :{" "}
              <Link href="/confirmation" className="font-semibold text-brand underline">Confirmation</Link>
            </p>
          </div>
        </div>

        {/* Mobile : total et validation toujours à portée de pouce */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md lg:hidden">
          {error && <p role="alert" className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-brand-dark">{error}</p>}
          <div className="flex items-center gap-3">
            <p className="shrink-0"><span className="block text-xs text-muted">{isOther ? "Hors livraison" : "Total"}</span><strong className="text-lg">{formatPrice(total)}</strong></p>
            <button disabled={isProcessing} className="flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-brand font-semibold text-white active:scale-[0.98] disabled:opacity-60">
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Valider"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
