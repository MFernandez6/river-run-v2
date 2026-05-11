import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth";
import { readSiteContent, writeSiteContent } from "@/lib/site-content/io";
import type { Announcement, BoardMember } from "@/lib/admin-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  try {
    const site = await readSiteContent();
    return NextResponse.json({
      board: site.board,
      announcements: site.announcements,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Read failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.res;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const boardIn = (body as { board?: unknown }).board;
  const annIn = (body as { announcements?: unknown }).announcements;
  if (!Array.isArray(boardIn) || !Array.isArray(annIn)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const next = {
      version: 1 as const,
      board: boardIn as BoardMember[],
      announcements: (annIn as Announcement[]).slice(0, 4),
    };
    await writeSiteContent(next);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Write failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
