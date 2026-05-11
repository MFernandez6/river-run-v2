import { NextResponse } from "next/server";
import { readSiteContent } from "@/lib/site-content/io";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const site = await readSiteContent();
    const items = site.announcements
      .slice()
      .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
      .slice(0, 4);

    return NextResponse.json(
      { items },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Read failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
