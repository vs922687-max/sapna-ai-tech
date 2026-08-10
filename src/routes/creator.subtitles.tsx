import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Captions, Download, Loader2, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreatorShell, creatorSchema } from "@/components/creator/creator-shell";
import { creatorTool } from "@/lib/creator-studio";
import { aiAuthHeaders } from "@/lib/ai-client";
import { downloadText, textareaCls } from "@/components/tools/ui-primitives";

const tool = creatorTool("subtitles");

const FAQS = [
  { q: "Kaunse file types chalte hain?", a: "MP4, MOV, WEBM video aur MP3, M4A, WAV audio — 25 MB tak. Lambi video ke liye pehle audio nikal kar upload karein." },
  { q: "Subtitles kis format mein export hote hain?", a: "SRT aur VTT dono — SRT YouTube/Instagram ke liye, VTT web players ke liye." },
  { q: "Timing galat ho to?", a: "Har line ka time editable hai. Text box mein seedha timestamp badal kar dobara export kar lein." },
  { q: "Hindi subtitles bante hain?", a: "Haan — transcription Hindi, Hinglish, Punjabi aur English audio par kaam karti hai, bhasha automatically detect hoti hai." },
];

export const Route = createFileRoute("/creator/subtitles")({
  head: () => ({
    meta: [
      { title: "AI Subtitle Generator — Auto Captions in SRT & VTT | Bharat AI Sathi" },
      { name: "description", content: "Upload a video or audio file and get AI auto subtitles in Hindi, Hinglish, Punjabi or English. Edit the timeline and export SRT or VTT free." },
      { property: "og:title", content: "AI Subtitle Generator — Bharat AI Sathi" },
      { property: "og:description", content: "Video se auto captions banayein aur SRT/VTT download karein." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/subtitles" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/subtitles" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: SubtitlePage,
});

type Cue = { start: number; end: number; text: string };

function fmt(t: number, comma: boolean) {
  const ms = Math.floor((t % 1) * 1000);
  const s = Math.floor(t) % 60;
  const m = Math.floor(t / 60) % 60;
  const h = Math.floor(t / 3600);
  const pad = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}${comma ? "," : "."}${pad(ms, 3)}`;
}

/** Split a transcript into readable cues spread across the media duration. */
function buildCues(text: string, duration: number): Cue[] {
  const parts = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?।])\s+/)
    .flatMap((s) => (s.length > 90 ? s.match(/.{1,90}(\s|$)/g) ?? [s] : [s]))
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return [];
  const totalChars = parts.reduce((a, p) => a + p.length, 0);
  const total = duration > 1 ? duration : parts.length * 3;
  let cursor = 0;
  return parts.map((p) => {
    const span = Math.max(1.2, (p.length / totalChars) * total);
    const cue = { start: cursor, end: Math.min(total, cursor + span), text: p };
    cursor += span;
    return cue;
  });
}

function toSrt(cues: Cue[]) {
  return cues.map((c, i) => `${i + 1}\n${fmt(c.start, true)} --> ${fmt(c.end, true)}\n${c.text}\n`).join("\n");
}
function toVtt(cues: Cue[]) {
  return `WEBVTT\n\n${cues.map((c) => `${fmt(c.start, false)} --> ${fmt(c.end, false)}\n${c.text}\n`).join("\n")}`;
}

function SubtitlePage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [cues, setCues] = useState<Cue[]>([]);
  const [current, setCurrent] = useState(0);
  const mediaRef = useRef<HTMLVideoElement | null>(null);

  const activeCue = useMemo(() => cues.find((c) => current >= c.start && current <= c.end), [cues, current]);

  const pick = (f?: File | null) => {
    if (!f) return;
    if (f.size > 25 * 1024 * 1024) { toast.error("File 25 MB se badi hai — chhota clip ya audio upload karein."); return; }
    setFile(f);
    setUrl(URL.createObjectURL(f));
    setCues([]);
    setTranscript("");
  };

  const transcribe = async () => {
    if (!file) { toast.error("Pehle video ya audio file chunein."); return; }
    setLoading(true);
    try {
      const headers = await aiAuthHeaders();
      const form = new FormData();
      form.append("file", file, file.name);
      const res = await fetch("/api/transcribe", { method: "POST", headers, body: form });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || `Transcription failed (${res.status})`);
      const text = data.text ?? "";
      if (!text.trim()) throw new Error("Audio mein koi awaaz detect nahi hui.");
      setTranscript(text);
      setCues(buildCues(text, mediaRef.current?.duration ?? 0));
      toast.success("Subtitles ban gaye — timing check karke export karein.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Transcription fail ho gayi.");
    } finally {
      setLoading(false);
    }
  };

  const editable = cues
    .map((c) => `${fmt(c.start, true)} --> ${fmt(c.end, true)}\n${c.text}`)
    .join("\n\n");

  const parseEditable = (value: string) => {
    const blocks = value.split(/\n\s*\n/);
    const parsed: Cue[] = [];
    for (const b of blocks) {
      const [timeLine, ...rest] = b.split("\n");
      const m = timeLine?.match(/(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)/);
      if (!m || rest.length === 0) continue;
      const n = m.slice(1).map(Number);
      parsed.push({
        start: n[0] * 3600 + n[1] * 60 + n[2] + n[3] / 1000,
        end: n[4] * 3600 + n[5] * 60 + n[6] + n[7] / 1000,
        text: rest.join(" ").trim(),
      });
    }
    setCues(parsed);
  };

  return (
    <CreatorShell
      tool={tool}
      faqs={FAQS}
      intro={
        <>
          <p>
            Captions ke saath video 40% tak zyada dekha jaata hai, khaaskar jab log bina sound scroll kar rahe hote
            hain. Apni clip ya audio upload karein, AI transcription chalayein, phir timeline mein lines aur timings
            edit karke SRT ya VTT download kar lein — YouTube aur Instagram dono accept karte hain.
          </p>
          <p>
            Player ke neeche live caption preview dikhta hai, isliye export se pehle hi pata chal jaata hai ki text
            time par aa raha hai ya nahi. Audio sirf transcription ke liye securely bheja jaata hai, store nahi hota.
          </p>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted/50">
          <Upload className="h-4 w-4" /> {file ? "Change file" : "Choose video / audio"}
          <input type="file" accept="video/*,audio/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        <Button onClick={transcribe} disabled={loading || !file} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Wand2 className="mr-1 h-4 w-4" />}
          Generate subtitles
        </Button>
        {cues.length > 0 && (
          <>
            <Button variant="outline" onClick={() => downloadText("subtitles.srt", toSrt(cues), "text/plain")}>
              <Download className="mr-1 h-4 w-4" /> SRT
            </Button>
            <Button variant="outline" onClick={() => downloadText("subtitles.vtt", toVtt(cues), "text/vtt")}>
              <Download className="mr-1 h-4 w-4" /> VTT
            </Button>
          </>
        )}
      </div>

      {url && (
        <div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-black">
          <video
            ref={mediaRef}
            src={url}
            controls
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
            className="mx-auto max-h-[420px] w-full"
          />
          <div className="min-h-[44px] bg-black/80 px-4 py-2 text-center text-sm font-medium text-white">
            {activeCue?.text ?? <span className="text-white/40">Caption preview</span>}
          </div>
        </div>
      )}

      {cues.length > 0 && (
        <label className="mt-4 block">
          <span className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Captions className="h-3.5 w-3.5" /> Subtitle timeline (editable — timestamp aur text badal sakte hain)
          </span>
          <textarea defaultValue={editable} onBlur={(e) => parseEditable(e.target.value)} className={textareaCls()} spellCheck={false} />
        </label>
      )}

      {transcript && (
        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Plain transcript</span>
          <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className={textareaCls()} />
        </label>
      )}

      {!url && (
        <p className="mt-4 rounded-xl border border-dashed border-border/60 bg-card/30 p-4 text-center text-sm text-muted-foreground">
          File choose karein — 25 MB tak video ya audio. Subtitles banane ke liye sign in zaroori hai.
        </p>
      )}
    </CreatorShell>
  );
}
