import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Sparkles, Download, Printer, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTemplate, type DocTemplate } from "@/lib/gov-documents";
import { useGovProfile, type GovProfile } from "@/lib/gov-profile";
import { askAi } from "@/lib/ai-client";
import { downloadHtmlAsDoc, printHtml } from "@/lib/gov-download";
import { uid } from "@/lib/gov-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/documents/$slug")({
  loader: ({ params }) => {
    const t = getTemplate(params.slug);
    if (!t) throw notFound();
    return { t };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Template not found" }, { name: "robots", content: "noindex" }] };
    return { meta: [
      { title: `${loaderData.t.name} — AI Document Generator | Bharat AI Sathi` },
      { name: "description", content: loaderData.t.description },
    ] };
  },
  notFoundComponent: () => <div className="p-10 text-center">Template not found. <Link to="/gov/documents" className="text-primary">Back</Link></div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-sm">Error: {error.message}</div>,
  component: DocGen,
});

function profileToContext(p: GovProfile): string {
  const bits: string[] = [];
  if (p.fullName) bits.push(`Name: ${p.fullName}`);
  if (p.fatherName) bits.push(`Father: ${p.fatherName}`);
  if (p.dob) bits.push(`DOB: ${p.dob}`);
  if (p.address) bits.push(`Address: ${p.address}, ${p.city}, ${p.district}, ${p.state} - ${p.pincode}`);
  if (p.mobile) bits.push(`Mobile: ${p.mobile}`);
  if (p.aadhaar) bits.push(`Aadhaar: ${p.aadhaar}`);
  if (p.pan) bits.push(`PAN: ${p.pan}`);
  return bits.join(", ");
}

function DocGen() {
  const { t } = Route.useLoaderData() as { t: DocTemplate };
  const [profile] = useGovProfile();
  const [details, setDetails] = useState("");
  const [lang, setLang] = useState<"en" | "hi" | "bilingual">("en");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [usedProfile, setUsedProfile] = useState(true);

  const generate = async () => {
    if (!details.trim() && !usedProfile) { toast.error("Please add details or enable profile"); return; }
    setLoading(true); setOutput("");
    try {
      const ctx = [usedProfile ? profileToContext(profile) : "", details].filter(Boolean).join("\n");
      const prompt = t.prompt(ctx || "(no extra details provided)", lang);
      const text = await askAi(prompt, "You are an expert Indian legal & government document drafter. Produce formal, print-ready drafts.");
      setOutput(text.trim());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Generation failed"); }
    finally { setLoading(false); }
  };

  const asHtml = () => `<h1>${t.name}</h1><pre>${output.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!))}</pre>`;

  const download = () => {
    if (!output.trim()) return toast.error("Generate a document first");
    downloadHtmlAsDoc(`${t.slug}-${Date.now()}.doc`, t.name, asHtml(),
      { id: uid("dl"), name: t.name, kind: "Document", category: t.category, createdAt: Date.now() });
    toast.success("Downloaded. Saved to Download Center.");
  };

  const print = () => {
    if (!output.trim()) return toast.error("Generate a document first");
    printHtml(t.name, asHtml());
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link to="/gov/documents" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> All templates
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-border/60"><FileText className="h-5 w-5" /></div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">{t.name}</h1>
            <p className="text-sm text-primary">{t.hindi}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details / Purpose</label>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Affidavit for name change from Rohit Kumar to Rohit K. Sharma for gazette notification. Include father's name and current address." rows={7} />
            <div className="mt-3 flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={usedProfile} onChange={(e) => setUsedProfile(e.target.checked)} />
                Use my saved profile <Link to="/gov/profile" className="underline">(edit)</Link>
              </label>
              <div className="flex gap-1">
                {(["en", "hi", "bilingual"] as const).map((l) => (
                  <button key={l} onClick={() => setLang(l)}
                    className={cn("rounded-full border px-2.5 py-1 text-[11px]",
                      lang === l ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground")}>
                    {l === "en" ? "English" : l === "hi" ? "हिंदी" : "Both"}
                  </button>
                ))}
              </div>
            </div>
            <Button className="mt-3 w-full" onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Drafting…" : "Generate with AI"}
            </Button>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Draft</label>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={print} disabled={!output}><Printer className="mr-1 h-3.5 w-3.5" /> Print</Button>
                <Button size="sm" onClick={download} disabled={!output}><Download className="mr-1 h-3.5 w-3.5" /> Download</Button>
              </div>
            </div>
            <Textarea value={output} onChange={(e) => setOutput(e.target.value)}
              placeholder="Your AI-generated document will appear here — fully editable before download." rows={16} />
          </div>
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">Always review the draft carefully. For legal filings, consult a qualified professional.</p>
      </section>
      <SiteFooter />
    </div>
  );
}
