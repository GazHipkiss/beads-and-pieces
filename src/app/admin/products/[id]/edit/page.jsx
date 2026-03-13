import { supabaseAdmin } from "@/lib/supabase/server";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }) {
  const productId = params.id;

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !product) {
    console.error(error);
    return (
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
        <p className="text-sm text-gray-500">
          The product you’re trying to edit doesn’t exist.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>
      <EditProductForm product={product} />
    </div>
  );
}
