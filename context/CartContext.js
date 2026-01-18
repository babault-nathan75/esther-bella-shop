"use client";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);

  // Charger le panier au démarrage depuis le stockage local (localStorage)
  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, []);

  // Sauvegarder dans le localStorage à chaque changement
  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem('cart', JSON.stringify(cartProducts));
    }
  }, [cartProducts]);

  function addProduct(product, size) {
    setCartProducts(prev => [...prev, { ...product, selectedSize: size, cartId: Date.now() }]);
  }

  function removeProduct(cartId) {
    setCartProducts(prev => prev.filter(item => item.cartId !== cartId));
  }

  function clearCart() {
    setCartProducts([]);
    ls?.removeItem('cart');
  }

  // --- NOUVEAU : Vérification de la validité du panier ---
  const isCartValid = () => {
    if (cartProducts.length === 0) return false;
    // Vérifie si l'un des produits dans le panier a un stock <= 0
    return !cartProducts.some(product => product.stock <= 0);
  };

  return (
    <CartContext.Provider value={{ cartProducts, setCartProducts, addProduct, removeProduct, clearCart, isCartValid  }}>
      {children}
    </CartContext.Provider>
  );
}