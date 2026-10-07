import { createFileRoute } from "@tanstack/react-router";
import { streamGatewayChat } from "@/lib/ai-gateway.server";
import { verifyBearer } from "@/lib/verify-auth.server";
import { buildToolMessages } from "@/lib/ai-instructions.server";

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await verifyBearer(request);
        if (!auth.ok) return auth.response;

        const messages = buildToolMessages(await request.json().catch(() => null));
        if (!messages) return Response.json({ error: "Invalid AI request. Select an existing tool and provide task content." }, { status: 400 });
        return streamGatewayChat(messages, undefined, request);
      },
    },
  },
});
