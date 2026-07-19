import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRICING_URL = "https://bharataisathi.com/pricing";
const PRICING_TITLE = "Pricing — Bharat AI Sathi";
const PRICING_DESC = "Simple, transparent pricing in ₹ INR. Free forever plan plus Pro (₹499/mo) and Team (₹1,499/mo).";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: PRICING_TITLE },
      { name: "description", content: PRICING_DESC },
      { property: "og:title", content: PRICING_TITLE },
      { property: "og:description", content: PRICING_DESC },
      { property: "og:url", content: PRICING_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: PRICING_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Bharat AI Sathi",
          description: PRICING_DESC,
          brand: { "@type": "Brand", name: "Bharat AI Sathi" },
          offers: [
            {
              "@type": "Offer",
              name: "Free",
              price: "0",
              priceCurrency: "INR",
              url: PRICING_URL,
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Pro",
              price: "499",
              priceCurrency: "INR",
              url: PRICING_URL,
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Team",
              price: "1499",
              priceCurrency: "INR",
              url: PRICING_URL,
              availability: "https://schema.org/InStock",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1240",
          },
        }),
      },
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
      "20 messages per day (resets every 24h)",
      "Hindi + English + 9 languages",
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

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> Secure payments via Razorpay & UPI
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> 256-bit SSL encryption
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> Cancel anytime · GST invoices
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> Made in India 🇮🇳
          </span>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
