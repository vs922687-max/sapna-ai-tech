import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  categoryName,
  formatInr,
  workerPayout,
  PLATFORM_FEE_PERCENT,
  APPLICATION_STATUS_LABEL,
} from "@/lib/work-jobs";
import { Loader2, ArrowLeft, Wallet, CalendarDays, ListChecks, Send } from "lucide-react";

export const Route = createFileRoute("/work/job/$id")({
  head: () => ({
    meta: [
      { title: "Job details — Work & Earn | Bharat AI Sathi" },
      {
        name: "description",
        content:
          "Job details, requirements, budget and platform fee — apply on Bharat AI Sathi Work & Earn.",
      },
      { property: "og:title", content: "Job details — Work & Earn | Bharat AI Sathi" },
      {
        property: "og:description",
        content: "Job requirements, transparent budget and platform fee. Income is not guaranteed.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JobDetail,
});

type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  contact_note: string | null;
  category: string;
  budget_inr: number;
  skills: string[];
  deadline: string | null;
  status: string;
  client_id: string;
  created_at: string;
};

function JobDetail() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [myStatus, setMyStatus] = useState<string | null>(null);
  const [cover, setCover] = useState("");
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("work_jobs")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setJob((data as Job) ?? null);
        setLoading(false);
      });
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
  }, [id]);

  useEffect(() => {
    if (!user) {
      setMyStatus(null);
      return;
    }
    supabase
      .from("work_applications")
      .select("status")
      .eq("job_id", id)
      .eq("worker_id", user.id)
      .maybeSingle()
      .then(({ data }) => setMyStatus(data?.status ?? null));
  }, [user, id]);

  const apply = async () => {
    if (!user) {
      nav({ to: "/auth" });
      return;
    }
    if (cover.trim().length < 20) {
      toast.error("Cover note kam se kam 20 characters ka likho.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("work_applications").insert({
      job_id: id,
      worker_id: user.id,
      cover_note: cover.trim(),
      quote_inr: quote ? Number(quote) : null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Application save nahi hui. Dobara try karo.");
      return;
    }
    setMyStatus("applied");
    setCover("");
    setQuote("");
    toast.success("Application bhej di gayi!");
  };

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <SiteHeader />
        <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
          <h1 className="font-display text-2xl font-bold">Job nahi mila</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ye job hata diya gaya hai ya link galat hai.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/work/marketplace" search={{ category: undefined }}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to marketplace
            </Link>
          </Button>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const isOwner = user?.id === job.client_id;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/work/marketplace" search={{ category: undefined }}>
            <ArrowLeft className="mr-1 h-4 w-4" /> All jobs
          </Link>
        </Button>

        <div className="glass-strong rounded-3xl border border-border/60 p-6 shadow-elegant sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{categoryName(job.category)}</Badge>
            <Badge variant={job.status === "open" ? "default" : "secondary"}>{job.status}</Badge>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold sm:text-3xl">{job.title}</h1>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Job budget</p>
              <p className="mt-1 inline-flex items-center gap-1 font-semibold">
                <Wallet className="h-4 w-4 text-primary" /> {formatInr(job.budget_inr)}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Platform fee</p>
              <p className="mt-1 font-semibold">{PLATFORM_FEE_PERCENT}%</p>
            </div>
            <div className="rounded-2xl border border-border/60 p-4">
              <p className="text-xs text-muted-foreground">Approx. worker payout</p>
              <p className="mt-1 font-semibold">{formatInr(workerPayout(job.budget_inr))}</p>
            </div>
          </div>

          <p className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN") : "Flexible"}
          </p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed">
            <div>
              <h2 className="font-display text-lg font-semibold">Job description</h2>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{job.description}</p>
            </div>
            {job.requirements ? (
              <div>
                <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold">
                  <ListChecks className="h-4 w-4 text-primary" /> Requirements
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{job.requirements}</p>
              </div>
            ) : null}
            {job.skills?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Earnings are based on available work, completed tasks, quality and approval. Income is not
            guaranteed. Payment sirf client approval ke baad process hota hai.
          </p>
        </div>

        <div className="mt-6 glass-strong rounded-3xl border border-border/60 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Apply for this job</h2>
          {isOwner ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Ye aapka posted job hai. Applications{" "}
              <Link to="/work/my" className="text-primary underline">
                My Work
              </Link>{" "}
              page par dekho.
            </p>
          ) : myStatus ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Aap already apply kar chuke ho — status:{" "}
              <span className="font-medium text-foreground">
                {APPLICATION_STATUS_LABEL[myStatus] ?? myStatus}
              </span>
              .{" "}
              <Link to="/work/my" className="text-primary underline">
                Track in My Work
              </Link>
            </p>
          ) : job.status !== "open" ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Ye job ab applications accept nahi kar raha.
            </p>
          ) : !user ? (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">Apply karne ke liye sign in karo.</p>
              <Button asChild className="mt-4">
                <Link to="/auth">Sign in</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="cover">Cover note</Label>
                <Textarea
                  id="cover"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  rows={5}
                  placeholder="Aap ye kaam kaise karoge, relevant experience aur delivery time likho."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="quote">Your quote (₹, optional)</Label>
                <Input
                  id="quote"
                  type="number"
                  min={0}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder={String(job.budget_inr)}
                  className="mt-1.5"
                />
              </div>
              <Button
                onClick={apply}
                disabled={submitting}
                className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
              >
                {submitting ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-1 h-4 w-4" />
                )}
                Submit application
              </Button>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
