import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [{ title: "AI Email Writer — Bharat AI Sathi" }, { name: "description", content: "Write professional emails in seconds with AI — formal, casual, sales, apology." },
      { property: "og:url", content: "https://bharataisathi.com/email" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/email" }],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Casual", "Sales", "Apology"] as const;

function EmailPage() {
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [subject, setSubject] = useState("");
  const [points, setPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!points.trim()) return;
    setLoading(true); setOutput("");
    try {
      const text = await askAi(
        `Write a ${tone.toLowerCase()} email.\nSubject: ${subject || "(suggest one)"}\nKey points:\n${points}\n\nReturn the full email including subject line, greeting, body, and sign-off.`,
        "You are an expert email copywriter.",
      );
      setOutput(text.trim());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <AiToolShell slug="email">
      <div className="grid gap-3">
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <Button key={t} size="sm" variant={tone === t ? "default" : "outline"} onClick={() => setTone(t)}>{t}</Button>
          ))}
        </div>
        <Input placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <Textarea placeholder="Key points to include..." value={points} onChange={(e) => setPoints(e.target.value)} className="min-h-[160px]" />
        <Button onClick={run} disabled={loading || !points.trim()} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Email
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
