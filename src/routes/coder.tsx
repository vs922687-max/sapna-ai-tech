import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const Route = createFileRoute("/coder")({
  head: () => ({ meta: [{ title: "AI Coding Assistant — Bharat AI Sathi" }, { name: "description", content: "Write, debug and explain code with AI pair-programming. Coming soon." }] }),
  component: () => <ComingSoonPage slug="coder" />,
});
