import { kv } from "@vercel/kv";
import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "rr_admin_session";
const SESSION_PREFIX = "rr:admin:session:";

export function isAdminEmail(email: string) {
  return email.trim().toLowerCase() === "rrcboardemail@gmail.com";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export async function createAdminSession() {
  const token = crypto.randomBytes(32).toString("hex");
  const key = `${SESSION_PREFIX}${token}`;

  // 7 days
  const ttlSeconds = 60 * 60 * 24 * 7;
  await kv.set(key, "1", { ex: ttlSeconds });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ttlSeconds,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await kv.del(`${SESSION_PREFIX}${token}`);
  cookieStore.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const exists = await kv.get(`${SESSION_PREFIX}${token}`);
  return Boolean(exists);
}

export function verifyAdminCredentials(email: string, password: string) {
  if (!isAdminEmail(email)) return false;
  if (!getAdminPassword()) return false;
  return password === getAdminPassword();
}

