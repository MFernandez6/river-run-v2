import { NextResponse } from "next/server";
import { getBoard } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { items: await getBoard() },
    {
      headers: { "Cache-Control": "no-store, max-age=0" },
    }
  );
}

