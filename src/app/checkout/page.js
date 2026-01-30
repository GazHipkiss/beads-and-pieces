"use client";

import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();

  async function handleStripeCheckout() {
    const res = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Stripe error:", data.error);
      alert("Payment failed: " + data.error);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-serif text-center mb-12 border-b border-[#D4AF37] pb-4">
        Checkout
      </h1>

      <div className="max-w-xl mx-auto text-center">
        <p className="text-lg mb-6">
          You are about to pay for {cart.length} item{cart.length !== 1 && "s"}.
        </p>

        <button
          onClick={handleStripeCheckout}
          className="bg-[#D4AF37] text-black px-8 py-3 rounded hover:bg-white transition"
        >
          Pay with Card (Stripe)
        </button>
      </div>
    </main>
  );
}
