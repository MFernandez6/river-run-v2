import { kv } from "@vercel/kv";
import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "rr_admin_session";
const SESSION_PREFIX = "rr:admin:session:";

function kvConfigured() {
  return Boolean(
    process.env.KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_URL ||
      process.env.REDIS_URL
  );
}

type MemoryState = {
  sessions: Map<string, string>;
};

function memoryState(): MemoryState {
  const g = globalThis as unknown as { __rr_admin_mem__?: MemoryState };
  if (!g.__rr_admin_mem__) g.__rr_admin_mem__ = { sessions: new Map() };
  return g.__rr_admin_mem__;
}

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
  if (kvConfigured()) {
    await kv.set(key, "1", { ex: ttlSeconds });
  } else {
    // Local/dev fallback so login works without KV env vars.
    memoryState().sessions.set(key, "1");
  }

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
  if (token) {
    const key = `${SESSION_PREFIX}${token}`;
    if (kvConfigured()) await kv.del(key);
    else memoryState().sessions.delete(key);
  }
  cookieStore.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const key = `${SESSION_PREFIX}${token}`;
  if (kvConfigured()) {
    const exists = await kv.get(key);
    return Boolean(exists);
  }
  return memoryState().sessions.has(key);
}

export function verifyAdminCredentials(email: string, password: string) {
  if (!isAdminEmail(email)) return false;
  if (!getAdminPassword()) return false;
  return password === getAdminPassword();
}

