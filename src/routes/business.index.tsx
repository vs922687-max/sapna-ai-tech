import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Receipt, Building2, Wallet, UtensilsCrossed, ArrowRight, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TITLE = "Business Services Guide - Dukandaron Ke Liye Zaroori Jaankari | Bharat AI Sathi";
const DESCRIPTION =
  "Chhote business aur dukaan chalane walon ke liye important government services aur registration ki simple guide - GST, Udyam, PM SVANidhi, FSSAI.";
const URL = "https://bharataisathi.com/business";

export const Route = createFileRoute("/business/")({
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
  }),
  component: BusinessHub,
});

type Card = {
  to: string;
  icon: LucideIcon;
  name: string;
  hindi: string;
  desc: string;
};

const CARDS: Card[] = [
  {
    to: "/business/gst",
    icon: Receipt,
    name: "GST Portal",
    hindi: "जीएसटी पोर्टल",
    desc: "GST registration, return filing aur invoice banane ke liye.",
  },
  {
    to: "/business/udyam",
    icon: Building2,
    name: "Udyam Registration",
    hindi: "उद्यम रजिस्ट्रेशन",
    desc: "MSME aur chhote business register karne ke liye - bilkul free.",
  },
  {
    to: "/business/svanidhi",
    icon: Wallet,
    name: "PM SVANidhi",
    hindi: "पीएम स्वनिधि",
    desc: "Street vendors ke liye ₹10,000 se ₹50,000 tak bina guarantee loan.",
  },
  {
    to: "/business/fssai",
    icon: UtensilsCrossed,
    name: "FSSAI License",
    hindi: "एफएसएसएआई लाइसेंस",
    desc: "Khane-peene ka business karne walon ke liye zaroori food license.",
  },
];

function BusinessHub() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Business Services</span>
        </nav>

        <header className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" /> Business Services Guide
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Business Services Guide - Dukandaron Ke Liye Zaroori Jaankari
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Chhote business aur dukaan chalane walon ke liye important government services aur
            registration ki simple guide. Har service ka short intro, zaroori baatein aur official
            portal ka seedha link.
          </p>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.to}
                to={c.to}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card/40 p-5 transition hover:border-primary/40 hover:bg-card/60 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-lg font-semibold">{c.name}</h2>
                    <p className="text-[11px] text-muted-foreground">{c.hindi}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Guide Dekho <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
