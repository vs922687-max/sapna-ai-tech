import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, FileText, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GOV_FORMS, FORM_CATEGORIES, type FormCategory } from "@/lib/gov-forms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gov/forms/")({
  head: () => ({
    meta: [
      { title: "AI Form Center — 500+ Government Forms | Bharat AI Sathi" },
      { name: "description", content: "Fill Aadhaar, PAN, Passport, PM Kisan, GST, EPFO, RTI and dozens more Indian government forms with AI auto-fill in Hindi & English." },
      { property: "og:title", content: "AI Form Center — Government Forms with AI Auto-Fill" },
      { property: "og:description", content: "Auto-fill 60+ Indian government forms from your saved profile. Free, secure, private." },
    ],
    links: [{ rel: "canonical", href: "https://sapna-ai-tech.lovable.app/gov/forms" }],
  }),
  component: FormsIndex,
});

function FormsIndex() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<FormCategory | "All">("All");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GOV_FORMS.filter((f) => {
      const catOk = cat === "All" || f.category === cat;
      const qOk = !needle ||
        f.name.toLowerCase().includes(needle) ||
        f.hindi.includes(needle) ||
        f.authority.toLowerCase().includes(needle);
      return catOk && qOk;
    });
  }, [q, cat]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <nav className="mb-3 text-xs text-muted-foreground">
            <Link to="/gov" className="hover:text-primary">Government</Link> / <span className="text-foreground">Forms</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-border/60">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">AI Form Center</p>
              <h1 className="font-display text-3xl font-bold">Government Forms with AI Auto-Fill</h1>
            </div>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Fill official Indian government forms in minutes. Auto-populate from your saved profile, edit anything, and download a clean copy in Hindi or English.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Aadhaar, PAN, GST, PM Kisan…"
                className="w-full rounded-xl border border-border/60 bg-background/60 pl-10 pr-3 py-3 text-sm outline-none focus:border-primary/60"
              />
            </div>
            <Link to="/gov/profile" className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/20">
              Manage Profile
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["All", ...FORM_CATEGORIES] as const).map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  cat === c ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground")}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="mb-4 text-xs text-muted-foreground">Showing {filtered.length} forms</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <Link key={f.slug} to="/gov/forms/$slug" params={{ slug: f.slug }}
              className="group rounded-2xl border border-border/60 bg-card/40 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-border/60">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{f.category}</span>
              </div>
              <h2 className="mt-3 font-display text-base font-bold">{f.name}</h2>
              <p className="text-[11px] text-primary">{f.hindi}</p>
              <p className="mt-1 text-xs text-muted-foreground">{f.authority}</p>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{f.description}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Fill form <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
