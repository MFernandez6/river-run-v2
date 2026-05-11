import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  adminSessionCookieOptions,
  createAdminSessionValue,
} from "@/lib/admin-session";
import {
  assertLoginAllowed,
  clearLoginFailures,
  getClientIp,
  recordLoginFailure,
} from "@/lib/login-rate-limit";

export const dynamic = "force-dynamic";

const GENERIC_ERROR = { error: "Invalid credentials" };

function verifyAdminPassword(plain: string, expectedFromEnv: string): boolean {
  const a = createHash("sha256").update(plain, "utf8").digest();
  const b = createHash("sha256").update(expectedFromEnv, "utf8").digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const gate = assertLoginAllowed(ip);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later.", retryAfterSec: gate.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(gate.retryAfterSec) } },
    );
  }

  const expected = process.env.ADMIN_SITE_PASSWORD?.trim() ?? "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
  if (!expected || !sessionSecret) {
    const hint =
      process.env.NODE_ENV !== "production"
        ? " Add ADMIN_SITE_PASSWORD and ADMIN_SESSION_SECRET to .env.local (see .env.example), then restart npm run dev."
        : "";
    return NextResponse.json(
      { error: `Server configuration incomplete.${hint}` },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const password = String(body?.password ?? "");

  if (!verifyAdminPassword(password, expected)) {
    const fail = recordLoginFailure(ip);
    if (fail.locked) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later.", retryAfterSec: fail.retryAfterSec },
        {
          status: 429,
          headers: { "Retry-After": String(fail.retryAfterSec ?? 60) },
        },
      );
    }
    return NextResponse.json(GENERIC_ERROR, { status: 401 });
  }

  const session = createAdminSessionValue();
  if (!session) {
    return NextResponse.json(
      { error: "Server configuration incomplete. Check ADMIN_SESSION_SECRET." },
      { status: 503 },
    );
  }

  clearLoginFailures(ip);
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE_NAME, session, adminSessionCookieOptions());

  return NextResponse.json({ ok: true });
}
