import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { items } = await req.json();

    for (const item of items) {
      const { data, error } = await supabaseAdmin
        .from("products")
        .select("stock")
        .eq("id", item.id)
        .single();

      if (error) throw error;

      const newStock = data.stock - item.quantity;

      await supabaseAdmin
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.id);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Stock reduction failed" }), {
      status: 500,
    });
  }
}
