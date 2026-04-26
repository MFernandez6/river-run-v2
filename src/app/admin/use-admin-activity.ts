"use client";

import { useEffect, useRef, useCallback } from "react";
import { ADMIN_IDLE_TIMEOUT_MS } from "@/lib/admin-constants";

const adminCred = { credentials: "same-origin" as const };

const opts: AddEventListenerOptions = { passive: true, capture: true };

/** Throttle touches to the server so mousemove doesn’t flood the network */
const PING_MIN_MS = 20_000;

/**
 * Resets a timer on user activity, pings the server to extend the idle window,
 * and signs out after ADMIN_IDLE_TIMEOUT_MS of no events.
 */
export function useAdminIdleLogout() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPing = useRef(0);

  const signOutForIdle = useCallback(() => {
    void (async () => {
      try {
        await fetch("/api/admin/logout", { method: "POST", ...adminCred });
      } finally {
        window.location.assign("/admin/login?reason=idle");
      }
    })();
  }, []);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(signOutForIdle, ADMIN_IDLE_TIMEOUT_MS);
    const n = Date.now();
    if (n - lastPing.current >= PING_MIN_MS) {
      lastPing.current = n;
      void fetch("/api/admin/session", { ...adminCred }).then((r) => {
        if (r.status === 401) {
          window.location.assign("/admin/login?reason=session");
        }
      });
    }
  }, [signOutForIdle]);

  useEffect(() => {
    reset();
    const ev = [
      "keydown",
      "mousedown",
      "touchstart",
      "scroll",
      "click",
      "mousemove",
    ] as const;
    for (const e of ev) {
      window.addEventListener(e, reset, opts);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
      for (const e of ev) {
        window.removeEventListener(e, reset, opts);
      }
    };
  }, [reset]);
}
