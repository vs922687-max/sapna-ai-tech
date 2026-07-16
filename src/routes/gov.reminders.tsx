import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bell, Plus, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { useGovStore, uid } from "@/lib/gov-store";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/reminders")({
  head: () => ({
    meta: [
      { title: "Smart Reminders — Passport, DL, Aadhaar renewals | Bharat AI Sathi" },
      { name: "description", content: "Never miss a passport, driving licence, PAN update, Aadhaar update or scheme deadline. Ready for email & SMS notifications." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reminders,
});

type Reminder = {
  id: string;
  title: string;
  date: string; // due
  channel: "In-app" | "Email" | "SMS";
  note?: string;
};

const SUGGESTIONS = [
  "Passport renewal (10 years)",
  "Driving Licence renewal",
  "PAN update / verification",
  "Aadhaar biometric update",
  "Vehicle insurance renewal",
  "PPF annual deposit",
  "Income Tax Return filing",
  "Property tax due",
  "LPG e-KYC",
  "Scholarship application",
];

function daysUntil(d: string): number {
  const target = new Date(d + "T00:00:00");
  return Math.ceil((target.getTime() - Date.now()) / 86400000);
}

function Reminders() {
  const [items, setItems] = useGovStore<Reminder[]>("reminders", []);
  const [draft, setDraft] = useState<Partial<Reminder>>({ channel: "In-app" });

  const add = (title?: string) => {
    const t = title ?? draft.title;
    if (!t?.trim() || !draft.date) return toast.error("Title and date are required");
    setItems([{ id: uid("rem"), title: t.trim(), date: draft.date, channel: draft.channel ?? "In-app", note: draft.note }, ...items]);
    setDraft({ channel: "In-app" });
    toast.success("Reminder saved");
  };
  const del = (id: string) => setItems(items.filter((r) => r.id !== id));

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Government</Link>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-border/60"><Bell className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Smart Reminders</h1>
            <p className="text-xs text-muted-foreground">Track renewals & deadlines. Email/SMS delivery unlocks when notifications are wired.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Add reminder</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Title (e.g. Passport renewal)" value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <input type="date" value={draft.date ?? ""} onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <select value={draft.channel} onChange={(e) => setDraft({ ...draft, channel: e.target.value as Reminder["channel"] })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm">
              <option>In-app</option><option>Email</option><option>SMS</option>
            </select>
            <input placeholder="Note (optional)" value={draft.note ?? ""} onChange={(e) => setDraft({ ...draft, note: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
          </div>
          <Button className="mt-3" onClick={() => add()}><Plus className="mr-1 h-4 w-4" /> Add reminder</Button>
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Quick add</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setDraft({ ...draft, title: s })}
                  className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground">{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {sorted.length === 0 ? (
            <p className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">No reminders yet.</p>
          ) : sorted.map((r) => {
            const d = daysUntil(r.date);
            const overdue = d < 0;
            const soon = d >= 0 && d <= 7;
            return (
              <div key={r.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{r.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Due {r.date} · {r.channel}
                    <span className={overdue ? " text-red-500" : soon ? " text-primary" : " text-muted-foreground"}>
                      {" · "}{overdue ? `${-d}d overdue` : `${d}d left`}
                    </span>
                  </p>
                  {r.note && <p className="text-[11px] text-muted-foreground">{r.note}</p>}
                </div>
                <button onClick={() => del(r.id)} className="rounded-lg border border-border/60 p-1.5 text-muted-foreground hover:border-red-500/50 hover:text-red-500" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            );
          })}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
