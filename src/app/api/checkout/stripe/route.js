import Stripe from "stripe";
import { calculateShipping } from "@/lib/shipping";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req) {
  try {
    const { cart } = await req.json();

    if (!cart || cart.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 });
    }

    const subtotal = cart.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const shippingCost = calculateShipping(subtotal);

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
          images: item.image?.startsWith("http") ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const cartData = cart.map(({ id, name, price, quantity }) => ({
      id,
      name,
      price,
      quantity,
    }));

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      // Apple Pay / Google Pay show on Stripe Checkout for card when domain is verified in Dashboard
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      metadata: {
        cart: JSON.stringify(cartData),
        subtotal: subtotal.toFixed(2),
        shipping: shippingCost.toFixed(2),
      },
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
