import { NextResponse } from "next/server";
import { getBoard, setBoard } from "@/lib/admin-data";
import { requireAdminSessionFromRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await requireAdminSessionFromRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ items: await getBoard() });
}

export async function PUT(req: Request) {
  if (!(await requireAdminSessionFromRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await setBoard(items);
  return NextResponse.json({ ok: true });
}
