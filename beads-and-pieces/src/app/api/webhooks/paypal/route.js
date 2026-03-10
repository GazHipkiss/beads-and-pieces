import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.event_type === "CHECKOUT.ORDER.APPROVED") {
      const order = body.resource;

      const items = JSON.parse(order.purchase_units[0].custom_id);

      // Log order
      await supabaseAdmin.from("orders").insert({
        customer_email: order.payer.email_address,
        total: order.purchase_units[0].amount.value,
        payment_provider: "paypal",
        payment_status: "paid",
      });

      // Reduce stock
      for (const item of items) {
        const { data } = await supabaseAdmin
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

        await supabaseAdmin
          .from("products")
          .update({ stock: data.stock - item.quantity })
          .eq("id", item.id);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Webhook error", { status: 500 });
  }
}
re_MaYKybFH_JSJY2WSeQXHGVtdy3PqhGzdT