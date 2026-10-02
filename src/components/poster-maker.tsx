import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, ImagePlus, Loader2, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SIZE = 1080;
const LEADS_KEY = "bas.poster-maker.leads.v1";
const FESTIVALS = ["Diwali", "Holi", "15 August", "Dussehra", "New Year", "Eid"] as const;

type Festival = (typeof FESTIVALS)[number];
type Template = { name: string; colors: [string, string, string]; accent: string; motif: "diya" | "rangoli" | "rays" | "arch" | "confetti" };

const TEMPLATES: Template[] = [
  { name: "Royal Utsav", colors: ["#240913", "#74151c", "#ff6b00"], accent: "#ffd166", motif: "arch" },
  { name: "Saffron Glow", colors: ["#351103", "#c43d06", "#ff9d00"], accent: "#fff1b8", motif: "diya" },
  { name: "Rangoli Night", colors: ["#131039", "#5d176d", "#d92d77"], accent: "#ffcf56", motif: "rangoli" },
  { name: "Bharat Pride", colors: ["#08271c", "#116149", "#ff6b00"], accent: "#f7f2e8", motif: "rays" },
  { name: "Midnight Gold", colors: ["#080c18", "#17213d", "#3e2b65"], accent: "#f7c65a", motif: "confetti" },
];

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxSize: number, minSize = 38) {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `800 ${size}px "Space Grotesk", Inter, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

function drawDecor(ctx: CanvasRenderingContext2D, template: Template) {
  ctx.save();
  ctx.strokeStyle = template.accent;
  ctx.fillStyle = template.accent;
  ctx.globalAlpha = 0.32;
  ctx.lineWidth = 5;

  if (template.motif === "rays") {
    for (let i = 0; i < 36; i += 1) {
      const a = (i / 36) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(540 + Math.cos(a) * 230, 520 + Math.sin(a) * 230);
      ctx.lineTo(540 + Math.cos(a) * 710, 520 + Math.sin(a) * 710);
      ctx.stroke();
    }
  } else if (template.motif === "rangoli") {
    for (const [x, y] of [[100, 130], [980, 130], [100, 950], [980, 950]]) {
      for (let r = 30; r <= 110; r += 25) {
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      }
    }
  } else if (template.motif === "arch") {
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(540, 560, 430, Math.PI, 0); ctx.lineTo(970, 920); ctx.stroke();
    ctx.beginPath(); ctx.arc(540, 560, 390, Math.PI, 0); ctx.lineTo(930, 920); ctx.stroke();
  } else if (template.motif === "diya") {
    for (let x = 90; x <= 990; x += 150) {
      ctx.beginPath(); ctx.ellipse(x, 930, 42, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x, 900); ctx.quadraticCurveTo(x - 18, 860, x, 830); ctx.quadraticCurveTo(x + 18, 860, x, 900); ctx.fill();
    }
  } else {
    for (let i = 0; i < 46; i += 1) {
      const x = (i * 233) % SIZE;
      const y = (i * 379) % SIZE;
      ctx.save(); ctx.translate(x, y); ctx.rotate(i * 0.7); ctx.fillRect(-5, -18, 10, 36); ctx.restore();
    }
  }
  ctx.restore();
}

function drawCoverImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, diameter: number) {
  const scale = Math.max(diameter / image.width, diameter / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, diameter / 2, 0, Math.PI * 2); ctx.clip();
  ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
  ctx.restore();
}

function drawPoster(
  canvas: HTMLCanvasElement,
  shopName: string,
  whatsapp: string,
  festival: Festival,
  template: Template,
  image: HTMLImageElement | null,
  watermark: boolean,
) {
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, template.colors[0]); bg.addColorStop(0.56, template.colors[1]); bg.addColorStop(1, template.colors[2]);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, SIZE, SIZE);
  drawDecor(ctx, template);

  const glow = ctx.createRadialGradient(540, 515, 60, 540, 515, 410);
  glow.addColorStop(0, `${template.accent}55`); glow.addColorStop(1, `${template.accent}00`);
  ctx.fillStyle = glow; ctx.fillRect(100, 80, 880, 820);

  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillStyle = template.accent;
  ctx.font = "600 34px Inter, sans-serif";
  ctx.fillText("SHUBH AVSAR • DIL SE SHUBHKAMNAYEIN", 540, 83);
  const festivalSize = fitText(ctx, festival.toUpperCase(), 900, 112, 62);
  ctx.font = `800 ${festivalSize}px "Space Grotesk", Inter, sans-serif`;
  ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 24;
  ctx.fillStyle = "#fffaf0"; ctx.fillText(festival.toUpperCase(), 540, 185);
  ctx.shadowBlur = 0;

  ctx.beginPath(); ctx.arc(540, 515, 230, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.fill();
  ctx.lineWidth = 18; ctx.strokeStyle = template.accent; ctx.stroke();
  ctx.beginPath(); ctx.arc(540, 515, 250, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1;
  if (image) {
    drawCoverImage(ctx, image, 540, 515, 442);
  } else {
    ctx.fillStyle = template.accent; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(540, 468, 74, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(540, 650, 135, Math.PI, 0); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = "#fffaf0"; ctx.font = "600 34px Inter, sans-serif"; ctx.fillText("LOGO / PHOTO", 540, 730);
  }

  const shownName = shopName.trim() || "AAPKI DUKAAN KA NAAM";
  const shopSize = fitText(ctx, shownName.toUpperCase(), 920, 82, 42);
  ctx.font = `800 ${shopSize}px "Space Grotesk", Inter, sans-serif`;
  ctx.fillStyle = "#fffaf0"; ctx.fillText(shownName.toUpperCase(), 540, 848);
  ctx.fillStyle = template.accent; ctx.fillRect(330, 900, 420, 5);
  ctx.font = "500 31px Inter, sans-serif";
  ctx.fillStyle = "#fffaf0";
  ctx.fillText(whatsapp.trim() ? `WhatsApp: ${whatsapp.trim()}` : "Aapka bharosemand local business", 540, 950);

  if (watermark) {
    ctx.save(); ctx.translate(540, 540); ctx.rotate(-Math.PI / 5.3);
    ctx.textAlign = "center"; ctx.font = "800 55px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,.22)";
    for (let y = -450; y <= 450; y += 170) ctx.fillText("BharatAISathi.com", 0, y);
    ctx.restore();
  }
}

function saveLead(shopName: string, whatsapp: string, festival: Festival) {
  try {
    const existing = JSON.parse(window.localStorage.getItem(LEADS_KEY) || "[]") as unknown[];
    existing.push({ shopName: shopName.trim(), whatsapp: whatsapp.trim(), festival, createdAt: new Date().toISOString() });
    window.localStorage.setItem(LEADS_KEY, JSON.stringify(existing.slice(-50)));
  } catch {
    // Poster creation still works when storage is unavailable.
  }
}

export function PosterMaker() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [shopName, setShopName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [festival, setFestival] = useState<Festival>("Diwali");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawPoster(canvas, shopName, whatsapp, festival, TEMPLATES[templateIndex], image, true);
  }, [shopName, whatsapp, festival, templateIndex, image]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const loadFile = useCallback((file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      toast.error("10MB tak ki JPG, PNG ya WebP image chunein."); return;
    }
    const url = URL.createObjectURL(file);
    const next = new Image();
    next.onload = () => {
      setPreviewUrl((old) => { if (old) URL.revokeObjectURL(old); return url; });
      setImage(next);
    };
    next.onerror = () => { URL.revokeObjectURL(url); toast.error("Photo load nahi hui."); };
    next.src = url;
  }, []);

  const requireName = () => {
    if (shopName.trim()) return true;
    toast.error("Dukaan ka naam likhein."); return false;
  };

  const generate = () => {
    if (!requireName()) return;
    setGenerating(true); saveLead(shopName, whatsapp, festival);
    window.setTimeout(() => { setGenerating(false); toast.success("Poster taiyar hai!"); }, 650);
  };

  const download = (watermark: boolean) => {
    if (!requireName()) return;
    const canvas = document.createElement("canvas");
    drawPoster(canvas, shopName, whatsapp, festival, TEMPLATES[templateIndex], image, watermark);
    canvas.toBlob((blob) => {
      if (!blob) { toast.error("Download taiyar nahi hua. Dobara try karein."); return; }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `${shopName.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${festival.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.click(); URL.revokeObjectURL(url);
      saveLead(shopName, whatsapp, festival);
      toast.success(watermark ? "Free poster download ho gaya" : "HD poster download ho gaya");
    }, "image/png");
  };

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
        <section className="glass-strong rounded-xl border border-poster/30 p-5 shadow-elegant sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-poster">
            <Sparkles className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold">Poster Details</h2>
          </div>
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Dukaan Ka Naam <span className="text-poster">*</span></span>
              <Input value={shopName} onChange={(e) => setShopName(e.target.value)} maxLength={55} placeholder="Jaise: Punjab Sweet House" className="h-11" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">WhatsApp Number</span>
              <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9+ ]/g, "").slice(0, 16))} inputMode="tel" placeholder="Jaise: 98765 43210" className="h-11" />
            </label>

            <div>
              <span className="mb-1.5 block text-sm font-medium">Logo / Photo</span>
              <div
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
                className={cn("flex min-h-36 cursor-pointer items-center justify-center rounded-lg border border-dashed p-4 text-center transition-colors", dragging ? "border-poster bg-poster/10" : "border-border hover:border-poster/60")}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img src={previewUrl} alt="Uploaded shop preview" className="h-24 w-24 rounded-full border-4 border-poster object-cover" />
                    <Button type="button" size="icon" variant="destructive" aria-label="Remove photo" className="absolute -right-2 -top-2 h-7 w-7" onClick={(e) => { e.stopPropagation(); setImage(null); setPreviewUrl(""); }}><X className="h-3 w-3" /></Button>
                  </div>
                ) : (
                  <div><ImagePlus className="mx-auto h-8 w-8 text-poster" /><p className="mt-2 text-sm font-medium">Photo drop karein ya upload karein</p><p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP • max 10MB</p></div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => loadFile(e.target.files?.[0])} />
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Festival Chuno</span>
              <Select value={festival} onValueChange={(value) => setFestival(value as Festival)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>{FESTIVALS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
              </Select>
            </label>
            <Button type="button" size="lg" onClick={generate} disabled={generating} className="h-12 w-full bg-poster text-poster-foreground shadow-glow hover:bg-poster/90">
              {generating ? <><Loader2 className="animate-spin" /> Poster ban raha hai…</> : <>✨ AI Poster Banao</>}
            </Button>
            <p className="text-center text-xs text-muted-foreground">100% browser mein banta hai • AI credits nahi lagenge</p>
          </div>
        </section>

        <section className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-poster/30 bg-card/50 p-2 shadow-elegant sm:p-4">
            <canvas ref={canvasRef} className="aspect-square h-auto w-full rounded-lg" aria-label="Live square festival poster preview" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" size="lg" className="h-auto min-h-11 whitespace-normal" onClick={() => download(true)}><Download /> Free Download (With Watermark)</Button>
            <Button type="button" size="lg" className="h-auto min-h-11 whitespace-normal bg-poster text-poster-foreground hover:bg-poster/90" onClick={() => { if (requireName()) setPaymentOpen(true); }}><Sparkles /> HD Download Without Watermark - ₹29</Button>
          </div>

          <div className="mt-7">
            <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate font-display text-lg font-bold">Template Styles</h2>
              <span className="shrink-0 text-xs text-muted-foreground">5 designs</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {TEMPLATES.map((template, index) => (
                <Button key={template.name} type="button" variant="outline" onClick={() => setTemplateIndex(index)} className={cn("relative h-auto min-h-20 overflow-hidden whitespace-normal p-2 text-xs", index === templateIndex && "border-poster ring-2 ring-poster/40")}>
                  <span className="absolute inset-0 opacity-35" style={{ background: `linear-gradient(135deg, ${template.colors.join(",")})` }} />
                  <span className="relative">{index === templateIndex && <Check className="mx-auto mb-1 h-4 w-4 text-poster" />}{template.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="border-poster/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>HD Poster — ₹29</DialogTitle>
            <DialogDescription>This is a demo payment screen. No real payment will be charged.</DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-poster/25 bg-poster/10 p-4 text-sm">
            <p className="font-semibold">You will receive</p>
            <ul className="mt-2 space-y-2 text-muted-foreground"><li>• 1080×1080 PNG quality</li><li>• BharatAISathi.com watermark removed</li><li>• Ready for WhatsApp and social media</li></ul>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
            <Button className="bg-poster text-poster-foreground hover:bg-poster/90" onClick={() => { setPaymentOpen(false); download(false); }}>Demo Unlock & Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}