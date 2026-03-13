import { getSupabaseAdmin } from "./server";
import localProducts from "@/data/products";

function normalizeProduct(product) {
  return {
    ...product,
    image: product.image_url || product.image || "/products/placeholder.jpg",
  };
}

export async function getProducts() {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return localProducts;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return localProducts;

    return data.map(normalizeProduct);
  } catch {
    return localProducts;
  }
}

export async function getProductById(id) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return localProducts.find((p) => p.id === Number(id)) || null;
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return localProducts.find((p) => p.id === Number(id)) || null;
    }

    return normalizeProduct(data);
  } catch {
    return localProducts.find((p) => p.id === Number(id)) || null;
  }
}

export async function getProductsByCategory(category) {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return localProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category.toLowerCase())
      .order("id", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) {
      return localProducts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    return data.map(normalizeProduct);
  } catch {
    return localProducts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }
}

export async function reduceProductStock(id, quantity) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { data: product } = await supabase
    .from("products")
    .select("stock")
    .eq("id", id)
    .single();

  if (!product) return;

  const newStock = Math.max(0, (product.stock || 0) - quantity);

  await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", id);
}
