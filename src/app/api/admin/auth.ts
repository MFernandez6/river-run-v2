import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const ADMIN_EMAIL = "rrcboardemail@gmail.com";

export async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  const email = data?.user?.email?.toLowerCase() ?? "";
  if (error || !data?.user || email !== ADMIN_EMAIL) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, supabase };
}

