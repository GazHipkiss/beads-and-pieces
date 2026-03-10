import products from "@/data/products";


export default function CategoryPage({ params }) {
  const category = params.category.toLowerCase();

  const filtered = products.filter(
    (item) => item.category.toLowerCase() === category
  );

  return (
    <main className="px-6 py-10 text-white">
      <h1 className="text-4xl font-serif mb-6 capitalize text-[#D4AF37]">
        {category}
      </h1>

      {filtered.length === 0 && (
        <p className="text-gray-400">No products found in this category.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="border border-[#D4AF37] p-4 rounded-lg">
            <img src={product.image} alt={product.name} className="mb-3" />
            <h2 className="text-lg font-medium">{product.name}</h2>
            <p className="text-gray-400">£{product.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
