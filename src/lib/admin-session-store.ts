import { kv } from "@vercel/kv";
import {
  ADMIN_IDLE_TIMEOUT_MS,
  ADMIN_KV_SESSION_TTL_SECONDS,
} from "@/lib/admin-constants";

/** Cookie name — keep in sync with middleware + admin-auth */
export const ADMIN_SESSION_COOKIE = "rr_admin_session";

const SESSION_PREFIX = "rr:admin:session:";

/** Read session token from raw Cookie header (reliable in Route Handlers on Vercel). */
export function parseAdminSessionTokenFromCookieHeader(
  cookieHeader: string | null
): string | undefined {
  if (!cookieHeader) return undefined;
  const prefix = `${ADMIN_SESSION_COOKIE}=`;
  for (const part of cookieHeader.split(";")) {
    const p = part.trim();
    if (!p.startsWith(prefix)) continue;
    const raw = p.slice(prefix.length);
    if (!raw) return undefined;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return undefined;
}

export function adminKvConfigured() {
  return Boolean(
    process.env.KV_REST_API_URL ||
      process.env.UPSTASH_REDIS_REST_URL ||
      process.env.KV_URL ||
      process.env.REDIS_URL
  );
}

type MemoryState = { sessions: Map<string, string> };

/** Same global as legacy admin-auth so existing dev sessions survive refactors */
function memoryState(): MemoryState {
  const g = globalThis as unknown as { __rr_admin_mem__?: MemoryState };
  if (!g.__rr_admin_mem__) g.__rr_admin_mem__ = { sessions: new Map() };
  return g.__rr_admin_mem__;
}

export function adminSessionStorageKey(token: string) {
  return `${SESSION_PREFIX}${token}`;
}

function parseOrMigrateLastActivity(
  raw: string
): { t: number; legacy: boolean } {
  if (raw === "1") {
    return { t: Date.now(), legacy: true };
  }
  try {
    const p = JSON.parse(raw) as { t?: number };
    if (typeof p.t === "number" && !Number.isNaN(p.t)) {
      return { t: p.t, legacy: false };
    }
  } catch {
    // fall through
  }
  return { t: Date.now(), legacy: true };
}

async function writeSessionValue(key: string, payload: string) {
  if (adminKvConfigured()) {
    await kv.set(key, payload, { ex: ADMIN_KV_SESSION_TTL_SECONDS });
  } else {
    memoryState().sessions.set(key, payload);
  }
}

/**
 * Validates session, enforces max idle, and refreshes last-activity.
 * Rejects if beyond idle window (session removed server-side).
 */
export async function validateAndTouchAdminSession(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const key = adminSessionStorageKey(token);
  let raw: string | null;
  if (adminKvConfigured()) {
    const v = await kv.get(key);
    raw = v == null ? null : String(v);
  } else {
    raw = memoryState().sessions.get(key) ?? null;
  }
  if (raw == null) return false;

  const { t: lastT } = parseOrMigrateLastActivity(raw);
  if (Date.now() - lastT > ADMIN_IDLE_TIMEOUT_MS) {
    await adminSessionDelete(token);
    return false;
  }

  const next = JSON.stringify({ t: Date.now() });
  await writeSessionValue(key, next);
  return true;
}

export async function adminSessionPut(token: string) {
  const key = adminSessionStorageKey(token);
  const next = JSON.stringify({ t: Date.now() });
  await writeSessionValue(key, next);
}

export async function adminSessionDelete(token: string) {
  const key = adminSessionStorageKey(token);
  if (adminKvConfigured()) await kv.del(key);
  else memoryState().sessions.delete(key);
}
