import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const Route = createFileRoute("/pdf")({
  head: () => ({ meta: [{ title: "AI PDF Chat — Bharat AI Sathi" }, { name: "description", content: "Chat with any PDF — contracts, notes, research. Coming soon." }] }),
  component: () => <ComingSoonPage slug="pdf" />,
});
