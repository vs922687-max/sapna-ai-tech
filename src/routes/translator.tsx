import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRightLeft, Copy } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/translator")({
  head: () => ({ meta: [{ title: "Indian Language Translator — Bharat AI Sathi" }, { name: "description", content: "Translate across Hindi, Tamil, Bengali, Marathi, Telugu, Gujarati and more with AI." }] }),
  component: TranslatorPage,
});

const LANGS = ["English", "Hindi", "Tamil", "Bengali", "Marathi", "Telugu", "Gujarati", "Kannada", "Malayalam", "Punjabi", "Odia"];

function TranslatorPage() {
  const [from, setFrom] = useState("English");
  const [to, setTo] = useState("Hindi");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const text = await askAi(
        `Translate the following text from ${from} to ${to}. Return ONLY the translation, no explanations, no quotes.\n\n${input}`,
        "You are a professional translator specialising in Indian languages. Preserve tone, names, and formatting.",
      );
      setOutput(text.trim());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => { setFrom(to); setTo(from); setInput(output); setOutput(input); };
  const copy = () => { navigator.clipboard.writeText(output); toast.success("Copied"); };

  return (
    <AiToolShell slug="translator">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="mb-2 w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm">
            {LANGS.map((l) => <option key={l}>{l}</option>)}
          </select>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or paste text..." className="min-h-[220px]" />
        </div>
        <div>
          <div className="mb-2 flex gap-2">
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm">
              {LANGS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <Button size="icon" variant="outline" onClick={swap} title="Swap"><ArrowRightLeft className="h-4 w-4" /></Button>
          </div>
          <Textarea value={output} readOnly placeholder="Translation will appear here..." className="min-h-[220px]" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={translate} disabled={loading || !input.trim()} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Translate
        </Button>
        {output && <Button variant="outline" onClick={copy}><Copy className="mr-1 h-4 w-4" />Copy</Button>}
      </div>
    </AiToolShell>
  );
}
