import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { GOV_SERVICES } from "@/lib/gov-services";
import { askAi } from "@/lib/ai-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gov/eligibility")({
  head: () => ({
    meta: [
      { title: "Smart Eligibility Checker — Find Government Schemes You Qualify For | Bharat AI Sathi" },
      { name: "description", content: "Answer a few questions and get AI-powered eligibility for Indian government schemes — PM Kisan, Ayushman Bharat, scholarships, Mudra Loan and more." },
      { property: "og:title", content: "Smart Eligibility Checker — Bharat AI Sathi" },
      { property: "og:description", content: "Personalized government scheme eligibility in 1 minute." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://sapna-ai-tech.lovable.app/gov/eligibility" }],
  }),
  component: EligibilityPage,
});

type Field = {
  key: string;
  label: string;
  type: "select" | "number" | "text";
  options?: string[];
  placeholder?: string;
};

const FIELDS: Field[] = [
  { key: "age", label: "Your age", type: "number", placeholder: "e.g. 32" },
  { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
  { key: "state", label: "State / UT", type: "text", placeholder: "e.g. Uttar Pradesh" },
  { key: "occupation", label: "Occupation", type: "select", options: ["Farmer", "Student", "Salaried", "Self-employed", "Business owner", "Unemployed", "Homemaker", "Retired", "Daily wage worker"] },
  { key: "income", label: "Annual family income (₹)", type: "number", placeholder: "e.g. 250000" },
  { key: "category", label: "Category", type: "select", options: ["General", "OBC", "SC", "ST", "EWS", "Minority"] },
  { key: "education", label: "Highest education", type: "select", options: ["None", "Primary", "Secondary (10th)", "Higher Secondary (12th)", "Graduate", "Post-graduate"] },
  { key: "special", label: "Any of these apply?", type: "select", options: ["None", "Person with Disability", "Senior Citizen (60+)", "Widow", "Single mother", "Farmer with land <2 ha"] },
];

function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const f = FIELDS[step];
  const isLast = step === FIELDS.length - 1;
  const canNext = ans[f.key]?.trim().length > 0;

  const submit = async () => {
    setLoading(true);
    setResult("");
    try {
      const list = GOV_SERVICES.map((s) => `- ${s.name} (${s.category}): ${s.tagline}`).join("\n");
      const profile = FIELDS.map((x) => `${x.label}: ${ans[x.key] || "-"}`).join("\n");
      const prompt = `User profile:\n${profile}\n\nCandidate schemes:\n${list}\n\nTask: Based on the user profile, list Indian government schemes/services they are likely ELIGIBLE for, PARTIALLY ELIGIBLE for, and NOT ELIGIBLE for. For each, give 1-line reason. Group under headings "✅ Eligible", "⚠️ Partially Eligible", "❌ Not Eligible". End with "🎯 Top 3 Recommendations" naming schemes they should apply to first.`;
      const text = await askAi(prompt, "You are an expert on Indian government welfare schemes. Be accurate, concise, and cite scheme names exactly from the candidate list.");
      setResult(text.trim());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to check eligibility");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> All services
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.76_0.17_55)]/25 to-[oklch(0.66_0.16_155)]/25 ring-1 ring-border/60">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">पात्रता जांच</p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Smart Eligibility Checker</h1>
            <p className="text-sm text-muted-foreground">Answer {FIELDS.length} quick questions to find schemes you qualify for.</p>
          </div>
        </div>

        {!result ? (
          <div className="mt-8 rounded-2xl border border-border/60 bg-card/40 p-6">
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / FIELDS.length) * 100}%` }} />
            </div>
            <p className="mb-2 text-xs text-muted-foreground">Question {step + 1} of {FIELDS.length}</p>
            <label className="mb-3 block font-display text-lg font-bold">{f.label}</label>

            {f.type === "select" ? (
              <div className="flex flex-wrap gap-2">
                {f.options!.map((o) => (
                  <button
                    key={o}
                    onClick={() => setAns({ ...ans, [f.key]: o })}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition",
                      ans[f.key] === o ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 hover:border-primary/40",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type={f.type}
                value={ans[f.key] || ""}
                onChange={(e) => setAns({ ...ans, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
              />
            )}

            <div className="mt-6 flex items-center justify-between gap-2">
              <Button variant="outline" size="sm" disabled={step === 0} onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-1 h-4 w-4" />Back
              </Button>
              {isLast ? (
                <Button size="sm" disabled={!canNext || loading} onClick={submit}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {loading ? "Checking…" : "Check Eligibility"}
                </Button>
              ) : (
                <Button size="sm" disabled={!canNext} onClick={() => setStep(step + 1)}>
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
            <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold">Your Results</h2>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">{result}</pre>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setResult(""); setStep(0); }}>Start over</Button>
              <Button asChild><Link to="/gov">Browse all services</Link></Button>
            </div>
          </motion.div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
