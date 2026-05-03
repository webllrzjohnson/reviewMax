import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

/** Anonymous Supabase client (no cookies). Use in sitemap/build contexts. */
export function createAnonymousClient(): SupabaseClient<Database> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as unknown as SupabaseClient<Database>;
}
