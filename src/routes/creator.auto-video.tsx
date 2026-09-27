import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, ImagePlus, Loader2, Play, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreatorShell, creatorSchema } from "@/components/creator/creator-shell";
import { textareaCls, downloadBlob } from "@/components/tools/ui-primitives";
import { useCreatorProject } from "@/hooks/use-creator-project";
import { creatorTool } from "@/lib/creator-studio";
import { aiAuthHeaders } from "@/lib/ai-client";
import type { VideoScene } from "@/lib/creator-video-export";

const tool = creatorTool("auto-video");
const FAQS = [
  { q: "MP4 mein voice hoti hai?", a: "Haan. Sign in karke AI narration banayein; export usi audio ko scene visuals ke saath MP4 mein jodta hai." },
  { q: "Apni photos laga sakte hain?", a: "Haan, har scene ki apni photo chunein. Bina photo ke bhi designed text visuals bante hain." },
  { q: "Kitni lambi video banegi?", a: "Is workflow mein 900 characters tak ka script aur 65 seconds tak ka voiceover support hota hai. Lambi script ko pehle chhota karein." },
];

export const Route = createFileRoute("/creator/auto-video")({
  head: () => ({
    meta: [
      { title: "Script to MP4 Video Maker | Bharat AI Sathi" },
      { name: "description", content: "Turn a short script into a vertical MP4 with AI voiceover, scene-by-scene visuals and optional photos." },
      { property: "og:title", content: "Script to MP4 Video Maker — Bharat AI Sathi" },
      { property: "og:description", content: "Script se voiceover aur visuals ke saath vertical MP4 banayein." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/auto-video" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: AutoVideoPage,
});

function splitScenes(text: string): VideoScene[] {
  const sentences = text.trim().split(/(?<=[.!?।॥])\s+|\n+/u).filter(Boolean);
  const parts = sentences.length > 1 ? sentences : text.trim().split(/,\s*|\s+और\s+|\s+and\s+/i).filter(Boolean);
  const perScene = Math.max(1, Math.ceil(parts.length / 5));
  return Array.from({ length: Math.ceil(parts.length / perScene) }, (_, i) => ({ text: parts.slice(i * perScene, (i + 1) * perScene).join(" ") }));
}

function AutoVideoPage() {
  const { project, hydrated, setOutput, save } = useCreatorProject();
  const [scenes, setScenes] = useState<VideoScene[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [busy, setBusy] = useState<"voice" | "export" | "">("");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const audioBlob = useRef<Blob | null>(null);
  const script = project.outputs.voiceover ?? project.outputs.script ?? "";
  const canPrepare = hydrated && script.trim().length > 0 && script.trim().length <= 900;
  const shownScenes = useMemo(() => scenes.map((scene, i) => ({ ...scene, number: i + 1 })), [scenes]);

  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); if (videoUrl) URL.revokeObjectURL(videoUrl); };
  }, [audioUrl, videoUrl]);

  const changeScript = (value: string) => {
    setOutput("voiceover", value);
    setScenes([]);
    audioBlob.current = null;
    setAudioUrl(""); setVideoUrl("");
  };

  const makeVoice = async () => {
    if (!canPrepare) { toast.error("900 characters tak ka script likhein."); return; }
    setBusy("voice"); setVideoUrl("");
    audioBlob.current = null; setAudioUrl("");
    try {
      const headers = await aiAuthHeaders();
      const response = await fetch("/api/creator-narration", {
        method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify({ text: script.trim() }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error || `Voice generation failed (${response.status}).`);
      }
      const blob = await response.blob();
      if (!blob.size || !blob.type.includes("audio")) throw new Error("Voice generation returned no playable audio.");
      audioBlob.current = blob;
      setAudioUrl(URL.createObjectURL(blob));
      setScenes(splitScenes(script));
      save();
      toast.success("Voice aur scenes tayyar hain.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Voice generation failed.");
    } finally { setBusy(""); }
  };

  const makeVideo = async () => {
    if (!audioBlob.current || !scenes.length) { toast.error("Pehle voice banayein."); return; }
    setBusy("export"); setProgress(0); setVideoUrl("");
    try {
      const ctx = new AudioContext();
      let audio: AudioBuffer;
      try { audio = await ctx.decodeAudioData(await audioBlob.current.arrayBuffer()); }
      finally { await ctx.close(); }
      const { exportCreatorMp4 } = await import("@/lib/creator-video-export");
      const blob = await exportCreatorMp4(audio, scenes, project.topic || "Bharat AI Sathi", setProgress);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      downloadBlob(`bharat-ai-sathi-${(project.topic || "short-video").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 36)}.mp4`, blob);
      toast.success("MP4 video download ho gaya.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "MP4 export failed.");
    } finally { setBusy(""); }
  };

  return (
    <CreatorShell tool={tool} faqs={FAQS} intro={<p>Script likhein ya Creator Studio mein banaya hua script use karein. AI voice banne par scenes taiyar hote hain; har scene mein apni photo lagakar MP4 download karein. Narration AI service ko bheja jaata hai; photos aur video export aapke browser mein rehte hain.</p>}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-4">
        <span className="text-sm font-semibold text-foreground">Script → Voice → Visuals → MP4</span>
        <Button asChild size="sm" variant="outline"><Link to="/creator/script-generator"><Sparkles className="mr-2 h-4 w-4" /> Script Generator</Link></Button>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Narration script</span>
        <textarea aria-label="Narration script" value={script} disabled={!hydrated || !!busy} onChange={(e) => changeScript(e.target.value)} placeholder="Apni video ki script yahan likhein…" maxLength={900} className={textareaCls()} />
        <span className="mt-1 block text-xs text-muted-foreground">{script.length}/900 characters · Hindi, Punjabi, English aur Hinglish text</span>
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={makeVoice} disabled={!canPrepare || !!busy}>
          {busy === "voice" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          {busy === "voice" ? "Voice bana rahe hain…" : audioUrl ? "Regenerate voice" : "Generate voice & scenes"}
        </Button>
        {audioUrl && <audio controls src={audioUrl} className="h-10 max-w-full" aria-label="Generated voiceover" />}
      </div>
      {shownScenes.length > 0 && (
        <section className="mt-8 border-t border-border/60 pt-6">
          <h2 className="font-display text-xl font-bold">Video scenes</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {shownScenes.map((scene, index) => (
              <div key={`${index}-${scene.text}`} className="rounded-md border border-border/60 bg-card/40 p-4">
                <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-primary">SCENE {scene.number}</span><span className="text-xs text-muted-foreground">{Math.round(index * 100 / scenes.length)}–{Math.round((index + 1) * 100 / scenes.length)}%</span></div>
                <p className="mt-2 line-clamp-4 min-h-16 text-sm leading-relaxed">{scene.text}</p>
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                  <ImagePlus className="h-4 w-4" /> {scene.image ? scene.image.name : "Add photo (optional)"}
                  <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 10 * 1024 * 1024) { toast.error("Photo 10 MB se chhoti honi chahiye."); return; }
                    setScenes((current) => current.map((item, i) => i === index ? { ...item, image: file } : item)); setVideoUrl("");
                  }} />
                </label>
                {scene.image && <Button size="sm" variant="ghost" className="mt-1" onClick={() => setScenes((current) => current.map((item, i) => i === index ? { ...item, image: undefined } : item))}><Trash2 className="mr-1 h-3 w-3" /> Remove photo</Button>}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button onClick={makeVideo} disabled={!!busy}><Download className="mr-2 h-4 w-4" /> {busy === "export" ? `Exporting ${progress}%` : "Download MP4"}</Button>
            <span className="text-xs text-muted-foreground">Vertical 9:16 · 540 × 960 · voice included</span>
          </div>
          {videoUrl && <video controls playsInline src={videoUrl} className="mt-5 aspect-[9/16] max-h-[520px] w-full rounded-md bg-background object-contain" aria-label="Exported MP4 preview" />}
        </section>
      )}
    </CreatorShell>
  );
}