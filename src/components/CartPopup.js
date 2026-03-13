"use client";

import { useCart } from "../context/CartContext";

export default function CartPopup() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-[#D4AF37] text-black px-6 py-3 rounded-lg shadow-lg animate-fadeInUp">
      {toast}
    </div>
  );
}
