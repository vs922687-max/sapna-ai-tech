import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "AI Resume Builder — Bharat AI Sathi" }, { name: "description", content: "AI-crafted ATS-friendly resumes for Indian and global recruiters. Coming soon." }] }),
  component: () => <ComingSoonPage slug="resume" />,
});
