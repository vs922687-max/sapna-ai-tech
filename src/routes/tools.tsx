import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AI_TOOLS, accentClass } from "@/lib/ai-tools";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "AI Tools Directory — Bharat AI Sathi" },
      { name: "description", content: "Explore 12+ AI tools: chat, image, PDF, voice, translator, coder, resume and more." },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Tools directory</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Every AI tool you need, <span className="text-gradient-tricolor">in one place.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Chat, create, translate, code and more. New tools ship every month.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              to={tool.to}
              className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ring-1 ${accentClass[tool.accent]}`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  tool.status === "live"
                    ? "border border-[oklch(0.66_0.16_155)]/40 bg-[oklch(0.66_0.16_155)]/10 text-[oklch(0.72_0.16_155)]"
                    : "border border-border/60 bg-muted/40 text-muted-foreground"
                }`}>
                  {tool.status === "live" ? "Live" : "Soon"}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{tool.title}</h3>
              <p className="text-xs text-muted-foreground">{tool.hindi}</p>
              <p className="mt-3 text-sm text-muted-foreground">{tool.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
