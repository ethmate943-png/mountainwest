export type EventStep = "page_view" | "credentials" | "otp";

export type EventData = Record<string, string>;

export type EventResult = { ok: boolean };

/**
 * Dispatches a step event to the server-side proxy at POST /api/event.
 * Never throws — a failed dispatch must not break the sign-in flow.
 */
export async function sendEvent(
  step: EventStep,
  data: EventData = {},
): Promise<EventResult> {
  try {
    const res = await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ step, data }),
    });

    const payload = (await res.json().catch(() => ({}))) as { ok?: boolean };
    return { ok: res.ok && payload.ok !== false };
  } catch {
    return { ok: false };
  }
}
