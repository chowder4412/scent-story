import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

/** Returns the Supabase client, initialising it lazily on first call. */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables (.env.local)."
      );
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

/**
 * Legacy named export kept for backward compatibility.
 * Prefer calling getSupabase() inside request handlers instead.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});
