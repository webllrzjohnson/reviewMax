import { NextResponse } from "next/server";

/** Liveness probe for Coolify/Traefik — no database required. */
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "verdict",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
