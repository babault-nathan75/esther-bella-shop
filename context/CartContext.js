"use client";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const [cartProducts, setCartProducts] = useState(() => {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    if (ls && ls.getItem('cart')) {
      try {
        return JSON.parse(ls.getItem('cart'));
      } catch (e) {
        console.error("Erreur lecture localStorage", e);
        return [];
      }
    }
    return [];
  });

  // 2. SAUVEGARDE SYNCHRONISÉE (Correction ici)
  useEffect(() => {
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    if (!ls) return;

    // On sauvegarde TOUJOURS, même si le tableau est vide []
    // Cela permet d'écraser les anciennes données quand on vide le panier
    ls.setItem('cart', JSON.stringify(cartProducts));
    
    // Si c'est vide, on peut même nettoyer proprement
    if (cartProducts.length === 0) {
      ls.removeItem('cart');
    }
  }, [cartProducts]);

  function addProduct(product, size) {
    setCartProducts(prev => [...prev, { ...product, selectedSize: size, cartId: Date.now() }]);
  }

  function removeProduct(cartId) {
    setCartProducts(prev => {
      const newCart = prev.filter(item => item.cartId !== cartId);
      // Optionnel : on peut forcer le ls ici pour une sécurité maximale
      return newCart;
    });
  }

  function clearCart() {
    setCartProducts([]);
    // Le useEffect s'occupera de faire le ls.removeItem('cart')
  }

  const isCartValid = () => {
    if (cartProducts.length === 0) return false;
    return !cartProducts.some(product => product.stock <= 0);
  };

  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, removeProduct, clearCart, isCartValid }}>
      {children}
    </CartContext.Provider>
  );
}