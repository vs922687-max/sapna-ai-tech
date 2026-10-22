import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, ImagePlus, Loader2, Shield, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { posterPaymentReceiptUrl } from "@/lib/poster-payment";
import { savePosterLead } from "@/components/poster-maker";
import { PosterPaymentDialog } from "@/components/poster-payment-dialog";

const WIDTH = 1080;
const HEIGHT = 1920;

type FootballTheme = {
  id: "red" | "black" | "white";
  name: string;
  bg: string;
  bgSoft: string;
  red: string;
  text: string;
  muted: string;
  border: string;
  glow: string;
};

const THEMES: FootballTheme[] = [
  { id: "red", name: "THEATRE RED", bg: "#050505", bgSoft: "#120000", red: "#DA020E", text: "#FFFFFF", muted: "rgba(255,255,255,0.55)", border: "rgba(255,255,255,0.12)", glow: "rgba(218,2,14,0.42)" },
  { id: "black", name: "SHADOW BLACK", bg: "#080808", bgSoft: "#101010", red: "#DA020E", text: "#FFFFFF", muted: "rgba(255,255,255,0.5)", border: "rgba(255,255,255,0.1)", glow: "rgba(255,255,255,0.08)" },
  { id: "white", name: "AWAY WHITE", bg: "#F6F3EE", bgSoft: "#FFFFFF", red: "#DA020E", text: "#0A0A0A", muted: "rgba(10,10,10,0.55)", border: "rgba(10,10,10,0.12)", glow: "rgba(218,2,14,0.18)" },
];

type Stat = { label: string; value: string };

type PosterState = {
  club: string;
  edition: string;
  tagline: string;
  playerName: string;
  number: string;
  location: string;
  season: string;
  stats: Stat[];
  scale: number;
  shift: number;
};

