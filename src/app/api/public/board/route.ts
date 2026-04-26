import { NextResponse } from "next/server";
import { getBoard } from "@/lib/admin-data";

export async function GET() {
  return NextResponse.json({ items: await getBoard() });
}

