import { getSupabaseAdmin } from "@/lib/supabase/server";
import { formatSupabaseAdminError } from "@/lib/supabase/adminErrorMessage";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default async function AdminOrdersPage() {
  const supabase = getSupabaseAdmin();
  let orders = null;
  let error = null;

  if (!supabase) {
    error = { message: "Supabase is not configured" };
  } else {
    const result = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    orders = result.data;
    error = result.error;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-semibold mb-8">Orders</h1>

      {error && (
        <p className="text-red-600 mb-4 text-sm leading-relaxed max-w-2xl">
          {formatSupabaseAdminError(error)}
        </p>
      )}

      {(!orders || orders.length === 0) && !error && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No orders yet</p>
          <p className="text-sm">Orders will appear here after customers complete checkout.</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const itemCount = (order.items || []).reduce(
              (sum, i) => sum + (i.quantity || 1),
              0
            );

            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between border rounded-lg p-4 bg-white hover:shadow-sm transition block"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium">Order #{order.order_number}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {order.customer_name || order.customer_email || "Guest"} &middot;{" "}
                    {itemCount} item{itemCount !== 1 ? "s" : ""} &middot;{" "}
                    £{Number(order.total).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <span className="text-gray-400 text-sm">&rarr;</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
