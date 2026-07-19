import { createFileRoute } from "@tanstack/react-router";
import { useState, type KeyboardEvent } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Download, X, Briefcase, MessagesSquare } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/hr-assistant")({
  head: () => ({
    meta: [
      { title: "HR Assistant — Job Descriptions & Interview Questions | Bharat AI Sathi" },
      {
        name: "description",
        content:
          "AI HR Assistant for Indian teams — generate professional job descriptions and categorized interview questions (Technical, Behavioural, Situational) in Hindi or English.",
      },
      { property: "og:url", content: "https://bharataisathi.com/hr-assistant" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/hr-assistant" }],
  }),
  component: HrAssistantPage,
});

type Mode = "jd" | "interview";
type Lang = "English" | "Hindi";
const LEVELS = ["Intern", "Entry", "Mid", "Senior", "Lead", "Manager"] as const;

function HrAssistantPage() {
  const [mode, setMode] = useState<Mode>("jd");
  const [lang, setLang] = useState<Lang>("English");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  // JD fields
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Mid");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Interview fields
  const [iqTitle, setIqTitle] = useState("");
  const [iqAreas, setIqAreas] = useState("");

  const addSkill = (raw: string) => {
    const s = raw.trim().replace(/,+$/, "");
    if (!s) return;
    setSkills((prev) => (prev.includes(s) ? prev : [...prev, s]));
    setSkillInput("");
  };

  const onSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === "Backspace" && !skillInput && skills.length) {
      setSkills((s) => s.slice(0, -1));
    }
  };

  const langInstr =
    lang === "Hindi"
      ? "Write the entire output in shudh Hindi (Devanagari script)."
      : "Write in clear, professional English used in Indian corporate hiring.";

  const runJd = async () => {
    if (!title.trim()) {
      toast.error("Please enter a job title");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Write a complete, professional job description for the following role.

Job Title: ${title}
Department: ${department || "(not specified)"}
Experience Level: ${level}
Location: ${location || "(not specified)"}
Key Skills: ${skills.length ? skills.join(", ") : "(not specified)"}

${langInstr}

Structure the JD with clearly labeled sections:
1. About the Role (2-3 sentence summary)
2. Key Responsibilities (bulleted, 6-10 points)
3. Requirements & Qualifications (bulleted — must-have + good-to-have)
4. Benefits & Perks (bulleted, India-appropriate)
5. How to Apply (one short line)

Return plain text only (no markdown code fences). Use hyphen bullets.`;
      const text = await askAi(prompt, "You are an expert HR partner writing job descriptions for Indian companies.");
      setOutput(text.trim());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const runInterview = async () => {
    if (!iqTitle.trim()) {
      toast.error("Please enter a job title");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Generate a categorized list of interview questions for hiring a "${iqTitle}".
Skill areas / focus: ${iqAreas || "(general for this role)"}

${langInstr}

Produce exactly three categories, in this order and exactly these headings:
TECHNICAL QUESTIONS
BEHAVIOURAL QUESTIONS
SITUATIONAL QUESTIONS

Under each heading, give 5-8 numbered questions. After each question, on a new line prefixed with "Good answer covers:" write a short (1-2 sentence) note on what a strong answer should cover.

Return plain text only, no markdown code fences.`;
      const text = await askAi(
        prompt,
        "You are an experienced Indian tech/HR interviewer designing structured interview kits.",
      );
      setOutput(text.trim());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!output.trim()) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const downloadPdf = async () => {
    if (!output.trim()) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const heading = mode === "jd" ? `Job Description — ${title || "Untitled"}` : `Interview Kit — ${iqTitle || "Untitled"}`;
    doc.text(heading, margin, margin);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let y = margin + 24;
    const lineHeight = 15;
    const lines = doc.splitTextToSize(output, width);
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    doc.save(`${mode === "jd" ? "job-description" : "interview-questions"}-${Date.now()}.pdf`);
  };

  return (
    <AiToolShell slug="hr-assistant">
      {/* Tabs */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-border/60 bg-background/40 p-1">
          <button
            onClick={() => {
              setMode("jd");
              setOutput("");
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
              mode === "jd" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase className="h-4 w-4" /> Job Description
          </button>
          <button
            onClick={() => {
              setMode("interview");
              setOutput("");
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
              mode === "interview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessagesSquare className="h-4 w-4" /> Interview Questions
          </button>
        </div>
        <div className="flex items-center gap-1">
          {(["English", "Hindi"] as Lang[]).map((l) => (
            <Button key={l} size="sm" variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}>
              {l}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form side */}
        <div className="grid gap-3">
          {mode === "jd" ? (
            <>
              <div>
                <Label className="text-xs">Job Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Department</Label>
                  <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bengaluru / Remote" className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Experience Level</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {LEVELS.map((l) => (
                    <Button key={l} size="sm" variant={level === l ? "default" : "outline"} onClick={() => setLevel(l)}>
                      {l}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs">Key Skills (press Enter or comma)</Label>
                <div className="mt-1 flex flex-wrap gap-1 rounded-md border border-border/60 bg-background p-2">
                  {skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-xs">
                      {s}
                      <button onClick={() => setSkills((prev) => prev.filter((x) => x !== s))} className="text-muted-foreground hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={onSkillKey}
                    onBlur={() => addSkill(skillInput)}
                    placeholder={skills.length ? "" : "React, TypeScript, GraphQL"}
                    className="min-w-[120px] flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
              <Button
                onClick={runJd}
                disabled={loading}
                className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Briefcase className="mr-2 h-4 w-4" />}
                Generate Job Description
              </Button>
            </>
          ) : (
            <>
              <div>
                <Label className="text-xs">Job Title</Label>
                <Input value={iqTitle} onChange={(e) => setIqTitle(e.target.value)} placeholder="e.g. Backend Engineer" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Skill Areas / Focus</Label>
                <Textarea
                  value={iqAreas}
                  onChange={(e) => setIqAreas(e.target.value)}
                  placeholder="Node.js, PostgreSQL, system design, team collaboration"
                  className="mt-1 min-h-[120px]"
                />
              </div>
              <Button
                onClick={runInterview}
                disabled={loading}
                className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessagesSquare className="mr-2 h-4 w-4" />}
                Generate Interview Questions
              </Button>
            </>
          )}
        </div>

        {/* Output side */}
        <div className="grid gap-3">
          <Label className="text-xs">Generated Output (editable)</Label>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder={
              mode === "jd"
                ? "Your AI-generated job description will appear here. Edit before downloading."
                : "Your categorized interview questions will appear here. Edit before downloading."
            }
            className="min-h-[440px] font-sans text-sm leading-relaxed"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={copy} disabled={!output.trim()}>
              <Copy className="mr-1 h-4 w-4" /> Copy
            </Button>
            <Button size="sm" variant="outline" onClick={downloadPdf} disabled={!output.trim()}>
              <Download className="mr-1 h-4 w-4" /> PDF
            </Button>
          </div>
        </div>
      </div>
    </AiToolShell>
  );
}
