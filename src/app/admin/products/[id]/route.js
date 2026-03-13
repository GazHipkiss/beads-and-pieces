import { supabaseAdmin } from "@/lib/supabase/server";

export async function PUT(req, { params }) {
  try {
    const productId = params.id;
    const body = await req.json();

    const { error } = await supabaseAdmin
      .from("products")
      .update({
        name: body.name,
        price: body.price,
        description: body.description,
        category: body.category,
        stock: body.stock,
        image_url: body.image_url,
      })
      .eq("id", productId);

    if (error) {
      console.error(error);
      return new Response("Error updating product", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const productId = params.id;

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error(error);
      return new Response("Error deleting product", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
