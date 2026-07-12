import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/coder")({
  head: () => ({ meta: [{ title: "AI Coding Assistant — Bharat AI Sathi" }, { name: "description", content: "Write, debug and explain code with AI pair-programming across 40+ languages." }] }),
  component: CoderPage,
});

const LANGS = ["Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "SQL", "HTML/CSS", "Kotlin", "Swift"];

function CoderPage() {
  const [lang, setLang] = useState("Python");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setOutput("");
    try {
      const text = await askAi(
        `Language: ${lang}\n\nUser request:\n${prompt}\n\nIf the user pasted code, debug or explain it. If they described a task, write clean, commented code. Always wrap code in fenced markdown blocks (\`\`\`${lang.toLowerCase()}). Add a brief explanation.`,
        "You are an expert programming assistant.",
      );
      setOutput(text.trim());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <AiToolShell slug="coder">
      <div className="grid gap-3">
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="w-full max-w-xs rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm">
          {LANGS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <Textarea placeholder="Ask a question or paste code to debug/explain..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[180px] font-mono" />
        <Button onClick={run} disabled={loading || !prompt.trim()} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Ask AI
        </Button>
        {output && (
          <div className="glass rounded-2xl border border-border/60 p-4">
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-background/60 p-3 font-mono text-xs">{output}</pre>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="mr-1 h-4 w-4" />Copy</Button>
          </div>
        )}
      </div>
    </AiToolShell>
  );
}
