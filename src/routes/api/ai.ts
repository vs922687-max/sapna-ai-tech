import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { streamGatewayChat, type GatewayMessage } from "@/lib/ai-gateway.server";
import { verifyBearer } from "@/lib/verify-auth.server";

const messageSchema = z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string().trim().min(1).max(50_000) });
const bodySchema = z.object({ system: z.string().trim().max(12_000).optional(), prompt: z.string().trim().max(50_000).optional(), messages: z.array(messageSchema).max(30).optional() });

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifyBearer(request);
        if (!auth.ok) return auth.response;

        const body = bodySchema.safeParse(await request.json().catch(() => null));
        if (!body.success) return Response.json({ error: "AI request is empty or too long." }, { status: 400 });
        const messages: GatewayMessage[] = [];
        if (body.data.system) messages.push({ role: "system", content: body.data.system });
        if (body.data.messages?.length) messages.push(...body.data.messages);
        else if (body.data.prompt) messages.push({ role: "user", content: body.data.prompt });
        if (messages.length === 0)
          return Response.json({ error: "Prompt is required." }, { status: 400 });
        return streamGatewayChat(messages, undefined, request);
      },
    },
  },
});
