import { createClient } from "@supabase/supabase-js";

let _supabaseAdmin = null;

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return null;
    }

    _supabaseAdmin = createClient(url, key);
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
