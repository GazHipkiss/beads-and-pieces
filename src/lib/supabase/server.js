import { createClient } from "@supabase/supabase-js";

let _supabaseAdmin = null;

function normalizeSupabaseUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  const url = raw.trim().replace(/\/+$/, "");
  if (!url.startsWith("https://")) {
    console.error(
      "NEXT_PUBLIC_SUPABASE_URL must start with https:// (no spaces or quotes)"
    );
    return null;
  }
  return url;
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!url || !key) {
      return null;
    }

    _supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _supabaseAdmin;
}

export const supabaseAdmin = new Proxy({}, {
  get(_, prop) {
    const client = getSupabaseAdmin();
    if (!client) {
      throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
    const value = client[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
