"use client";

import { useCart } from "../context/CartContext";

export default function CartPopup() {
  const { notification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-[#D4AF37] text-black px-6 py-3 rounded-lg shadow-lg animate-fadeInUp">
      {notification}
    </div>
  );
}
