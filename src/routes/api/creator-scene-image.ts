import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { verifyBearer } from "@/lib/verify-auth.server";

const input = z.object({ scene: z.string().trim().min(3).max(900), topic: z.string().trim().max(180), stream: z.boolean().optional() });

export const Route = createFileRoute("/api/creator-scene-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifyBearer(request);
        if (!auth.ok) return auth.response;
        const parsed = input.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Scene text is required (up to 900 characters)." }, { status: 400 });
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return Response.json({ error: "AI images are not configured." }, { status: 500 });
        const { scene, topic, stream = true } = parsed.data;
        const prompt = `Create one vivid, cinematic, photorealistic vertical 9:16 editorial image for a short video. The overall topic is: ${topic || "a short story"}. This specific moment is: ${scene}. Show a concrete subject and recognizable environment relevant to this moment; use clear lighting, rich natural colors and a strong central composition that remains legible behind a small lower-third caption. Make the image visually distinct and specific, not an abstract background, UI mockup or a text slide. No words, captions, watermarks or logos. Respect the scene's actual meaning and cultural setting.`;
        try {
          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: "openai/gpt-image-2.5-sunburst", prompt, size: "1024x1536", quality: "low", ...(stream ? { stream: true, partial_images: 1 } : {}) }),
          });
          return new Response(upstream.body, {
            status: upstream.status,
            headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json", "Cache-Control": "no-store" },
          });
        } catch {
          return Response.json({ error: "Image service could not be reached. Please try again later." }, { status: 502 });
        }
      },
    },
  },
});