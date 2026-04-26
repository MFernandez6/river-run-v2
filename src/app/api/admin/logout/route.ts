import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-auth";
import {
  adminSessionDelete,
  parseAdminSessionTokenFromCookieHeader,
} from "@/lib/admin-session-store";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const token = parseAdminSessionTokenFromCookieHeader(
    req.headers.get("cookie")
  );
  if (token) await adminSessionDelete(token);
  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}
