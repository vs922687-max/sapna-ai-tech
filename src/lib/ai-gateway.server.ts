import { aiResponseHeaders, createAiRunIdFetch, incomingAiRunId } from "./ai-run-id.server";

// Server-only helper for calling the Lovable AI Gateway.
// LOVABLE_API_KEY is auto-injected — never expose it to the client.
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const DEFAULT_MODEL = "openai/gpt-6-astra";

export type GatewayMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function streamGatewayChat(
  messages: GatewayMessage[],
  model = DEFAULT_MODEL,
  request?: Request,
): Promise<Response> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return Response.json({ error: "AI service is not configured." }, { status: 500 });

  const gateway = createAiRunIdFetch(request ? incomingAiRunId(request) : undefined);
  let upstream: Response;
  try {
    upstream = await gateway.fetch(`${GATEWAY_URL}/responses`, {
      method: "POST",
      signal: request?.signal,
      headers: { "Lovable-API-Key": key, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({ model, input: messages, stream: true, store: false, reasoning: { effort: "medium", summary: "auto" }, include: ["reasoning.encrypted_content"] }),
    });
  } catch (error) {
    if (request?.signal.aborted && error instanceof Error && error.name === "AbortError") return new Response(null, { status: 499 });
    return Response.json({ error: "AI service could not be reached. Please try again." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const body = await upstream.json().catch(() => null) as { message?: string; error?: string | { message?: string } } | null;
    const error = body?.message ?? (typeof body?.error === "string" ? body.error : body?.error?.message);
    return Response.json({ error: error || `AI request failed (${upstream.status}).` }, { status: upstream.status, headers: aiResponseHeaders(upstream.headers, "application/json") });
  }

  return new Response(upstream.body, { status: 200, headers: aiResponseHeaders(upstream.headers) });
}

export async function completeGatewayChat(
  messages: GatewayMessage[],
  model = DEFAULT_MODEL,
): Promise<{ ok: true; text: string } | { ok: false; status: number; error: string }> {
  const response = await streamGatewayChat(messages, model);
  if (!response.ok || !response.body) {
    const data = await response.json().catch(() => null) as { error?: string } | null;
    return { ok: false, status: response.status, error: data?.error || `AI request failed (${response.status}).` };
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";
    for (const frame of frames) for (const line of frame.split("\n")) {
      if (!line.startsWith("data:")) continue;
      const raw = line.slice(5).trim();
      if (!raw || raw === "[DONE]") continue;
      const event = JSON.parse(raw) as { type?: string; delta?: string; error?: { message?: string } };
      if (event.type === "response.output_text.delta" && event.delta) text += event.delta;
      if (event.type === "error") return { ok: false, status: 502, error: event.error?.message || "AI generation stopped unexpectedly." };
    }
    if (done) break;
  }
  if (!text.trim()) return { ok: false, status: 502, error: "AI returned an empty response. Please try again." };
  return { ok: true, text: text.trim() };
}
