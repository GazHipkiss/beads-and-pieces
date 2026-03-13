import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ["pending", "fulfilled", "cancelled"];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: "Invalid status" }),
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return new Response("Supabase not configured", { status: 500 });
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(error);
      return new Response("Failed to update order", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
