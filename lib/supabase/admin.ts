import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

/** Service role client for webhook and trusted server-only operations. */
export function createServiceRoleClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase URL or service role key");
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  }) as unknown as SupabaseClient<Database>;
}
