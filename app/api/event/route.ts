import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Upstream event service. When unset the route stays in local mode and only
 * writes the event to the server console (nothing leaves the machine).
 */
const UPSTREAM_BASE_URL = (process.env.EVENT_API_URL || "").trim().replace(/\/+$/, "");
const UPSTREAM_TOKEN = (process.env.EVENT_API_TOKEN || "").trim();

const MAX_BODY_BYTES = 10_000;

function resolveClientIp(request: Request): string {
  const candidates = [
    request.headers.get("x-forwarded-for"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-vercel-forwarded-for"),
    request.headers.get("cf-connecting-ip"),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const first = candidate.split(",")[0]?.trim();
    if (first) return first;
  }
  return "";
}

export async function POST(request: Request) {
  const raw = await request.text();

  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw || "{}");
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid event payload" }, { status: 400 });
  }

  const { step, data: rawData } = payload as { step?: unknown; data?: unknown };

  if (typeof step !== "string" || !step.trim()) {
    return NextResponse.json({ ok: false, error: "step is required" }, { status: 400 });
  }

  const data: Record<string, unknown> =
    rawData && typeof rawData === "object" && !Array.isArray(rawData)
      ? { ...(rawData as Record<string, unknown>) }
      : {};

  const ip = resolveClientIp(request);
  const ua = request.headers.get("user-agent") || "";
  data.ip = ip;
  data.ua = ua;

  if (!UPSTREAM_BASE_URL) {
    console.log(`[mwb:event] ${step} ${JSON.stringify(data)}`);
    return NextResponse.json({ ok: true, mode: "local" });
  }

  try {
    const upstream = await fetch(`${UPSTREAM_BASE_URL}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": ua || "mwb-event-proxy",
        ...(ip ? { "x-forwarded-for": ip } : {}),
        ...(UPSTREAM_TOKEN ? { "x-api-key": UPSTREAM_TOKEN } : {}),
      },
      body: JSON.stringify({ step, data }),
      cache: "no-store",
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Event service unavailable" },
      { status: 502 },
    );
  }
}
