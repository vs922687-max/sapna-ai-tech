import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/pdf")({
  head: () => ({ meta: [{ title: "AI PDF Chat — Bharat AI Sathi" }, { name: "description", content: "Upload a PDF and chat with it — extract answers instantly." }] }),
  component: PdfPage,
});

type Msg = { role: "user" | "assistant"; content: string };

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  // Use bundled worker via URL import
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it) => ("str" in it ? (it as { str: string }).str : "")).join(" ") + "\n\n";
  }
  return out.trim();
}

function PdfPage() {
  const [fileName, setFileName] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name); setPdfText(""); setMsgs([]);
    setExtracting(true);
    try {
      const text = await extractPdfText(file);
      if (!text) throw new Error("No extractable text (scanned PDF?)");
      setPdfText(text);
      toast.success(`Loaded ${file.name}`);
    } catch (err) { toast.error(err instanceof Error ? err.message : "PDF failed"); }
    finally { setExtracting(false); }
  };

  const ask = async () => {
    if (!q.trim() || !pdfText) return;
    const question = q.trim();
    setQ("");
    setMsgs((m) => [...m, { role: "user", content: question }]);
    setLoading(true);
    try {
      // Truncate to keep prompt reasonable
      const context = pdfText.slice(0, 60000);
      const answer = await askAi(
        `PDF content:\n---\n${context}\n---\n\nQuestion: ${question}\n\nAnswer based ONLY on the PDF above. If the answer isn't in the PDF, say so.`,
        "You are a document assistant.",
      );
      setMsgs((m) => [...m, { role: "assistant", content: answer }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
      setMsgs((m) => m.slice(0, -1));
    } finally { setLoading(false); }
  };

  return (
    <AiToolShell slug="pdf">
      <label className="glass flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border/60 p-6 hover:border-primary/50">
        <Upload className="h-5 w-5 text-primary" />
        <div className="flex-1">
          <div className="text-sm font-medium">{fileName || "Upload a PDF"}</div>
          <div className="text-xs text-muted-foreground">{extracting ? "Extracting text..." : pdfText ? `${pdfText.length.toLocaleString()} chars extracted` : "Click to choose file"}</div>
        </div>
        {extracting && <Loader2 className="h-4 w-4 animate-spin" />}
        <input type="file" accept="application/pdf" className="hidden" onChange={onFile} />
      </label>

      {pdfText && (
        <>
          <div className="mt-6 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`glass rounded-2xl border border-border/60 p-3 text-sm ${m.role === "user" ? "ml-auto max-w-[85%] bg-primary/10" : "max-w-[85%]"}`}>
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{m.role === "user" ? "You" : "AI"}</div>
                <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
              </div>
            ))}
            {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><FileText className="h-4 w-4" />Reading PDF...</div>}
          </div>
          <div className="mt-4 flex gap-2">
            <Input placeholder="Ask about the PDF..." value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ask(); }} />
            <Button onClick={ask} disabled={loading || !q.trim()} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground">Ask</Button>
          </div>
        </>
      )}
    </AiToolShell>
  );
}
