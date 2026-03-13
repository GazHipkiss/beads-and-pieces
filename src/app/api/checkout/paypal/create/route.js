import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";
import { calculateShipping } from "@/lib/shipping";

export async function POST(req) {
  try {
    const { cart } = await req.json();

    if (!cart || cart.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400,
      });
    }

    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const shippingCost = calculateShipping(subtotal);
    const total = subtotal + shippingCost;

    const cartData = cart.map(({ id, name, price, quantity }) => ({
      id,
      name,
      price,
      quantity,
    }));

    const itemBreakdown = cart.map((item) => ({
      name: item.name,
      quantity: String(item.quantity),
      unit_amount: {
        currency_code: "GBP",
        value: item.price.toFixed(2),
      },
    }));

    const accessToken = await getPayPalAccessToken();

    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "GBP",
              value: total.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "GBP",
                  value: subtotal.toFixed(2),
                },
                shipping: {
                  currency_code: "GBP",
                  value: shippingCost.toFixed(2),
                },
              },
            },
            items: itemBreakdown,
            custom_id: JSON.stringify(cartData),
          },
        ],
        application_context: {
          brand_name: "Beads & Pieces",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          shipping_preference: "GET_FROM_FILE",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("PayPal create order error:", err);
      return new Response(
        JSON.stringify({ error: "PayPal create order failed" }),
        { status: 500 }
      );
    }

    const data = await res.json();

    return new Response(JSON.stringify({ id: data.id }), { status: 200 });
  } catch (err) {
    console.error("PayPal create order error:", err);
    return new Response(
      JSON.stringify({ error: "PayPal create order failed" }),
      { status: 500 }
    );
  }
}
