import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ScanText, Upload, Loader2, Sparkles, ShieldAlert, Copy, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { askAi } from "@/lib/ai-client";
import { toast } from "sonner";

export const Route = createFileRoute("/gov/ocr")({
  head: () => ({
    meta: [
      { title: "Document OCR — Extract Aadhaar, PAN, Certificate details | Bharat AI Sathi" },
      {
        name: "description",
        content:
          "Upload Aadhaar, PAN, Passport, Driving Licence or any government certificate — extract Name, DOB, Number, Address instantly. All processing runs in your browser.",
      },
    ],
    links: [{ rel: "canonical", href: "https://sapna-ai-tech.lovable.app/gov/ocr" }],
  }),
  component: OcrPage,
});

type Extracted = {
  name?: string;
  dob?: string;
  gender?: string;
  documentNumber?: string;
  address?: string;
  fatherOrHusbandName?: string;
  issueDate?: string;
  expiryDate?: string;
  otherFields?: Record<string, string>;
  warnings?: string[];
};

function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<Extracted | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setRawText("");
    setProgress(0);
    setExtracted(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onFile = (f: File | null) => {
    if (!f) return;
    if (f.size > 15 * 1024 * 1024) {
      toast.error("File too large (max 15 MB)");
      return;
    }
    reset();
    setFile(f);
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const runOcr = async () => {
    if (!file) return;
    setRunning(true);
    setProgress(0);
    setRawText("");
    setExtracted(null);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker(["eng", "hin"], 1, {
        logger: (m) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const text = (data.text || "").trim();
      setRawText(text);
      if (!text) {
        toast.error("Couldn't read any text. Try a clearer photo.");
      } else {
        toast.success("Text extracted");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "OCR failed");
    } finally {
      setRunning(false);
    }
  };

  const runExtract = async () => {
    if (!rawText) return;
    setExtracting(true);
    setExtracted(null);
    try {
      const system = `You are a document field extractor for Indian government IDs (Aadhaar, PAN, Passport, Driving Licence, Voter ID, certificates).
Return ONLY a strict JSON object with this shape (omit fields you cannot find, do not invent):
{
  "name": string,
  "dob": string,
  "gender": string,
  "documentNumber": string,
  "address": string,
  "fatherOrHusbandName": string,
  "issueDate": string,
  "expiryDate": string,
  "otherFields": { "<label>": "<value>" },
  "warnings": string[]
}
Add helpful entries in "warnings" if the number looks malformed (e.g. Aadhaar should be 12 digits, PAN should be 10 chars AAAAA9999A).
Do not include any prose, backticks, or markdown — JSON only.`;
      const reply = await askAi(rawText, system);
      const cleaned = reply
        .trim()
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
      const parsed = JSON.parse(cleaned) as Extracted;
      setExtracted(parsed);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Extraction failed");
    } finally {
      setExtracting(false);
    }
  };

  const copyAll = () => {
    if (!extracted) return;
    void navigator.clipboard.writeText(JSON.stringify(extracted, null, 2));
    toast.success("Copied JSON");
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
          <span className="text-foreground">Document OCR</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.76_0.17_55)]/25 to-[oklch(0.66_0.16_155)]/25 ring-1 ring-border/60">
            <ScanText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Document AI</p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">Document OCR &amp; Field Extractor</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Upload a photo or scan of Aadhaar, PAN, Passport, Driving Licence, Voter ID or any government certificate.
          Text recognition runs entirely in your browser — your document never leaves your device.
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Always verify extracted values against the original document before using them. We do not store your file
            or the recognised text on our servers.
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-background/40 px-4 py-8 text-center transition hover:border-primary/50">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">Choose image (JPG, PNG, WEBP)</span>
              <span className="text-[11px] text-muted-foreground">Max 15 MB · Processed on your device</span>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </label>

            {preview && (
              <div className="relative mt-4">
                <img src={preview} alt="Uploaded document" className="max-h-80 w-full rounded-lg border border-border/60 object-contain" />
                <button
                  onClick={reset}
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-border/60 bg-background/80 text-muted-foreground hover:text-red-500"
                  aria-label="Remove"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Button onClick={runOcr} disabled={!file || running} className="flex-1">
                {running ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reading… {progress}%
                  </>
                ) : (
                  <>
                    <ScanText className="mr-2 h-4 w-4" /> Run OCR
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold">Recognised text</h2>
              {rawText && (
                <button
                  onClick={() => {
                    void navigator.clipboard.writeText(rawText);
                    toast.success("Copied");
                  }}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              )}
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Text will appear here after OCR. You can edit before AI extraction."
              className="h-52 w-full resize-none rounded-lg border border-border/60 bg-background/60 p-3 text-xs outline-none focus:border-primary/60"
            />
            <Button onClick={runExtract} disabled={!rawText || extracting} className="mt-3 w-full" variant="outline">
              {extracting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Extracting fields…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Extract fields with AI
                </>
              )}
            </Button>
          </div>
        </div>

        {extracted && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold">Extracted fields</h2>
              <button onClick={copyAll} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                <Copy className="h-3 w-3" /> Copy JSON
              </button>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["Name", extracted.name],
                  ["Document Number", extracted.documentNumber],
                  ["Date of Birth", extracted.dob],
                  ["Gender", extracted.gender],
                  ["Father / Husband", extracted.fatherOrHusbandName],
                  ["Issue Date", extracted.issueDate],
                  ["Expiry Date", extracted.expiryDate],
                  ["Address", extracted.address],
                ] as const
              )
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm">{v}</dd>
                  </div>
                ))}
              {extracted.otherFields &&
                Object.entries(extracted.otherFields).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                    <dd className="mt-1 text-sm">{v}</dd>
                  </div>
                ))}
            </dl>
            {extracted.warnings && extracted.warnings.length > 0 && (
              <ul className="mt-4 space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                {extracted.warnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
