import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase, BookOpen, GraduationCap, Award, Route as RouteIcon, ArrowLeft, Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { askAi } from "@/lib/ai-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGovStore, uid } from "@/lib/gov-store";

export const Route = createFileRoute("/career/")({
  head: () => ({
    meta: [
      { title: "Career & Student Hub | Bharat AI Sathi" },
      { name: "description", content: "AI mock interviews, study planners, exam prep, scholarship finder and personalised skills roadmap — built for Indian students and job seekers." },
      { property: "og:title", content: "Career & Student Hub | Bharat AI Sathi" },
      { property: "og:description", content: "AI mock interviews, study planners, exam prep, scholarship finder and personalised skills roadmap." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/career" }],
  }),
  component: CareerHub,
});

const TABS = [
  { id: "interview", label: "Mock Interview", icon: Briefcase },
  { id: "planner", label: "Study Planner", icon: BookOpen },
  { id: "mcq", label: "Exam Prep", icon: GraduationCap },
  { id: "scholarships", label: "Scholarships", icon: Award },
  { id: "roadmap", label: "Skills Roadmap", icon: RouteIcon },
];

const SCHOLARSHIPS = [
  { name: "National Merit Scholarship", provider: "MHRD", eligible: "Class 12 toppers", amount: "₹12,000/year", deadline: "December" },
  { name: "Post Matric Scholarship", provider: "Government of India", eligible: "SC/ST/OBC college students", amount: "Full tuition + maintenance", deadline: "Year-round" },
  { name: "PM Scholarship Scheme", provider: "MoD", eligible: "Wards of ex-servicemen", amount: "₹2,000-3,000/month", deadline: "November" },
  { name: "NSP Pre-Matric", provider: "Minority Affairs", eligible: "Minority community students Class 1-10", amount: "Up to ₹350/month", deadline: "October" },
  { name: "Kishore Vaigyanik Protsahan Yojana (KVPY)", provider: "DST", eligible: "Science students Class 11+", amount: "₹5,000-7,000/month", deadline: "August" },
  { name: "IIT/JEE Rank-based Scholarships", provider: "Private institutes", eligible: "JEE Main/Advanced qualifiers", amount: "25%-100% tuition", deadline: "After counselling" },
  { name: "UPSC CSE Fee Reimbursement", provider: "State welfare boards", eligible: "Selected coaching candidates", amount: "Reimbursement", deadline: "Varies" },
  { name: "AIIMS/NEET State Scholarships", provider: "State govts", eligible: "MBBS aspirants from reserved categories", amount: "Tuition + hostel", deadline: "Admission time" },
];

function CareerHub() {
  const [tab, setTab] = useState("interview");

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> Home</Link>
        <div className="mt-3">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Career & Student Hub</h1>
          <p className="text-sm text-muted-foreground">AI-powered tools for students, job seekers and exam warriors in India.</p>
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto pb-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  tab === t.id ? "border-primary/60 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:bg-muted/50")}>
                <Icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 min-h-[300px]">
          {tab === "interview" && <MockInterview />}
          {tab === "planner" && <StudyPlanner />}
          {tab === "mcq" && <ExamPrep />}
          {tab === "scholarships" && <Scholarships />}
          {tab === "roadmap" && <SkillsRoadmap />}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function MockInterview() {
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("Fresher");
  const [lang, setLang] = useState("English");
  const [questions, setQuestions] = useState<string[]>(JSON.parse(localStorage.getItem("career-interview-q") || "[]"));
  const [answers, setAnswers] = useState<Record<number, string>>(JSON.parse(localStorage.getItem("career-interview-a") || "{}"));
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingF, setLoadingF] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("career-interview-q", JSON.stringify(questions));
    localStorage.setItem("career-interview-a", JSON.stringify(answers));
  }, [questions, answers]);

  const generate = async () => {
    if (!role.trim()) return toast.error("Enter target role");
    setLoadingQ(true);
    try {
      const prompt = `Generate 5 realistic ${lang} interview questions for a ${exp.toLowerCase()} ${role} role in India. Return ONLY the numbered list, no intro.`;
      const text = await askAi(prompt, "You are an experienced Indian HR interviewer.");
      const list = text.split("\n").map((l) => l.replace(/^\s*\d+[.\)]\s*/, "").trim()).filter(Boolean);
      setQuestions(list.slice(0, 6));
      setAnswers({});
      setFeedbacks({});
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setLoadingQ(false); }
  };

  const evaluate = async (i: number) => {
    if (!answers[i]?.trim()) return toast.error("Type your answer first");
    setLoadingF(i);
    try {
      const prompt = `Question: ${questions[i]}\nCandidate answer in ${lang}:\n${answers[i]}\n\nGive 1-line feedback in ${lang}: what was good and one tip to improve. Keep under 200 characters.`;
      const fb = await askAi(prompt, "You are a friendly Indian career coach.");
      setFeedbacks({ ...feedbacks, [i]: fb });
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setLoadingF(null); }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">AI Mock Interview</h2>
      <p className="text-xs text-muted-foreground">Practice role-specific questions. Sign in required for AI generation.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <input placeholder="Target role (e.g. Software Engineer)" value={role} onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60 sm:col-span-2" />
        <select value={exp} onChange={(e) => setExp(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60">
          <option>Fresher</option><option>1-3 years</option><option>3-5 years</option><option>5+ years</option>
        </select>
        <select value={lang} onChange={(e) => setLang(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60">
          <option>English</option><option>Hindi</option><option>Hinglish</option>
        </select>
      </div>
      <Button className="mt-3" onClick={generate} disabled={loadingQ}>
        {loadingQ ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
        Generate questions
      </Button>

      {questions.length > 0 && (
        <div className="mt-5 space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="text-sm font-medium"><span className="text-primary">Q{i + 1}.</span> {q}</p>
              <textarea value={answers[i] ?? ""} onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                placeholder="Type your answer..." rows={2}
                className="mt-2 w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => evaluate(i)} disabled={loadingF === i}>
                  {loadingF === i ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1 h-3.5 w-3.5" />}
                  Evaluate
                </Button>
                {feedbacks[i] && <span className="text-xs text-[oklch(0.72_0.16_155)]"><strong>AI:</strong> {feedbacks[i]}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StudyPlanner() {
  const [exam, setExam] = useState("");
  const [subjects, setSubjects] = useState("");
  const [hours, setHours] = useState("4");
  const [weeks, setWeeks] = useState("4");
  const [plan, setPlan] = useState(localStorage.getItem("career-study-plan") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => { localStorage.setItem("career-study-plan", plan); }, [plan]);

  const generate = async () => {
    if (!exam.trim() || !subjects.trim()) return toast.error("Enter exam and subjects");
    setLoading(true);
    try {
      const prompt = `Create a ${weeks}-week study plan for ${exam} covering ${subjects}. I can study ${hours} hours/day. Include daily focus, revision days and mock-test days. Output as a simple week-by-week list in English with Hindi headings.`;
      const text = await askAi(prompt, "You are a top Indian competitive-exam mentor.");
      setPlan(text);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">AI Study Planner</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input placeholder="Exam (e.g. UPSC Prelims, JEE Mains)" value={exam} onChange={(e) => setExam(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
        <input placeholder="Subjects (e.g. History, Polity, Quant)" value={subjects} onChange={(e) => setSubjects(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
        <input type="number" min={1} max={16} value={hours} onChange={(e) => setHours(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
        <input type="number" min={1} max={52} value={weeks} onChange={(e) => setWeeks(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
      </div>
      <Button className="mt-3" onClick={generate} disabled={loading}>
        {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
        Build plan
      </Button>
      {plan && (
        <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
          <pre className="whitespace-pre-wrap text-sm text-foreground">{plan}</pre>
        </div>
      )}
    </div>
  );
}

function ExamPrep() {
  const [exam, setExam] = useState("");
  const [topic, setTopic] = useState("");
  const [mcq, setMcq] = useState<{ q: string; options: string[]; answer: string } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!exam.trim() || !topic.trim()) return toast.error("Enter exam and topic");
    setLoading(true); setSelected(null);
    try {
      const prompt = `Generate one multiple-choice question for ${exam} on the topic: ${topic}. Format exactly as:\nQuestion: ...\nA) ...\nB) ...\nC) ...\nD) ...\nAnswer: A/B/C/D`;
      const text = await askAi(prompt, "You are an Indian exam-prep expert.");
      const q = text.match(/Question:\s*(.+)/)?.[1]?.trim();
      const options = ["A", "B", "C", "D"].map((l) => text.match(new RegExp(`${l}\\)\\s*(.+)`))?.[1]?.trim() ?? "");
      const ans = text.match(/Answer:\s*([A-D])/)?.[1]?.trim() ?? "";
      if (q && options.every(Boolean) && ans) setMcq({ q, options, answer: ans });
      else throw new Error("Could not parse AI response");
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">AI Exam Prep MCQ</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input placeholder="Exam (e.g. UPSC, SSC, Banking)" value={exam} onChange={(e) => setExam(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
        <input placeholder="Topic (e.g. Constitution, Percentage)" value={topic} onChange={(e) => setTopic(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
      </div>
      <Button className="mt-3" onClick={generate} disabled={loading}>
        {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
        Get question
      </Button>
      {mcq && (
        <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
          <p className="font-medium">{mcq.q}</p>
          <div className="mt-2 space-y-2">
            {mcq.options.map((opt, i) => {
              const letter = ["A", "B", "C", "D"][i];
              const isSelected = selected === letter;
              const isCorrect = letter === mcq.answer;
              const show = selected !== null;
              return (
                <button key={letter} onClick={() => setSelected(letter)} disabled={selected !== null}
                  className={cn("flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm text-left transition-colors",
                    show && isCorrect ? "border-[oklch(0.66_0.16_155)]/60 bg-[oklch(0.66_0.16_155)]/10" :
                    show && isSelected ? "border-red-500/60 bg-red-500/10" : "border-border/60 bg-background/60 hover:border-primary/40")}>
                  {show && isCorrect ? <CheckCircle2 className="h-4 w-4 text-[oklch(0.72_0.16_155)]" /> : show && isSelected ? <XCircle className="h-4 w-4 text-red-500" /> : <span className="text-xs font-semibold">{letter}</span>}
                  {opt}
                </button>
              );
            })}
          </div>
          {selected && <p className="mt-2 text-xs text-muted-foreground">Correct answer: <strong>{mcq.answer}</strong></p>}
        </div>
      )}
    </div>
  );
}

function Scholarships() {
  const [q, setQ] = useState("");
  const filtered = SCHOLARSHIPS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()) || s.eligible.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">Scholarship Finder</h2>
      <p className="text-xs text-muted-foreground">Curated scholarships for Indian students. Verify deadlines on official portals.</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or eligibility..."
        className="mt-4 w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((s) => (
          <div key={s.name} className="rounded-xl border border-border/60 bg-background/40 p-3">
            <h3 className="text-sm font-semibold">{s.name}</h3>
            <p className="text-xs text-muted-foreground">{s.provider}</p>
            <div className="mt-2 space-y-1 text-xs">
              <p><span className="text-muted-foreground">Eligible:</span> {s.eligible}</p>
              <p><span className="text-muted-foreground">Amount:</span> {s.amount}</p>
              <p><span className="text-muted-foreground">Deadline:</span> {s.deadline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsRoadmap() {
  const [goal, setGoal] = useState("");
  const [current, setCurrent] = useState("");
  const [roadmap, setRoadmap] = useState(localStorage.getItem("career-roadmap") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => { localStorage.setItem("career-roadmap", roadmap); }, [roadmap]);

  const generate = async () => {
    if (!goal.trim()) return toast.error("Enter your career goal");
    setLoading(true);
    try {
      const prompt = `Create a 12-week beginner-to-job-ready skills roadmap for someone who wants to become a ${goal} in India. Current level: ${current || "beginner"}. Output week-by-week list with resources (free/Indian preferred). Include Hindi section titles.`;
      const text = await askAi(prompt, "You are an Indian career mentor and ed-tech expert.");
      setRoadmap(text);
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
      <h2 className="font-display text-lg font-semibold">AI Skills Roadmap</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input placeholder="Career goal (e.g. Data Analyst, Web Developer)" value={goal} onChange={(e) => setGoal(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
        <input placeholder="Current level / skills" value={current} onChange={(e) => setCurrent(e.target.value)}
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60" />
      </div>
      <Button className="mt-3" onClick={generate} disabled={loading}>
        {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
        Build roadmap
      </Button>
      {roadmap && (
        <div className="mt-4 rounded-xl border border-border/60 bg-background/40 p-4">
          <pre className="whitespace-pre-wrap text-sm text-foreground">{roadmap}</pre>
        </div>
      )}
    </div>
  );
}
