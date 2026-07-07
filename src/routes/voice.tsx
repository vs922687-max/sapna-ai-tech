import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const Route = createFileRoute("/voice")({
  head: () => ({ meta: [{ title: "AI Voice Assistant — Bharat AI Sathi" }, { name: "description", content: "Voice-first AI assistant for every Indian language. Coming soon." }] }),
  component: () => <ComingSoonPage slug="voice" />,
});
