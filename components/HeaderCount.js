"use client";
import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function HeaderCount() {
  const { cartProducts } = useContext(CartContext);

  if (cartProducts.length === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[11px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
      {cartProducts.length}
    </span>
  );
}
