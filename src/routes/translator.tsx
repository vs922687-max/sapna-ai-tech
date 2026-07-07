import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const Route = createFileRoute("/translator")({
  head: () => ({ meta: [{ title: "Indian Language Translator — Bharat AI Sathi" }, { name: "description", content: "Translate across Hindi, Tamil, Bengali, Marathi and more. Coming soon." }] }),
  component: () => <ComingSoonPage slug="translator" />,
});
