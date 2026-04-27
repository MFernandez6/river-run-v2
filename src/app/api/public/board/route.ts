import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("board_members")
    .select("id,name,position,email,phone,photo_url,created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).map((x) => ({
    id: String(x.id),
    name: String(x.name ?? ""),
    position: String(x.position ?? ""),
    email: String(x.email ?? ""),
    phone: x.phone ?? null,
    photoUrl: x.photo_url ?? null,
    createdAt: String(x.created_at ?? ""),
  }));

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

