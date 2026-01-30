import "./globals.css";
import Link from "next/link";
import { CartProvider } from "../context/CartContext";

import CartToast from "../components/CartToast";
import CartDrawerMinimal from "../components/CartDrawerMinimal";
import CartLink from "../components/CartLink";

export const metadata = {
  title: "Beads & Pieces",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <CartProvider>

          <header className="sticky top-0 z-[9999] bg-black flex justify-between items-center px-6 py-4 border-b border-[#D4AF37]">
            <h1 className="text-2xl font-serif">Beads & Pieces</h1>

            <nav className="space-x-6 text-[#D4AF37] font-medium flex items-center">
              <Link href="/">Home</Link>
              <Link href="/shop">Shop</Link>
              <CartLink />
            </nav>
          </header>

          <CartToast />
          <CartDrawerMinimal />

          {children}

          <footer className="bg-black text-white border-t border-[#D4AF37] mt-16">
            <div className="max-w-6xl mx-auto px-6 py-10 text-center">

              <p className="text-center mb-4">
                <span className="text-[#D4AF37] italic text-sm border-b border-[#D4AF37] pb-[2px]">
                  Made by Mel
                </span>
              </p>

              <div className="flex justify-center mb-4">
                <a
                  href="https://instagram.com/beads_n_pieces_25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"/>
                  </svg>
                </a>
              </div>

              <p className="text-gray-400 text-xs mt-2">
                Website designed by{" "}
                <a
                  href="https://purekissltd.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:text-white transition-colors"
                >
                  Pure Kiss Ltd
                </a>
              </p>

              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} All Rights Reserved
              </p>

            </div>
          </footer>

        </CartProvider>
      </body>
    </html>
  );
}
