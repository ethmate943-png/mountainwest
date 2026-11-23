import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { isGooglebot: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
