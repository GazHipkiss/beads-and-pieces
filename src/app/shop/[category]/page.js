import { getProducts } from "@/lib/supabase/products";
import ShopClient from "@/components/ShopClient";

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const products = await getProducts();

  return <ShopClient products={products} initialCategory={category.toLowerCase()} />;
}
