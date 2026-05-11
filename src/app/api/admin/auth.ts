import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionValue,
} from "@/lib/admin-session";

export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!verifyAdminSessionValue(token)) {
    return {
      ok: false as const,
      res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true as const };
}
