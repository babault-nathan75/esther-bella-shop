"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const API = "/api/admin/delivery-zones";

export default function DeliveryZonesPage() {
  const [zones, setZones] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("1500");
  const [error, setError] = useState("");

  const fetchZones = () => axios.get(API).then((res) => setZones(res.data));

  useEffect(() => {
    fetchZones();
  }, []);

  const showError = (err) => setError(err.response?.data?.error || "L'enregistrement a échoué.");

  const addZone = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(API, { name, price: Number(price) });
      setName("");
      fetchZones();
    } catch (err) {
      showError(err);
    }
  };

  const updateZone = async (zone, changes) => {
    setError("");
    setZones((prev) => prev.map((z) => z._id === zone._id ? { ...z, ...changes } : z));
    try {
      await axios.put(API, { _id: zone._id, ...changes });
    } catch (err) {
      showError(err);
      fetchZones();
    }
  };

  const savePrice = (zone, value) => {
    const next = Number(value);
    if (value !== "" && next >= 0 && next !== zone.price) updateZone(zone, { price: next });
  };

  const deleteZone = async (zone) => {
    if (!window.confirm(`Supprimer le lieu « ${zone.name} » ?`)) return;
    try {
      await axios.delete(`${API}?_id=${zone._id}`);
      fetchZones();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-bold">Lieux de livraison</h1>
      <p className="mb-6 mt-1 text-muted">Les changements s&apos;appliquent aussitôt à la commande. Les clientes peuvent aussi choisir « Autre lieu », avec un tarif à confirmer.</p>

      <form onSubmit={addZone} className="mb-6 grid gap-3 rounded-2xl border border-line bg-white shadow-sm p-5 sm:grid-cols-[1fr_140px_auto] sm:items-end">
        <div>
          <label htmlFor="zone-name" className="mb-1 block text-sm font-medium">Nouveau lieu</label>
          <input id="zone-name" required placeholder="Ex. Bingerville" value={name} onChange={(e) => setName(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="zone-price" className="mb-1 block text-sm font-medium">Montant (FCFA)</label>
          <input id="zone-price" type="number" min="0" inputMode="numeric" required value={price} onChange={(e) => setPrice(e.target.value)} className="field" />
        </div>
        <button className="h-12 rounded-lg bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark">Ajouter</button>
      </form>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-brand-dark">{error}</p>}

      <ul className="divide-y divide-line rounded-2xl border border-line bg-white shadow-sm">
        {zones.map((zone) => (
          <li key={zone._id} className="flex items-center gap-2 p-3">
            <p className={`min-w-0 flex-1 truncate font-medium ${zone.active ? "" : "text-muted line-through"}`}>{zone.name}</p>
            <input
              key={zone.price}
              type="number"
              min="0"
              inputMode="numeric"
              aria-label={`Montant pour ${zone.name} en FCFA`}
              defaultValue={zone.price}
              onBlur={(e) => savePrice(zone, e.target.value)}
              className="field w-24! shrink-0"
            />
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={zone.active} onChange={(e) => updateZone(zone, { active: e.target.checked })} className="h-5 w-5 accent-[var(--color-brand)]" />
              Actif
            </label>
            <button onClick={() => deleteZone(zone)} aria-label={`Supprimer ${zone.name}`} className="flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-paper hover:text-brand">
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
