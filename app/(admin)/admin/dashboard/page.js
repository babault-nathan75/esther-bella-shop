"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Download, Eye, Layers, Loader2, Minus, Package, Percent,
  Plus, ShoppingBag, Truck, Users, Wallet,
} from "lucide-react";
import { formatPrice, orderNumber } from "@/lib/shop";

const POLL_INTERVAL = 30000;
const PRESETS = [
  { days: 1, label: "Aujourd'hui" },
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "90 jours" },
];
const iso = (date) => date.toISOString().slice(0, 10);
const shiftDays = (days) => iso(new Date(Date.now() - days * 86400000));
const count = (n) => (Number(n) || 0).toLocaleString("fr-FR");
const shortDate = (text) => new Date(`${text}T00:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });

function Panel({ title, children, action, className = "" }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-4 shadow-sm md:p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Kpi({ icon: Icon, label, value, current, previous, unit = "" }) {
  const delta = current - previous;
  const percent = previous ? Math.round((delta / previous) * 100) : null;
  const Trend = delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus;
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between text-muted">
        <span className="text-sm">{label}</span>
        <Icon size={18} />
      </div>
      <p className="mt-2 truncate text-2xl font-bold tracking-tight">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${delta > 0 ? "text-green-700" : delta < 0 ? "text-brand-dark" : "text-muted"}`}>
        <Trend size={14} />
        {percent !== null ? `${percent > 0 ? "+" : ""}${percent} %` : delta ? `${delta > 0 ? "+" : ""}${count(delta)}${unit}` : "Stable"}
        <span className="font-normal text-muted">vs période préc.</span>
      </p>
    </div>
  );
}

