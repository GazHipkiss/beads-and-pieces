import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const { email, total, provider, items } = await req.json();

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_email: email,
        total,
        payment_provider: provider,
        payment_status: "paid",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    for (const item of items) {
      await supabaseAdmin.from("order_items").insert({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Order logging failed" }), {
      status: 500,
    });
  }
}
