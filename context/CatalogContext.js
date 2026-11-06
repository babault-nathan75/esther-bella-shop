"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { arrivalTime, isInStock } from "@/lib/shop";

const POLL_INTERVAL = 20000;

export const CatalogContext = createContext({ products: [], categories: [], zones: [] });
export const useCatalog = () => useContext(CatalogContext);

export function CatalogProvider({ initial, children }) {
  const [catalog, setCatalog] = useState(initial);
  const [arrivals, setArrivals] = useState([]);
  const catalogRef = useRef(initial);

  const refresh = useCallback(async () => {
    if (document.hidden) return;
    try {
      const response = await fetch(`/api/catalog?v=${catalogRef.current.version || ""}`, { cache: "no-store" });
      if (!response.ok) return;
      const next = await response.json();
      if (next.unchanged) return;

      const known = new Map(catalogRef.current.products.map((p) => [p._id, arrivalTime(p)]));
      const fresh = next.products.filter(
        (p) => isInStock(p) && (!known.has(p._id) || arrivalTime(p) > known.get(p._id))
      );

      catalogRef.current = next;
      setCatalog(next);
      if (fresh.length) setArrivals(fresh);
    } catch {
      // Connexion instable : on réessaie au prochain passage
    }
  }, []);

  useEffect(() => {
    // Le serveur ayant pu échouer au premier rendu, on récupère aussitôt si la liste est vide
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!catalogRef.current.version) refresh();
    const timer = setInterval(refresh, POLL_INTERVAL);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [refresh]);

  const dismissArrivals = useCallback(() => setArrivals([]), []);

  return (
    <CatalogContext.Provider value={{ ...catalog, arrivals, dismissArrivals }}>
      {children}
    </CatalogContext.Provider>
  );
}