const FONT_ANTON = '"Anton", Impact, sans-serif';
const FONT_BEBAS = '"Bebas Neue", Oswald, sans-serif';
const FONT_MONO = '"JetBrains Mono", monospace';

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxSize: number, family: string, minSize = 28) {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `400 ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

function drawFootballPoster(
  canvas: HTMLCanvasElement,
  state: PosterState,
  theme: FootballTheme,
  playerImage: HTMLImageElement | null,
  crestImage: HTMLImageElement | null,
  watermark: boolean,
) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const isWhite = theme.id === "white";

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const glow = ctx.createRadialGradient(540, -200, 0, 540, -200, 1400);
  glow.addColorStop(0, theme.glow);
  glow.addColorStop(0.5, theme.bgSoft);
  glow.addColorStop(1, theme.bg);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const rand = seededRandom(42);
  ctx.fillStyle = isWhite ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";
  for (let i = 0; i < 3000; i += 1) {
    ctx.fillRect(rand() * WIDTH, rand() * HEIGHT, 1.2, 1.2);
  }

  ctx.fillStyle = isWhite ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
  ctx.beginPath();
  ctx.moveTo(0, 1305.6);
  ctx.bezierCurveTo(216, 1190.4, 432, 1228.8, 540, 1267.2);
  ctx.bezierCurveTo(756, 1228.8, 918, 1209.6, 1080, 1305.6);
  ctx.lineTo(1080, 1382.4);
  ctx.lineTo(0, 1382.4);
  ctx.closePath();
  ctx.fill();
  for (let x = 0; x < WIDTH; x += 32) ctx.fillRect(x + 2, 1283.6, 18, 22);

  ctx.fillStyle = theme.red;
  ctx.fillRect(0, 0, WIDTH, 4);
  ctx.fillStyle = theme.muted;
  ctx.font = `700 20px ${FONT_MONO}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`${(state.club.trim() || "MANU").toUpperCase()} // FAN POSTER`.slice(0, 34), 48, 90);
  ctx.textAlign = "right";
  ctx.fillStyle = theme.red;
  ctx.fillText("NEXT LEVEL EDITION", 1032, 90);

  const crestSize = 110;
  const crestY = 150;
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(540, crestY + crestSize / 2, crestSize / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = isWhite ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)";
  ctx.fill();
  if (crestImage) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, crestY + crestSize / 2, crestSize / 2 - 2, 0, Math.PI * 2);
    ctx.clip();
    const scale = Math.max(crestSize / crestImage.width, crestSize / crestImage.height);
    ctx.drawImage(crestImage, 540 - (crestImage.width * scale) / 2, crestY + crestSize / 2 - (crestImage.height * scale) / 2, crestImage.width * scale, crestImage.height * scale);
    ctx.restore();
  } else {
    ctx.fillStyle = theme.text;
    ctx.font = `700 44px ${FONT_ANTON}`;
    ctx.textAlign = "center";
    ctx.fillText("MU", 540, crestY + 68);
    ctx.font = `400 16px ${FONT_MONO}`;
    ctx.fillStyle = theme.red;
    ctx.fillText(state.club.trim().toUpperCase().slice(0, 10) || "MAN UTD", 540, crestY + 88);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = theme.text;
  const clubText = (state.club.trim() || "MANU").toUpperCase();
  const clubSize = fitFont(ctx, clubText, 980, 208, FONT_ANTON);
  ctx.font = `400 ${clubSize}px ${FONT_ANTON}`;
  ctx.save();
  ctx.translate(540, 480);
  ctx.scale(0.88, 1);
  ctx.fillText(clubText, 0, 0);
  ctx.restore();

  const subText = (state.edition.trim() || "NEXT LEVEL").toUpperCase();
  const subSize = fitFont(ctx, subText, 900, 98, FONT_BEBAS);
  ctx.font = `400 ${subSize}px ${FONT_BEBAS}`;
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "8px"; } catch { /* older browsers */ }
  ctx.lineWidth = 3;
  ctx.strokeStyle = theme.red;
  ctx.strokeText(subText, 540, 590);
  if (!isWhite) {
    ctx.fillStyle = "rgba(218,2,14,0.08)";
    ctx.fillText(subText, 540, 590);
  }
  ctx.shadowColor = theme.red;
  ctx.shadowBlur = 18;
  ctx.strokeText(subText, 540, 590);
  ctx.shadowBlur = 0;
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"; } catch { /* older browsers */ }

  ctx.fillStyle = isWhite ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)";
  ctx.font = `400 520px ${FONT_ANTON}`;
  ctx.textAlign = "center";
  ctx.fillText((state.number.trim() || "08").slice(0, 3), 540, 1497.6);

  if (playerImage) {
    const w = 993.6 * state.scale;
    const h = (w * playerImage.height) / playerImage.width;
    const x = (WIDTH - w) / 2;
    const y = 806.4 + state.shift - h * 0.15;
    ctx.save();
    const fade = ctx.createLinearGradient(0, y + h * 0.5, 0, y + h);
    fade.addColorStop(0, "rgba(0,0,0,0)");
    fade.addColorStop(1, theme.bg);
    ctx.drawImage(playerImage, x, y, w, h);
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = fade;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
    ctx.strokeStyle = theme.red;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;
    ctx.strokeRect(x + 10, y + 10, w - 20, h - 20);
    ctx.globalAlpha = 1;
  }

  ctx.textAlign = "left";
  ctx.fillStyle = theme.text;
  const nameText = (state.playerName.trim() || "BRUNO FERNANDES").toUpperCase();
  const nameSize = fitFont(ctx, nameText, 984, 84, FONT_ANTON);
  ctx.font = `400 ${nameSize}px ${FONT_ANTON}`;
  ctx.fillText(nameText, 48, 1651.2);
  ctx.fillStyle = theme.red;
  ctx.fillRect(48, 1663.2, 160, 6);
  ctx.font = `700 24px ${FONT_MONO}`;
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "6px"; } catch { /* older browsers */ }
  ctx.fillText((state.tagline.trim() || "FEAR THE DEVIL").toUpperCase(), 48, 1703.2);
  try { (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px"; } catch { /* older browsers */ }

  const cardW = 312;
  const cardY = 1747.2;
  const cardH = 174;
  state.stats.slice(0, 3).forEach((stat, i) => {
    const x = 48 + i * (cardW + 24);
    ctx.fillStyle = isWhite ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)";
    ctx.fillRect(x, cardY, cardW, cardH);
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, cardY, cardW, cardH);
    ctx.fillStyle = theme.red;
    ctx.fillRect(x, cardY, cardW, 3);
    ctx.fillStyle = theme.muted;
    ctx.font = `700 18px ${FONT_MONO}`;
    ctx.textAlign = "left";
    ctx.fillText((stat.label.trim() || "STAT").toUpperCase().slice(0, 14), x + 20, cardY + 32);
    ctx.fillStyle = theme.text;
    const valueSize = fitFont(ctx, stat.value.trim() || "0", cardW - 40, 64, FONT_ANTON);
    ctx.font = `400 ${valueSize}px ${FONT_ANTON}`;
    ctx.fillText(stat.value.trim() || "0", x + 20, cardY + 100);
  });

  ctx.fillStyle = theme.border;
  ctx.fillRect(0, 1832, WIDTH, 1);
  ctx.fillStyle = theme.muted;
  ctx.font = `700 18px ${FONT_MONO}`;
  ctx.textAlign = "left";
  ctx.fillText((state.location.trim() || "OLD TRAFFORD • M16 0RA").toUpperCase(), 48, 1884);
  ctx.textAlign = "right";
  ctx.fillText((state.season.trim() || "2025 / 26 PREMIER LEAGUE").toUpperCase(), 1032, 1884);
  ctx.fillStyle = theme.red;
  ctx.font = `400 22px ${FONT_MONO}`;
  ctx.textAlign = "center";
  ctx.fillText("▲ ▲  DEVIL MODE ENGAGED  ▲ ▲", 540, cardY - 24);

  if (watermark) {
    ctx.save();
    ctx.translate(540, 960);
    ctx.rotate(-Math.PI / 5.3);
    ctx.textAlign = "center";
    ctx.font = "800 55px Inter, sans-serif";
    ctx.fillStyle = isWhite ? "rgba(0,0,0,.18)" : "rgba(255,255,255,.2)";
    for (let y = -900; y <= 900; y += 170) ctx.fillText("BharatAISathi.com", 0, y);
    ctx.restore();
  }
}

