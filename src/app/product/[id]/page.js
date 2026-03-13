import { getProductById } from "@/lib/supabase/products";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[#D4AF37] mb-4">Product Not Found</h1>
          <p className="text-gray-400">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </main>
    );
  }

  return <ProductDetail product={product} />;
}
