import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Landmark } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GOV_SERVICES, GOV_CATEGORIES, type GovCategory } from "@/lib/gov-services";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gov/")({
  head: () => ({
    meta: [
      { title: "Government Services Guide — Aadhaar, PAN, PM Kisan & more | Bharat AI Sathi" },
      { name: "description", content: "Step-by-step guides, eligibility, documents and official links for 19+ major Indian government services — Aadhaar, PAN, Passport, PM Kisan, Ayushman Bharat, Mudra Loan and more." },
      { name: "keywords", content: "government schemes india, aadhaar, pan card, pm kisan, ayushman bharat, mudra loan, apply online, sarkari yojana" },
      { property: "og:title", content: "Indian Government Services Guide — Bharat AI Sathi" },
      { property: "og:description", content: "Simple guides for Aadhaar, PAN, Passport, PM Kisan, Ayushman Bharat and every major Sarkari Yojana." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sapna-ai-tech.lovable.app/gov" },
    ],
    links: [{ rel: "canonical", href: "https://sapna-ai-tech.lovable.app/gov" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Indian Government Services Directory",
        url: "https://sapna-ai-tech.lovable.app/gov",
        about: GOV_SERVICES.map((s) => ({ "@type": "GovernmentService", name: s.name, url: `https://sapna-ai-tech.lovable.app/gov/${s.slug}` })),
      }),
    }],
  }),
  component: GovIndex,
});

const PAGE_SIZE = 24;

function GovIndex() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<GovCategory | "All">("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GOV_SERVICES.filter((s) => {
      const catOk = cat === "All" || s.category === cat;
      const qOk = !needle ||
        s.name.toLowerCase().includes(needle) ||
        s.hindi.includes(needle) ||
        s.tagline.toLowerCase().includes(needle) ||
        s.ministry.toLowerCase().includes(needle);
      return catOk && qOk;
    });
  }, [q, cat]);

  useEffect(() => { setVisible(PAGE_SIZE); }, [q, cat]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;



  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[oklch(0.76_0.17_55)]/10 via-transparent to-[oklch(0.66_0.16_155)]/10" />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Government Services</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.76_0.17_55)]/25 to-[oklch(0.66_0.16_155)]/25 ring-1 ring-border/60">
              <Landmark className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">सरकारी सेवाएं</p>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">Government Services Guide</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Simple, verified guides for India's most important documents and welfare schemes — eligibility, documents, application steps and official links, all in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Aadhaar, PAN, PM Kisan…"
                className="w-full rounded-xl border border-border/60 bg-background/60 pl-10 pr-3 py-3 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
                aria-label="Search government services"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(["All", ...GOV_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  cat === c
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="mb-4 text-xs text-muted-foreground">
          Showing <span className="text-foreground font-semibold">{shown.length}</span> of {filtered.length} services
          {cat !== "All" && <> in <span className="text-primary">{cat}</span></>}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
            No services match your search.
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min((i % PAGE_SIZE) * 0.015, 0.15) }}
                  >
                    <Link
                      to="/gov/$slug"
                      params={{ slug: s.slug }}
                      className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-glow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ring-1", s.accent)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {s.category}
                        </span>
                      </div>
                      <h2 className="mt-4 font-display text-lg font-bold">{s.name}</h2>
                      <p className="text-[11px] text-primary">{s.hindi}</p>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">{s.tagline}</p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-80 transition group-hover:opacity-100">
                        View guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                >
                  Load more ({filtered.length - visible} left)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

