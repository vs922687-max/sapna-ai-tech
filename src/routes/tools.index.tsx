import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AI_TOOLS, accentClass } from "@/lib/ai-tools";
import { UTILITY_TOOLS, CATEGORIES, type ToolCategory } from "@/lib/utility-tools";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "AI & Utility Tools Directory — 100+ Free Tools | Bharat AI Sathi" },
      { name: "description", content: "100+ free AI, text, calculator, SEO, developer, image and utility tools. Everything in one place, no signup required." },
      { property: "og:title", content: "100+ Free AI & Utility Tools — Bharat AI Sathi" },
      { property: "og:description", content: "PDF, image, text, calculators, SEO, developer and utility tools — all free." },
      { property: "og:url", content: "https://bharataisathi.com/tools" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/tools" }],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<ToolCategory | "all">("all");
  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return UTILITY_TOOLS.filter((t) => (cat === "all" || t.category === cat) && (!term || t.title.toLowerCase().includes(term) || t.description.toLowerCase().includes(term) || t.keywords.toLowerCase().includes(term)));
  }, [q, cat]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Tools directory</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            100+ free tools, <span className="text-gradient-tricolor">all in one place.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">AI, text, calculators, SEO, developer, image and utility tools — no signup, works on mobile.</p>
        </div>

        {/* AI tools */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold">AI Tools</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AI_TOOLS.map((tool) => (
              <Link key={tool.slug} to={tool.to} className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-glow">
                <div className="flex items-start justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ring-1 ${accentClass[tool.accent]}`}>
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tool.status === "live" ? "border border-[oklch(0.66_0.16_155)]/40 bg-[oklch(0.66_0.16_155)]/10 text-[oklch(0.72_0.16_155)]" : "border border-border/60 bg-muted/40 text-muted-foreground"}`}>{tool.status === "live" ? "Live" : "Soon"}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{tool.title}</h3>
                <p className="text-xs text-muted-foreground">{tool.hindi}</p>
                <p className="mt-3 text-sm text-muted-foreground">{tool.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">Open <ArrowRight className="h-3 w-3" /></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Utility tools */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold">Utility Tools ({UTILITY_TOOLS.length})</h2>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 80+ tools…" className="w-full rounded-lg border border-border/60 bg-background/60 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/60" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setCat("all")} className={`rounded-full border px-3 py-1 text-xs font-medium ${cat === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border/60"}`}>All</button>
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCat(c.id)} className={`rounded-full border px-3 py-1 text-xs font-medium ${cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border/60"}`}>{c.label}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => {
              const Icon = t.icon;
              return (
                <Link key={t.slug} to="/tools/$slug" params={{ slug: t.slug }} className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur transition-colors hover:border-primary/40 hover:shadow-glow">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold group-hover:text-primary">{t.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </Link>
              );
            })}
            {filtered.length === 0 && <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No tools match "{q}"</p>}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
