import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Zap, Shield, Globe } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { AI_TOOLS, accentClass } from "@/lib/ai-tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bharat AI Sathi — India's Premium AI Companion" },
      {
        name: "description",
        content:
          "Chat, create images, translate Indian languages, analyze PDFs, code and more with Bharat AI Sathi — a premium AI suite built for India.",
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
      <Features />
      <ToolsGrid />
      <Why />
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
              "Voice & image support",
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
                { k: "12+", v: "AI tools" },
                { k: "11", v: "Indian languages" },
                { k: "<200ms", v: "First token" },
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
    { icon: Shield, title: "Private by default", body: "Your conversations are yours. Enterprise-grade encryption end-to-end." },
    { icon: Sparkles, title: "One suite, everything", body: "Chat, image, PDF, voice, resume, translator — under one login." },
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
        {AI_TOOLS.map((tool, i) => (
          <motion.div
            key={tool.slug}
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
        ))}
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
              "Team, student and creator plans in ₹ INR — no dollar surprises",
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

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-[oklch(0.76_0.17_55)]/15 via-background to-[oklch(0.66_0.16_155)]/15 p-10 text-center shadow-elegant sm:p-16">
        <h2 className="font-display text-3xl font-bold sm:text-5xl">
          Start your AI journey <br />
          <span className="text-gradient-tricolor">आज ही, मुफ़्त में</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Sign up in seconds. No credit card. Unlimited chat on the free plan.
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
      </div>
    </section>
  );
}
