import Stripe from "stripe";
import { reduceStock } from "@/lib/inventory";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendAdminOrderNotification } from "@/lib/email";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const items = JSON.parse(session.metadata.cart);
      const subtotal = parseFloat(session.metadata.subtotal) || 0;
      const shipping = parseFloat(session.metadata.shipping) || 0;
      const total = (session.amount_total || 0) / 100;
      const customerEmail = session.customer_details?.email || null;
      const customerName = session.customer_details?.name || null;
      const shippingAddress = session.shipping_details?.address || null;

      await reduceStock(items);

      let orderNumber = null;
      const supabase = getSupabaseAdmin();

      if (supabase) {
        const { data: order, error } = await supabase
          .from("orders")
          .insert({
            stripe_session_id: session.id,
            customer_email: customerEmail,
            customer_name: customerName,
            shipping_address: shippingAddress,
            items,
            subtotal,
            shipping,
            total,
            status: "pending",
          })
          .select("order_number")
          .single();

        if (error) {
          console.error("Failed to store order:", error);
        } else {
          orderNumber = order.order_number;
        }
      }

      if (customerEmail && orderNumber) {
        await sendOrderConfirmation({
          email: customerEmail,
          name: customerName,
          orderNumber,
          items,
          subtotal,
          shipping,
          total,
        });

        await sendAdminOrderNotification({
          orderNumber,
          customerName,
          customerEmail,
          total,
          items,
        });
      }
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return new Response("OK", { status: 200 });
}
