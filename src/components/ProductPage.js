import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="border border-[#D4AF37] p-4 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-300 cursor-pointer">
        <div className="w-full h-48 bg-gray-800 rounded mb-4 flex items-center justify-center">
          <span className="text-gray-500">Image</span>
        </div>

        <h3 className="text-xl font-serif mb-2">{product.name}</h3>
        <p className="text-gray-300 mb-2">£{product.price.toFixed(2)}</p>

        <button className="w-full border border-black bg-black text-white py-2 hover:bg-white hover:text-black transition-all duration-300">
          View Details
        </button>
      </div>
    </Link>
  );
}
