import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Square, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreatorShell, creatorSchema } from "@/components/creator/creator-shell";
import { OutputPanel } from "@/components/creator/output-panel";
import { useCreatorProject } from "@/hooks/use-creator-project";
import { askAi } from "@/lib/ai-client";
import { CREATOR_SYSTEM, briefLine, creatorTool } from "@/lib/creator-studio";
import { textareaCls } from "@/components/tools/ui-primitives";

const tool = creatorTool("voice-over");

const FAQS = [
  { q: "Kya voice download ho sakti hai?", a: "Browser की speech engine seedha audio file nahi deti. Preview sunkar script finalise karein, phir phone ke screen/voice recorder se record kar lein — ya voice-over script download karke apne editor mein narrate karein." },
  { q: "Hindi voice nahi dikh rahi?", a: "Voice list aapke device par installed voices se aati hai. Android/iOS settings mein Hindi text-to-speech voice install karne par wo yahan dikhne lagegi." },
  { q: "Speed aur pitch kaam karta hai?", a: "Haan — dono sliders live preview par lagte hain, taaki aap natural narration speed set kar sakein." },
  { q: "Script AI se ban sakti hai?", a: "Haan, “AI se voice-over script banayein” dabaayein — aapke project topic se narration-ready text ban jaata hai." },
];

export const Route = createFileRoute("/creator/voice-over")({
  head: () => ({
    meta: [
      { title: "AI Voice-over Studio — Hindi, English & Punjabi Narration | Bharat AI Sathi" },
      { name: "description", content: "Write or generate a voice-over script and hear it read aloud in Hindi, English or Punjabi with speed and pitch control, right in your browser." },
      { property: "og:title", content: "AI Voice-over Studio — Bharat AI Sathi" },
      { property: "og:description", content: "Script likhein aur turant apni bhasha mein narration sunein." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/voice-over" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/voice-over" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: VoiceOverPage,
});

function VoiceOverPage() {
  const { project, setOutput, save } = useCreatorProject();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const text = project.outputs.voiceover ?? project.outputs.script ?? "";

  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const preferred = useMemo(() => {
    const want = project.language === "English" ? "en" : project.language === "Punjabi" ? "pa" : "hi";
    return voices.filter((v) => v.lang.toLowerCase().startsWith(want));
  }, [voices, project.language]);

  const speak = () => {
    if (!supported) { toast.error("Aapka browser voice preview support nahi karta."); return; }
    if (!text.trim()) { toast.error("Pehle script likhein."); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.slice(0, 6000));
    const chosen = voices.find((v) => v.voiceURI === voiceUri) ?? preferred[0] ?? voices[0];
    if (chosen) { u.voice = chosen; u.lang = chosen.lang; }
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => setSpeaking(false);
    u.onerror = () => { setSpeaking(false); toast.error("Voice playback fail ho gaya."); };
    utterRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stop = () => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const generateScript = async () => {
    if (!project.topic.trim()) { toast.error("Pehle Content Generator mein topic set karein ya script likhein."); return; }
    setLoading(true);
    try {
      const out = await askAi(
        `${briefLine(project)}\n\nWrite ONLY a clean voice-over narration script for ${project.duration}. Narration text only — no headings, no timestamps, no stage directions, no emoji. Short sentences that are easy to read aloud.`,
        CREATOR_SYSTEM,
      );
      setOutput("voiceover", out);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation fail ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatorShell
      tool={tool}
      faqs={FAQS}
      intro={
        <>
          <p>
            Voice-over Studio mein aap apni narration script likh ya AI se bana sakte hain, phir usse apne device ki
            voices se sun sakte hain. Speed aur pitch adjust karke wahi rhythm set karein jo aap video mein chahte hain
            — isse record karte waqt pata hota hai kahan pause lena hai.
          </p>
          <p>
            Yeh feature aapke browser ki speech engine use karta hai, isliye koi upload nahi hota aur data kharch bhi
            nahi hota. Script Generator se save ki gayi script yahan automatically aa jaati hai.
          </p>
        </>
      }
    >
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">Voice-over script</span>
        <textarea
          value={text}
          onChange={(e) => setOutput("voiceover", e.target.value)}
          placeholder="Narration text yahan likhein…"
          className={textareaCls()}
        />
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Voice ({project.language})</span>
          <select
            value={voiceUri}
            onChange={(e) => setVoiceUri(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60"
          >
            <option value="">Auto ({preferred[0]?.name ?? voices[0]?.name ?? "device default"})</option>
            {(preferred.length ? preferred : voices).map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>{v.name} — {v.lang}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Speed — {rate.toFixed(2)}x</span>
          <input type="range" min={0.5} max={1.6} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-[oklch(0.76_0.17_55)]" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Pitch — {pitch.toFixed(1)}</span>
          <input type="range" min={0.5} max={1.6} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))} className="w-full accent-[oklch(0.76_0.17_55)]" />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {speaking ? (
          <Button onClick={stop} variant="outline"><Square className="mr-1 h-4 w-4" /> Stop</Button>
        ) : (
          <Button onClick={speak} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
            <Play className="mr-1 h-4 w-4" /> Preview voice
          </Button>
        )}
        <Button onClick={generateScript} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
          AI se voice-over script banayein
        </Button>
      </div>
      {!supported && (
        <p className="mt-3 text-xs text-destructive">
          Is browser mein voice preview available nahi hai — script download karke apne editor mein use karein.
        </p>
      )}

      <div className="mt-6">
        <OutputPanel
          value={text}
          onChange={(v) => setOutput("voiceover", v)}
          onSave={() => { save(); toast.success("Voice-over script save ho gayi"); }}
          filename={`voiceover-${project.topic || "bharat-ai-sathi"}`}
          minHeight={200}
          emptyHint="Script likhne ke baad yahan Copy aur Download options aa jaayenge."
        />
      </div>
    </CreatorShell>
  );
}
