"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartDrawerMinimal() {
  const {
    cart,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div
      className={`fixed inset-0 z-40 transition ${
        isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-sm 
          bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a1a1a]
          border-l border-[#D4AF37]/40
          shadow-[0_0_40px_rgba(212,175,55,0.25)]
          p-6 transform transition-transform duration-500 
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif tracking-wide">Your Cart</h2>

          <button
            onClick={closeDrawer}
            className="text-[#D4AF37] hover:text-white transition 
                       hover:rotate-90 duration-300"
          >
            ✕
          </button>
        </div>

        {/* Empty */}
        {cart.length === 0 ? (
          <p className="text-gray-400">Your cart is empty.</p>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b border-gray-700/40 pb-3"
                >
                  <div className="w-16 h-16 bg-black rounded overflow-hidden flex items-center justify-center shadow-inner">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-serif text-sm tracking-wide">{item.name}</p>
                    <p className="text-[#D4AF37] text-sm">
                      £{item.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-6 h-6 bg-[#D4AF37] text-black rounded flex items-center justify-center text-sm hover:bg-white transition"
                      >
                        –
                      </button>

                      <span className="text-sm">{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 bg-[#D4AF37] text-black rounded flex items-center justify-center text-sm hover:bg-white transition"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-xs text-red-400 hover:text-red-200 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 border-t border-gray-700/40 pt-4">
              <p className="flex justify-between text-sm mb-3">
                <span>Subtotal</span>
                <span className="text-[#D4AF37] font-semibold">
                  £{subtotal.toFixed(2)}
                </span>
              </p>

              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full text-center border border-[#D4AF37] text-[#D4AF37] py-2 rounded 
                             hover:bg-[#D4AF37] hover:text-black transition"
                >
                  View Cart
                </Link>

                <button className="w-full bg-[#D4AF37] text-black py-2 rounded hover:bg-white transition">
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
