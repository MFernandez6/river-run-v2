import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "@/lib/supabase/env";

export async function supabaseServer() {
  const cookieStore = await cookies();
  const { url, anon } = supabaseEnv();
  if (!url || !anon) throw new Error("Missing Supabase env vars");

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const c of cookiesToSet) {
          cookieStore.set(c.name, c.value, c.options);
        }
      },
    },
  });
}

