import { reduceStock } from "@/lib/inventory";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendOrderConfirmation, sendAdminOrderNotification } from "@/lib/email";

export async function processOrder({
  items,
  subtotal,
  shipping,
  total,
  customerEmail,
  customerName,
  shippingAddress,
  paymentMethod,
  stripeSessionId = null,
  paypalOrderId = null,
}) {
  await reduceStock(items);

  let orderNumber = null;
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        stripe_session_id: stripeSessionId,
        paypal_order_id: paypalOrderId,
        payment_method: paymentMethod,
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

  return { orderNumber };
}
