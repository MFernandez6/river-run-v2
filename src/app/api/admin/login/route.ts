import { NextResponse } from "next/server";
import {
  attachAdminSessionCookie,
  issueAdminSessionToken,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "");
    const password = String(body?.password ?? "");

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await issueAdminSessionToken();
    const res = NextResponse.json({ ok: true });
    attachAdminSessionCookie(res, token);
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
