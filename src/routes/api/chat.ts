import { createFileRoute } from "@tanstack/react-router";
import { streamGatewayChat, type GatewayMessage } from "@/lib/ai-gateway.server";

type ChatBody = {
  messages?: GatewayMessage[];
  system?: string;
  model?: string;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ChatBody;
        try {
          body = (await request.json()) as ChatBody;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) {
          return new Response("messages required", { status: 400 });
        }

        const withSystem: GatewayMessage[] = body.system
          ? [{ role: "system", content: body.system }, ...messages]
          : messages;

        return streamGatewayChat(withSystem, body.model);
      },
    },
  },
});
