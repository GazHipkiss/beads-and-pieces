"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "bracelets",
    stock: "0",
  });
  const [saving, setSaving] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("Name and price are required");
      return;
    }

    setSaving(true);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Failed to create product");
      return;
    }

    const { product } = await res.json();
    router.push(`/admin/products/${product.id}/edit`);
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Product name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (£)</label>
          <input
            className="w-full border p-2 rounded"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe this product..."
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
          >
            <option value="bracelets">Bracelets</option>
            <option value="necklaces">Necklaces</option>
            <option value="earrings">Earrings</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            className="w-full border p-2 rounded"
            value={form.stock}
            onChange={(e) => updateField("stock", e.target.value)}
            type="number"
            min="0"
          />
        </div>

        <p className="text-sm text-gray-500">
          You can upload an image after creating the product.
        </p>

        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="text-sm text-gray-600 hover:underline"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
