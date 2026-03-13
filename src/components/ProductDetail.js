"use client";

import { useCart } from "../context/CartContext";

export default function ProductDetail({ product }) {
  const { addToCart } = useCart();

  return (
    <main className="min-h-screen bg-black text-white px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full animate-fadeInUp">
        <div className="
          rounded-xl p-10 
          bg-gradient-to-b from-black via-[#0d0d0d] to-[#1a1a1a]
          border border-[#D4AF37]/40
          shadow-[0_0_40px_rgba(212,175,55,0.25)]
        ">
          <div className="
            w-full h-80
            bg-black 
            rounded-lg 
            mb-10 
            overflow-hidden 
            flex items-center justify-center
            shadow-inner
          ">
            <img
              src={product.image}
              alt={product.name}
              className="
                w-full h-full object-contain
                transition-transform duration-500
                hover:scale-110
              "
            />
          </div>

          <h1 className="
            text-4xl font-serif mb-4 
            border-b border-[#D4AF37]/40 pb-3 
            tracking-wide
          ">
            {product.name}
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {product.description ||
              "A beautifully handcrafted piece designed with care and attention to detail. Each item in our collection is selected for its elegance, quality, and timeless appeal."}
          </p>

          <p className="text-3xl text-[#D4AF37] font-semibold mb-10">
            £{product.price.toFixed(2)}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="
              w-full py-4 rounded-lg 
              bg-[#D4AF37] text-black 
              font-medium tracking-wide
              hover:bg-white 
              transition-all duration-300
              shadow-[0_0_20px_rgba(212,175,55,0.35)]
            "
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
