"use client";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Check, CheckCircle2, Clock, Loader2, MapPin, MessageCircle, Package, Phone, RotateCcw, Search, Truck, XCircle } from "lucide-react";
import Media from "@/components/Media";
import { ORDER_STATUSES, formatPrice, orderNumber } from "@/lib/shop";

const POLL_INTERVAL = 15000;
const CANCELLED = "Annulée";

// Pour chaque statut : son badge et l'action suivante proposée à l'admin
const STATUS_FLOW = {
  "En attente": { Icon: Clock, badge: "bg-amber-100 text-amber-900", next: "Confirmée", action: "Confirmer", ActionIcon: Check },
  "Confirmée": { Icon: CheckCircle2, badge: "bg-green-100 text-green-900", next: "En préparation", action: "Passer en préparation", ActionIcon: Package },
  "En préparation": { Icon: Package, badge: "bg-blue-100 text-blue-900", next: "En livraison", action: "Passer en livraison", ActionIcon: Truck },
  "En livraison": { Icon: Truck, badge: "bg-blue-100 text-blue-900", next: "Livrée", action: "Marquer livrée", ActionIcon: CheckCircle2 },
  "Livrée": { Icon: CheckCircle2, badge: "bg-green-100 text-green-900" },
  [CANCELLED]: { Icon: XCircle, badge: "bg-red-100 text-brand-dark" },
};

// Numéros ivoiriens : 10 chiffres, préfixe 01/05/07 conservé
const formatWhatsApp = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "").replace(/^(00)?225/, "");
  return `https://wa.me/225${digits}`;
};

function StatusBadge({ status }) {
  const { Icon, badge } = STATUS_FLOW[status] || STATUS_FLOW["En attente"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${badge}`}>
      <Icon size={15} /> {status}
    </span>
  );
}

function OrderActions({ order, busy, onAdvance, onCancel, onRestore }) {
  const status = order.status || "En attente";
  const { next, action, ActionIcon } = STATUS_FLOW[status] || STATUS_FLOW["En attente"];
  const base = "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors active:scale-[0.98] disabled:opacity-50";
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {next && (
        <button disabled={busy} onClick={() => onAdvance(next)} className={`${base} bg-brand text-white hover:bg-brand-dark`}>
          <ActionIcon size={17} /> {action}
        </button>
      )}
      {status !== CANCELLED && status !== "Livrée" && (
        <button disabled={busy} onClick={onCancel} className={`${base} border border-line hover:border-brand hover:text-brand`}>
          <XCircle size={17} /> Annuler
        </button>
      )}
      {status === CANCELLED && (
        <button disabled={busy} onClick={onRestore} className={`${base} border border-ink hover:bg-paper`}>
          <RotateCcw size={17} /> Rétablir la commande
        </button>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get("/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Erreur chargement commandes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(() => { if (!document.hidden) fetchOrders(); }, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchOrders]);

  const cancelOrder = (order) => {
    if (window.confirm(`Annuler la commande ${orderNumber(order._id)} de ${order.name} ? Son stock sera rendu.`)) {
      updateOrder(order._id, { status: CANCELLED });
    }
  };

  const updateOrder = async (id, changes) => {
    setError("");
    setBusyId(id);
    try {
      await axios.put("/api/admin/orders", { id, ...changes });
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la mise à jour.");
    } finally {
      setBusyId(null);
    }
  };

  const term = search.trim().toLowerCase();
  const filteredOrders = orders.filter((o) => {
    const status = o.status || "En attente";
    if (statusFilter !== "all" && status !== statusFilter) return false;
    return !term || [o.name, o.city, o.phone, orderNumber(o._id)].some((v) => v?.toLowerCase().includes(term));
  });

  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-brand" size={32} /></div>;

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold">Commandes</h1>
      <p className="mb-5 mt-1 text-sm text-muted">Mise à jour automatique, sans recharger.</p>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input type="search" aria-label="Rechercher une commande" placeholder="Nom, lieu, téléphone ou numéro…" value={search} onChange={(e) => setSearch(e.target.value)} className="field pl-10!" />
        </div>
        <select aria-label="Filtrer par statut" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="field sm:w-52!">
          <option value="all">Tous les statuts</option>
          {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-brand-dark">{error}</p>}
      {filteredOrders.length === 0 && <p className="rounded-xl bg-white p-10 text-center text-muted">Aucune commande à afficher.</p>}

      <ul className="space-y-4">
        {filteredOrders.map((order) => (
          <li key={order._id} className="rounded-2xl border border-line bg-white shadow-sm p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted">
                  {orderNumber(order._id)} · {new Date(order.createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                </p>
                <h2 className="mt-1 text-lg font-bold">{order.name}</h2>
              </div>
              <StatusBadge status={order.status || "En attente"} />
            </div>

            <p className="mt-2 flex gap-2 text-sm text-muted"><MapPin size={16} className="mt-0.5 shrink-0 text-brand" /> {order.city}, {order.address}</p>

            <OrderActions
              order={order}
              busy={busyId === order._id}
              onAdvance={(status) => updateOrder(order._id, { status })}
              onCancel={() => cancelOrder(order)}
              onRestore={() => updateOrder(order._id, { status: "En attente" })}
            />

            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {order.cartProducts?.map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-paper">
                    <Media src={item.images?.[0]} alt="" className="h-full w-full object-cover text-xs" />
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="font-medium">{item.title || "Article sans nom"}</p>
                    <p className="text-muted">
                      {item.selectedSize || "Unique"} · {formatPrice(item.price)}
                      {item.kind === "confection" && <strong className="text-brand"> · À confectionner</strong>}
                    </p>
                    {item.notes && <p className="mt-1 whitespace-pre-line rounded bg-paper p-2 text-xs">{item.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
              <div className="text-sm">
                <p className="text-muted">{order.paymentMethod || "Paiement non précisé"}</p>
                {order.shippingPending ? (
                  <label className="mt-1 block">
                    <span className="font-semibold text-brand">Fixer les frais de livraison</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="Montant, puis Entrée"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value !== "") updateOrder(order._id, { shippingCost: Number(e.currentTarget.value) });
                      }}
                      className="field mt-1"
                    />
                  </label>
                ) : order.shippingCost > 0 && (
                  <p className="text-muted">Livraison : {formatPrice(order.shippingCost)}</p>
                )}
                <p className="mt-1 text-xl font-bold">{formatPrice(order.total)}</p>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${order.phone}`} className="inline-flex h-11 items-center gap-2 rounded-lg border border-line px-4 text-sm font-semibold hover:border-ink">
                  <Phone size={16} /> {order.phone}
                </a>
                <a href={formatWhatsApp(order.phone)} target="_blank" rel="noopener noreferrer" aria-label="Écrire sur WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-700 text-white">
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
