import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export const metadata = {
  title: "Add Product",
};

export default function AddProductPage() {
  async function addProduct(formData) {
    "use server";

    const supabase = createClient();

    const name = formData.get("name");
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const file = formData.get("image");

    if (!name || !price || !stock || !file || file.size === 0) {
      throw new Error("All fields are required.");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      throw new Error("Image upload failed.");
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(filePath);

    // Insert product
    const { error: insertError } = await supabase.from("products").insert({
      name,
      price,
      stock,
      image: publicUrl,
    });

    if (insertError) {
      console.error(insertError);
      throw new Error("Failed to add product.");
    }

    redirect("/admin/products");
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Add Product</h1>

      <form action={addProduct} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price (£)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
