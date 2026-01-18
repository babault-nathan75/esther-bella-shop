"use client";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function HeaderCount() {
  const { cartProducts } = useContext(CartContext);
  
  if (cartProducts.length === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-primary text-yellow-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow-lg animate-in zoom-in duration-300">
      {cartProducts.length}
    </span>
  );
}