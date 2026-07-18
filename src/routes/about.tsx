import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Sparkles, Landmark, FileText, Wrench, ShieldCheck, Mail, Target, Eye, Users } from "lucide-react";

const TITLE = "About Bharat AI Sathi — India's AI + Government Assistant";
const DESCRIPTION =
  "Learn about Bharat AI Sathi — our mission to democratise AI and government services for every Indian through free, multilingual, easy-to-use tools.";
const URL = "https://bharataisathi.com/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: TITLE,
          url: URL,
          description: DESCRIPTION,
          mainEntity: {
            "@type": "Organization",
            name: "Bharat AI Sathi",
            url: "https://bharataisathi.com",
            email: "support@bharataisathi.com",
            areaServed: "IN",
          },
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> About us
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Bharat AI Sathi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A premium, made-for-India AI + Government platform helping every citizen access
            information, forms and schemes in their own language — free and simple.
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-2">
          <Card icon={<Target className="h-5 w-5" />} title="Our Mission">
            Democratise AI and government access for every Indian — from a farmer in a village
            to a student in a metro — through free, multilingual, easy-to-use tools.
          </Card>
          <Card icon={<Eye className="h-5 w-5" />} title="Our Vision">
            To become India's most trusted AI companion — a single, honest, no-jargon place
            for citizens to think, create, learn and get things done.
          </Card>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">What we offer</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon={<Wrench className="h-5 w-5" />} title="AI Tools" to="/tools">
              110+ tools for chat, images, PDFs, translation, code, resume and more.
            </Feature>
            <Feature icon={<Landmark className="h-5 w-5" />} title="Government Services" to="/gov">
              270+ Central & State services with eligibility, documents and step-by-step guides.
            </Feature>
            <Feature icon={<FileText className="h-5 w-5" />} title="Government Forms" to="/gov/forms">
              Auto-fill forms with your saved profile and download ready-to-submit PDFs.
            </Feature>
            <Feature icon={<Sparkles className="h-5 w-5" />} title="Government Schemes" to="/gov">
              Discover schemes you're eligible for with the AI Eligibility Checker.
            </Feature>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <Card icon={<ShieldCheck className="h-5 w-5" />} title="Trust & privacy">
            No data selling. Sensitive data stays on your device where possible. Read our{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </Card>
          <Card icon={<Users className="h-5 w-5" />} title="For every Indian">
            Hindi, English and Hinglish support across chat and government assistant.
          </Card>
          <Card icon={<Sparkles className="h-5 w-5" />} title="Always improving">
            New tools, forms and schemes added every month — free for citizens.
          </Card>
        </section>

        <section className="mt-12 rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Why trust Bharat AI Sathi</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <li>• Transparent — we clearly label AI-generated content.</li>
            <li>• Independent — not a government website; we link to official sources.</li>
            <li>• Secure — encrypted transport and Row-Level-Security on user data.</li>
            <li>• Accessible — keyboard-friendly, mobile-first, dark-mode ready.</li>
            <li>• Multilingual — Hindi, English and Hinglish across most tools.</li>
            <li>• Free — the core platform is free for every citizen.</li>
          </ul>
        </section>

        <section className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/40 p-6 sm:flex-row sm:p-8">
          <div>
            <h2 className="font-display text-xl font-bold">Get in touch</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Questions, partnerships, or feedback? We'd love to hear from you.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Mail className="h-4 w-4" /> Contact us
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
      <div className="flex items-center gap-2 text-primary">{icon}<h3 className="font-display text-lg font-semibold">{title}</h3></div>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

function Feature({ icon, title, to, children }: { icon: React.ReactNode; title: string; to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group rounded-2xl border border-border/60 bg-card/40 p-5 transition-colors hover:border-primary/50">
      <div className="flex items-center gap-2 text-primary">{icon}<h3 className="font-display text-base font-semibold">{title}</h3></div>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
      <span className="mt-3 inline-block text-xs font-medium text-primary group-hover:underline">Explore →</span>
    </Link>
  );
}
