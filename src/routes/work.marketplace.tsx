import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  WORK_CATEGORIES,
  categoryName,
  formatInr,
  workerPayout,
  PLATFORM_FEE_PERCENT,
} from "@/lib/work-jobs";
import { Search, Loader2, ArrowLeft, Briefcase, CalendarDays, Wallet } from "lucide-react";

const TITLE = "Work Marketplace — Find Online Work | Bharat AI Sathi";
const DESCRIPTION =
  "Browse genuine online work by category on Bharat AI Sathi. Income is not guaranteed and depends on available work and approval.";
const URL = "https://bharataisathi.com/work/marketplace";

export const Route = createFileRoute("/work/marketplace")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
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
  component: Marketplace,
});

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_inr: number;
  skills: string[];
  deadline: string | null;
  created_at: string;
};

function Marketplace() {
  const { category } = Route.useSearch();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    let query = supabase
      .from("work_jobs")
      .select("id,title,description,category,budget_inr,skills,deadline,created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(100);
    if (category) query = query.eq("category", category);
    query.then(({ data, error }) => {
      if (!active) return;
      if (error) setError("Jobs load nahi ho sake. Thodi der baad try karo.");
      else setJobs((data ?? []) as Job[]);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [category]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return jobs;
    return jobs.filter((j) =>
      [j.title, j.description, categoryName(j.category), ...(j.skills ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [jobs, q]);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Work <span className="text-gradient-tricolor">Marketplace</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Genuine online work browse karo, apply karo aur approved work se earning karo. Income
              guaranteed nahi hai.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/work">
                <ArrowLeft className="mr-1 h-4 w-4" /> Work & Earn
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/work/my">My Work</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/work/post-job">Post a Job</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, skill or keyword"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/work/marketplace" search={{ category: undefined }}>
              <Badge variant={category ? "outline" : "default"} className="cursor-pointer">
                All categories
              </Badge>
            </Link>
            {WORK_CATEGORIES.map((c) => (
              <Link key={c.slug} to="/work/marketplace" search={{ category: c.slug }}>
                <Badge variant={category === c.slug ? "default" : "outline"} className="cursor-pointer">
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Platform fee {PLATFORM_FEE_PERCENT}% — worker payout budget minus platform fee. Earnings
          depend on available work, completed tasks, quality and approval.
        </p>

        <div className="mt-6">
          {loading ? (
            <div className="grid place-items-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-strong rounded-3xl border border-border/60 p-10 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30">
                <Briefcase className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold">Abhi koi open job nahi hai</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {category
                  ? `${categoryName(category)} category mein filhaal koi job open nahi hai. Doosri category dekho ya baad mein wapas aao.`
                  : "Naye jobs post hote rehte hain — thodi der baad wapas check karo."}
              </p>
              <Button asChild className="mt-6" variant="outline">
                <Link to="/work/post-job">Client ho? Job post karo</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((job) => (
                <Link
                  key={job.id}
                  to="/work/job/$id"
                  params={{ id: job.id }}
                  className="glass-strong group flex flex-col rounded-2xl border border-border/60 p-5 transition hover:border-primary/40 hover:shadow-elegant"
                >
                  <Badge variant="outline" className="w-fit">
                    {categoryName(job.category)}
                  </Badge>
                  <h3 className="mt-3 line-clamp-2 font-display text-lg font-semibold group-hover:text-primary">
                    {job.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{job.description}</p>
                  {job.skills?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                      <Wallet className="h-3.5 w-3.5" /> {formatInr(job.budget_inr)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "Flexible"}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Approx. payout after {PLATFORM_FEE_PERCENT}% fee: {formatInr(workerPayout(job.budget_inr))}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
