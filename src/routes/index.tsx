import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Zap, Shield, Globe, UserPlus, MousePointerClick, Download, ChevronDown } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CORE_TOOLS, OFFICE_TOOLS, accentClass, type AiTool } from "@/lib/ai-tools";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { PLANS } from "@/lib/plans";

const HOME_URL = "https://bharataisathi.com/";
const HOME_TITLE = "Bharat AI Sathi — Free AI Tools in Hindi & English for India";
const HOME_DESC =
  "Free AI chat, translator, resume builder, poster maker, creator tools and government service guides in Hindi, English and Indian languages — made in India.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESC },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESC },
      { property: "og:url", content: HOME_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: HOME_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": HOME_URL + "#org",
              name: "Bharat AI Sathi",
              url: HOME_URL,
              logo: HOME_URL + "favicon.ico",
              sameAs: [],
              areaServed: "IN",
            },
            {
              "@type": "WebSite",
              "@id": HOME_URL + "#website",
              url: HOME_URL,
              name: "Bharat AI Sathi",
              description: HOME_DESC,
              publisher: { "@id": HOME_URL + "#org" },
              inLanguage: ["en-IN", "hi-IN"],
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: HOME_URL + "tools?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@type": "SoftwareApplication",
              name: "Bharat AI Sathi",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              url: HOME_URL,
              offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero />
      <AboutIntro />
      <Features />
      <HowItWorks />
      <ToolsGrid />
      <Why />
      <PricingPreview />
      <LatestArticles />
      <HomeFaq />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Powered by Gemini · Made for Bharat
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Your all-in-one <br />
            <span className="text-gradient-tricolor">Bharatiya AI</span> साथी
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Chat, create, translate, code, and build — in Hindi, English, and every
            major Indian language. One premium AI suite designed for India, from India.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
            >
              <Link to="/chat">
                Start chatting free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="glass border-border/60">
              <Link to="/tools">Explore all AI tools</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {[
              "No credit card",
              "Hindi + 10 Indian languages",
              "Voice & PDF support",
            ].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> {t}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-strong mx-auto mt-16 max-w-5xl overflow-hidden rounded-3xl border border-border/60 p-1 shadow-elegant"
        >
          <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] bg-background/60 p-6 sm:p-10">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { k: "110+", v: "AI & utility tools" },
                { k: "270+", v: "Govt service guides" },
                { k: "₹0", v: "To get started" },
              ].map((s) => (
                <div key={s.v} className="text-center">
                  <div className="font-display text-4xl font-bold text-gradient-primary">
                    {s.k}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Zap, title: "Lightning fast", body: "Streamed responses, edge-served. Every keystroke feels instant." },
    { icon: Globe, title: "Truly Indian", body: "Fluent in Hindi, Tamil, Bengali, Marathi, Telugu, Gujarati, Kannada and more." },
    { icon: Shield, title: "Private by default", body: "We never sell your data. Everything travels over HTTPS and each account's data is locked to its owner." },
    { icon: Sparkles, title: "One suite, everything", body: "Chat, PDF, voice, resume, translator, office tools — under one login." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="glass rounded-2xl p-6">
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolCard({ tool, i }: { tool: AiTool; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: i * 0.04 }}
    >
      <Link
        to={tool.to}
        className="group relative block h-full overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-glow"
      >
        <div className="flex items-start justify-between">
          <div
            className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ring-1 ${accentClass[tool.accent]}`}
          >
            <tool.icon className="h-5 w-5" />
          </div>
          {tool.status === "soon" && (
            <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Soon
            </span>
          )}
          {tool.status === "live" && (
            <span className="rounded-full border border-[oklch(0.66_0.16_155)]/40 bg-[oklch(0.66_0.16_155)]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[oklch(0.72_0.16_155)]">
              Live
            </span>
          )}
        </div>
        <h3 className="mt-5 font-display text-lg font-semibold">{tool.title}</h3>
        <p className="text-xs text-muted-foreground">{tool.hindi}</p>
        <p className="mt-3 text-sm text-muted-foreground">{tool.description}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          Open <ArrowRight className="h-3 w-3" />
        </div>
      </Link>
    </motion.div>
  );
}

function ToolsGrid() {
  return (
    <section id="tools" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          AI Tools Directory
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Everything you need. <span className="text-gradient-tricolor">One saathi.</span>
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CORE_TOOLS.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} i={i} />
        ))}
      </div>

      <div className="mt-16 border-t border-border/60 pt-12" id="office-tools">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[oklch(0.72_0.16_155)]">
            Office Tools · ऑफिस टूल्स
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Everything you need to run your <span className="text-gradient-tricolor">office</span>, in one place.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFFICE_TOOLS.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}


function Why() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="glass-strong overflow-hidden rounded-3xl p-8 sm:p-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Made in India
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Not just translated. <br /> Built <span className="text-gradient-tricolor">for Bharat.</span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              From UPI-native pricing to context-aware Hindi, Tamil and Bengali —
              every detail is tuned for how India actually works, chats and builds.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "Native Hindi and 10+ Indian language support, not a bolted-on translator",
              "Optimized for slow networks and small screens across Tier 2 & 3 cities",
              "Plans priced in ₹ INR with UPI payments — no dollar surprises",
              "Voice-first workflows for hands-busy users and accessibility",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[oklch(0.66_0.16_155)]/20 text-[oklch(0.72_0.16_155)]">
                  <Check className="h-3 w-3" />
                </div>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function AboutIntro() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">What is Bharat AI Sathi?</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <p>
          Bharat AI Sathi is a free, made-in-India website that puts useful AI tools and plain-language
          guides in one place. You can chat with an AI assistant in Hindi, English or Hinglish, translate
          between Indian languages, summarise PDFs, write letters and emails, build a resume, make a
          festival poster for your shop, and plan YouTube Shorts — without needing any technical skills.
        </p>
        <p>
          Alongside the tools, we publish step-by-step guides for 270+ central and state government
          services — Aadhaar, PAN, passport, PM Kisan, Ayushman Bharat, PM Awas Yojana and more — with
          eligibility, documents and links to the official portals. Bharat AI Sathi is an independent
          platform, not a government website: we explain the process, and you apply on the official site.
        </p>
        <p>
          It is built for students, job seekers, small shop owners, creators and families across India,
          including people on slow mobile networks. Read our{" "}
          <Link to="/blog" className="text-primary hover:underline">blog</Link> for practical guides, or
          learn more{" "}
          <Link to="/about" className="text-primary hover:underline">about us</Link>.
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Create a free account",
      body: "Sign up with email or Google in under a minute. No credit card needed.",
    },
    {
      icon: MousePointerClick,
      title: "2. Pick a tool and ask",
      body: "Choose a tool — chat, translator, resume, poster — and type or speak in Hindi, English or Hinglish.",
    },
    {
      icon: Download,
      title: "3. Review, edit and download",
      body: "Check the result, edit it, then copy, download or share. Always verify important facts.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Three simple <span className="text-gradient-tricolor">steps</span>
        </h2>
      </div>
      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <li key={s.title} className="glass rounded-2xl p-6">
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
              <s.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function PricingPreview() {
  const plans = PLANS.filter((p) => p.name === "Free" || p.name === "Pro");
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Free to start. <span className="text-gradient-tricolor">Pro when you need more.</span>
        </h2>
      </div>
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl border p-8 ${p.highlight ? "glass-strong border-primary/50" : "glass border-border/60"}`}
          >
            <h3 className="font-display text-2xl font-bold">{p.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.period}</span>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.72_0.16_155)]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full" variant={p.highlight ? "default" : "outline"}>
              <Link to={p.to}>{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        See all plans on the <Link to="/pricing" className="text-primary hover:underline">Pricing page</Link> ·{" "}
        <Link to="/refund-policy" className="text-primary hover:underline">Refund policy</Link>
      </p>
    </section>
  );
}

