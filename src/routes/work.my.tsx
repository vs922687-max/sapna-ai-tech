import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  APPLICATION_STATUS_LABEL,
  JOB_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  categoryName,
  formatInr,
} from "@/lib/work-jobs";
import { ArrowLeft, Briefcase, CheckCircle2, ExternalLink, Loader2, Send, Users, WalletCards } from "lucide-react";

const TITLE = "My Work — Applications and Posted Jobs | Bharat AI Sathi";
const DESCRIPTION = "Track your Work & Earn applications, submissions, posted jobs and applicant status.";

export const Route = createFileRoute("/work/my")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyWork,
});

type JobSummary = {
  id: string;
  title: string;
  category: string;
  budget_inr: number;
  status: string;
  payment_status: string;
  payment_updated_at: string | null;
  client_id: string;
};

type Application = {
  id: string;
  job_id: string;
  worker_id: string;
  cover_note: string;
  quote_inr: number | null;
  status: string;
  submission_note: string | null;
  submission_url: string | null;
  created_at: string;
  work_jobs: JobSummary | null;
};

function MyWork() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState<Record<string, string>>({});
  const [submissionUrls, setSubmissionUrls] = useState<Record<string, string>>({});

  const loadData = async (currentUser: User) => {
    setLoading(true);
    const [myApps, myJobs] = await Promise.all([
      supabase
        .from("work_applications")
        .select("*,work_jobs(id,title,category,budget_inr,status,client_id)")
        .eq("worker_id", currentUser.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("work_jobs")
        .select("id,title,category,budget_inr,status,client_id")
        .eq("client_id", currentUser.id)
        .order("created_at", { ascending: false }),
    ]);

    const ownedJobs = (myJobs.data ?? []) as JobSummary[];
    setApplications((myApps.data ?? []) as unknown as Application[]);
    setJobs(ownedJobs);

    if (ownedJobs.length > 0) {
      const incoming = await supabase
        .from("work_applications")
        .select("*,work_jobs(id,title,category,budget_inr,status,client_id)")
        .in("job_id", ownedJobs.map((job) => job.id))
        .order("created_at", { ascending: false });
      setApplicants((incoming.data ?? []) as unknown as Application[]);
    } else {
      setApplicants([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      if (!sessionUser) {
        nav({ to: "/auth" });
        return;
      }
      setUser(sessionUser);
      void loadData(sessionUser);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) nav({ to: "/auth" });
      else setUser(session.user);
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  const updateApplication = async (id: string, status: string) => {
    if (!user) return;
    setBusyId(id);
    const { error } = await supabase.from("work_applications").update({ status }).eq("id", id);
    setBusyId(null);
    if (error) return toast.error("Status update nahi hua. Dobara try karo.");
    toast.success("Application status update ho gaya.");
    await loadData(user);
  };

  const updateJob = async (id: string, status: string) => {
    if (!user) return;
    setBusyId(id);
    const { error } = await supabase.from("work_jobs").update({ status }).eq("id", id);
    setBusyId(null);
    if (error) return toast.error("Job status update nahi hua.");
    toast.success("Job status update ho gaya.");
    await loadData(user);
  };

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    if (!user) return;
    setBusyId(id);
    const { error } = await supabase
      .from("work_applications")
      .update({ payment_status: paymentStatus })
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error("Payment status update nahi hua. Dobara try karo.");
    toast.success("Payment status update ho gaya.");
    await loadData(user);
  };

  const submitWork = async (application: Application) => {
    if (!user) return;
    const note = (submissionNotes[application.id] ?? "").trim();
    const url = (submissionUrls[application.id] ?? "").trim();
    if (note.length < 10) return toast.error("Submission note kam se kam 10 characters ka likho.");
    setBusyId(application.id);
    const { error } = await supabase
      .from("work_applications")
      .update({ status: "submitted", submission_note: note, submission_url: url || null })
      .eq("id", application.id);
    setBusyId(null);
    if (error) return toast.error("Work submit nahi hua. Dobara try karo.");
    toast.success("Work client ko submit ho gaya.");
    await loadData(user);
  };

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-3">
              <Link to="/work">
                <ArrowLeft className="mr-1 h-4 w-4" /> Work & Earn
              </Link>
            </Button>
            <h1 className="font-display text-3xl font-bold">
              My <span className="text-gradient-tricolor">Work</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Applications, submissions, posted jobs aur applicant status ek jagah track karo.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/work/marketplace" search={{ category: undefined }}>Find Work</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/work/post-job">Post a Job</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="applications" className="mt-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="applications">My Applications ({applications.length})</TabsTrigger>
            <TabsTrigger value="jobs">My Posted Jobs ({jobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-5 space-y-4">
            {applications.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="Abhi koi application nahi"
                description="Marketplace se apni skill ke hisaab se job choose karke apply karo."
                action="Browse jobs"
                to="marketplace"
              />
            ) : (
              applications.map((app) => (
                <div key={app.id} className="glass-strong rounded-2xl border border-border/60 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Badge variant="outline">{categoryName(app.work_jobs?.category ?? "")}</Badge>
                      <h2 className="mt-2 font-display text-lg font-semibold">
                        {app.work_jobs?.title ?? "Job"}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Budget {formatInr(app.work_jobs?.budget_inr ?? 0)}
                        {app.quote_inr ? ` • Your quote ${formatInr(app.quote_inr)}` : ""}
                      </p>
                    </div>
                    <Badge>{APPLICATION_STATUS_LABEL[app.status] ?? app.status}</Badge>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{app.cover_note}</p>

                  {app.status === "approved" ? (
                    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-secondary/40 p-3 text-sm">
                      <WalletCards className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Payment status</span>
                      <Badge variant="outline">
                        {PAYMENT_STATUS_LABEL[app.payment_status] ?? app.payment_status}
                      </Badge>
                    </div>
                  ) : null}

                  {app.status === "accepted" ? (
                    <div className="mt-5 space-y-3 border-t border-border/60 pt-5">
                      <h3 className="font-medium">Submit completed work</h3>
                      <div>
                        <Label htmlFor={`note-${app.id}`}>Submission note</Label>
                        <Textarea
                          id={`note-${app.id}`}
                          value={submissionNotes[app.id] ?? ""}
                          onChange={(e) =>
                            setSubmissionNotes((current) => ({ ...current, [app.id]: e.target.value }))
                          }
                          placeholder="Kya complete kiya aur client kaise check kare, likho."
                          rows={3}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`url-${app.id}`}>Work link (optional)</Label>
                        <Input
                          id={`url-${app.id}`}
                          type="url"
                          value={submissionUrls[app.id] ?? ""}
                          onChange={(e) =>
                            setSubmissionUrls((current) => ({ ...current, [app.id]: e.target.value }))
                          }
                          placeholder="https://drive.google.com/..."
                          className="mt-1.5"
                        />
                      </div>
                      <Button onClick={() => submitWork(app)} disabled={busyId === app.id}>
                        {busyId === app.id ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="mr-1 h-4 w-4" />
                        )}
                        Submit work
                      </Button>
                    </div>
                  ) : null}

                  {app.submission_note ? (
                    <div className="mt-4 rounded-xl bg-secondary/50 p-4 text-sm">
                      <p className="font-medium">Submitted work</p>
                      <p className="mt-1 text-muted-foreground">{app.submission_note}</p>
                      {app.submission_url ? (
                        <a
                          href={app.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-primary underline"
                        >
                          Open submission <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="jobs" className="mt-5 space-y-5">
            {jobs.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Abhi koi job post nahi kiya"
                description="Requirements, budget aur deadline ke saath pehla job publish karo."
                action="Post a job"
                to="post"
              />
            ) : (
              jobs.map((job) => {
                const jobApplicants = applicants.filter((app) => app.job_id === job.id);
                return (
                  <div key={job.id} className="glass-strong rounded-2xl border border-border/60 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Badge variant="outline">{categoryName(job.category)}</Badge>
                        <Link to="/work/job/$id" params={{ id: job.id }}>
                          <h2 className="mt-2 font-display text-lg font-semibold hover:text-primary">
                            {job.title}
                          </h2>
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatInr(job.budget_inr)} • {jobApplicants.length} application(s)
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{JOB_STATUS_LABEL[job.status] ?? job.status}</Badge>
                        {job.status === "open" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateJob(job.id, "closed")}
                            disabled={busyId === job.id}
                          >
                            Close job
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    {jobApplicants.length > 0 ? (
                      <div className="mt-5 space-y-3 border-t border-border/60 pt-5">
                        <h3 className="font-medium">Applications</h3>
                        {jobApplicants.map((app) => (
                          <div key={app.id} className="rounded-xl border border-border/60 p-4">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium">Worker application</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {app.quote_inr ? `Quote ${formatInr(app.quote_inr)}` : "Budget quote not provided"}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {APPLICATION_STATUS_LABEL[app.status] ?? app.status}
                              </Badge>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">{app.cover_note}</p>
                            {app.submission_note ? (
                              <div className="mt-3 rounded-lg bg-secondary/50 p-3 text-sm">
                                <p className="font-medium">Work submitted</p>
                                <p className="mt-1 text-muted-foreground">{app.submission_note}</p>
                                {app.submission_url ? (
                                  <a
                                    href={app.submission_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-primary underline"
                                  >
                                    Open work <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                ) : null}
                              </div>
                            ) : null}
                            <div className="mt-4 flex flex-wrap gap-2">
                              {app.status === "applied" || app.status === "shortlisted" ? (
                                <>
                                  {app.status === "applied" ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateApplication(app.id, "shortlisted")}
                                      disabled={busyId === app.id}
                                    >
                                      Shortlist
                                    </Button>
                                  ) : null}
                                  <Button
                                    size="sm"
                                    onClick={() => updateApplication(app.id, "accepted")}
                                    disabled={busyId === app.id}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateApplication(app.id, "rejected")}
                                    disabled={busyId === app.id}
                                  >
                                    Not selected
                                  </Button>
                                </>
                              ) : null}
                              {app.status === "submitted" ? (
                                <Button
                                  size="sm"
                                  onClick={() => updateApplication(app.id, "approved")}
                                  disabled={busyId === app.id}
                                >
                                  <CheckCircle2 className="mr-1 h-4 w-4" /> Approve work
                                </Button>
                              ) : null}
                              {app.status === "approved" ? (
                                <div className="flex w-full flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                                  <span className="mr-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                    <WalletCards className="h-4 w-4" /> Payment
                                  </span>
                                  {(["pending", "processing", "paid", "issue"] as const).map((paymentStatus) => (
                                    <Button
                                      key={paymentStatus}
                                      variant={app.payment_status === paymentStatus ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => updatePaymentStatus(app.id, paymentStatus)}
                                      disabled={busyId === app.id || app.payment_status === paymentStatus}
                                    >
                                      {PAYMENT_STATUS_LABEL[paymentStatus]}
                                    </Button>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 border-t border-border/60 pt-4 text-sm text-muted-foreground">
                        Abhi koi application nahi aayi.
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>

        <p className="mt-8 text-xs text-muted-foreground">
          “Approved” status work approval ko show karta hai. Automated payment transfer abhi enabled
          nahi hai; payment terms client aur worker ko pehle clear karne chahiye.
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  to,
}: {
  icon: typeof Briefcase;
  title: string;
  description: string;
  action: string;
  to: "marketplace" | "post";
}) {
  return (
    <div className="glass-strong rounded-3xl border border-border/60 p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30">
        <Icon className="h-6 w-6" />
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-6" variant="outline">
        {to === "marketplace" ? (
          <Link to="/work/marketplace" search={{ category: undefined }}>{action}</Link>
        ) : (
          <Link to="/work/post-job">{action}</Link>
        )}
      </Button>
    </div>
  );
}
