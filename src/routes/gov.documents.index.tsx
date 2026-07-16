import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, FileText, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DOC_TEMPLATES } from "@/lib/gov-documents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gov/documents/")({
  head: () => ({
    meta: [
      { title: "AI Document Generator — Affidavits, RTI, Letters | Bharat AI Sathi" },
      { name: "description", content: "Generate professional Indian government letters, affidavits, RTI applications, NOCs, rental agreements and more with AI — Hindi, English or bilingual." },
      { property: "og:title", content: "AI Document Generator — Bharat AI Sathi" },
      { property: "og:description", content: "20+ ready templates for Indian legal & government documents." },
    ],
    links: [{ rel: "canonical", href: "https://sapna-ai-tech.lovable.app/gov/documents" }],
  }),
  component: DocsIndex,
});

const CATS = ["All", "Affidavit", "Application", "Declaration", "Letter", "Legal", "Certificate"] as const;

function DocsIndex() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return DOC_TEMPLATES.filter((t) => (cat === "All" || t.category === cat) &&
      (!n || t.name.toLowerCase().includes(n) || t.hindi.includes(n) || t.description.toLowerCase().includes(n)));
  }, [q, cat]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <nav className="mb-3 text-xs text-muted-foreground"><Link to="/gov" className="hover:text-primary">Government</Link> / <span className="text-foreground">Documents</span></nav>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-border/60"><FileText className="h-5 w-5" /></div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">AI Document Generator</p>
              <h1 className="font-display text-3xl font-bold">Affidavits, Letters & Legal Drafts</h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Pick a template, add a few details, and get a formal Indian-style document draft in Hindi, English or both. Edit, print, or download.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search affidavit, RTI, NOC…"
                className="w-full rounded-xl border border-border/60 bg-background/60 pl-10 pr-3 py-3 text-sm outline-none focus:border-primary/60" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={cn("rounded-full border px-3 py-1.5 text-xs font-medium",
                  cat === c ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground")}>{c}</button>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Link key={t.slug} to="/gov/documents/$slug" params={{ slug: t.slug }}
              className="group rounded-2xl border border-border/60 bg-card/40 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-border/60"><FileText className="h-4 w-4" /></div>
                <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{t.category}</span>
              </div>
              <h2 className="mt-3 font-display text-base font-bold">{t.name}</h2>
              <p className="text-[11px] text-primary">{t.hindi}</p>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.description}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">Generate <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
