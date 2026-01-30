"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-serif text-center mb-12 border-b border-[#D4AF37] pb-4">
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-xl mb-6">Your cart is empty.</p>
          <Link
            href="/shop"
            className="text-[#D4AF37] underline hover:text-white transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 border border-[#D4AF37] rounded-xl p-4"
            >
              {/* Product Image */}
              <div className="w-28 h-28 bg-black rounded overflow-hidden flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h2 className="text-xl font-serif">{item.name}</h2>
                <p className="text-[#D4AF37] font-semibold mt-1">
                  £{item.price.toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="w-8 h-8 bg-[#D4AF37] text-black rounded flex items-center justify-center hover:bg-white transition"
                  >
                    -
                  </button>

                  <span className="text-lg">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 bg-[#D4AF37] text-black rounded flex items-center justify-center hover:bg-white transition"
                  >
                    +
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 text-red-400 hover:text-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="border-t border-[#D4AF37] pt-6 text-right">
            <p className="text-xl mb-2">
              Subtotal:{" "}
              <span className="text-[#D4AF37] font-semibold">
                £{subtotal.toFixed(2)}
              </span>
            </p>

            <Link href="/checkout">
              <button className="mt-4 bg-[#D4AF37] text-black px-8 py-3 rounded hover:bg-white transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
