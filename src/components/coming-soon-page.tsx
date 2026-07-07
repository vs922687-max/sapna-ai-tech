import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowLeft } from "lucide-react";
import { AI_TOOLS, accentClass, type AiTool } from "@/lib/ai-tools";
import type { LucideIcon } from "lucide-react";

export function ComingSoonPage({ slug }: { slug: string }) {
  const tool: AiTool | undefined = AI_TOOLS.find((t) => t.slug === slug);
  if (!tool) return null;
  const Icon: LucideIcon = tool.icon;
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="glass-strong rounded-3xl border border-border/60 p-10 text-center shadow-elegant">
          <div className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ring-1 ${accentClass[tool.accent]}`}>
            <Icon className="h-7 w-7" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary">{tool.hindi}</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {tool.title} — <span className="text-gradient-tricolor">coming soon</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">{tool.description}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Rocket className="h-3 w-3" /> In active development
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/chat">Try AI Chat now</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/tools"><ArrowLeft className="mr-1 h-4 w-4" /> All tools</Link>
            </Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
