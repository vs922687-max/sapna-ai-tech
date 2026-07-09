import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowRight, Home } from "lucide-react";
import type { UtilityTool } from "@/lib/utility-tools";
import { relatedTools, CATEGORIES } from "@/lib/utility-tools";
import type { ReactNode } from "react";

export function ToolLayout({ tool, children }: { tool: UtilityTool; children: ReactNode }) {
  const Icon = tool.icon;
  const related = relatedTools(tool.slug, tool.category);
  const cat = CATEGORIES.find((c) => c.id === tool.category)!;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground"><Home className="h-3 w-3" /> Home</Link>
          <ArrowRight className="h-3 w-3" />
          <Link to="/tools" className="hover:text-foreground">Tools</Link>
          <ArrowRight className="h-3 w-3" />
          <span className="text-foreground">{cat.label}</span>
          <ArrowRight className="h-3 w-3" />
          <span className="truncate text-foreground">{tool.title}</span>
        </nav>

        <header className="glass-strong mb-6 rounded-2xl border border-border/60 p-6 shadow-elegant sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.76_0.17_55)]/25 to-[oklch(0.68_0.2_30)]/10 text-[oklch(0.76_0.17_55)] ring-1 ring-[oklch(0.76_0.17_55)]/30">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">{cat.label}</p>
              <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{tool.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{tool.description}</p>
            </div>
          </div>
        </header>

        <div className="glass rounded-2xl border border-border/60 p-4 shadow-elegant sm:p-6">
          {children}
        </div>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">
            {tool.faqs.map((f) => (
              <details key={f.q} className="glass group rounded-xl border border-border/60 p-4 open:shadow-glow">
                <summary className="cursor-pointer list-none text-sm font-medium">
                  <span className="mr-2 text-primary">▸</span>{f.q}
                </summary>
                <p className="mt-2 pl-5 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold sm:text-2xl">Related tools</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const RI = r.icon;
                return (
                  <Link key={r.slug} to="/tools/$slug" params={{ slug: r.slug }} className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur transition-colors hover:border-primary/40">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><RI className="h-4 w-4" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold group-hover:text-primary">{r.title}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{r.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
