import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, FolderOpen, Plus, Trash2, FileCheck, Shield, UploadCloud } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { useGovStore, uid } from "@/lib/gov-store";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/vault")({
  head: () => ({
    meta: [
      { title: "Document Vault — Government AI Assistant | Bharat AI Sathi" },
      { name: "description", content: "Track your passport, Aadhaar, PAN, driving licence, marksheets and other government documents. Know expiry dates and renewal windows." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://bharataisathi.com/gov/vault" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/gov/vault" }],
  }),
  component: Vault,
});

type VaultDoc = {
  id: string;
  name: string;
  number?: string;
  issuedOn?: string;
  expiresOn?: string;
  notes?: string;
  hasFile?: boolean;
};

const SUGGESTIONS = [
  "Aadhaar Card",
  "PAN Card",
  "Passport",
  "Driving Licence",
  "Voter ID (EPIC)",
  "Ration Card",
  "Income Certificate",
  "Caste Certificate",
  "Birth Certificate",
  "10th Marksheet",
  "12th Marksheet",
  "Graduation Degree",
];

function daysUntil(d: string): number | null {
  if (!d) return null;
  const target = new Date(d + "T00:00:00");
  return Math.ceil((target.getTime() - Date.now()) / 86400000);
}

function Vault() {
  const [docs, setDocs] = useGovStore<VaultDoc[]>("gov-vault", []);
  const [draft, setDraft] = useState<Partial<VaultDoc>>({});

  const add = (name?: string) => {
    const n = (name ?? draft.name)?.trim();
    if (!n) return toast.error("Document name is required");
    setDocs([{ id: uid("doc"), name: n, ...draft }, ...docs]);
    setDraft({});
    toast.success("Document added to vault");
  };

  const del = (id: string) => setDocs(docs.filter((d) => d.id !== id));

  const sorted = [...docs].sort((a, b) => (a.expiresOn || "").localeCompare(b.expiresOn || ""));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Government</Link>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[oklch(0.66_0.16_155)]/15 text-[oklch(0.72_0.16_155)] ring-1 ring-border/60"><FolderOpen className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Document Vault</h1>
            <p className="text-xs text-muted-foreground">DigiLocker-style readiness tracker for your important documents.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold">Add document</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Document name (e.g. Passport)" value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <input placeholder="Document number / ID" value={draft.number ?? ""} onChange={(e) => setDraft({ ...draft, number: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <input type="date" placeholder="Issued on" value={draft.issuedOn ?? ""} onChange={(e) => setDraft({ ...draft, issuedOn: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <input type="date" placeholder="Expires on" value={draft.expiresOn ?? ""} onChange={(e) => setDraft({ ...draft, expiresOn: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <input placeholder="Notes (e.g. kept in locker, Digilocker linked)" value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-muted-foreground hover:bg-background">
              <UploadCloud className="h-4 w-4" />
              <span>Attach copy (simulated)</span>
              <input type="checkbox" checked={draft.hasFile ?? false} onChange={(e) => setDraft({ ...draft, hasFile: e.target.checked })} className="ml-auto h-4 w-4 accent-primary" />
            </label>
          </div>
          <Button className="mt-3" onClick={() => add()}><Plus className="mr-1 h-4 w-4" /> Add</Button>
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Quick add</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => add(s)}
                  className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground">{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {sorted.length === 0 ? (
            <p className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center text-sm text-muted-foreground">No documents added yet.</p>
          ) : sorted.map((d) => {
            const days = daysUntil(d.expiresOn || "");
            const expired = days !== null && days < 0;
            const soon = days !== null && days >= 0 && days <= 60;
            return (
              <div key={d.id} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border/60 bg-card/40 p-4">
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 font-semibold">
                    {d.name}
                    {d.hasFile && <FileCheck className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" />}
                  </h3>
                  {d.number && <p className="text-xs text-muted-foreground">No.: <span className="text-foreground">{d.number}</span></p>}
                  <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    {d.issuedOn && <span>Issued: {d.issuedOn}</span>}
                    {d.expiresOn && (
                      <span className={expired ? "text-red-500" : soon ? "text-primary" : ""}>
                        Expires: {d.expiresOn} {days !== null ? `(${days}d ${days < 0 ? "ago" : "left"})` : ""}
                      </span>
                    )}
                  </div>
                  {d.notes && <p className="mt-1 text-xs text-muted-foreground">{d.notes}</p>}
                </div>
                <button onClick={() => del(d.id)} className="rounded-lg border border-border/60 p-1.5 text-muted-foreground hover:border-red-500/50 hover:text-red-500" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-[oklch(0.72_0.16_155)]/30 bg-[oklch(0.66_0.16_155)]/5 p-3 text-xs text-[oklch(0.72_0.16_155)]">
          <Shield className="h-4 w-4 shrink-0" />
          <span>Your document list is stored on this device. Sign in to sync it securely across devices and attach real files in a future update.</span>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
