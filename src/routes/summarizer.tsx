import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/summarizer")({
  head: () => ({ meta: [{ title: "AI Summarizer — Bharat AI Sathi" }, { name: "description", content: "Summarize long articles into crisp bullet points with AI." }] }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [length, setLength] = useState<"Short" | "Medium" | "Detailed">("Medium");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput("");
    const spec = length === "Short" ? "3 concise bullets" : length === "Medium" ? "5 bullet points" : "8-10 detailed bullet points with sub-points where useful";
    try {
      const text = await askAi(
        `Summarize the following text into ${spec}. Use markdown bullets. Match the source language.\n\n${input}`,
        "You are a concise summarizer.",
      );
      setOutput(text.trim());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <AiToolShell slug="summary">
      <div className="grid gap-4">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste article or long text..." className="min-h-[220px]" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Length:</span>
          {(["Short", "Medium", "Detailed"] as const).map((l) => (
            <Button key={l} size="sm" variant={length === l ? "default" : "outline"} onClick={() => setLength(l)}>{l}</Button>
          ))}
          <Button onClick={run} disabled={loading || !input.trim()} className="ml-auto bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Summarize
          </Button>
        </div>
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
