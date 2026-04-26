import crypto from "crypto";
import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionPut,
  parseAdminSessionTokenFromCookieHeader,
  validateAndTouchAdminSession,
} from "@/lib/admin-session-store";

export { ADMIN_SESSION_COOKIE };

export function isAdminEmail(email: string) {
  return email.trim().toLowerCase() === "rrcboardemail@gmail.com";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** Secure cookies are not stored/sent over http:// — breaks local admin API auth */
export function cookieSecureInProduction() {
  return process.env.NODE_ENV === "production";
}

/**
 * Session cookie: no `maxAge` = cleared when the browser is closed.
 * (Idle is enforced server-side in validateAndTouchAdminSession.)
 */
export function adminSessionCookieOptions() {
  return {
    httpOnly: true as const,
    secure: cookieSecureInProduction(),
    sameSite: "lax" as const,
    path: "/",
  };
}

/** Creates server session + returns token. Caller must set the cookie on the Response. */
export async function issueAdminSessionToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await adminSessionPut(token);
  return token;
}

export function attachAdminSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: cookieSecureInProduction(),
    sameSite: "lax",
  });
}

export async function requireAdminSessionFromRequest(
  req: Request
): Promise<boolean> {
  const fromHeader = parseAdminSessionTokenFromCookieHeader(
    req.headers.get("cookie")
  );
  if (fromHeader) return validateAndTouchAdminSession(fromHeader);
  const cookieStore = await cookies();
  return validateAndTouchAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  );
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  return validateAndTouchAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  );
}

export function verifyAdminCredentials(email: string, password: string) {
  if (!isAdminEmail(email)) return false;
  if (!getAdminPassword()) return false;
  return password === getAdminPassword();
}
