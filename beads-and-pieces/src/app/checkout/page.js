// src/app/checkout/page.jsx
"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { cart, subtotal } = useCart();
  const router = useRouter();

  const [isStripeLoading, setIsStripeLoading] = useState(false);
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const [error, setError] = useState("");

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/shop");
    }
  }, [cart, router]);

  const handleStripeCheckout = async () => {
    try {
      setError("");
      setIsStripeLoading(true);

      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Stripe checkout failed");
      }

      const data = await res.json();
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(err.message || "Stripe checkout failed");
      setIsStripeLoading(false);
    }
  };

  const renderPayPalButtons = () => {
    if (!window.paypal || !cart.length) return;

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        },
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cart.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
              subtotal,
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to create PayPal order");
          }

          const data = await res.json();
          return data.id;
        },
        onApprove: async (data) => {
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });

          if (!res.ok) {
            const body = await res.json();
            console.error("PayPal capture failed:", body);
            return;
          }

          router.push("/checkout/paypal-success");
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          setError("PayPal checkout failed");
        },
      })
      .render("#paypal-buttons-container");
  };

  useEffect(() => {
    if (isPayPalReady) {
      renderPayPalButtons();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPayPalReady, cart, subtotal]);

  if (!cart.length) {
    return (
      <main className="min-h-screen bg-black text-white px-6 flex items-center justify-center">
        <p className="text-gray-400">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-3xl bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a1a1a] border border-[#D4AF37]/40 rounded-xl p-8 shadow-[0_0_40px_rgba(212,175,55,0.25)]">
        <h1 className="text-3xl font-serif mb-6 border-b border-[#D4AF37]/40 pb-3">
          Checkout
        </h1>

        {/* Order summary */}
        <div className="mb-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-gray-700/40 pb-3"
            >
              <div>
                <p className="font-serif">{item.name}</p>
                <p className="text-sm text-gray-400">
                  Qty: {item.quantity} × £{item.price.toFixed(2)}
                </p>
              </div>
              <p className="text-[#D4AF37] font-semibold">
                £{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="flex justify-between text-lg mt-4">
            <span>Subtotal</span>
            <span className="text-[#D4AF37] font-semibold">
              £{subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Payment options */}
        <div className="space-y-4">
          {/* Stripe */}
          <button
            onClick={handleStripeCheckout}
            disabled={isStripeLoading}
            className="w-full py-3 rounded-lg bg-white text-black font-medium tracking-wide hover:bg-[#D4AF37] hover:text-black transition disabled:opacity-60"
          >
            {isStripeLoading ? "Redirecting to Stripe..." : "Pay with Card (Stripe)"}
          </button>

          {/* PayPal */}
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">
              Or pay securely with PayPal:
            </p>

            <div id="paypal-buttons-container" className="mb-2" />

            {!isPayPalReady && (
              <p className="text-xs text-gray-500">
                Loading PayPal…
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PayPal SDK */}
      {paypalClientId && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=GBP`}
          strategy="afterInteractive"
          onLoad={() => setIsPayPalReady(true)}
        />
      )}
    </main>
  );
}
