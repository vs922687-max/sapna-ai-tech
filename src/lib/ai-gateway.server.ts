// Server-only helper for calling the Lovable AI Gateway.
// LOVABLE_API_KEY is auto-injected — never expose it to the client.
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export type GatewayMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function streamGatewayChat(
  messages: GatewayMessage[],
  model = "google/gemini-2.5-flash",
): Promise<Response> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

  const upstream = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: true }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    return new Response(text || "Upstream error", { status: upstream.status });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function completeGatewayChat(
  messages: GatewayMessage[],
  model = "google/gemini-2.5-flash",
): Promise<{ ok: true; text: string } | { ok: false; status: number; error: string }> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return { ok: false, status: 500, error: "Missing LOVABLE_API_KEY" };

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return { ok: false, status: res.status, error: errText || `Upstream ${res.status}` };
  }
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = json.choices?.[0]?.message?.content ?? "";
  return { ok: true, text };
}
