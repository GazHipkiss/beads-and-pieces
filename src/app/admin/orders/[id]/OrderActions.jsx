"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderActions({ orderId, currentStatus }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function updateStatus(newStatus) {
    if (newStatus === currentStatus) return;

    setUpdating(true);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setUpdating(false);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update order status");
    }
  }

  return (
    <div className="flex items-center gap-2">
      {currentStatus === "pending" && (
        <button
          onClick={() => updateStatus("fulfilled")}
          disabled={updating}
          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {updating ? "Updating..." : "Mark Fulfilled"}
        </button>
      )}

      {currentStatus === "fulfilled" && (
        <span className="px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded font-medium">
          Fulfilled
        </span>
      )}

      {currentStatus !== "cancelled" && (
        <button
          onClick={() => {
            if (confirm("Cancel this order?")) {
              updateStatus("cancelled");
            }
          }}
          disabled={updating}
          className="px-3 py-1.5 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50 transition disabled:opacity-50"
        >
          Cancel Order
        </button>
      )}

      {currentStatus === "cancelled" && (
        <span className="px-3 py-1.5 bg-red-100 text-red-800 text-sm rounded font-medium">
          Cancelled
        </span>
      )}
    </div>
  );
}
