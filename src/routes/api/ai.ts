// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { completeGatewayChat, type GatewayMessage } from "@/lib/ai-gateway.server";
import { verifyBearer } from "@/lib/verify-auth.server";

type Body = { system?: string; prompt?: string; messages?: GatewayMessage[]; model?: string };

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifyBearer(request);
        if (!auth.ok) return auth.response;

        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
        }
        const messages: GatewayMessage[] = [];
        if (body.system) messages.push({ role: "system", content: body.system });
        if (body.messages?.length) messages.push(...body.messages);
        else if (body.prompt) messages.push({ role: "user", content: body.prompt });
        if (messages.length === 0)
          return new Response(JSON.stringify({ error: "prompt or messages required" }), { status: 400 });

        const result = await completeGatewayChat(messages, body.model);
        if (!result.ok) {
          const msg =
            result.status === 429
              ? "Rate limited — please retry in a moment."
              : result.status === 402
                ? "AI credits exhausted. Please upgrade."
                : result.error;
          return new Response(JSON.stringify({ error: msg }), {
            status: result.status,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ text: result.text }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
