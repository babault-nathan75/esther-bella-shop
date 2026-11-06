"use client";
import { useCatalog } from "@/context/CatalogContext";
import { formatPrice } from "@/lib/shop";

export default function DeliveryRates() {
  const { zones } = useCatalog();
  return (
    <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
      {zones.map((zone) => (
        <li key={zone._id} className="flex justify-between gap-4 border-b border-white/10 py-2 text-sm text-white/80">
          <span>{zone.name}</span>
          <strong className="text-white">{formatPrice(zone.price)}</strong>
        </li>
      ))}
    </ul>
  );
}
