import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  adminSessionCookieOptions,
} from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export async function POST() {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...adminSessionCookieOptions(),
    maxAge: 0,
  });
  return NextResponse.json({ ok: true });
}
