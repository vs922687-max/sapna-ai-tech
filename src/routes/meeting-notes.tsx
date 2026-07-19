import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Mic, MicOff, Copy, Download, ClipboardList, CheckSquare, Gavel, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Generator — Bharat AI Sathi" },
      { name: "description", content: "Turn meeting transcripts or audio into a clean summary, action items and decisions. Hindi and English supported." },
      { property: "og:title", content: "Meeting Notes Generator — Bharat AI Sathi" },
      { property: "og:description", content: "AI-powered meeting minutes: summary, action items and decisions from your transcript or audio." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/meeting-notes" }],
  }),
  component: MeetingNotesPage,
});

type ActionItem = { task: string; owner?: string; due?: string };
type Notes = {
  language: string;
  summary: string;
  key_points: string[];
  action_items: ActionItem[];
  decisions: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSpeechRecognition = (): any => {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

function MeetingNotesPage() {
  const [transcript, setTranscript] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [notes, setNotes] = useState<Notes | null>(null);
  const [listening, setListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { recognitionRef.current?.stop?.(); }, []);

  const onAudio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { aiAuthHeaders } = await import("@/lib/ai-client");
      const auth = await aiAuthHeaders();
      const res = await fetch("/api/transcribe", { method: "POST", body: fd, headers: auth });
      const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Transcription failed");
      setTranscript((t) => (t ? t + "\n\n" : "") + (data.text ?? ""));
      toast.success("Audio transcribed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const toggleListen = () => {
    const SR = getSpeechRecognition();
    if (!SR) { toast.error("Live dictation not supported in this browser"); return; }
    if (listening) { recognitionRef.current?.stop?.(); setListening(false); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";
    let finalBuf = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (ev: any) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) finalBuf += r[0].transcript + " ";
        else interim += r[0].transcript;
      }
      setTranscript((prev) => {
        // replace trailing interim by rebuilding — simplest: append final only
        return (prev.replace(/\s*\[…[^\]]*\]$/, "") + (finalBuf ? finalBuf : "") + (interim ? ` [… ${interim}]` : "")).replace(/\s+/g, " ").trim();
      });
      finalBuf = "";
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  const generate = async () => {
    if (!transcript.trim()) { toast.error("Please provide a transcript"); return; }
    setGenerating(true); setNotes(null);
    try {
      const system = "You are an expert meeting minutes assistant. Detect the language of the transcript (Hindi, English, or Hinglish) and write ALL output fields in that SAME language. Return ONLY valid minified JSON — no markdown, no code fences, no commentary.";
      const prompt = `Analyse the meeting transcript below and produce structured notes.

Return JSON with EXACTLY these keys:
{
  "language": "en" | "hi" | "hi-en",
  "summary": "3-5 sentence overview",
  "key_points": ["…", "…"],
  "action_items": [{ "task": "…", "owner": "name or empty", "due": "date phrase or empty" }],
  "decisions": ["…", "…"]
}

Rules:
- Write summary/key_points/action_items/decisions in the SAME language as the transcript.
- If no owner/due mentioned, use empty strings.
- Keep bullets crisp.

Transcript:
"""
${transcript.slice(0, 60000)}
"""`;
      const raw = await askAi(prompt, system);
      const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      const jsonStr = jsonStart >= 0 ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned;
      const parsed = JSON.parse(jsonStr) as Notes;
      setNotes({
        language: parsed.language || "en",
        summary: parsed.summary || "",
        key_points: Array.isArray(parsed.key_points) ? parsed.key_points : [],
        action_items: Array.isArray(parsed.action_items) ? parsed.action_items : [],
        decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate notes");
    } finally {
      setGenerating(false);
    }
  };

  const asPlainText = (n: Notes) => {
    const lines: string[] = [];
    lines.push("MEETING NOTES", "");
    lines.push("Summary:", n.summary, "");
    if (n.key_points.length) { lines.push("Key Points:"); n.key_points.forEach((p) => lines.push(`• ${p}`)); lines.push(""); }
    if (n.action_items.length) {
      lines.push("Action Items:");
      n.action_items.forEach((a) => lines.push(`☐ ${a.task}${a.owner ? ` — ${a.owner}` : ""}${a.due ? ` (due ${a.due})` : ""}`));
      lines.push("");
    }
    if (n.decisions.length) { lines.push("Decisions:"); n.decisions.forEach((d) => lines.push(`• ${d}`)); }
    return lines.join("\n");
  };

  const copy = async () => {
    if (!notes) return;
    await navigator.clipboard.writeText(asPlainText(notes));
    toast.success("Copied to clipboard");
  };

  const downloadPdf = async () => {
    if (!notes || !printRef.current) return;
    const { default: jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(printRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW - 40;
    const imgH = (canvas.height * imgW) / canvas.width;
    let y = 20;
    if (imgH <= pageH - 40) {
      pdf.addImage(img, "PNG", 20, y, imgW, imgH);
    } else {
      // simple multi-page
      const ratio = imgW / canvas.width;
      const pageSliceH = (pageH - 40) / ratio;
      let sY = 0;
      while (sY < canvas.height) {
        const sliceH = Math.min(pageSliceH, canvas.height - sY);
        const c = document.createElement("canvas");
        c.width = canvas.width; c.height = sliceH;
        c.getContext("2d")!.drawImage(canvas, 0, sY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        pdf.addImage(c.toDataURL("image/png"), "PNG", 20, y, imgW, sliceH * ratio);
        sY += sliceH;
        if (sY < canvas.height) { pdf.addPage(); y = 20; }
      }
    }
    pdf.save("meeting-notes.pdf");
  };

  return (
    <AiToolShell slug="meeting-notes">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl border border-border/60 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Transcript</div>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste meeting transcript here, upload audio, or dictate live…"
              className="min-h-[220px] resize-y"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs hover:border-primary/50 ${uploading ? "opacity-60" : ""}`}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Transcribing…" : "Upload audio"}
                <input type="file" accept="audio/mp3,audio/mpeg,audio/wav,audio/x-m4a,audio/mp4,audio/webm,.mp3,.wav,.m4a" className="hidden" onChange={onAudio} disabled={uploading} />
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleListen}
                className="gap-2"
              >
                {listening ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
                {listening ? "Stop dictation" : "Dictate live"}
              </Button>
              {transcript && (
                <Button type="button" variant="ghost" size="sm" onClick={() => { setTranscript(""); setNotes(null); }}>Clear</Button>
              )}
            </div>
          </div>

          <Button
            onClick={generate}
            disabled={generating || !transcript.trim()}
            className="w-full bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground"
          >
            {generating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating notes…</>) : "Generate Meeting Notes"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Supports Hindi, English and Hinglish. Language is detected automatically and notes are returned in the same language.
          </p>
        </div>

        {/* Output */}
        <div className="lg:col-span-3">
          {!notes && !generating && (
            <div className="glass grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
              <div>
                <ClipboardList className="mx-auto mb-2 h-8 w-8 text-primary/70" />
                Your structured meeting notes will appear here.
              </div>
            </div>
          )}
          {generating && (
            <div className="glass grid min-h-[320px] place-items-center rounded-2xl border border-border/60 p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Generating notes…
              </div>
            </div>
          )}
          {notes && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={copy} className="gap-2"><Copy className="h-4 w-4" /> Copy</Button>
                <Button size="sm" variant="outline" onClick={downloadPdf} className="gap-2"><Download className="h-4 w-4" /> Download PDF</Button>
              </div>

              <div ref={printRef} className="space-y-4 rounded-2xl bg-white p-6 text-slate-900">
                <h2 className="text-xl font-bold">Meeting Notes</h2>

                <Section icon={<Sparkle />} title="Summary">
                  <p className="text-sm leading-relaxed">{notes.summary}</p>
                </Section>

                <Section icon={<ListChecks className="h-4 w-4" />} title="Key Discussion Points">
                  {notes.key_points.length ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {notes.key_points.map((p, i) => (<li key={i}>{p}</li>))}
                    </ul>
                  ) : <Empty />}
                </Section>

                <Section icon={<CheckSquare className="h-4 w-4" />} title="Action Items">
                  {notes.action_items.length ? (
                    <ul className="space-y-2 text-sm">
                      {notes.action_items.map((a, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-600" />
                          <div>
                            <div>{a.task}</div>
                            {(a.owner || a.due) && (
                              <div className="text-xs text-slate-600">
                                {a.owner && <span>Owner: <b>{a.owner}</b></span>}
                                {a.owner && a.due && <span> · </span>}
                                {a.due && <span>Due: <b>{a.due}</b></span>}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : <Empty />}
                </Section>

                <Section icon={<Gavel className="h-4 w-4" />} title="Decisions Made">
                  {notes.decisions.length ? (
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {notes.decisions.map((d, i) => (<li key={i}>{d}</li>))}
                    </ul>
                  ) : <Empty />}
                </Section>
              </div>
            </div>
          )}
        </div>
      </div>
    </AiToolShell>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span className="text-primary">{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

function Empty() { return <p className="text-xs text-slate-500">None captured.</p>; }
function Sparkle() { return <span className="inline-block h-4 w-4 rounded-full bg-gradient-to-br from-amber-400 to-rose-500" />; }
