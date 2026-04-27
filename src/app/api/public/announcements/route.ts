import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("announcements")
    .select("id,title,content,date_label,type,created_at")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []).map((x) => ({
    id: String(x.id),
    title: String(x.title ?? ""),
    content: String(x.content ?? ""),
    dateLabel: String(x.date_label ?? ""),
    type: String(x.type ?? "Update"),
    createdAt: String(x.created_at ?? ""),
  }));

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

