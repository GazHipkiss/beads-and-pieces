"use client";

import { useCart } from "../context/CartContext";

export default function CartCount() {
  const { cart } = useCart();
  return <span className="text-sm text-[#D4AF37]">({cart.length})</span>;
}
