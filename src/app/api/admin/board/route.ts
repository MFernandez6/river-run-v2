import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("board_members")
    .select("id,name,position,email,phone,photo_url,created_at")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data ?? []).map((x) => ({
    id: String(x.id),
    name: String(x.name ?? ""),
    position: String(x.position ?? ""),
    email: String(x.email ?? ""),
    phone: x.phone ?? null,
    photoUrl: x.photo_url ?? null,
    createdAt: String(x.created_at ?? ""),
  }));

  return NextResponse.json({ items });
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const admin = supabaseAdmin();

  // Simple replace strategy: clear & insert in one request cycle.
  // (Good enough for a small admin-managed list.)
  const del = await admin.from("board_members").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });

  if (items.length === 0) return NextResponse.json({ ok: true });

  const payload = (items as Array<{ id: string; name: string; position: string; email: string; phone?: string | null; photoUrl?: string | null }>).map((x) => ({
    id: x.id,
    name: x.name,
    position: x.position,
    email: x.email,
    phone: x.phone ?? null,
    photo_url: x.photoUrl ?? null,
  }));
  const ins = await admin.from("board_members").insert(payload);
  if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

