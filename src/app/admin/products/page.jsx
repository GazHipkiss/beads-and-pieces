import { getSupabaseAdmin } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = getSupabaseAdmin();
  let products = null;
  let error = null;

  if (!supabase) {
    error = { message: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local" };
  } else {
    const result = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });
    products = result.data;
    error = result.error;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          + Add Product
        </Link>
      </div>

      {error && (
        <p className="text-red-500 mb-4">Error: {error.message}</p>
      )}

      {(!products || products.length === 0) && !error && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No products yet</p>
          <p className="text-sm">Click &quot;Add Product&quot; to create your first product.</p>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border rounded-lg p-4 bg-white hover:shadow-sm transition"
            >
              <div className="flex items-center gap-4">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded border"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-100 rounded border flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}

                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.category} &middot; £{Number(product.price).toFixed(2)} &middot; Stock: {product.stock ?? 0}
                    {product.active === false && (
                      <span className="ml-2 text-orange-500">(inactive)</span>
                    )}
                  </p>
                </div>
              </div>

              <Link
                href={`/admin/products/${product.id}/edit`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
