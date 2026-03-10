// src/app/api/paypal/capture-order/route.js

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
    const { orderID } = await req.json();

    if (!orderID) {
      return new Response(JSON.stringify({ error: "No orderID provided" }), {
        status: 400,
      });
    }

    const accessToken = await getAccessToken();

    const res = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("PayPal capture error:", err);
      return new Response(JSON.stringify({ error: "PayPal capture failed" }), {
        status: 500,
      });
    }

    const data = await res.json();

    // TODO: reduce stock here based on metadata / items

    return new Response(JSON.stringify({ status: "COMPLETED", data }), {
      status: 200,
    });
  } catch (err) {
    console.error("PayPal capture error:", err);
    return new Response(JSON.stringify({ error: "PayPal capture failed" }), {
      status: 500,
    });
  }
}
