import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Bharat AI Sathi" },
      { name: "description", content: "Simple, transparent pricing in ₹ INR. Free forever plan plus Pro and Team." },
    ],
  }),
  component: PricingPage,
});

const tiers = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    tag: "Start here",
    features: [
      "Unlimited AI chat",
      "Hindi + English + 9 languages",
      "Basic image generation",
      "Community support",
    ],
    cta: "Get started",
    to: "/auth" as const,
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    tag: "Most popular",
    features: [
      "Everything in Free",
      "Priority Gemini Pro access",
      "PDF chat + voice assistant",
      "Unlimited image generation",
      "Save & export conversations",
    ],
    cta: "Upgrade to Pro",
    to: "/auth" as const,
    highlight: true,
  },
  {
    name: "Team",
    price: "₹1,499",
    period: "/month",
    tag: "For businesses",
    features: [
      "Everything in Pro",
      "5 seats included",
      "Team workspaces",
      "Admin analytics dashboard",
      "Priority email support",
    ],
    cta: "Contact sales",
    to: "/contact" as const,
    highlight: false,
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Priced for <span className="text-gradient-tricolor">Bharat.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            No dollar surprises. Start free, upgrade when you need more.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-8 shadow-elegant ${
                t.highlight
                  ? "glass-strong border-primary/50"
                  : "glass border-border/60"
              }`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-glow">
                  {t.tag}
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{t.name}</h3>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{t.tag}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.72_0.16_155)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 w-full ${
                  t.highlight
                    ? "bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
                    : ""
                }`}
                variant={t.highlight ? "default" : "outline"}
              >
                <Link to={t.to}>{t.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
