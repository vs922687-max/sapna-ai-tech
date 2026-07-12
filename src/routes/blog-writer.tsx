import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/blog-writer")({
  head: () => ({ meta: [{ title: "AI Blog Writer — Bharat AI Sathi" }, { name: "description", content: "Generate full SEO-ready blog posts in Hindi or English with AI." }] }),
  component: BlogWriterPage,
});

const TONES = ["Informative", "Casual", "SEO"] as const;
const LANGS = ["English", "Hindi"] as const;

function BlogWriterPage() {
  const [topic, setTopic] = useState("");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("English");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Informative");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true); setOutput("");
    try {
      const text = await askAi(
        `Write a full blog post in ${lang}, ${tone} tone.\nTopic: ${topic}\n\nStructure using markdown:\n- H1 title\n- Compelling intro\n- 4-6 H2 sections with detailed body\n- Conclusion with CTA\n\nAim for 700-1000 words.`,
        "You are an expert blog writer.",
      );
      setOutput(text.trim());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <AiToolShell slug="blog">
      <div className="grid gap-3">
        <Input placeholder="Blog topic (e.g. Best UPI apps in India 2025)" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-muted-foreground">Language:</span>
          {LANGS.map((l) => <Button key={l} size="sm" variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}>{l}</Button>)}
          <span className="ml-4 self-center text-xs text-muted-foreground">Tone:</span>
          {TONES.map((t) => <Button key={t} size="sm" variant={tone === t ? "default" : "outline"} onClick={() => setTone(t)}>{t}</Button>)}
        </div>
        <Button onClick={run} disabled={loading || !topic.trim()} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Blog
        </Button>
        {output && (
          <div className="glass rounded-2xl border border-border/60 p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm">{output}</pre>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="mr-1 h-4 w-4" />Copy</Button>
          </div>
        )}
      </div>
    </AiToolShell>
  );
}
