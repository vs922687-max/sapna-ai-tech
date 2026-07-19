import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Bookmark, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { GOV_SERVICES } from "@/lib/gov-services";
import { useGovBookmarks } from "@/lib/gov-bookmarks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gov/bookmarks")({
  head: () => ({
    meta: [
      { title: "My Bookmarked Government Services | Bharat AI Sathi" },
      { name: "description", content: "Your saved Indian government schemes and services for quick access." },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://bharataisathi.com/gov/bookmarks" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/gov/bookmarks" }],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const { items, toggle } = useGovBookmarks();
  const saved = GOV_SERVICES.filter((s) => items.includes(s.slug));

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Link to="/gov" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> All services
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.76_0.17_55)]/25 to-[oklch(0.66_0.16_155)]/25 ring-1 ring-border/60">
            <Bookmark className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">बुकमार्क</p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">My Bookmarks</h1>
            <p className="text-sm text-muted-foreground">{saved.length} saved service{saved.length === 1 ? "" : "s"}</p>
          </div>
        </div>

        {saved.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border/60 bg-card/40 p-10 text-center">
            <p className="text-sm text-muted-foreground">You haven't bookmarked any services yet.</p>
            <Button asChild className="mt-4"><Link to="/gov">Browse services</Link></Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.slug} className="group relative rounded-2xl border border-border/60 bg-card/40 p-5">
                  <button
                    onClick={() => toggle(s.slug)}
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-border/60 text-muted-foreground transition hover:border-red-500/60 hover:text-red-500"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className={cn("grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ring-1", s.accent)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 font-display text-lg font-bold">{s.name}</h2>
                  <p className="text-[11px] text-primary">{s.hindi}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
                  <Link to="/gov/$slug" params={{ slug: s.slug }} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    View guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
