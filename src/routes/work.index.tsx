import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Search,
  Send,
  CheckCircle2,
  Wallet,
  Tags,
  Keyboard,
  Languages,
  AudioLines,
  PenLine,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Globe,
  Share2,
  Palette,
  Film,
  MonitorSmartphone,
  ArrowRight,
  Info,
  FileCheck,
  Percent,
  ClipboardCheck,
  BadgeCheck,
  LifeBuoy,
  Flag,
  type LucideIcon,
} from "lucide-react";

const TITLE = "Work & Earn — AI de naal kam karo, skills naal kamao | Bharat AI Sathi";
const DESCRIPTION =
  "Bharat AI Sathi te genuine online work labho. Apni skills use karo, work complete karo, te approved work ton earning karo. Income guaranteed nahi hai.";
const URL = "https://bharataisathi.com/work";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Bharat AI Sathi — Work & Earn",
          url: URL,
          description: DESCRIPTION,
          inLanguage: ["pa-IN", "hi-IN", "en-IN"],
        }),
      },
    ],
  }),
  component: WorkLanding,
});

type Step = { icon: LucideIcon; title: string; desc: string };
const STEPS: Step[] = [
  { icon: Search, title: "Find Work", desc: "Find jobs according to your skills." },
  { icon: Send, title: "Apply", desc: "Send your application to the client." },
  { icon: CheckCircle2, title: "Complete Work", desc: "Complete the assigned work according to requirements." },
  { icon: Wallet, title: "Get Paid", desc: "After approved completion, earnings are recorded according to platform rules." },
];

type Category = { slug: string; name: string; hindi: string; icon: LucideIcon; accent: string };
const CATEGORIES: Category[] = [
  { slug: "ai-data-annotation", name: "AI Data Annotation", hindi: "एआई डेटा एनोटेशन", icon: Tags, accent: "saffron" },
  { slug: "data-entry", name: "Data Entry", hindi: "डेटा एंट्री", icon: Keyboard, accent: "green" },
  { slug: "punjabi-translation", name: "Punjabi Translation", hindi: "पंजाबी अनुवाद", icon: Languages, accent: "saffron" },
  { slug: "hindi-translation", name: "Hindi Translation", hindi: "हिंदी अनुवाद", icon: Languages, accent: "green" },
  { slug: "english-translation", name: "English Translation", hindi: "अंग्रेजी अनुवाद", icon: Languages, accent: "royal" },
  { slug: "transcription", name: "Transcription", hindi: "ट्रांसक्रिप्शन", icon: AudioLines, accent: "royal" },
  { slug: "content-writing", name: "Content Writing", hindi: "कंटेंट राइटिंग", icon: PenLine, accent: "green" },
  { slug: "ai-assisted-writing", name: "AI-assisted Writing", hindi: "एआई-असिस्टेड राइटिंग", icon: Sparkles, accent: "saffron" },
  { slug: "image-tagging", name: "Image Tagging", hindi: "इमेज टैगिंग", icon: ImageIcon, accent: "green" },
  { slug: "document-formatting", name: "Document Formatting", hindi: "डॉक्यूमेंट फॉर्मेटिंग", icon: FileText, accent: "royal" },
  { slug: "web-research", name: "Web Research", hindi: "वेब रिसर्च", icon: Globe, accent: "royal" },
  { slug: "social-media-content", name: "Social Media Content", hindi: "सोशल मीडिया कंटेंट", icon: Share2, accent: "saffron" },
  { slug: "graphic-design", name: "Graphic Design", hindi: "ग्राफिक डिज़ाइन", icon: Palette, accent: "green" },
  { slug: "video-editing", name: "Video Editing", hindi: "वीडियो एडिटिंग", icon: Film, accent: "royal" },
  { slug: "website-testing", name: "Website Testing", hindi: "वेबसाइट टेस्टिंग", icon: MonitorSmartphone, accent: "saffron" },
];

const accentRing: Record<string, string> = {
  saffron: "text-[oklch(0.76_0.17_55)] bg-[oklch(0.76_0.17_55)]/10 ring-[oklch(0.76_0.17_55)]/30",
  green: "text-[oklch(0.72_0.16_155)] bg-[oklch(0.66_0.16_155)]/10 ring-[oklch(0.66_0.16_155)]/30",
  royal: "text-[oklch(0.72_0.15_260)] bg-[oklch(0.62_0.19_260)]/10 ring-[oklch(0.62_0.19_260)]/30",
};

