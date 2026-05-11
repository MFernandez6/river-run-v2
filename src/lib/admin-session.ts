import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "rrc_site_admin";

export { COOKIE as ADMIN_SESSION_COOKIE_NAME };

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
}

/** Signed payload: base64url(json).base64url(hmac) */
export function createAdminSessionValue(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp }), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const secret = getSecret();
  if (!secret) return false;
  const i = value.lastIndexOf(".");
  if (i <= 0) return false;
  const payload = value.slice(0, i);
  const sig = value.slice(i + 1);
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
    };
    return typeof json.exp === "number" && json.exp > Date.now();
  } catch {
    return false;
  }
}

export function adminSessionCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true as const,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  };
}
