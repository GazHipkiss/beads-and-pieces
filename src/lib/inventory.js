import { reduceProductStock } from "@/lib/supabase/products";

export async function reduceStock(orderItems) {
  for (const item of orderItems) {
    await reduceProductStock(item.id, item.quantity);
  }
}
