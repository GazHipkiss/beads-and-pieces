import { getProducts } from "@/lib/supabase/products";
import ShopClient from "@/components/ShopClient";

export default async function ShopPage() {
  const products = await getProducts();

  return <ShopClient products={products} />;
}
