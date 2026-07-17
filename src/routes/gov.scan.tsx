import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, QrCode, Camera, Upload, Loader2, ShieldAlert, Copy, X, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/scan")({
  head: () => ({
    meta: [
      { title: "QR Code Scanner — Aadhaar, Certificates, Gov QR | Bharat AI Sathi" },
      {
        name: "description",
        content:
          "Scan Aadhaar QR, government certificate QR or verification QR safely using your camera or by uploading an image. Runs entirely in your browser.",
      },
    ],
    links: [{ rel: "canonical", href: "https://sapna-ai-tech.lovable.app/gov/scan" }],
  }),
  component: ScanPage,
});

type Parsed = {
  kind: "url" | "aadhaar-xml" | "aadhaar-secure" | "text" | "json";
  raw: string;
  fields?: Record<string, string>;
  url?: string;
};

function detectKind(text: string): Parsed {
  const raw = text.trim();
  if (/^https?:\/\//i.test(raw)) return { kind: "url", raw, url: raw };
  if (raw.startsWith("<?xml") || raw.startsWith("<PrintLetterBarcodeData")) {
    const fields: Record<string, string> = {};
    const attrRe = /(\w+)="([^"]*)"/g;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(raw))) fields[m[1]] = m[2];
    return { kind: "aadhaar-xml", raw, fields };
  }
  // Aadhaar Secure QR is base64-ish binary. Just show hex length.
  if (/^[A-Za-z0-9+/=]{100,}$/.test(raw)) return { kind: "aadhaar-secure", raw };
  try {
    const j = JSON.parse(raw) as Record<string, unknown>;
    const flat: Record<string, string> = {};
    Object.entries(j).forEach(([k, v]) => {
      flat[k] = typeof v === "string" ? v : JSON.stringify(v);
    });
    return { kind: "json", raw, fields: flat };
  } catch {
    /* not json */
  }
  return { kind: "text", raw };
}

function ScanPage() {
  const [result, setResult] = useState<Parsed | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      const v = videoRef.current;
      if (!v) return;
      v.srcObject = stream;
      await v.play();
      setScanning(true);
      void tick();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Camera access denied");
    }
  };

  const tick = async () => {
    const v = videoRef.current;
    if (!v || v.readyState !== v.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(() => void tick());
      return;
    }
    if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const { default: jsQR } = await import("jsqr");
    const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
    if (code?.data) {
      handleDecoded(code.data);
      stopCamera();
      return;
    }
    rafRef.current = requestAnimationFrame(() => void tick());
  };

  const handleDecoded = (text: string) => {
    const parsed = detectKind(text);
    setResult(parsed);
    toast.success("QR decoded");
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    try {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.src = url;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      const { default: jsQR } = await import("jsqr");
      const code = jsQR(data.data, data.width, data.height, { inversionAttempts: "attemptBoth" });
      if (!code?.data) {
        toast.error("No QR code found in image");
        return;
      }
      handleDecoded(code.data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read image");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/gov" className="inline-flex items-center gap-1 hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Government Services
          </Link>
          <span>/</span>
          <span className="text-foreground">QR Scanner</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.76_0.17_55)]/25 to-[oklch(0.66_0.16_155)]/25 ring-1 ring-border/60">
            <QrCode className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Verification</p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Government QR Scanner</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Scan Aadhaar QR, certificate QR or any verification QR. Everything is decoded on your device — nothing is
          uploaded.
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Never share your Aadhaar QR image with strangers. Aadhaar's Secure QR is signed and encrypted — only mAadhaar
            or authorised readers can fully verify it.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <h2 className="font-display text-sm font-bold">Camera scan</h2>
            <div className="relative mt-3 aspect-video overflow-hidden rounded-lg border border-border/60 bg-black/60">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                muted
                aria-label="Live camera preview"
              />
              {!scanning && (
                <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                  Camera off
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              {!scanning ? (
                <Button onClick={() => void startCamera()} className="flex-1">
                  <Camera className="mr-2 h-4 w-4" /> Start camera
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  <X className="mr-2 h-4 w-4" /> Stop
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <h2 className="font-display text-sm font-bold">Upload QR image</h2>
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-background/40 px-4 py-10 text-center transition hover:border-primary/50">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">Choose an image with a QR code</span>
              <span className="text-[11px] text-muted-foreground">PNG, JPG, WEBP</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </div>

        {result && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold">
                {result.kind === "url"
                  ? "Link"
                  : result.kind === "aadhaar-xml"
                  ? "Aadhaar QR (unsigned)"
                  : result.kind === "aadhaar-secure"
                  ? "Aadhaar Secure QR (encrypted)"
                  : result.kind === "json"
                  ? "Structured data"
                  : "Text"}
              </h2>
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(result.raw);
                  toast.success("Copied");
                }}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Copy className="h-3 w-3" /> Copy raw
              </button>
            </div>

            {result.kind === "url" && result.url && (
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 break-all rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm text-primary hover:underline"
              >
                {result.url} <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {result.fields && (
              <dl className="grid gap-2 sm:grid-cols-2">
                {Object.entries(result.fields).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border/60 bg-background/60 p-2.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 break-all text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {result.kind === "aadhaar-secure" && (
              <p className="text-xs text-muted-foreground">
                This is UIDAI's encrypted Secure QR. Contents can only be decoded by the official mAadhaar / UIDAI
                verification app. Raw payload length: {result.raw.length} chars.
              </p>
            )}

            {(result.kind === "text" || result.kind === "aadhaar-secure") && (
              <pre className="mt-3 max-h-52 overflow-auto rounded-lg border border-border/60 bg-background/60 p-3 text-[11px] leading-relaxed">
                {result.raw}
              </pre>
            )}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