type AiToolLink = { to: string; name: string; hindi: string; desc: string };
const WORKER_TOOLS: AiToolLink[] = [
  { to: "/chat", name: "AI Chat", hindi: "एआई चैट", desc: "Quick help for any task or question." },
  { to: "/translator", name: "Translator", hindi: "अनुवादक", desc: "Translate across Indian languages." },
  { to: "/pdf", name: "PDF Tools", hindi: "पीडीएफ़ टूल्स", desc: "Read and extract from PDF documents." },
  { to: "/resume", name: "Resume Builder", hindi: "रिज़्यूमे बिल्डर", desc: "ATS-friendly resumes in minutes." },
  { to: "/blog-writer", name: "Content Writer", hindi: "कंटेंट राइटर", desc: "Long-form SEO-ready articles." },
  { to: "/grammar", name: "Grammar Checker", hindi: "व्याकरण जाँच", desc: "Fix grammar, tone and clarity." },
  { to: "/data-analyzer", name: "Data Tools", hindi: "डेटा टूल्स", desc: "Analyze CSV/Excel and get insights." },
  { to: "/coder", name: "Coding Tools", hindi: "कोडिंग टूल्स", desc: "Write, debug and explain code." },
];

type Trust = { icon: LucideIcon; title: string; desc: string };
const TRUST: Trust[] = [
  { icon: FileCheck, title: "Clear job requirements", desc: "Har job da scope, deliverables aur expectations clearly likhiya hunda hai." },
  { icon: Wallet, title: "Transparent job budget", desc: "Job da budget client valon openly set hunda hai — koi hidden number nahi." },
  { icon: Percent, title: "Transparent platform fee", desc: "Platform fee clear hai — koi surprise charge nahi." },
  { icon: ClipboardCheck, title: "Work submission tracking", desc: "Apni submission di status har stage te track karo." },
  { icon: BadgeCheck, title: "Payment status", desc: "Approval ton baad payment status transparent rahi." },
  { icon: LifeBuoy, title: "Dispute support", desc: "Kisi vi issue te dispute support available hai." },
  { icon: Flag, title: "User reporting", desc: "Suspicious job ya user report karn di suvidha hai." },
];

function WorkLanding() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
            <div className="absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-[oklch(0.76_0.17_55)]/20 blur-3xl" />
            <div className="absolute right-0 top-40 h-56 w-56 rounded-full bg-[oklch(0.62_0.19_260)]/20 blur-3xl" />
            <div className="absolute left-0 top-24 h-56 w-56 rounded-full bg-[oklch(0.66_0.16_155)]/20 blur-3xl" />
          </div>
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
            <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <span className="text-foreground">Work & Earn</span>
            </nav>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Work & Earn — Bharat AI Sathi
            </div>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight sm:text-5xl">
              <span className="text-gradient-tricolor">AI de naal kam karo,</span>
              <br className="hidden sm:block" /> skills naal kamao.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-lg">
              Bharat AI Sathi te genuine online work labho, apni skills use karo, work complete karo te
              approved work ton earning karo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/work/marketplace">Find Work <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/work/post-job">Post a Job</Link>
              </Button>
            </div>
            <div className="mt-6 inline-flex items-start gap-2 rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Earnings are based on available work, completed tasks, quality and approval. Income is
                not guaranteed.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" id="how-it-works">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">How it Works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Chaar simple steps — find, apply, complete, get paid.</p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="relative rounded-2xl border border-border/60 bg-card/40 p-6">
                  <span className="absolute right-4 top-4 font-display text-3xl font-bold text-primary/15">
                    {i + 1}
                  </span>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Work categories */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" id="categories">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Work Categories</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Apni skills hisaab choose karo. Har category marketplace te filter lagondi hai.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.slug}
                  to="/work/marketplace"
                  search={{ category: c.slug }}
                  className="group flex flex-col items-start rounded-2xl border border-border/60 bg-card/40 p-4 transition hover:border-primary/40 hover:bg-card/60"
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${accentRing[c.accent]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-tight">{c.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{c.hindi}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary opacity-0 transition group-hover:opacity-100">
                    View tasks <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* AI tools for workers */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Bharat AI Sathi de AI tools naal apna work hor easy banao.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Existing AI tools — koi duplicate nahi. Apne task te sidha use karo.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WORKER_TOOLS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card/40 p-5 transition hover:border-primary/40 hover:bg-card/60"
              >
                <h3 className="font-display text-base font-semibold">{t.name}</h3>
                <p className="text-[11px] text-muted-foreground">{t.hindi}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trust & transparency */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" id="trust">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Safe & Transparent Work</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Clear requirements, transparent budgets and fees, submission tracking aur dispute support.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="flex gap-3 rounded-2xl border border-border/60 bg-card/40 p-5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold">{t.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl border border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Bharat AI Sathi kisi vi "guaranteed income", "easy money", MLM, Ponzi ya investment-to-earn
              scheme da support nahi karda. Income available work, completed tasks, quality aur approval
              te depend karda hai.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
