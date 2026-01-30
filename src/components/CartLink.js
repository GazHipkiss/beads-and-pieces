"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function CartLink() {
  const { cart } = useCart();
  const [animate, setAnimate] = useState(false);

  // Trigger animation when cart changes
  useEffect(() => {
    if (cart.length === 0) return;

    setAnimate(true);

    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [cart.length]);

  return (
    <Link href="/cart" className="flex items-center gap-2 relative">
      <span className="flex items-center gap-1">
        {/* Tiny cart icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-[#D4AF37]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          <circle cx="9" cy="19" r="2" />
          <circle cx="17" cy="19" r="2" />
        </svg>

        Cart
      </span>

      {/* Badge */}
      <span
        className={`
          inline-flex items-center justify-center
          w-6 h-6 rounded-full text-black text-sm font-bold
          transition-all duration-300
          ${animate ? "scale-125" : "scale-100"}

          /* Gold gradient */
          bg-gradient-to-br from-[#F7D774] to-[#D4AF37]

          /* Glow pulse */
          ${animate ? "shadow-[0_0_12px_3px_rgba(212,175,55,0.7)]" : ""}
        `}
      >
        {cart.length}
      </span>

      {/* Sparkle effect */}
      {animate && (
        <span className="absolute -top-1 -right-1 text-[#F7D774] animate-ping text-xs">
          ✨
        </span>
      )}
    </Link>
  );
}
