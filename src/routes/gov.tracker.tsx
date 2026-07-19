import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, ClipboardList, Plus, Search, Trash2, Calendar } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { useGovStore, uid } from "@/lib/gov-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/tracker")({
  head: () => ({
    meta: [
      { title: "Application Tracker | Bharat AI Sathi" },
      { name: "description", content: "Track your Indian government applications, reference numbers, status updates and reminders — all in one place." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://bharataisathi.com/gov/tracker" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/gov/tracker" }],
  }),
  component: Tracker,
});

type Status = "Draft" | "Submitted" | "In Progress" | "Approved" | "Rejected";
const STATUSES: Status[] = ["Draft", "Submitted", "In Progress", "Approved", "Rejected"];

type App = {
  id: string;
  service: string;
  refNo: string;
  status: Status;
  submittedOn: string;
  followUp?: string;
  notes?: string;
};

function Tracker() {
  const [apps, setApps] = useGovStore<App[]>("applications", []);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [draft, setDraft] = useState<Partial<App>>({ status: "Submitted" });

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    return apps.filter((a) => (filter === "All" || a.status === filter) &&
      (!n || a.service.toLowerCase().includes(n) || a.refNo.toLowerCase().includes(n)));
  }, [apps, q, filter]);

  const add = () => {
    if (!draft.service?.trim() || !draft.refNo?.trim()) return toast.error("Service and reference number are required");
    setApps([{ id: uid("app"), service: draft.service.trim(), refNo: draft.refNo.trim(),
      status: (draft.status as Status) ?? "Submitted",
      submittedOn: draft.submittedOn ?? new Date().toISOString().slice(0, 10),
      followUp: draft.followUp, notes: draft.notes,
    }, ...apps]);
    setDraft({ status: "Submitted" });
    toast.success("Application tracked");
  };

  const del = (id: string) => setApps(apps.filter((a) => a.id !== id));
  const setStatus = (id: string, s: Status) => setApps(apps.map((a) => a.id === id ? { ...a, status: s } : a));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Government</Link>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-border/60"><ClipboardList className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Application Tracker</h1>
            <p className="text-xs text-muted-foreground">Save reference numbers, track status, and set follow-up dates.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Add application</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Service (e.g. PAN Card Correction)" value={draft.service ?? ""} onChange={(e) => setDraft({ ...draft, service: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <input placeholder="Reference / Application No." value={draft.refNo ?? ""} onChange={(e) => setDraft({ ...draft, refNo: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <input type="date" value={draft.submittedOn ?? ""} onChange={(e) => setDraft({ ...draft, submittedOn: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Status })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" placeholder="Follow-up date" value={draft.followUp ?? ""} onChange={(e) => setDraft({ ...draft, followUp: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <input placeholder="Notes (optional)" value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
          </div>
          <Button className="mt-3" onClick={add}><Plus className="mr-1 h-4 w-4" /> Add</Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search service or reference…"
              className="w-full rounded-xl border border-border/60 bg-background/60 pl-10 pr-3 py-2 text-sm outline-none focus:border-primary/60" />
          </div>
          <div className="flex flex-wrap gap-1">
            {(["All", ...STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={cn("rounded-full border px-3 py-1 text-xs",
                  filter === s ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground")}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">No applications tracked yet.</p>
          ) : filtered.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border/60 bg-card/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{a.service}</h3>
                  <p className="text-xs text-muted-foreground">Ref: <span className="text-foreground">{a.refNo}</span> · Submitted: {a.submittedOn}</p>
                  {a.followUp && <p className="mt-1 inline-flex items-center gap-1 text-xs text-primary"><Calendar className="h-3 w-3" /> Follow-up: {a.followUp}</p>}
                  {a.notes && <p className="mt-1 text-xs text-muted-foreground">{a.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value as Status)}
                    className="rounded-lg border border-border/60 bg-background/60 px-2 py-1 text-xs">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => del(a.id)} className="rounded-lg border border-border/60 p-1.5 text-muted-foreground hover:border-red-500/50 hover:text-red-500" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
