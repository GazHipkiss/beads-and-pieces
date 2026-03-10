"use client";
import { useCart } from "../context/CartContext";

export default function CartToast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div
      className="
        fixed bottom-8 left-1/2 -translate-x-1/2 
        px-6 py-3 rounded-lg 
        bg-gradient-to-r from-[#D4AF37] via-[#e6c76a] to-[#D4AF37]
        text-black font-medium tracking-wide
        shadow-[0_0_25px_rgba(212,175,55,0.45)]
        z-50
        animate-bounce
      "
    >
      {toast}
    </div>
  );
}