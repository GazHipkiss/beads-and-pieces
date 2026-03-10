// src/app/api/paypal/create-order/route.js

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";

const PAYPAL_API_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
    "base64"
  );

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(req) {
  try {
    const { items, subtotal } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
      });
    }

    const accessToken = await getAccessToken();

    const total = subtotal.toFixed(2);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
              value: total,
            },
          },
        ],
        application_context: {
          brand_name: "Beads & Pieces",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${baseUrl}/checkout/paypal-success`,
          cancel_url: `${baseUrl}/checkout/cancel`,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("PayPal create order error:", err);
      return new Response(JSON.stringify({ error: "PayPal create order failed" }), {
        status: 500,
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify({ id: data.id }), {
      status: 200,
    });
  } catch (err) {
    console.error("PayPal create order error:", err);
    return new Response(JSON.stringify({ error: "PayPal create order failed" }), {
      status: 500,
    });
  }
}
