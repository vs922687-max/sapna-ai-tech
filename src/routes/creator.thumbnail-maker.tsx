import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Plus, Trash2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreatorShell, creatorSchema } from "@/components/creator/creator-shell";
import { useCreatorProject } from "@/hooks/use-creator-project";
import { askAi } from "@/lib/ai-client";
import { CREATOR_SYSTEM, briefLine, creatorTool } from "@/lib/creator-studio";
import { downloadBlob } from "@/components/tools/ui-primitives";

const tool = creatorTool("thumbnail-maker");

const FAQS = [
  { q: "Thumbnail kis size mein banta hai?", a: "YouTube ke liye 1280x720, Shorts/Reels ke liye 1080x1920 aur square post ke liye 1080x1080 presets diye gaye hain." },
  { q: "Kya image upload server par jaati hai?", a: "Nahi. Poora editor aapke browser mein chalta hai — image kahin upload nahi hoti." },
  { q: "Text kitna hona chahiye?", a: "3-4 shabd sabse achhe chalte hain. Mobile par thumbnail chhota dikhta hai, isliye bade font aur strong contrast rakhein." },
  { q: "Download kis format mein hota hai?", a: "High-quality PNG — seedha YouTube ya Instagram par upload kar sakte hain." },
];

export const Route = createFileRoute("/creator/thumbnail-maker")({
  head: () => ({
    meta: [
      { title: "Free Thumbnail Maker for YouTube & Reels (No Upload) | Bharat AI Sathi" },
      { name: "description", content: "Design YouTube and Reels thumbnails in your browser: presets, background image, gradient overlay, bold text layers and one-click PNG download. Nothing is uploaded." },
      { property: "og:title", content: "Free Thumbnail Maker — Bharat AI Sathi Creator Studio" },
      { property: "og:description", content: "Browser mein hi bold, high-contrast thumbnail banayein aur PNG download karein." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/thumbnail-maker" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/thumbnail-maker" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: ThumbnailMakerPage,
});

const PRESETS = [
  { label: "YouTube 1280×720", w: 1280, h: 720 },
  { label: "Shorts / Reels 1080×1920", w: 1080, h: 1920 },
  { label: "Square 1080×1080", w: 1080, h: 1080 },
];

type Layer = {
  id: string;
  text: string;
  x: number; // 0..1
  y: number; // 0..1
  size: number; // px at design size
  color: string;
  stroke: string;
  weight: 700 | 900;
  align: CanvasTextAlign;
};

function newLayer(text = "BIG TEXT", y = 0.5): Layer {
  return {
    id: `l_${Math.random().toString(36).slice(2, 8)}`,
    text,
    x: 0.5,
    y,
    size: 120,
    color: "#ffffff",
    stroke: "#000000",
    weight: 900,
    align: "center",
  };
}

function ThumbnailMakerPage() {
  const { project } = useCreatorProject();
  const [preset, setPreset] = useState(0);
  const [bg1, setBg1] = useState("#0b1020");
  const [bg2, setBg2] = useState("#c2410c");
  const [overlay, setOverlay] = useState(0.35);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [layers, setLayers] = useState<Layer[]>([newLayer("NEW SCHEME", 0.42), newLayer("PURA SACH", 0.6)]);
  const [selected, setSelected] = useState(0);
  const [ideas, setIdeas] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { w, h } = PRESETS[preset];

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = w;
    c.height = h;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, bg1);
    grad.addColorStop(1, bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (img) {
      const scale = Math.max(w / img.width, h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.fillStyle = `rgba(0,0,0,${overlay})`;
      ctx.fillRect(0, 0, w, h);
    }

    const base = Math.min(w, h) / 720;
    for (const l of layers) {
      const size = l.size * base;
      ctx.font = `${l.weight} ${size}px Poppins, Inter, system-ui, sans-serif`;
      ctx.textAlign = l.align;
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(4, size * 0.14);
      ctx.strokeStyle = l.stroke;
      ctx.fillStyle = l.color;
      const x = l.x * w;
      const y = l.y * h;
      ctx.strokeText(l.text, x, y);
      ctx.fillText(l.text, x, y);
    }
  }, [w, h, bg1, bg2, img, overlay, layers]);

  const onFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Image file chunein."); return; }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { setImg(image); URL.revokeObjectURL(url); };
    image.onerror = () => { toast.error("Image load nahi hui."); URL.revokeObjectURL(url); };
    image.src = url;
  };

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.toBlob((blob) => {
      if (!blob) { toast.error("Export fail ho gaya."); return; }
      downloadBlob(`thumbnail-${w}x${h}.png`, blob);
      toast.success("Thumbnail download ho gaya");
    }, "image/png");
  };

  const suggest = async () => {
    if (!project.topic.trim()) { toast.error("Content Generator mein topic set karein ya wahan se project continue karein."); return; }
    setLoading(true);
    try {
      const out = await askAi(
        `${briefLine(project)}\n\nGive 8 thumbnail text options. Each: max 4 words, UPPERCASE, high curiosity, no lies, no emoji. After the list add a short section COLOR TIP with one background + text colour pairing that reads well on mobile.`,
        CREATOR_SYSTEM,
      );
      setIdeas(out);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation fail ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  const patchLayer = (updates: Partial<Layer>) =>
    setLayers((prev) => prev.map((l, i) => (i === selected ? { ...l, ...updates } : l)));

  const l = layers[selected];

  return (
    <CreatorShell
      tool={tool}
      faqs={FAQS}
      intro={
        <>
          <p>
            Thumbnail hi decide karta hai ki koi aapka video kholega ya scroll kar dega. Yahan aap background gradient
            ya apni photo laga sakte hain, uske upar dark overlay daal sakte hain, aur bold outline wale text layers
            add kar sakte hain — jaisa top Indian creators use karte hain. Sab kuch live preview mein dikhta hai.
          </p>
          <p>
            Text kam rakhein aur contrast zyada — mobile par thumbnail bahut chhota dikhta hai. AI se text suggestions
            lene ke liye “AI thumbnail text ideas” dabaayein, phir best option layer mein paste karke PNG download kar
            lein.
          </p>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="overflow-hidden rounded-xl border border-border/60 bg-black/30">
            <canvas ref={canvasRef} className="block h-auto w-full" aria-label="Thumbnail preview" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={download} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
              <Download className="mr-1 h-4 w-4" /> Download PNG
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border/60 px-3 py-1.5 text-sm hover:bg-muted/50">
              <ImagePlus className="h-4 w-4" /> Background image
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            {img && (
              <Button size="sm" variant="ghost" onClick={() => setImg(null)}>Remove image</Button>
            )}
            <Button size="sm" variant="outline" onClick={suggest} disabled={loading}>
              {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
              AI thumbnail text ideas
            </Button>
          </div>
          {ideas && (
            <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-border/60 bg-card/40 p-3 text-xs text-muted-foreground">{ideas}</pre>
          )}
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Size preset</span>
            <select value={preset} onChange={(e) => setPreset(Number(e.target.value))} className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm">
              {PRESETS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">BG colour 1</span>
              <input type="color" value={bg1} onChange={(e) => setBg1(e.target.value)} className="h-9 w-full rounded-lg border border-border/60 bg-transparent" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">BG colour 2</span>
              <input type="color" value={bg2} onChange={(e) => setBg2(e.target.value)} className="h-9 w-full rounded-lg border border-border/60 bg-transparent" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Image darkness — {Math.round(overlay * 100)}%</span>
            <input type="range" min={0} max={0.8} step={0.05} value={overlay} onChange={(e) => setOverlay(Number(e.target.value))} className="w-full accent-[oklch(0.76_0.17_55)]" />
          </label>

          <div className="rounded-xl border border-border/60 bg-card/40 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Text layers</span>
              <Button size="sm" variant="ghost" onClick={() => { setLayers((p) => [...p, newLayer()]); setSelected(layers.length); }}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {layers.map((layer, i) => (
                <div key={layer.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setSelected(i)}
                    className={`flex-1 truncate rounded-lg px-2 py-1.5 text-left text-xs ${i === selected ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/50"}`}
                  >
                    {layer.text || "(empty)"}
                  </button>
                  {layers.length > 1 && (
                    <button
                      aria-label="Delete layer"
                      onClick={() => { setLayers((p) => p.filter((_, x) => x !== i)); setSelected(0); }}
                      className="rounded p-1 text-destructive hover:bg-muted/50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {l && (
              <div className="mt-3 space-y-3 border-t border-border/60 pt-3">
                <input
                  value={l.text}
                  onChange={(e) => patchLayer({ text: e.target.value })}
                  placeholder="Layer text"
                  className="w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm"
                />
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Font size — {l.size}</span>
                  <input type="range" min={40} max={260} value={l.size} onChange={(e) => patchLayer({ size: Number(e.target.value) })} className="w-full accent-[oklch(0.76_0.17_55)]" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Horizontal — {Math.round(l.x * 100)}%</span>
                  <input type="range" min={0} max={1} step={0.01} value={l.x} onChange={(e) => patchLayer({ x: Number(e.target.value) })} className="w-full accent-[oklch(0.76_0.17_55)]" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">Vertical — {Math.round(l.y * 100)}%</span>
                  <input type="range" min={0} max={1} step={0.01} value={l.y} onChange={(e) => patchLayer({ y: Number(e.target.value) })} className="w-full accent-[oklch(0.76_0.17_55)]" />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">Text</span>
                    <input type="color" value={l.color} onChange={(e) => patchLayer({ color: e.target.value })} className="h-9 w-full rounded-lg border border-border/60 bg-transparent" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">Outline</span>
                    <input type="color" value={l.stroke} onChange={(e) => patchLayer({ stroke: e.target.value })} className="h-9 w-full rounded-lg border border-border/60 bg-transparent" />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CreatorShell>
  );
}
