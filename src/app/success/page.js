"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useEffect } from "react";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 flex items-center justify-center">
      <div className="max-w-lg text-center animate-fadeInUp">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-[#D4AF37]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-serif mb-4 text-[#D4AF37]">
          Thank You!
        </h1>

        <p className="text-gray-300 text-lg mb-2">
          Your order has been placed successfully.
        </p>

        <p className="text-gray-400 mb-10">
          You&apos;ll receive a confirmation email shortly. We&apos;ll get your beautiful pieces packed and sent out to you as soon as possible.
        </p>

        <Link
          href="/shop"
          className="inline-block bg-[#D4AF37] text-black px-8 py-3 rounded-lg hover:bg-white transition font-medium tracking-wide"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
