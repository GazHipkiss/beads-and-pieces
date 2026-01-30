"use client";

import { useState } from "react";
import Link from "next/link";
import { products as productData } from "../../data/products";

export default function ShopPage() {
  const [sortOption, setSortOption] = useState("default");
  const [category, setCategory] = useState("all");

  // Filter by category
  const filteredProducts =
    category === "all"
      ? productData
      : productData.filter((p) => p.category === category);

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceLow":
        return a.price - b.price;
      case "priceHigh":
        return b.price - a.price;
      case "nameAZ":
        return a.name.localeCompare(b.name);
      case "nameZA":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen bg-black text-white px-6 flex flex-col">

      <h1 className="text-4xl font-serif text-center mb-12 pb-4">

        My Collection
      </h1>

      {/* Category Tabs */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-center gap-6">
        {[
          { label: "All", value: "all" },
          { label: "Bracelets", value: "bracelets" },
          { label: "Necklaces", value: "necklaces" },
          { label: "Earrings", value: "earrings" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={`
              px-4 py-2 font-serif tracking-wide transition-all duration-300
              ${
                category === tab.value
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-gray-400 hover:text-[#D4AF37]"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sorting Dropdown */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-end">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-black border border-[#D4AF37] text-[#D4AF37] px-4 py-2 rounded focus:outline-none"
        >
          <option value="default">Sort By</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="nameAZ">Name: A → Z</option>
          <option value="nameZA">Name: Z → A</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {sortedProducts.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="border border-[#D4AF37] rounded-xl p-4 hover:scale-105 transition-transform duration-300"
          >
            {/* Image container */}
            <div className="w-full h-56 bg-black rounded overflow-hidden flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product name */}
            <h2 className="mt-4 text-xl font-serif">{product.name}</h2>

            {/* Price */}
            <p className="text-[#D4AF37] font-semibold mt-2">
              £{product.price.toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
