"use client";
import { createContext, useEffect, useMemo, useState } from "react";
import { useCatalog } from "@/context/CatalogContext";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const { products, version } = useCatalog();
  const [storedItems, setStoredItems] = useState([]);
  const [ready, setReady] = useState(false);

  // Lecture après le montage pour que le premier rendu soit identique à celui du serveur
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('cart') || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(saved)) setStoredItems(saved);
    } catch (e) {
      console.error("Erreur lecture localStorage", e);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem('cart', JSON.stringify(storedItems));
    } catch (e) {
      console.error("Erreur écriture localStorage", e);
    }
  }, [storedItems, ready]);

  // Le panier suit le catalogue en direct : prix et disponibilité restent à jour
  const cartProducts = useMemo(() => {
    if (!version) return storedItems;
    const live = new Map(products.map((p) => [p._id, p]));
    return storedItems.map((item) => {
      const product = live.get(item._id);
      return product ? { ...item, ...product } : { ...item, available: false };
    });
  }, [storedItems, products, version]);

  function addProduct(product, size, notes = "") {
    setStoredItems(prev => [...prev, {
      _id: product._id,
      title: product.title,
      price: product.price,
      images: product.images,
      kind: product.kind,
      leadTime: product.leadTime,
      selectedSize: size,
      notes,
      cartId: `${product._id}-${Date.now()}`,
    }]);
  }

  function removeProduct(cartId) {
    setStoredItems(prev => prev.filter(item => item.cartId !== cartId));
  }

  function clearCart() {
    setStoredItems([]);
  }

  return (
    <CartContext.Provider value={{ cartProducts, ready, addProduct, removeProduct, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
