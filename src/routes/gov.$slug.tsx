import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, CheckCircle2, FileText, ListChecks, AlertTriangle, HelpCircle, Sparkles, Loader2, Landmark, Bookmark, BookmarkCheck, MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { GOV_SERVICES, getGovService, type GovService } from "@/lib/gov-services";
import { askAi } from "@/lib/ai-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { GovAiAssistant } from "@/components/gov-ai-assistant";
import { useGovBookmarks } from "@/lib/gov-bookmarks";

export const Route = createFileRoute("/gov/$slug")({
  loader: ({ params }) => {
    const svc = getGovService(params.slug);
    if (!svc) throw notFound();
    return { svc };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service not found — Bharat AI Sathi" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.svc;
    const url = `https://sapna-ai-tech.lovable.app/gov/${params.slug}`;
    const title = `${s.name} (${s.hindi}) — Eligibility, Documents & How to Apply | Bharat AI Sathi`;
    const desc = `${s.tagline} Complete guide to ${s.name}: eligibility, required documents, step-by-step application and official links.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentService",
            name: s.name,
            alternateName: s.hindi,
            description: s.tagline,
            url,
            serviceType: s.category,
            provider: { "@type": "GovernmentOrganization", name: s.ministry, url: s.official },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: s.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  notFoundComponent: NotFoundView,
  errorComponent: ErrorView,
  component: GovDetail,
});

function NotFoundView() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Service not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The government service you're looking for doesn't exist in our directory.</p>
        <Button asChild className="mt-6"><Link to="/gov">Back to services</Link></Button>
      </div>
      <SiteFooter />
    </div>
  );
}

function ErrorView({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">We couldn't load this service page. Please try again.</p>
        <Button className="mt-6" onClick={reset}>Retry</Button>
      </div>
      <SiteFooter />
    </div>
  );
}

function GovDetail() {
  const { svc: s } = Route.useLoaderData() as { svc: GovService };
  const Icon = s.icon;
  const [aiLang, setAiLang] = useState<"hi" | "en">("hi");
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const related = GOV_SERVICES.filter((x) => x.category === s.category && x.slug !== s.slug).slice(0, 3);

  const explain = async () => {
    setAiLoading(true);
    setAiText("");
    try {
      const prompt = aiLang === "hi"
        ? `भारत की "${s.name}" सरकारी सेवा को बहुत ही सरल हिंदी में समझाओ। 5-7 छोटे बुलेट पॉइंट्स दो: यह क्या है, किसके लिए है, फायदा क्या है, कैसे apply करें, और एक ज़रूरी tip। कोई अंग्रेज़ी शब्द ज़रूरी हो तभी इस्तेमाल करो।`
        : `Explain the Indian government service "${s.name}" in very simple English. Give 5-7 short bullet points: what it is, who it's for, key benefit, how to apply, and one important tip.`;
      const text = await askAi(prompt, "You are a helpful assistant that explains Indian government schemes accurately and simply.");
      setAiText(text.trim());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "AI explanation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const bookmarks = useGovBookmarks();
  const bookmarked = bookmarks.has(s.slug);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[oklch(0.76_0.17_55)]/10 via-transparent to-[oklch(0.66_0.16_155)]/10" />
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link to="/gov" className="hover:text-primary">Government Services</Link>
            <span>/</span>
            <span className="text-foreground">{s.name}</span>
          </nav>

          <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> All services
          </Link>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4">
            <div className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ring-1", s.accent)}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">{s.hindi} · {s.category}</p>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{s.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
              <p className="mt-1 text-xs text-muted-foreground">Managed by: {s.ministry}</p>
            </div>
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow">
              <a href={s.official} target="_blank" rel="noopener noreferrer">
                Official Website <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" onClick={() => {
              bookmarks.toggle(s.slug);
              toast.success(bookmarked ? "Removed from bookmarks" : "Bookmarked");
            }}>
              {bookmarked ? <BookmarkCheck className="mr-2 h-4 w-4 text-primary" /> : <Bookmark className="mr-2 h-4 w-4" />}
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/gov/eligibility"><Sparkles className="mr-2 h-4 w-4" />Check Eligibility</Link>
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("gov-ai-assistant")?.scrollIntoView({ behavior: "smooth" })}>
              <MessageSquare className="mr-2 h-4 w-4" />Ask AI
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div id="gov-ai-assistant">
            <GovAiAssistant service={s} />
          </div>
          <Card icon={<CheckCircle2 className="h-4 w-4" />} title="Eligibility">
            <ul className="space-y-2 text-sm">
              {s.eligibility.map((e) => (
                <li key={e} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{e}</li>
              ))}
            </ul>
          </Card>

          <Card icon={<FileText className="h-4 w-4" />} title="Required Documents">
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {s.documents.map((d) => (
                <li key={d} className="flex gap-2 rounded-lg border border-border/50 bg-background/40 p-2">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />{d}
                </li>
              ))}
            </ul>
          </Card>

          <Card icon={<ListChecks className="h-4 w-4" />} title="Step-by-step Application Guide">
            <ol className="space-y-3">
              {s.steps.map((st, i) => (
                <li key={st.title} className="flex gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{i + 1}</div>
                  <div>
                    <p className="text-sm font-semibold">{st.title}</p>
                    <p className="text-sm text-muted-foreground">{st.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card icon={<AlertTriangle className="h-4 w-4" />} title="Important Notes">
            <ul className="space-y-2 text-sm">
              {s.notes.map((n) => (
                <li key={n} className="rounded-lg border border-[oklch(0.78_0.15_85)]/30 bg-[oklch(0.78_0.15_85)]/10 p-2 text-foreground/90">{n}</li>
              ))}
            </ul>
          </Card>

          <Card icon={<HelpCircle className="h-4 w-4" />} title="Frequently Asked Questions">
            <div className="space-y-3">
              {s.faqs.map((f) => (
                <details key={f.q} className="group rounded-lg border border-border/50 bg-background/40 p-3">
                  <summary className="cursor-pointer text-sm font-semibold">{f.q}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card icon={<Sparkles className="h-4 w-4" />} title="AI Explanation">
            <div className="mb-3 flex gap-2">
              <button onClick={() => setAiLang("hi")} className={cn("rounded-full border px-3 py-1 text-xs", aiLang === "hi" ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground")}>हिंदी</button>
              <button onClick={() => setAiLang("en")} className={cn("rounded-full border px-3 py-1 text-xs", aiLang === "en" ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground")}>English</button>
            </div>
            <Button onClick={explain} disabled={aiLoading} size="sm" className="w-full">
              {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {aiLoading ? "Generating…" : `Explain ${s.name} simply`}
            </Button>
            {aiText && (
              <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-border/50 bg-background/40 p-3 text-xs leading-relaxed text-foreground/90 font-sans">{aiText}</pre>
            )}
          </Card>

          <Card icon={<Landmark className="h-4 w-4" />} title="Official Portal">
            <p className="text-sm text-muted-foreground">Always apply only on the official government website below. Bharat AI Sathi does not process applications.</p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <a href={s.official} target="_blank" rel="noopener noreferrer">Visit official site <ExternalLink className="ml-2 h-3.5 w-3.5" /></a>
            </Button>
          </Card>

          {related.length > 0 && (
            <Card title="Related Services">
              <div className="space-y-2">
                {related.map((r) => {
                  const RIcon = r.icon;
                  return (
                    <Link key={r.slug} to="/gov/$slug" params={{ slug: r.slug }}
                      className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-2 transition hover:border-primary/50">
                      <div className={cn("grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ring-1", r.accent)}>
                        <RIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{r.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{r.tagline}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          )}
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}

function Card({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h2 className="font-display text-base font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
