/** Inactivity = no requests / no client events for this long; server and browser enforce. */
export const ADMIN_IDLE_TIMEOUT_MS = 90_000;

/** KV key TTL to garbage-collect server session rows (browser cookie is session or idle-bound). */
export const ADMIN_KV_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
