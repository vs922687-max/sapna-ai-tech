import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowLeft } from "lucide-react";
import { AI_TOOLS, accentClass, type AiTool } from "@/lib/ai-tools";
import type { ReactNode } from "react";

export function AiToolShell({ slug, children }: { slug: string; children: ReactNode }) {
  const tool = AI_TOOLS.find((t) => t.slug === slug) as AiTool;
  const Icon = tool.icon;
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link to="/tools" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> All tools
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ring-1 ${accentClass[tool.accent]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">{tool.hindi}</p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{tool.title}</h1>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
          </div>
        </div>
        <div className="mt-8">{children}</div>
      </section>
      <SiteFooter />
    </div>
  );
}
