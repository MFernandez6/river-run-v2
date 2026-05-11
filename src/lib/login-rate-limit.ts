/**
 * Best-effort per-IP login throttling (in-memory).
 * On multi-instance serverless deploys, use a shared store (e.g. Vercel KV / Upstash).
 */

type Entry = { failures: number; windowStart: number; lockedUntil: number };

const store = new Map<string, Entry>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 12;
const LOCKOUT_MS = 30 * 60 * 1000;

function prune(now: number) {
  for (const [k, v] of store) {
    if (v.lockedUntil < now && now - v.windowStart > WINDOW_MS * 2) {
      store.delete(k);
    }
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export function assertLoginAllowed(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  prune(now);
  const e = store.get(ip);
  if (e && e.lockedUntil > now) {
    return { ok: false, retryAfterSec: Math.ceil((e.lockedUntil - now) / 1000) };
  }
  return { ok: true };
}

export function recordLoginFailure(ip: string): { locked: boolean; retryAfterSec?: number } {
  const now = Date.now();
  let e = store.get(ip);
  if (!e || now - e.windowStart > WINDOW_MS) {
    e = { failures: 0, windowStart: now, lockedUntil: 0 };
  }
  if (e.lockedUntil > now) {
    return { locked: true, retryAfterSec: Math.ceil((e.lockedUntil - now) / 1000) };
  }
  e.failures += 1;
  if (e.failures >= MAX_FAILURES) {
    e.lockedUntil = now + LOCKOUT_MS;
    e.failures = 0;
    e.windowStart = now;
  }
  store.set(ip, e);
  if (e.lockedUntil > now) {
    return { locked: true, retryAfterSec: Math.ceil((e.lockedUntil - now) / 1000) };
  }
  return { locked: false };
}

export function clearLoginFailures(ip: string) {
  store.delete(ip);
}
