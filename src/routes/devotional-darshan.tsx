import { createFileRoute } from "@tanstack/react-router";
import { DevotionalAnimator } from "@/components/DevotionalAnimator";
import { SiteHeader } from "@/components/site-header";

const title = "Devotional Darshan — Animate Devotional Images | Bharat AI Sathi";
const description =
  "Create an immersive devotional experience by bringing sacred images to life with the Bharat AI Sathi Devotional Image Animator.";

export const Route = createFileRoute("/devotional-darshan")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://bharataisathi.com/devotional-darshan" },
    ],
  }),
  component: DevotionalDarshanPage,
});

function DevotionalDarshanPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-3 py-8 sm:px-6 sm:py-12">
        <header className="mb-6 text-center sm:mb-8">
          <p className="text-sm font-semibold uppercase text-saffron">
            Divine Creativity
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Devotional Darshan
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Bring your devotional images to life in an immersive sacred experience.
          </p>
        </header>

        <DevotionalAnimator />
      </main>
    </div>
  );
}