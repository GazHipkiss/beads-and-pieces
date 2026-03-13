import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";
import { calculateShipping } from "@/lib/shipping";
import { processOrder } from "@/lib/orders";

export async function POST(req) {
  try {
    const { orderID, cart } = await req.json();

    if (!orderID) {
      return new Response(JSON.stringify({ error: "No orderID provided" }), {
        status: 400,
      });
    }

    const accessToken = await getPayPalAccessToken();

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
      return new Response(
        JSON.stringify({ error: "PayPal capture failed" }),
        { status: 500 }
      );
    }

    const data = await res.json();

    if (data.status === "COMPLETED") {
      const payer = data.payer || {};
      const shipping = data.purchase_units?.[0]?.shipping || {};
      const items = cart || [];

      const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const shippingCost = calculateShipping(subtotal);
      const total = subtotal + shippingCost;

      const shippingAddress = shipping.address
        ? {
            line1: shipping.address.address_line_1 || "",
            line2: shipping.address.address_line_2 || "",
            city: shipping.address.admin_area_2 || "",
            postal_code: shipping.address.postal_code || "",
            country: shipping.address.country_code || "",
          }
        : null;

      const customerName =
        shipping.name?.full_name ||
        [payer.name?.given_name, payer.name?.surname].filter(Boolean).join(" ") ||
        null;

      await processOrder({
        items,
        subtotal,
        shipping: shippingCost,
        total,
        customerEmail: payer.email_address || null,
        customerName,
        shippingAddress,
        paymentMethod: "paypal",
        paypalOrderId: orderID,
      });
    }

    return new Response(
      JSON.stringify({ status: data.status }),
      { status: 200 }
    );
  } catch (err) {
    console.error("PayPal capture error:", err);
    return new Response(
      JSON.stringify({ error: "PayPal capture failed" }),
      { status: 500 }
    );
  }
}
