import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { verifyBearer } from "@/lib/verify-auth.server";

const payload = z.object({ text: z.string().trim().min(1).max(10_000) });

export const Route = createFileRoute("/api/creator-narration")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifyBearer(request);
        if (!auth.ok) return auth.response;
        const parsed = payload.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Narration must be between 1 and 10,000 characters." }, { status: 400 });
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "AI voice is not configured." }, { status: 500 });

        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Lovable-AIG-SDK": "fetch" },
            body: JSON.stringify({
              model: "google/gemini-3.1-flash-tts-preview",
              contents: [{ role: "user", parts: [{ text: parsed.data.text }] }],
              generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } },
              stream_format: "audio",
            }),
          });
          if (!upstream.ok) {
            const data = await upstream.json().catch(() => null) as { message?: string; error?: { message?: string } | string } | null;
            const reason = data?.message ?? (typeof data?.error === "string" ? data.error : data?.error?.message);
            return Response.json({ error: reason || `Voice generation failed (${upstream.status}).` }, { status: upstream.status });
          }
          if (!upstream.body) return Response.json({ error: "Voice generation returned no audio." }, { status: 502 });
          return new Response(upstream.body, {
            status: 200,
            headers: { "Content-Type": upstream.headers.get("content-type") ?? "audio/wav", "Cache-Control": "no-store" },
          });
        } catch {
          return Response.json({ error: "Voice service could not be reached. Try again later." }, { status: 502 });
        }
      },
    },
  },
});