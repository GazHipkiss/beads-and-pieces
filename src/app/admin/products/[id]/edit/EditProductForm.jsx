"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProductForm({ product }) {
  const router = useRouter();
  const productId = product.id;

  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price || "",
    description: product.description || "",
    category: product.category || "",
    stock: product.stock || "",
    image_url: product.image_url || "",
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);

    const res = await fetch(`/admin/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        description: form.description,
        category: form.category,
        stock: Number(form.stock),
        image_url: form.image_url,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      console.error(await res.text());
      alert("Error saving product");
      return;
    }

    router.push("/admin/products");
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleting(true);

    const res = await fetch(`/admin/products/${productId}`, {
      method: "DELETE",
    });

    setDeleting(false);

    if (!res.ok) {
      console.error(await res.text());
      alert("Error deleting product");
      return;
    }

    router.push("/admin/products");
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/admin/products/${productId}/image`, {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      console.error(await res.text());
      alert("Image upload failed");
      return;
    }

    const data = await res.json();
    updateField("image_url", data.image_url);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Product name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            className="w-full border p-2 rounded"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            className="w-full border p-2 rounded"
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            placeholder="Category"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            className="w-full border p-2 rounded"
            value={form.stock}
            onChange={(e) => updateField("stock", e.target.value)}
            placeholder="Stock"
            type="number"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Product Image</label>

          {form.image_url && (
            <img
              src={form.image_url}
              alt="Product"
              className="w-32 h-32 object-cover rounded border mb-2"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2 rounded"
          />

          {uploading && (
            <p className="text-xs text-gray-500">Uploading image…</p>
          )}

          <input
            className="w-full border p-2 rounded mt-2"
            value={form.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="Image URL"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm text-gray-600 hover:underline"
        >
          Cancel
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded border border-red-500 text-red-600 text-sm"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
