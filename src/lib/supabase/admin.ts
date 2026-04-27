import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/supabase/env";

export function supabaseAdmin() {
  const { url, service } = supabaseEnv();
  if (!url || !service) throw new Error("Missing Supabase service role env vars");
  return createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

