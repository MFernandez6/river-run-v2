import { NextResponse } from "next/server";
import { getAnnouncements } from "@/lib/admin-data";

export async function GET() {
  return NextResponse.json({ items: await getAnnouncements() });
}

