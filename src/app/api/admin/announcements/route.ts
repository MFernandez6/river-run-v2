import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("announcements")
    .select("id,title,content,date_label,type,created_at")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data ?? []).map((x) => ({
    id: String(x.id),
    title: String(x.title ?? ""),
    content: String(x.content ?? ""),
    dateLabel: String(x.date_label ?? ""),
    type: String(x.type ?? "Update"),
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

  const del = await admin.from("announcements").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });

  if (items.length === 0) return NextResponse.json({ ok: true });

  const payload = (items as Array<{ id: string; title: string; content: string; dateLabel: string; type: string }>)
    .slice(0, 4)
    .map((x) => ({
    id: x.id,
    title: x.title,
    content: x.content,
    date_label: x.dateLabel,
    type: x.type,
  }));
  const ins = await admin.from("announcements").insert(payload);
  if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

