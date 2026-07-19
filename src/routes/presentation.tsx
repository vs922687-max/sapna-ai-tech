import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Download, Copy, Presentation as PresentationIcon } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/presentation")({
  head: () => ({
    meta: [
      { title: "Presentation Generator — Bharat AI Sathi" },
      { name: "description", content: "Turn any topic into a ready slide outline. Export as PPTX in seconds." },
      { property: "og:title", content: "AI Presentation Generator — Bharat AI Sathi" },
      { property: "og:description", content: "Generate a full slide deck outline from any topic and export as PPTX." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/presentation" }],
  }),
  component: PresentationPage,
});

type Slide = { title: string; bullets: string[]; notes?: string };
type Deck = { title: string; subtitle?: string; slides: Slide[] };

function PresentationPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [slideCount, setSlideCount] = useState(8);
  const [language, setLanguage] = useState<"English" | "Hindi" | "Hinglish">("English");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deck, setDeck] = useState<Deck | null>(null);

  const generate = async () => {
    if (!topic.trim()) return toast.error("Enter a topic");
    setLoading(true);
    setDeck(null);
    try {
      const system = `You generate structured presentation outlines. Reply with ONLY a JSON object (no markdown fences) matching: {"title":string,"subtitle":string,"slides":[{"title":string,"bullets":string[3-5],"notes":string}]}. Write everything in ${language}.`;
      const prompt = `Create a ${slideCount}-slide presentation outline.
Topic: ${topic}
Audience: ${audience || "general"}
Include a title slide, agenda, and closing/thank-you slide within the count. Keep bullets crisp (max 12 words each). Speaker notes 1-2 sentences.`;
      const text = await askAi(prompt, system);
      const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = JSON.parse(cleaned) as Deck;
      if (!parsed?.slides?.length) throw new Error("Empty deck");
      setDeck(parsed);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const copyOutline = () => {
    if (!deck) return;
    const text = [
      deck.title,
      deck.subtitle || "",
      "",
      ...deck.slides.map((s, i) => `Slide ${i + 1}: ${s.title}\n${s.bullets.map((b) => `  • ${b}`).join("\n")}${s.notes ? `\nNotes: ${s.notes}` : ""}`),
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied outline");
  };

  const exportPptx = async () => {
    if (!deck) return;
    setExporting(true);
    try {
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_WIDE";
      pptx.title = deck.title;

      const title = pptx.addSlide();
      title.background = { color: "0F172A" };
      title.addText(deck.title, { x: 0.5, y: 2.4, w: 12, h: 1.5, fontSize: 44, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri" });
      if (deck.subtitle) title.addText(deck.subtitle, { x: 0.5, y: 4.0, w: 12, h: 0.8, fontSize: 20, color: "F59E0B", align: "center" });
      title.addText("Bharat AI Sathi", { x: 0.5, y: 6.8, w: 12, h: 0.4, fontSize: 12, color: "94A3B8", align: "center" });

      deck.slides.forEach((s, idx) => {
        if (idx === 0 && s.title.toLowerCase() === deck.title.toLowerCase()) return;
        const slide = pptx.addSlide();
        slide.background = { color: "FFFFFF" };
        slide.addText(s.title, { x: 0.5, y: 0.4, w: 12, h: 0.8, fontSize: 28, bold: true, color: "0F172A", fontFace: "Calibri" });
        slide.addShape("rect", { x: 0.5, y: 1.2, w: 1.2, h: 0.06, fill: { color: "F59E0B" } });
        const bullets = s.bullets.map((b) => ({ text: b, options: { bullet: true, fontSize: 18, color: "1F2937" } }));
        slide.addText(bullets, { x: 0.6, y: 1.5, w: 11.8, h: 5.0, valign: "top", paraSpaceAfter: 8 });
        if (s.notes) slide.addNotes(s.notes);
      });

      await pptx.writeFile({ fileName: `${deck.title.replace(/[^\w\s-]/g, "").slice(0, 60) || "presentation"}.pptx` });
      toast.success("Downloaded PPTX");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AiToolShell slug="presentation">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4 rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Topic</label>
            <Textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Introduction to Digital India for rural entrepreneurs" rows={3} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Audience (optional)</label>
            <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. college students, investors" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Slides</label>
              <Input type="number" min={4} max={20} value={slideCount} onChange={(e) => setSlideCount(Math.min(20, Math.max(4, Number(e.target.value) || 8)))} className="mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value as typeof language)} className="mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm">
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
              </select>
            </div>
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : <><PresentationIcon className="mr-2 h-4 w-4" /> Generate outline</>}
          </Button>
        </div>

        <div className="min-h-[300px] rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
          {!deck && !loading && (
            <div className="grid h-full min-h-[260px] place-items-center text-center text-sm text-muted-foreground">
              Your slide outline will appear here. Export as PPTX with one click.
            </div>
          )}
          {loading && (
            <div className="grid h-full min-h-[260px] place-items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Generating slides…</div>
            </div>
          )}
          {deck && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold">{deck.title}</h2>
                  {deck.subtitle && <p className="text-sm text-muted-foreground">{deck.subtitle}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{deck.slides.length} slides</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyOutline}><Copy className="mr-1 h-3.5 w-3.5" /> Copy</Button>
                  <Button size="sm" onClick={exportPptx} disabled={exporting}>
                    {exporting ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1 h-3.5 w-3.5" />} PPTX
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {deck.slides.map((s, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Slide {i + 1}</p>
                    <h3 className="mt-1 font-semibold">{s.title}</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {s.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />{b}</li>
                      ))}
                    </ul>
                    {s.notes && <p className="mt-2 text-xs italic text-muted-foreground">Notes: {s.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AiToolShell>
  );
}
