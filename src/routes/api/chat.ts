import { createFileRoute } from "@tanstack/react-router";
import { streamGatewayChat } from "@/lib/ai-gateway.server";
import { verifyBearer } from "@/lib/verify-auth.server";
import { buildChatMessages } from "@/lib/ai-instructions.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifyBearer(request);
        if (!auth.ok) return auth.response;

        const messages = buildChatMessages(await request.json().catch(() => null));
        if (!messages) return Response.json({ error: "Invalid chat request." }, { status: 400 });
        return streamGatewayChat(messages, undefined, request);
      },
    },
  },
});
