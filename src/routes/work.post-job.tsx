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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { WORK_CATEGORIES, PLATFORM_FEE_PERCENT, formatInr, workerPayout } from "@/lib/work-jobs";
import { ArrowLeft, Briefcase, Loader2 } from "lucide-react";

const TITLE = "Post a Job — Hire Skilled Workers | Bharat AI Sathi";
const DESCRIPTION =
  "Post a job on Bharat AI Sathi Work & Earn: set a clear budget, requirements and deadline, and receive applications from skilled workers.";
const URL = "https://bharataisathi.com/work/post-job";

export const Route = createFileRoute("/work/post-job")({
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
  component: PostJob,
});

function PostJob() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [skills, setSkills] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [contactNote, setContactNote] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const budgetNumber = Number(budget) || 0;

  const submit = async () => {
    if (!user) {
      nav({ to: "/auth" });
      return;
    }
    if (title.trim().length < 6) return toast.error("Job title thoda detail mein likho.");
    if (!category) return toast.error("Category select karo.");
    if (description.trim().length < 30)
      return toast.error("Description kam se kam 30 characters ka likho.");
    if (budgetNumber <= 0) return toast.error("Budget ₹ mein daalo.");

    setSaving(true);
    const { data, error } = await supabase
      .from("work_jobs")
      .insert({
        client_id: user.id,
        title: title.trim(),
        category,
        description: description.trim(),
        requirements: requirements.trim() || null,
        contact_note: contactNote.trim() || null,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        budget_inr: budgetNumber,
        deadline: deadline || null,
        status: "open",
      })
      .select("id")
      .single();
    setSaving(false);
    if (error || !data) {
      toast.error("Job post nahi ho saka. Dobara try karo.");
      return;
    }
    toast.success("Job post ho gaya!");
    nav({ to: "/work/job/$id", params: { id: data.id } });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/work">
            <ArrowLeft className="mr-1 h-4 w-4" /> Work & Earn
          </Link>
        </Button>

        <div className="glass-strong rounded-3xl border border-border/60 p-6 shadow-elegant sm:p-8">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <Briefcase className="h-6 w-6" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold sm:text-3xl">
            Post a <span className="text-gradient-tricolor">Job</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Clear budget, requirements aur deadline likho — skilled workers apply karenge.
          </p>

          {!ready ? (
            <div className="grid place-items-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : !user ? (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">Job post karne ke liye sign in karo.</p>
              <Button asChild className="mt-4">
                <Link to="/auth">Sign in</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              <div>
                <Label htmlFor="title">Job title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 500 product images ki Hindi tagging"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="mt-1.5">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORK_CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Job description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kaam kya hai, kitna volume hai, kaise deliver karna hai."
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (optional)</Label>
                <Textarea
                  id="requirements"
                  rows={4}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Experience, language, file format, quality checks."
                  className="mt-1.5"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="5000"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline (optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Hindi, Excel, tagging"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="contact">Note for applicants (optional)</Label>
                <Textarea
                  id="contact"
                  rows={3}
                  value={contactNote}
                  onChange={(e) => setContactNote(e.target.value)}
                  placeholder="Kaise contact karein, kya sample chahiye."
                  className="mt-1.5"
                />
              </div>

              {budgetNumber > 0 ? (
                <p className="rounded-2xl border border-border/60 bg-secondary/40 p-4 text-xs text-muted-foreground">
                  Budget {formatInr(budgetNumber)} • Platform fee {PLATFORM_FEE_PERCENT}% • Worker
                  payout approx {formatInr(workerPayout(budgetNumber))}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={submit}
                  disabled={saving}
                  className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
                >
                  {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
                  Publish job
                </Button>
                <Button asChild variant="outline">
                  <Link to="/work/my">My Work</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
