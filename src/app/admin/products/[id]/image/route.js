import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req, { params }) {
  try {
    const productId = params.id;
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("No file provided", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("products")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      return new Response("Upload failed", { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({ image_url: urlData.publicUrl }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response("Error", { status: 500 });
  }
}
