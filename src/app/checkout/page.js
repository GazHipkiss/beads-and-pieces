"use client";

import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { calculateShipping } from "@/lib/shipping";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();
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
        {/* Order Summary */}
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

        {/* Payment Options */}
        <div className="space-y-4">
          <h2 className="text-lg font-serif text-[#D4AF37] mb-2">Pay With</h2>

          {/* Stripe / Card */}
          <button
            onClick={handleStripeCheckout}
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-medium hover:bg-white transition disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Pay with Card"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* PayPal */}
          <div className="rounded-lg overflow-hidden">
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                currency: "GBP",
              }}
            >
            <PayPalButtons
              style={{
                layout: "vertical",
                color: "gold",
                shape: "rect",
                label: "paypal",
                height: 48,
              }}
              createOrder={async () => {
                const res = await fetch("/api/checkout/paypal/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ cart }),
                });

                const data = await res.json();

                if (data.error) {
                  alert("PayPal error: " + data.error);
                  throw new Error(data.error);
                }

                return data.id;
              }}
              onApprove={async (data) => {
                const cartData = cart.map(({ id, name, price, quantity }) => ({
                  id,
                  name,
                  price,
                  quantity,
                }));

                const res = await fetch("/api/checkout/paypal/capture", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    cart: cartData,
                  }),
                });

                const result = await res.json();

                if (result.status === "COMPLETED") {
                  clearCart();
                  router.push("/success");
                } else {
                  alert("Payment was not completed. Please try again.");
                }
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                alert("PayPal payment failed. Please try again.");
              }}
            />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
    </main>
  );
}
