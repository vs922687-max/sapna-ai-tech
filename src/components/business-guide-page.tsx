import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AlertTriangle, ExternalLink, CheckCircle2, Briefcase } from "lucide-react";
import type { ReactNode } from "react";

export interface BusinessGuideProps {
  title: string;
  breadcrumb: string;
  intro: ReactNode;
  keyPoints: ReactNode[];
  officialUrl: string;
  officialLabel?: string;
}

export function BusinessGuidePage({
  title,
  breadcrumb,
  intro,
  keyPoints,
  officialUrl,
  officialLabel = "Official Website par Jayein",
}: BusinessGuideProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/business" className="hover:text-primary">Business Services</Link>
          <span>/</span>
          <span className="text-foreground">{breadcrumb}</span>
        </nav>

        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" /> Business Service
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            {title}
          </h1>
          <div className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {intro}
          </div>
        </header>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Zaroori Baatein</h2>
          <ul className="mt-5 space-y-3 rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6">
            {keyPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-[oklch(0.76_0.17_55)]/30 bg-[oklch(0.76_0.17_55)]/10 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.76_0.17_55)]" />
            <div>
              <h3 className="font-display text-base font-semibold sm:text-lg">Important Note</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Ye site sirf jaankari ke liye hai. Registration, payment aur application jaisa kaam
                sirf official government portal par hi karein. Kabhi bhi apna OTP, Aadhaar ya bank
                details kisi third-party site par share na karein.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="font-display text-xl font-bold">{officialLabel}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Application aur latest updates ke liye hamesha official portal use karein.
            </p>
          </div>
          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:text-base"
          >
            {officialLabel} <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
