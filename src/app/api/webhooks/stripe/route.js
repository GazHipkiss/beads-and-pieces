import Stripe from "stripe";
import { processOrder } from "@/lib/orders";

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

      await processOrder({
        items,
        subtotal,
        shipping,
        total,
        customerEmail: session.customer_details?.email || null,
        customerName: session.customer_details?.name || null,
        shippingAddress: session.shipping_details?.address || null,
        paymentMethod: "stripe",
        stripeSessionId: session.id,
      });
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return new Response("OK", { status: 200 });
}
