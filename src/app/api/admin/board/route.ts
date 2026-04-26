import { NextResponse } from "next/server";
import { getBoard, setBoard } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ items: await getBoard() });
}

export async function PUT(req: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await setBoard(items);
  return NextResponse.json({ ok: true });
}

