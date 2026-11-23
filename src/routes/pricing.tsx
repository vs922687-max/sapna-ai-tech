import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, type Plan } from "@/lib/plans";
import { supabase } from "@/integrations/supabase/client";
import { PlanPaymentDialog } from "@/components/plan-payment-dialog";
import type { PaidPlanName } from "@/lib/plan-payment";

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
      { name: "twitter:card", content: "summary_large_image" },
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
        }),
      },
    ],
  }),
  component: PricingPage,
});

const tiers = PLANS;

type CurrentPlan = { plan_name: string; status: string; expires_at: string | null };

function isActive(plan: CurrentPlan | null): plan is CurrentPlan {
  return !!plan && plan.status === "active" && (!plan.expires_at || new Date(plan.expires_at) > new Date());
}

function PricingPage() {
  const nav = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [current, setCurrent] = useState<CurrentPlan | null>(null);
  const [checkout, setCheckout] = useState<Plan | null>(null);

  const loadPlan = useCallback(async (uid: string) => {
    const { data } = await supabase.from("user_plans").select("plan_name, status, expires_at").eq("user_id", uid).maybeSingle();
    setCurrent(data ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null;
      setUserId(uid);
      if (uid) void loadPlan(uid);
    });
  }, [loadPlan]);

  const startUpgrade = (plan: Plan) => {
    if (!userId) {
      nav({ to: "/auth", search: { next: "/pricing" } });
      return;
    }
    setCheckout(plan);
  };

  const active = isActive(current) ? current : null;
  const pending = !active && current?.status === "pending" ? current : null;

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

        {active && (
          <div role="status" className="mx-auto mt-8 max-w-xl rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-center text-sm">
            Your <strong>{active.plan_name}</strong> plan is active
            {active.expires_at ? ` until ${new Date(active.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : ""}.
          </div>
        )}

        {pending && (
          <div role="status" className="mx-auto mt-8 max-w-xl rounded-2xl border border-border/60 bg-card/40 px-4 py-3 text-center text-sm">
            Your <strong>{pending.plan_name}</strong> payment is being verified. The plan turns on as soon as we confirm it.
          </div>
        )}

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
              {t.priceNumber > 0 ? (
                <Button
                  type="button"
                  onClick={() => startUpgrade(t)}
                  disabled={active?.plan_name === t.name}
                  className={`mt-8 w-full ${
                    t.highlight
                      ? "bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
                      : ""
                  }`}
                  variant={t.highlight ? "default" : "outline"}
                >
                  {active?.plan_name === t.name ? "Current plan" : t.cta}
                </Button>
              ) : (
                <Button asChild className="mt-8 w-full" variant="outline">
                  <Link to={t.to}>{t.cta}</Link>
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> Pay by UPI
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> HTTPS secured
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> Cancel anytime
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-[oklch(0.72_0.16_155)]" /> Made in India 🇮🇳
          </span>
        </div>
      </section>
      {checkout && userId && (
        <PlanPaymentDialog
          open={!!checkout}
          onOpenChange={(o) => { if (!o) setCheckout(null); }}
          userId={userId}
          planName={checkout.name as PaidPlanName}
          amount={checkout.priceNumber}
          onActivated={() => void loadPlan(userId)}
        />
      )}
      <SiteFooter />
    </div>
  );
}
