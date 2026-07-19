import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon, ArrowLeft, Landmark, FileText, ClipboardList, Bell, Download } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GOV_SERVICES } from "@/lib/gov-services";
import { GOV_FORMS } from "@/lib/gov-forms";
import { DOC_TEMPLATES } from "@/lib/gov-documents";

export const Route = createFileRoute("/gov/search")({
  head: () => ({
    meta: [
      { title: "Search Government Services, Forms & Documents | Bharat AI Sathi" },
      { name: "description", content: "Universal search across 276 Indian government services, 60+ forms and 20+ document templates." },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/gov/search" }],
  }),
  component: SearchPage,
});

type Row = { kind: string; title: string; sub: string; to: string; params?: Record<string, string>; icon: React.ComponentType<{ className?: string }> };

function SearchPage() {
  const [q, setQ] = useState("");

  const results: Row[] = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return [];
    const rows: Row[] = [];
    for (const s of GOV_SERVICES) {
      if (s.name.toLowerCase().includes(n) || s.hindi.includes(n) || s.tagline.toLowerCase().includes(n))
        rows.push({ kind: "Service", title: s.name, sub: s.hindi + " · " + s.category, to: "/gov/$slug", params: { slug: s.slug }, icon: Landmark });
    }
    for (const f of GOV_FORMS) {
      if (f.name.toLowerCase().includes(n) || f.hindi.includes(n) || f.authority.toLowerCase().includes(n))
        rows.push({ kind: "Form", title: f.name, sub: f.hindi + " · " + f.authority, to: "/gov/forms/$slug", params: { slug: f.slug }, icon: FileText });
    }
    for (const t of DOC_TEMPLATES) {
      if (t.name.toLowerCase().includes(n) || t.hindi.includes(n) || t.description.toLowerCase().includes(n))
        rows.push({ kind: "Document", title: t.name, sub: t.hindi + " · " + t.category, to: "/gov/documents/$slug", params: { slug: t.slug }, icon: FileText });
    }
    return rows.slice(0, 60);
  }, [q]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Government</Link>
        <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Universal Search</h1>
        <p className="text-xs text-muted-foreground">Services · Forms · Documents · Bookmarks · Applications · Downloads</p>

        <div className="mt-4 relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to search everything…"
            className="w-full rounded-xl border border-border/60 bg-background/60 pl-10 pr-3 py-3 text-sm outline-none focus:border-primary/60" />
        </div>

        {!q.trim() && (
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <Link to="/gov/tracker" className="rounded-2xl border border-border/60 bg-card/40 p-4 text-sm hover:border-primary/50"><ClipboardList className="mb-2 h-4 w-4 text-primary" /> Applications</Link>
            <Link to="/gov/reminders" className="rounded-2xl border border-border/60 bg-card/40 p-4 text-sm hover:border-primary/50"><Bell className="mb-2 h-4 w-4 text-primary" /> Reminders</Link>
            <Link to="/gov/downloads" className="rounded-2xl border border-border/60 bg-card/40 p-4 text-sm hover:border-primary/50"><Download className="mb-2 h-4 w-4 text-primary" /> Downloads</Link>
            <Link to="/gov/bookmarks" className="rounded-2xl border border-border/60 bg-card/40 p-4 text-sm hover:border-primary/50"><Landmark className="mb-2 h-4 w-4 text-primary" /> Bookmarks</Link>
          </div>
        )}

        {q.trim() && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"}</p>
            {results.map((r, i) => {
              const Icon = r.icon;
              const linkProps = r.params
                ? { to: r.to as "/gov/$slug", params: r.params as { slug: string } }
                : { to: r.to as "/gov" };
              return (
                <Link key={i} {...linkProps} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 hover:border-primary/50">
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{r.kind} · {r.sub}</p>
                  </div>
                </Link>
              );
            })}
            {results.length === 0 && <p className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">No results.</p>}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
