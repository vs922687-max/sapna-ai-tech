import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/resume")({
  head: () => ({ meta: [{ title: "AI Resume Builder — Bharat AI Sathi" }, { name: "description", content: "Generate ATS-friendly resumes tailored for Indian and global recruiters." }] }),
  component: ResumePage,
});

function ResumePage() {
  const [f, setF] = useState({ name: "", email: "", phone: "", skills: "", experience: "", education: "", languages: "" });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const run = async () => {
    if (!f.name.trim()) { toast.error("Please enter your name"); return; }
    setLoading(true); setOutput("");
    try {
      const text = await askAi(
        `Create an ATS-friendly resume using this info. Use clean markdown with sections: Header, Summary, Skills, Work Experience, Education, Languages. Use strong action verbs and quantifiable outcomes.\n\nName: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone}\nSkills: ${f.skills}\nExperience: ${f.experience}\nEducation: ${f.education}\nLanguages: ${f.languages}`,
        "You are an expert resume writer for Indian and global recruiters.",
      );
      setOutput(text.trim());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <AiToolShell slug="resume">
      <div className="grid gap-3 md:grid-cols-2">
        <Input placeholder="Full name" value={f.name} onChange={set("name")} />
        <Input placeholder="Email" value={f.email} onChange={set("email")} />
        <Input placeholder="Phone" value={f.phone} onChange={set("phone")} />
        <Input placeholder="Languages (e.g. Hindi, English)" value={f.languages} onChange={set("languages")} />
        <Textarea placeholder="Skills (comma separated)" value={f.skills} onChange={set("skills")} className="md:col-span-2" />
        <Textarea placeholder="Work experience (role, company, dates, achievements)" value={f.experience} onChange={set("experience")} className="min-h-[140px] md:col-span-2" />
        <Textarea placeholder="Education (degree, institution, year)" value={f.education} onChange={set("education")} className="md:col-span-2" />
      </div>
      <Button onClick={run} disabled={loading} className="mt-4 bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Generate Resume
      </Button>
      {output && (
        <div className="glass mt-4 rounded-2xl border border-border/60 p-6">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{output}</pre>
          <Button size="sm" variant="outline" className="mt-4" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="mr-1 h-4 w-4" />Copy Resume</Button>
        </div>
      )}
    </AiToolShell>
  );
}