// Une seule série par graphique, une seule échelle. Survol ou toucher : valeur du jour.
function TrendChart({ data, valueKey, format, type = "area" }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(1, ...data.map((d) => d[valueKey]));
  const x = (i) => (data.length > 1 ? (i / (data.length - 1)) * 100 : 50);
  const y = (v) => 100 - (v / max) * 96;
  const line = data.map((d, i) => `${x(i)},${y(d[valueKey])}`).join(" ");
  const active = hovered !== null ? data[hovered] : null;
  const total = data.reduce((sum, d) => sum + d[valueKey], 0);

  const onMove = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
    setHovered(type === "bars" ? Math.min(data.length - 1, Math.floor(ratio * data.length)) : Math.round(ratio * (data.length - 1)));
  };
  const markerLeft = hovered === null ? 0 : type === "bars" ? ((hovered + 0.5) / data.length) * 100 : x(hovered);

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex w-24 shrink-0 flex-col justify-between py-0.5 text-right text-xs text-muted">
          <span className="truncate">{format(max)}</span><span>0</span>
        </div>
        <div
          className="relative h-44 flex-1 touch-pan-y border-b border-line"
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHovered(null)}
          role="img"
          aria-label={`Total sur la période : ${format(total)}`}
        >
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
          {type === "bars" ? (
            <div className="absolute inset-0 flex items-end gap-[2px]">
              {data.map((d, i) => (
                <div key={d.date} className={`min-w-0 flex-1 rounded-t ${hovered === i ? "bg-brand-dark" : "bg-brand"}`} style={{ height: `${(d[valueKey] / max) * 96}%` }} />
              ))}
            </div>
          ) : (
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
              <defs>
                <linearGradient id={`fill-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--color-brand)" stopOpacity="0.22" />
                  <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {data.length > 1 && <polygon points={`0,100 ${line} 100,100`} fill={`url(#fill-${valueKey})`} />}
              <polyline points={line} fill="none" stroke="var(--color-brand)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
          )}
          {active && (
            <>
              <div className="pointer-events-none absolute inset-y-0 w-px bg-ink/30" style={{ left: `${markerLeft}%` }} />
              <div
                className="pointer-events-none absolute top-0 z-10 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow-lg"
                style={{ left: `${markerLeft}%`, transform: `translateX(${markerLeft > 60 ? "-105%" : "5%"})` }}
              >
                <span className="text-white/70">{shortDate(active.date)}</span> <strong>{format(active[valueKey])}</strong>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="ml-[6.5rem] mt-1 flex justify-between text-xs text-muted">
        <span>{data[0] && shortDate(data[0].date)}</span>
        <span>{data.length > 1 && shortDate(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
}

function RankList({ rows, format = count, empty = "Pas encore de données." }) {
  if (!rows?.length) return <p className="py-6 text-center text-sm text-muted">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span className="truncate">{row.label}</span>
            <strong className="shrink-0">{format(row.value)}</strong>
          </div>
          <div className="h-1.5 rounded-full bg-paper">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(row.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function AlertRow({ href, icon: Icon, label, value, urgent }) {
  return (
    <Link href={href} className="flex min-h-12 items-center gap-3 rounded-xl px-2 transition-colors hover:bg-paper">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${urgent && value ? "bg-red-50 text-brand" : "bg-paper text-muted"}`}><Icon size={17} /></span>
      <span className="flex-1 text-sm">{label}</span>
      <strong className={urgent && value ? "text-brand" : ""}>{count(value)}</strong>
    </Link>
  );
}

export default function AdminDashboard() {
  const [range, setRange] = useState({ days: 30, from: shiftDays(29), to: iso(new Date()) });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    return axios.get("/api/admin/stats", { params: { from: range.from, to: range.to } })
      .then((res) => { setStats(res.data); setError(""); })
      .catch(() => setError("Impossible de charger les statistiques."))
      .finally(() => setLoading(false));
  }, [range.from, range.to]);

  useEffect(() => {
    load();
    const timer = setInterval(() => { if (!document.hidden) load(); }, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [load]);

  const choosePreset = (days) => {
    setLoading(true);
    setRange({ days, from: shiftDays(days - 1), to: iso(new Date()) });
  };

  const setCustom = (changes) => {
    const next = { ...range, days: null, ...changes };
    if (next.from && next.to && next.from <= next.to) {
      setLoading(true);
      setRange(next);
    }
  };

  const kpis = useMemo(() => {
    if (!stats) return [];
    const { kpis: k, previous: p } = stats;
    return [
      { icon: Users, label: "Visiteurs", value: count(k.visitors), current: k.visitors, previous: p.visitors },
      { icon: Eye, label: "Pages vues", value: count(k.views), current: k.views, previous: p.views },
      { icon: ShoppingBag, label: "Commandes", value: count(k.orders), current: k.orders, previous: p.orders },
      { icon: BarChart3, label: "Chiffre d'affaires", value: formatPrice(k.revenue), current: k.revenue, previous: p.revenue },
      { icon: Wallet, label: "Panier moyen", value: formatPrice(k.avgBasket), current: k.avgBasket, previous: p.avgBasket },
      { icon: Percent, label: "Conversion", value: `${k.conversion} %`, current: k.conversion, previous: p.conversion, unit: " pt" },
    ];
  }, [stats]);

  if (!stats) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {error ? <p role="alert" className="text-brand-dark">{error}</p> : <Loader2 className="animate-spin text-brand" size={32} />}
      </div>
    );
  }

  const { alerts, audienceSplit, customers, catalog } = stats;

  return (
    <div className="space-y-5">
      {/* --- EN-TÊTE --- */}
      <div className="rounded-2xl bg-ink p-5 text-white md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold">Tableau de bord</h1>
            <p className="mt-1 text-white/70">Bienvenue, Queen Mooooo 👑</p>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <strong>{count(stats.online)}</strong> en ligne maintenant
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/admin/products/new" className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold hover:bg-brand-dark"><Plus size={16} /> Nouvelle tenue</Link>
          <Link href="/admin/orders" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold hover:bg-white/10"><ShoppingBag size={16} /> Commandes</Link>
          <Link href="/admin/categories" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold hover:bg-white/10"><Layers size={16} /> Rubriques</Link>
          <Link href="/admin/livraison" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold hover:bg-white/10"><Truck size={16} /> Livraison</Link>
          <a href={`/api/admin/orders/export?from=${range.from}&to=${range.to}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold hover:bg-white/10"><Download size={16} /> Exporter les commandes</a>
        </div>
      </div>

      {/* --- PÉRIODE : pilote toute la page --- */}
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map(({ days, label }) => (
          <button key={days} onClick={() => choosePreset(days)} aria-pressed={range.days === days} className={`h-10 rounded-full border px-4 text-sm font-medium ${range.days === days ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>
            {label}
          </button>
        ))}
        <div className="flex items-center gap-2 text-sm">
          <input type="date" aria-label="Du" value={range.from} max={range.to} onChange={(e) => setCustom({ from: e.target.value })} className="h-10 rounded-full border border-line bg-white px-3" />
          <span className="text-muted">au</span>
          <input type="date" aria-label="Au" value={range.to} min={range.from} max={iso(new Date())} onChange={(e) => setCustom({ to: e.target.value })} className="h-10 rounded-full border border-line bg-white px-3" />
        </div>
        {loading && <Loader2 size={18} className="animate-spin text-brand" />}
      </div>

      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-brand-dark">{error}</p>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {kpis.map((kpi) => <Kpi key={kpi.label} {...kpi} />)}
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <Panel title="Visiteurs par jour"><TrendChart data={stats.series} valueKey="visitors" format={count} /></Panel>
          <Panel title="Chiffre d'affaires par jour"><TrendChart data={stats.series} valueKey="revenue" type="bars" format={(v) => formatPrice(v)} /></Panel>
        </div>
        <div className="space-y-5">
          <Panel title="À traiter">
            <div className="-mx-2">
              <AlertRow href="/admin/orders" icon={ShoppingBag} label="Commandes en attente" value={alerts.pending} urgent />
              <AlertRow href="/admin/orders" icon={Truck} label="Frais de livraison à fixer" value={alerts.shippingToSet} urgent />
              <AlertRow href="/admin/orders" icon={Package} label="Commandes en cours" value={alerts.inProgress} />
              <AlertRow href="/admin/products" icon={AlertTriangle} label="Tenues épuisées" value={alerts.soldOut} />
            </div>
            {alerts.lowStock.length > 0 && (
              <div className="mt-3 border-t border-line pt-3">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><AlertTriangle size={15} className="text-brand" /> Stock faible</p>
                <ul className="space-y-1">
                  {alerts.lowStock.slice(0, 5).map((p) => (
                    <li key={p._id}>
                      <Link href={`/admin/products/edit/${p._id}`} className="flex min-h-9 items-center justify-between gap-3 text-sm hover:text-brand">
                        <span className="truncate">{p.title}</span><strong>{p.quantity} restant{p.quantity > 1 ? "s" : ""}</strong>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Panel>
          <Panel title="Audience et clientèle">
            <dl className="space-y-2 text-sm">
              {[
                ["Nouveaux visiteurs", audienceSplit.new],
                ["Visiteurs de retour", audienceSplit.returning],
                ["Clientes sur la période", customers.total],
                ["dont déjà clientes", customers.returning],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between"><dt className="text-muted">{label}</dt><dd className="font-semibold">{count(value)}</dd></div>
              ))}
            </dl>
          </Panel>
          <Panel title="Catalogue">
            <dl className="space-y-2 text-sm">
              {[["Tenues en ligne", catalog.total], ["Prêt à porter", catalog.ready], ["En stock", catalog.stock], ["À confectionner", catalog.confection]].map(([label, value]) => (
                <div key={label} className="flex justify-between"><dt className="text-muted">{label}</dt><dd className="font-semibold">{count(value)}</dd></div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="Tenues les plus vendues"><RankList rows={stats.topSold} /></Panel>
        <Panel title="Tenues les plus consultées"><RankList rows={stats.topViewed} /></Panel>
        <Panel title="Pages les plus vues"><RankList rows={stats.topPages} /></Panel>
        <Panel title="D'où viennent les visiteurs"><RankList rows={stats.sources} /></Panel>
        <Panel title="Appareils"><RankList rows={stats.devices} /></Panel>
        <Panel title="Lieux de livraison"><RankList rows={stats.zones} /></Panel>
        <Panel title="Modes de paiement"><RankList rows={stats.payments} /></Panel>
        <Panel title="Statut des commandes"><RankList rows={stats.statuses} /></Panel>
        <Panel title="Commandes récentes" action={<Link href="/admin/orders" className="text-sm font-semibold text-brand">Tout voir</Link>}>
          {stats.recentOrders.length ? (
            <ul className="divide-y divide-line">
              {stats.recentOrders.map((order) => (
                <li key={order._id} className="flex justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{order.name}</p>
                    <p className="text-xs text-muted">{orderNumber(order._id)} · {order.city}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-bold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted">{order.status || "En attente"}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="py-6 text-center text-sm text-muted">Aucune commande sur la période.</p>}
        </Panel>
      </div>
    </div>
  );
}
