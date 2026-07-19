import { createFileRoute } from "@tanstack/react-router";

const STT_URL = "https://ai.gateway.lovable.dev/v1/audio/transcriptions";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), { status: 500 });

        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
          return new Response(JSON.stringify({ error: "multipart/form-data required" }), { status: 400 });
        }

        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File) || file.size === 0) {
          return new Response(JSON.stringify({ error: "Audio file required" }), { status: 400 });
        }

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-transcribe");
        upstream.append("file", file, file.name || "recording.webm");

        const res = await fetch(STT_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` },
          body: upstream,
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          const msg =
            res.status === 429
              ? "Rate limited — please retry shortly."
              : res.status === 402
                ? "AI credits exhausted."
                : errText || `Transcription failed (${res.status})`;
          return new Response(JSON.stringify({ error: msg }), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
          });
        }

        const data = (await res.json().catch(() => ({}))) as { text?: string };
        return new Response(JSON.stringify({ text: data.text ?? "" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