function LatestArticles() {
  const posts = [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">From the blog</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Latest guides</h2>
        </div>
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
          All articles <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="glass rounded-2xl border border-border/60 p-6 transition-colors hover:border-primary/40"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">{p.category}</p>
            <h3 className="mt-2 font-display text-base font-semibold leading-snug">{p.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

const HOME_FAQ = [
  {
    q: "What is Bharat AI Sathi?",
    a: "An independent, made-in-India website with free AI tools (chat, translator, resume, poster maker, creator tools and more) and step-by-step guides for Indian government services.",
  },
  {
    q: "Is Bharat AI Sathi free?",
    a: "Yes, you can start for free. The free plan includes 20 AI chat messages per day, and most tools have no charge. Optional paid features, such as the Pro plan and HD posters, are listed on the Pricing page.",
  },
  {
    q: "Which languages does it support?",
    a: "Hindi, English and Hinglish work across most tools. AI chat and the translator also handle other Indian languages such as Punjabi, Bengali, Marathi, Tamil, Telugu, Gujarati and Kannada.",
  },
  {
    q: "Is my data safe?",
    a: "We never sell your data. Everything travels over HTTPS and each account's saved data can only be read by its owner. Photos you add to Poster Maker stay on your device. Never type passwords, OTPs or bank details into any AI tool.",
  },
  {
    q: "Do I need to sign up?",
    a: "No sign-up is needed to read the homepage, blog, government guides, About or Contact pages. AI tools need a free account so we can keep usage fair.",
  },
  {
    q: "Is this a government website?",
    a: "No. Bharat AI Sathi is not affiliated with any government body. We explain processes and link to official portals; applications are always made on the official website.",
  },
  {
    q: "Can the AI make mistakes?",
    a: "Yes. AI answers can be wrong or out of date. Check important information — especially legal, medical, financial or government details — with official sources. See our Disclaimer.",
  },
  {
    q: "How can I contact you?",
    a: "Use the contact form, email support@bharataisathi.com, or message us on WhatsApp at +91 81468 96118.",
  },
];

function HomeFaq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
      </div>
      <div className="mt-10 space-y-3">
        {HOME_FAQ.map((f) => (
          <details key={f.q} className="glass group rounded-2xl border border-border/60 p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              <h3 className="text-sm font-semibold sm:text-base">{f.q}</h3>
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        More answers on our <Link to="/faq" className="text-primary hover:underline">FAQ page</Link>.
      </p>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[oklch(0.76_0.17_55)]/15 via-background to-[oklch(0.66_0.16_155)]/15 p-10 text-center shadow-elegant sm:p-16">
        <h2 className="font-display text-3xl font-bold sm:text-5xl">
          Start your AI journey <br />
          <span className="text-gradient-tricolor">आज ही, मुफ़्त में</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Sign up in seconds. No credit card. 20 messages per day on the free plan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
          >
            <Link to="/auth">Create free account</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="glass">
            <Link to="/chat">Try AI Chat</Link>
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span>🔒 UPI payments</span>
          <span>·</span>
          <span>HTTPS secured</span>
          <span>·</span>
          <span>Cancel anytime</span>
          <span>·</span>
          <span>Made in India 🇮🇳</span>
        </div>
      </div>
    </section>
  );
}
