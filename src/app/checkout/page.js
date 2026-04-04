"use client";

import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { calculateShipping } from "@/lib/shipping";

export default function CheckoutPage() {
  const { cart, subtotal } = useCart();
  const [loading, setLoading] = useState(false);

  const shippingCost = calculateShipping(subtotal);
  const total = subtotal + shippingCost;

  async function handleStripeCheckout() {
    setLoading(true);

    const res = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Stripe error:", data.error);
      alert("Payment failed: " + data.error);
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-20 text-center">
        <h1 className="text-4xl font-serif mb-6 text-[#D4AF37]">Checkout</h1>
        <p className="text-gray-400 text-lg">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-serif text-center mb-12 border-b border-[#D4AF37] pb-4">
        Checkout
      </h1>

      <div className="max-w-lg mx-auto">
        <div className="border border-[#D4AF37]/40 rounded-xl p-6 mb-8 bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a1a1a]">
          <h2 className="text-lg font-serif text-[#D4AF37] mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {item.name} <span className="text-gray-500">x{item.quantity}</span>
                </span>
                <span>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700/40 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shipping</span>
              <span>{shippingCost > 0 ? `£${shippingCost.toFixed(2)}` : "Free"}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-700/40">
              <span>Total</span>
              <span className="text-[#D4AF37]">£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-serif text-[#D4AF37] mb-2">Payment</h2>

          <button
            onClick={handleStripeCheckout}
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-medium hover:bg-white transition disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Continue to secure payment"}
          </button>

          <p className="text-gray-500 text-sm text-center leading-relaxed">
            On the next screen you can pay by card. On iPhone, Mac, or Safari,
            <span className="text-gray-400"> Apple Pay </span>
            may appear when it is set up on your device. Google Pay can show on Chrome and Android.
          </p>
        </div>
      </div>
    </main>
  );
}
