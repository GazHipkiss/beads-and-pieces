import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function PUT(req, { params }) {
  try {
    const { id: productId } = await params;
    const body = await req.json();

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return new Response("Supabase not configured", { status: 500 });
    }

    const { error } = await supabase
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
    const { id: productId } = await params;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return new Response("Supabase not configured", { status: 500 });
    }

    const { error } = await supabase
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
