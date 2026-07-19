import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/grammar")({
  head: () => ({
    meta: [{ title: "AI Grammar Checker — Bharat AI Sathi" }, { name: "description", content: "Fix grammar, spelling, and tone in English or Hindi with AI." },
      { property: "og:url", content: "https://bharataisathi.com/grammar" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/grammar" }],
  }),
  component: GrammarPage,
});

function GrammarPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!input.trim()) return;
    setLoading(true); setOutput("");
    try {
      const text = await askAi(
        `Correct grammar, spelling and tone in the following text. Preserve the original language (English or Hindi). Return ONLY the corrected text, no commentary.\n\n${input}`,
        "You are an expert editor for English and Hindi.",
      );
      setOutput(text.trim());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <AiToolShell slug="grammar">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Original</div>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste text in Hindi or English..." className="min-h-[260px]" />
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Corrected</div>
          <Textarea value={output} readOnly placeholder="Corrected text will appear here..." className="min-h-[260px]" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={check} disabled={loading || !input.trim()} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Check Grammar
        </Button>
        {output && <Button variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="mr-1 h-4 w-4" />Copy</Button>}
      </div>
    </AiToolShell>
  );
}
