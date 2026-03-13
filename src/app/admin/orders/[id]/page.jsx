import { getSupabaseAdmin } from "@/lib/supabase/server";
import OrderActions from "./OrderActions";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-6">
        <p className="text-red-500">Supabase is not configured.</p>
      </div>
    );
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-semibold mb-4">Order not found</h1>
        <p className="text-gray-500">This order doesn&apos;t exist.</p>
      </div>
    );
  }

  const items = order.items || [];
  const address = order.shipping_address;

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Order #{order.order_number}</h1>
        <OrderActions orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Customer</p>
            <p className="font-medium">{order.customer_name || "N/A"}</p>
            <p className="text-gray-600">{order.customer_email || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Date</p>
            <p className="font-medium">
              {new Date(order.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {address && (
          <div className="text-sm">
            <p className="text-gray-500 mb-1">Shipping Address</p>
            <p className="font-medium">
              {[address.line1, address.line2, address.city, address.postal_code, address.country]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        )}

        <div>
          <p className="text-gray-500 text-sm mb-3">Items</p>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm border-b pb-2">
                <span>
                  {item.name} <span className="text-gray-400">x{item.quantity}</span>
                </span>
                <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-right space-y-1 pt-2 border-t">
          <p>Subtotal: £{Number(order.subtotal).toFixed(2)}</p>
          <p>Shipping: {Number(order.shipping) > 0 ? `£${Number(order.shipping).toFixed(2)}` : "Free"}</p>
          <p className="text-lg font-semibold">
            Total: £{Number(order.total).toFixed(2)}
          </p>
        </div>

        <div className="text-xs text-gray-400 pt-2 space-y-1">
          <p>
            Payment: <span className="capitalize font-medium text-gray-600">{order.payment_method || "stripe"}</span>
          </p>
          {order.stripe_session_id && (
            <p>Stripe session: {order.stripe_session_id}</p>
          )}
          {order.paypal_order_id && (
            <p>PayPal order: {order.paypal_order_id}</p>
          )}
        </div>
      </div>
    </div>
  );
}
