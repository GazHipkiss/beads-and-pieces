export function formatSupabaseAdminError(error) {
  if (!error) return "Unknown error";

  const msg = String(error.message || error);

  if (msg.includes("fetch failed") || msg === "TypeError: fetch failed") {
    return (
      "Could not reach Supabase from the server. Check: (1) NEXT_PUBLIC_SUPABASE_URL is exactly your " +
      "project URL from Supabase (Settings → API), with no spaces or extra characters. " +
      "(2) SUPABASE_SERVICE_ROLE_KEY is the service_role secret, not the anon key. " +
      "(3) Your Supabase project is not paused (free tier). " +
      "(4) After changing env vars on Vercel, redeploy."
    );
  }

  return msg;
}
