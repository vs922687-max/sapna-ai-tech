import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Upload, Scissors } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreatorShell, creatorSchema } from "@/components/creator/creator-shell";
import { creatorTool } from "@/lib/creator-studio";
import { downloadBlob } from "@/components/tools/ui-primitives";

const tool = creatorTool("video-editor");

const FAQS = [
  { q: "Video upload hoti hai kya?", a: "Nahi — editing aur export dono aapke browser mein hote hain, file kabhi server par nahi jaati." },
  { q: "Export kis format mein hota hai?", a: "WEBM video (audio ke saath, agar source mein audio ho). YouTube, Instagram aur WhatsApp sab WEBM accept karte hain; chahein to apne phone gallery app se MP4 mein convert kar lein." },
  { q: "Export kitna time leta hai?", a: "Export real-time recording hai, matlab 30 second ka trim taqreeban 30 second leta hai. Tab band na karein." },
  { q: "Kya 9:16 Reels ratio milta hai?", a: "Haan — 9:16, 16:9 aur 1:1 presets hain, video automatically center-crop ho jaata hai." },
  { q: "Watermark hataya ja sakta hai?", a: "Watermark text aap khud likhte hain — khaali chhodne par koi watermark nahi lagta." },
];

export const Route = createFileRoute("/creator/video-editor")({
  head: () => ({
    meta: [
      { title: "Free Online Video Editor — Trim, Crop 9:16, Add Text (No Upload) | Bharat AI Sathi" },
      { name: "description", content: "Trim, crop to 9:16 or 1:1, rotate, change speed, add text and a watermark, then export video right in your browser. Nothing is uploaded to any server." },
      { property: "og:title", content: "Free Online Video Editor — Bharat AI Sathi Creator Studio" },
      { property: "og:description", content: "Browser mein trim, crop, text aur watermark — bina upload, bina watermark." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/video-editor" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/video-editor" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: VideoEditorPage,
});

const RATIOS = [
  { label: "9:16 (Shorts / Reels)", w: 1080, h: 1920 },
  { label: "16:9 (YouTube)", w: 1920, h: 1080 },
  { label: "1:1 (Square post)", w: 1080, h: 1080 },
];

function VideoEditorPage() {
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [muted, setMuted] = useState(false);
  const [text, setText] = useState("");
  const [watermark, setWatermark] = useState("");
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const target = RATIOS[ratio];

  // Live preview: draw the transformed frame onto the canvas.
  useEffect(() => {
    const draw = () => {
      const v = videoRef.current;
      const c = canvasRef.current;
      rafRef.current = requestAnimationFrame(draw);
      if (!v || !c || !v.videoWidth) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      if (c.width !== target.w || c.height !== target.h) {
        c.width = target.w;
        c.height = target.h;
      }
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, c.width, c.height);
      const swap = rotate === 90 || rotate === 270;
      const vw = swap ? v.videoHeight : v.videoWidth;
      const vh = swap ? v.videoWidth : v.videoHeight;
      const scale = Math.max(c.width / vw, c.height / vh) * zoom;
      ctx.save();
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.drawImage(v, (-v.videoWidth * scale) / 2, (-v.videoHeight * scale) / 2, v.videoWidth * scale, v.videoHeight * scale);
      ctx.restore();
      const base = Math.min(c.width, c.height);
      if (text.trim()) {
        const size = base * 0.075;
        ctx.font = `900 ${size}px Poppins, Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = size * 0.16;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#fff";
        ctx.strokeText(text, c.width / 2, c.height * 0.12);
        ctx.fillText(text, c.width / 2, c.height * 0.12);
      }
      if (watermark.trim()) {
        const size = base * 0.035;
        ctx.font = `600 ${size}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.fillText(watermark, c.width - base * 0.04, c.height - base * 0.04);
      }
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target.w, target.h, rotate, zoom, text, watermark]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) { v.playbackRate = speed; v.muted = muted; }
  }, [speed, muted]);

  const pick = (f?: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) { toast.error("Video file chunein."); return; }
    setUrl(URL.createObjectURL(f));
    setProgress(0);
  };

  const exportVideo = async () => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    if (typeof MediaRecorder === "undefined" || !("captureStream" in c)) {
      toast.error("Is browser mein export support nahi hai — Chrome ya Edge use karein.");
      return;
    }
    const clipEnd = end > start ? end : duration;
    if (clipEnd - start < 0.2) { toast.error("Trim range bahut chhota hai."); return; }

    setExporting(true);
    setProgress(0);
    try {
      const stream = (c as HTMLCanvasElement).captureStream(30);
      // Mix in the original audio when the browser exposes it and audio isn't muted.
      if (!muted) {
        try {
          const withAudio = v as HTMLVideoElement & { captureStream?: () => MediaStream };
          withAudio.captureStream?.().getAudioTracks().forEach((t) => stream.addTrack(t));
        } catch {
          /* audio capture unsupported — export video only */
        }
      }
      const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

      const done = new Promise<void>((resolve) => { rec.onstop = () => resolve(); });

      v.currentTime = start;
      await new Promise<void>((r) => { v.onseeked = () => r(); });
      v.muted = true; // avoid echo while exporting
      rec.start(200);
      await v.play();

      const tick = () => {
        const pct = Math.min(100, Math.round(((v.currentTime - start) / (clipEnd - start)) * 100));
        setProgress(pct);
        if (v.currentTime >= clipEnd || v.ended) {
          v.pause();
          if (rec.state !== "inactive") rec.stop();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      await done;

      v.muted = muted;
      const blob = new Blob(chunks, { type: "video/webm" });
      if (blob.size < 1000) throw new Error("Export khaali nikla — dobara koshish karein.");
      downloadBlob(`bharat-ai-sathi-${target.w}x${target.h}.webm`, blob);
      toast.success("Video export ho gaya");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export fail ho gaya.");
    } finally {
      setExporting(false);
      setProgress(0);
    }
  };

  return (
    <CreatorShell
      tool={tool}
      faqs={FAQS}
      intro={
        <>
          <p>
            Yeh halka-phulka video editor un creators ke liye hai jo phone ya laptop par jaldi ek clip ready karna
            chahte hain. Video choose karein, start-end se trim karein, 9:16 ya 1:1 ratio chunein, rotate ya zoom
            karein, speed badlein, upar bada text aur neeche apna watermark lagayein — sab live preview mein dikhta
            hai. Export dabaane par file seedha aapke device par save hoti hai.
          </p>
          <p>
            Kuch bhi upload nahi hota, isliye private clips par bhi surakshit hai aur internet data bachta hai. Bade
            projects ke liye pehle Shorts Generator se timeline banayein, phir usi ke hisaab se yahan trim karein.
          </p>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border/60 px-3 py-2 text-sm hover:bg-muted/50">
          <Upload className="h-4 w-4" /> {url ? "Change video" : "Choose video"}
          <input type="file" accept="video/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        <Button onClick={exportVideo} disabled={!url || exporting} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
          {exporting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Download className="mr-1 h-4 w-4" />}
          {exporting ? `Exporting ${progress}%` : "Export video"}
        </Button>
      </div>

      {url ? (
        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <canvas ref={canvasRef} className="mx-auto block max-h-[460px] w-auto max-w-full rounded-xl border border-border/60 bg-black" aria-label="Video preview" />
            <video
              ref={videoRef}
              src={url}
              controls
              playsInline
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                setDuration(d);
                setStart(0);
                setEnd(d);
              }}
              className="mt-3 max-h-[160px] w-full rounded-lg border border-border/60 bg-black"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Neeche wala player source video hai — upar wala canvas final output dikhata hai.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Aspect ratio</span>
              <select value={ratio} onChange={(e) => setRatio(Number(e.target.value))} className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm">
                {RATIOS.map((r, i) => <option key={r.label} value={i}>{r.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Trim start — {start.toFixed(1)}s</span>
              <input type="range" min={0} max={Math.max(0.1, duration)} step={0.1} value={start}
                onChange={(e) => { const v = Math.min(Number(e.target.value), end - 0.2); setStart(Math.max(0, v)); if (videoRef.current) videoRef.current.currentTime = Math.max(0, v); }}
                className="w-full accent-[oklch(0.76_0.17_55)]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Trim end — {end.toFixed(1)}s</span>
              <input type="range" min={0} max={Math.max(0.1, duration)} step={0.1} value={end}
                onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 0.2))}
                className="w-full accent-[oklch(0.76_0.17_55)]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Zoom / crop — {zoom.toFixed(2)}x</span>
              <input type="range" min={1} max={2} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-[oklch(0.76_0.17_55)]" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Speed — {speed.toFixed(2)}x</span>
              <input type="range" min={0.5} max={2} step={0.05} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-[oklch(0.76_0.17_55)]" />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setRotate((r) => (r + 90) % 360)}>
                <Scissors className="mr-1 h-4 w-4" /> Rotate {rotate}°
              </Button>
              <Button size="sm" variant={muted ? "default" : "outline"} onClick={() => setMuted((m) => !m)}>
                {muted ? "Audio off" : "Audio on"}
              </Button>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Top text (optional)</span>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. PMAY ka naya rule" className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Watermark (optional)</span>
              <input value={watermark} onChange={(e) => setWatermark(e.target.value)} placeholder="@yourchannel" className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm" />
            </label>
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-border/60 bg-card/30 p-4 text-center text-sm text-muted-foreground">
          Video choose karein — editing aur export poori tarah aapke browser mein hoti hai.
        </p>
      )}
    </CreatorShell>
  );
}
