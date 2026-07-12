import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/social")({
  head: () => ({ meta: [{ title: "AI Social Media Post Generator — Bharat AI Sathi" }, { name: "description", content: "Generate ready-to-post captions with emojis and hashtags for Instagram, LinkedIn, WhatsApp, X." }] }),
  component: SocialPage,
});

const PLATFORMS = ["Instagram", "LinkedIn", "WhatsApp", "Twitter/X"] as const;

function SocialPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>("Instagram");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true); setOutput("");
    try {
      const text = await askAi(
        `Write a ready-to-post ${platform} caption about: ${topic}\n\nInclude emojis, a strong hook, and relevant hashtags. Match ${platform} best practices for length and formatting.`,
        "You are a social media copywriter for Indian audiences.",
      );
      setOutput(text.trim());
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <AiToolShell slug="social">
      <div className="grid gap-3">
        <Input placeholder="What's the post about?" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => <Button key={p} size="sm" variant={platform === p ? "default" : "outline"} onClick={() => setPlatform(p)}>{p}</Button>)}
        </div>
        <Button onClick={run} disabled={loading || !topic.trim()} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Post
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
