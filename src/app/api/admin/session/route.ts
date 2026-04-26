import { NextResponse } from "next/server";
import { requireAdminSessionFromRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * Light endpoint so the client can refresh last-activity while the user
 * is active on the page (not only on save/load).
 */
export async function GET(req: Request) {
  if (!(await requireAdminSessionFromRequest(req))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
