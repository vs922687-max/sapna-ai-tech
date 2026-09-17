import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft, Briefcase } from "lucide-react";

const TITLE = "Post a Job — Hire Skilled Workers | Bharat AI Sathi";
const DESCRIPTION =
  "Post a job on Bharat AI Sathi and connect with skilled workers. Job posting is coming soon.";
const URL = "https://bharataisathi.com/work/post-job";

export const Route = createFileRoute("/work/post-job")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: PostJobComingSoon,
});

function PostJobComingSoon() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="glass-strong rounded-3xl border border-border/60 p-10 text-center shadow-elegant">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <Briefcase className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            Post a Job — <span className="text-gradient-tricolor">coming soon</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            Job posting for clients will be available soon. Set a clear budget, requirements and
            deadline — workers will apply.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Rocket className="h-3 w-3" /> In active development
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            Earnings are based on available work, completed tasks, quality and approval. Income is not guaranteed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="outline">
              <Link to="/work"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Work & Earn</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
