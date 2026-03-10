import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const items = session.metadata.items
      ? JSON.parse(session.metadata.items)
      : [];

    // Log order
    await supabaseAdmin.from("orders").insert({
      customer_email: session.customer_details.email,
      total: session.amount_total / 100,
      payment_provider: "stripe",
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
}
