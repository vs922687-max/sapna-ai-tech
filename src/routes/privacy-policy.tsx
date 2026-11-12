import { createFileRoute, redirect } from "@tanstack/react-router";

// Common URL people type; the policy itself lives at /privacy.
export const Route = createFileRoute("/privacy-policy")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy", statusCode: 301 });
  },
});