export function FootballPoster() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerFileRef = useRef<HTMLInputElement | null>(null);
  const crestFileRef = useRef<HTMLInputElement | null>(null);
  const [themeIndex, setThemeIndex] = useState(0);
  const [state, setState] = useState<PosterState>({
    club: "MANU",
    edition: "NEXT LEVEL",
    tagline: "FEAR THE DEVIL",
    playerName: "",
    number: "08",
    location: "OLD TRAFFORD • M16 0RA",
    season: "2025 / 26 PREMIER LEAGUE",
    stats: [
      { label: "GOALS", value: "27" },
      { label: "ASSISTS", value: "11" },
      { label: "RATING", value: "9.2" },
    ],
    scale: 1,
    shift: 0,
  });
  const [playerImage, setPlayerImage] = useState<HTMLImageElement | null>(null);
  const [playerPreview, setPlayerPreview] = useState("");
  const [crestImage, setCrestImage] = useState<HTMLImageElement | null>(null);
  const [crestPreview, setCrestPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fontsReady, setFontsReady] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => { if (!cancelled) setFontsReady((n) => n + 1); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawFootballPoster(canvas, state, THEMES[themeIndex], playerImage, crestImage, true);
  }, [state, themeIndex, playerImage, crestImage, fontsReady]);

  useEffect(() => () => {
    if (playerPreview) URL.revokeObjectURL(playerPreview);
    if (crestPreview) URL.revokeObjectURL(crestPreview);
  }, [playerPreview, crestPreview]);

  const loadImage = useCallback((file: File | null | undefined, kind: "player" | "crest") => {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      toast.error("10MB tak ki JPG, PNG ya WebP image chunein.");
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (kind === "player") {
        setPlayerPreview((old) => { if (old) URL.revokeObjectURL(old); return url; });
        setPlayerImage(img);
      } else {
        setCrestPreview((old) => { if (old) URL.revokeObjectURL(old); return url; });
        setCrestImage(img);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast.error("Photo load nahi hui."); };
    img.src = url;
  }, []);

  const update = (patch: Partial<PosterState>) => setState((s) => ({ ...s, ...patch }));
  const updateStat = (index: number, patch: Partial<Stat>) =>
    setState((s) => ({ ...s, stats: s.stats.map((stat, i) => (i === index ? { ...stat, ...patch } : stat)) }));

  const requireName = () => {
    if (state.playerName.trim()) return true;
    toast.error("Player ka naam likhein.");
    return false;
  };

  const generate = () => {
    if (!requireName()) return;
    setGenerating(true);
    savePosterLead(state.playerName, state.club, "Football Poster");
    window.setTimeout(() => { setGenerating(false); toast.success("Poster taiyar hai!"); }, 650);
  };

  const download = (watermark: boolean) => {
    if (!requireName()) return;
    const canvas = document.createElement("canvas");
    drawFootballPoster(canvas, state, THEMES[themeIndex], playerImage, crestImage, watermark);
    canvas.toBlob((blob) => {
      if (!blob) { toast.error("Download taiyar nahi hua. Dobara try karein."); return; }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${state.playerName.trim().replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "player"}-football-poster.png`;
      link.click();
      URL.revokeObjectURL(url);
      savePosterLead(state.playerName, state.club, "Football Poster");
      toast.success(watermark ? "Free poster download ho gaya" : "HD poster download ho gaya");
    }, "image/png");
  };

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
        <section className="glass-strong rounded-xl border border-poster/30 p-5 shadow-elegant sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-poster">
            <Shield className="h-5 w-5" />
            <h2 className="font-display text-lg font-bold">Football Poster Details</h2>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Player Ka Naam <span className="text-poster">*</span></span>
              <Input value={state.playerName} onChange={(e) => update({ playerName: e.target.value })} maxLength={24} placeholder="Jaise: Bruno Fernandes" className="h-11" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Club / Team</span>
                <Input value={state.club} onChange={(e) => update({ club: e.target.value })} maxLength={12} placeholder="MANU" className="h-11" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Jersey Number</span>
                <Input value={state.number} onChange={(e) => update({ number: e.target.value.replace(/[^0-9]/g, "").slice(0, 3) })} inputMode="numeric" placeholder="08" className="h-11" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Subtitle</span>
                <Input value={state.edition} onChange={(e) => update({ edition: e.target.value })} maxLength={18} placeholder="NEXT LEVEL" className="h-11" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Tagline</span>
                <Input value={state.tagline} onChange={(e) => update({ tagline: e.target.value })} maxLength={22} placeholder="FEAR THE DEVIL" className="h-11" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Match Location</span>
                <Input value={state.location} onChange={(e) => update({ location: e.target.value })} maxLength={28} className="h-11" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Season / League</span>
                <Input value={state.season} onChange={(e) => update({ season: e.target.value })} maxLength={28} className="h-11" />
              </label>
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium">Stats (3 cards)</span>
              <div className="space-y-2">
                {state.stats.map((stat, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <Input value={stat.label} onChange={(e) => updateStat(i, { label: e.target.value })} maxLength={12} placeholder={["GOALS", "ASSISTS", "RATING"][i]} aria-label={`Stat ${i + 1} label`} className="h-10" />
                    <Input value={stat.value} onChange={(e) => updateStat(i, { value: e.target.value })} maxLength={6} placeholder={["27", "11", "9.2"][i]} aria-label={`Stat ${i + 1} value`} className="h-10" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium">Player Photo</span>
              <div
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") playerFileRef.current?.click(); }}
                onClick={() => playerFileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); loadImage(e.dataTransfer.files[0], "player"); }}
                className={cn("flex min-h-28 cursor-pointer items-center justify-center rounded-lg border border-dashed p-4 text-center transition-colors", dragging ? "border-poster bg-poster/10" : "border-border hover:border-poster/60")}
              >
                {playerPreview ? (
                  <div className="relative">
                    <img src={playerPreview} alt="Uploaded player preview" className="h-24 w-24 rounded-lg border-2 border-poster object-cover" />
                    <Button type="button" size="icon" variant="destructive" aria-label="Remove player photo" className="absolute -right-2 -top-2 h-7 w-7" onClick={(e) => { e.stopPropagation(); setPlayerImage(null); setPlayerPreview(""); }}><X className="h-3 w-3" /></Button>
                  </div>
                ) : (
                  <div><ImagePlus className="mx-auto h-7 w-7 text-poster" /><p className="mt-2 text-sm font-medium">Player photo upload karein</p><p className="mt-1 text-xs text-muted-foreground">Transparent PNG best • max 10MB</p></div>
                )}
              </div>
              <input ref={playerFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => loadImage(e.target.files?.[0], "player")} />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium">Club Crest (optional)</span>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={() => crestFileRef.current?.click()}><ImagePlus /> Crest Upload</Button>
                {crestPreview && (
                  <div className="relative">
                    <img src={crestPreview} alt="Uploaded crest preview" className="h-10 w-10 rounded-full border border-poster object-cover" />
                    <Button type="button" size="icon" variant="destructive" aria-label="Remove crest" className="absolute -right-2 -top-2 h-6 w-6" onClick={() => { setCrestImage(null); setCrestPreview(""); }}><X className="h-3 w-3" /></Button>
                  </div>
                )}
              </div>
              <input ref={crestFileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => loadImage(e.target.files?.[0], "crest")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Photo Scale ({Math.round(state.scale * 100)}%)</span>
                <input type="range" min={0.6} max={1.5} step={0.05} value={state.scale} onChange={(e) => update({ scale: Number(e.target.value) })} className="h-11 w-full accent-[#FF6B00]" aria-label="Player photo scale" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Vertical Shift ({state.shift})</span>
                <input type="range" min={-250} max={250} step={10} value={state.shift} onChange={(e) => update({ shift: Number(e.target.value) })} className="h-11 w-full accent-[#FF6B00]" aria-label="Player photo vertical shift" />
              </label>
            </div>

            <Button type="button" size="lg" onClick={generate} disabled={generating} className="h-12 w-full bg-poster text-poster-foreground shadow-glow hover:bg-poster/90">
              {generating ? <><Loader2 className="animate-spin" /> Poster ban raha hai…</> : <>✨ Football Poster Banao</>}
            </Button>
            <p className="text-center text-xs text-muted-foreground">100% browser mein banta hai • AI credits nahi lagenge</p>
          </div>
        </section>

        <section className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-poster/30 bg-card/50 p-2 shadow-elegant sm:p-4">
            <canvas ref={canvasRef} className="mx-auto aspect-[9/16] h-auto w-full max-w-md rounded-lg" aria-label="Live vertical football player poster preview" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="outline" size="lg" className="h-auto min-h-11 whitespace-normal" onClick={() => download(true)}><Download /> Free Download (With Watermark)</Button>
            <Button type="button" size="lg" className="h-auto min-h-11 whitespace-normal bg-poster text-poster-foreground hover:bg-poster/90" onClick={() => { if (requireName()) setPaymentOpen(true); }}><Sparkles /> HD Download Without Watermark - ₹29</Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">Fan poster template — kisi bhi football club se officially affiliated nahi hai.</p>

          <div className="mt-7">
            <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate font-display text-lg font-bold">Theme / Material</h2>
              <span className="shrink-0 text-xs text-muted-foreground">3 presets</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((theme, index) => (
                <Button key={theme.id} type="button" variant="outline" onClick={() => setThemeIndex(index)} className={cn("relative h-auto min-h-20 overflow-hidden whitespace-normal p-2 text-xs", index === themeIndex && "border-poster ring-2 ring-poster/40")}>
                  <span className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${theme.bgSoft}, ${theme.red})` }} />
                  <span className="relative">{index === themeIndex && <Check className="mx-auto mb-1 h-4 w-4 text-poster" />}{theme.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <PosterPaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        posterLabel="Football Poster"
        receiptUrl={posterPaymentReceiptUrl(state.playerName || "Football Poster", `Football Poster - ${state.club}`)}
        onReceiptClick={() => savePosterLead(state.playerName, state.club, "Football Poster")}
      />
    </>
  );
}
