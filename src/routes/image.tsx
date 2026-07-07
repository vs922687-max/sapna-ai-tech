import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const Route = createFileRoute("/image")({
  head: () => ({ meta: [{ title: "AI Image Generator — Bharat AI Sathi" }, { name: "description", content: "Generate stunning images from text prompts. Coming soon." }] }),
  component: () => <ComingSoonPage slug="image" />,
});
