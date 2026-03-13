import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return new Response("Supabase not configured", { status: 500 });
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name,
        price: Number(body.price),
        description: body.description,
        category: body.category,
        stock: Number(body.stock) || 0,
        image_url: body.image_url || null,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Failed to create product" }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ product: data }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
