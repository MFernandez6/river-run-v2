import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

const ADMIN_EMAIL = "rrcboardemail@gmail.com";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

