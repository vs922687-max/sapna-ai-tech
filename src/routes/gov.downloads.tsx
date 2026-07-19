import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Download as DownloadIcon, Search, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useGovStore } from "@/lib/gov-store";
import { type DownloadItem, downloadTextFile } from "@/lib/gov-download";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gov/downloads")({
  head: () => ({
    meta: [
      { title: "Download Center | Bharat AI Sathi" },
      { name: "description", content: "All your generated forms, documents, letters and certificates in one place." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://bharataisathi.com/gov/downloads" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/gov/downloads" }],,
  }),
  component: Downloads,
});

const KINDS = ["All", "Form", "Document", "Letter", "Certificate", "Receipt"] as const;

function Downloads() {
  const [items, setItems] = useGovStore<DownloadItem[]>("downloads", []);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("All");

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return items.filter((d) => (kind === "All" || d.kind === kind) &&
      (!n || d.name.toLowerCase().includes(n) || (d.category ?? "").toLowerCase().includes(n)));
  }, [items, q, kind]);

  const del = (id: string) => setItems(items.filter((d) => d.id !== id));
  const redownload = (d: DownloadItem) => {
    if (!d.content) return;
    downloadTextFile(`${d.name.replace(/\s+/g, "-")}.txt`, d.content);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Government</Link>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-border/60"><DownloadIcon className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Download Center</h1>
            <p className="text-xs text-muted-foreground">Everything you've generated — search, re-download, or delete.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search downloads…"
              className="w-full rounded-xl border border-border/60 bg-background/60 pl-10 pr-3 py-2 text-sm outline-none focus:border-primary/60" />
          </div>
          <div className="flex flex-wrap gap-1">
            {KINDS.map((k) => (
              <button key={k} onClick={() => setKind(k)}
                className={cn("rounded-full border px-3 py-1 text-xs",
                  kind === k ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground")}>{k}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">Nothing here yet. Generate a form or document to see it here.</p>
          ) : filtered.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">{d.kind}{d.category ? ` · ${d.category}` : ""} · {new Date(d.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-1">
                {d.content && <button onClick={() => redownload(d)} className="rounded-lg border border-border/60 p-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary" aria-label="Re-download"><DownloadIcon className="h-3.5 w-3.5" /></button>}
                <button onClick={() => del(d.id)} className="rounded-lg border border-border/60 p-1.5 text-muted-foreground hover:border-red-500/50 hover:text-red-500" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
