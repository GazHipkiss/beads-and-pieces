"use client";

import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20 flex items-center justify-center">
      <div className="max-w-lg text-center animate-fadeInUp">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-red-500/10 border-2 border-red-400/50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-4xl font-serif mb-4 text-red-400">
          Order Cancelled
        </h1>

        <p className="text-gray-300 text-lg mb-2">
          Your payment was not completed.
        </p>

        <p className="text-gray-400 mb-10">
          No worries &mdash; your items are still in your cart. You can try again whenever you&apos;re ready.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cart"
            className="inline-block bg-[#D4AF37] text-black px-8 py-3 rounded-lg hover:bg-white transition font-medium tracking-wide"
          >
            Back to Cart
          </Link>

          <Link
            href="/shop"
            className="inline-block border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-lg hover:bg-[#D4AF37] hover:text-black transition font-medium tracking-wide"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
