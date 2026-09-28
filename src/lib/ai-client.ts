import { supabase } from "@/integrations/supabase/client";

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in to use AI tools.");
  return { Authorization: `Bearer ${token}` };
}

type AskAiOptions = { signal?: AbortSignal; onProgress?: (text: string) => void };

async function readAiStream(response: Response, onProgress?: (text: string) => void) {
  if (!response.body) throw new Error("AI returned no content. Please try again.");
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
      const event = JSON.parse(raw) as { type?: string; delta?: string; error?: { message?: string }; response?: { error?: { message?: string } } };
      if (event.type === "response.output_text.delta" && event.delta) { text += event.delta; onProgress?.(text); }
      if (event.type === "error" || event.type === "response.failed") throw new Error(event.error?.message || event.response?.error?.message || "AI generation stopped unexpectedly.");
    }
    if (done) break;
  }
  if (!text.trim()) throw new Error("AI returned an empty response. Please try again.");
  return text.trim();
}

export async function askAi(prompt: string, system?: string, options: AskAiOptions = {}): Promise<string> {
  const auth = await authHeaders();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify({ prompt, system }),
      signal: options.signal,
    });
    if (res.ok) return readAiStream(res, options.onProgress);
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if ((res.status === 429 || res.status >= 500) && attempt === 0) {
      const retryAfter = Number(res.headers.get("Retry-After"));
      const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1_000, 8_000) : 1_200;
      await new Promise<void>((resolve, reject) => {
        const timer = globalThis.setTimeout(resolve, delay);
        options.signal?.addEventListener("abort", () => {
          globalThis.clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        }, { once: true });
      });
      continue;
    }
    throw new Error(data.error || `AI request failed (${res.status}).`);
  }
  throw new Error("AI service is temporarily unavailable. Please try again later.");
}

export async function aiAuthHeaders(): Promise<Record<string, string>> {
  return authHeaders();
}
