import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/letter")({
  head: () => ({
    meta: [
      { title: "Official Letter Writer — Bharat AI Sathi" },
      { name: "description", content: "AI Official Letter Writer for Indian formats — leave, job, resignation, complaint, RTI, bank & school applications in Hindi, English or Hinglish." },
      { property: "og:url", content: "https://bharataisathi.com/letter" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/letter" }],
  }),
  component: LetterPage,
});

type LetterType =
  | "Leave Application"
  | "Job Application"
  | "Resignation Letter"
  | "Complaint Letter"
  | "Government Application (RTI / Certificate)"
  | "Bank Application"
  | "School / College Application"
  | "Business Letter"
  | "Custom";

const LETTER_TYPES: LetterType[] = [
  "Leave Application",
  "Job Application",
  "Resignation Letter",
  "Complaint Letter",
  "Government Application (RTI / Certificate)",
  "Bank Application",
  "School / College Application",
  "Business Letter",
  "Custom",
];

type FieldDef = { key: string; label: string; placeholder?: string; textarea?: boolean };

const FIELDS: Record<LetterType, FieldDef[]> = {
  "Leave Application": [
    { key: "name", label: "Your Name" },
    { key: "designation", label: "Designation / Class" },
    { key: "recipient", label: "Addressed To (e.g. Principal, HR Manager)" },
    { key: "from", label: "Leave From (date)" },
    { key: "to", label: "Leave To (date)" },
    { key: "reason", label: "Reason for Leave", textarea: true },
  ],
  "Job Application": [
    { key: "name", label: "Your Name" },
    { key: "position", label: "Position Applied For" },
    { key: "company", label: "Company / Organisation" },
    { key: "recipient", label: "Addressed To (e.g. HR Manager)" },
    { key: "experience", label: "Experience / Qualifications", textarea: true },
  ],
  "Resignation Letter": [
    { key: "name", label: "Your Name" },
    { key: "designation", label: "Your Designation" },
    { key: "company", label: "Company" },
    { key: "lastDay", label: "Proposed Last Working Day" },
    { key: "reason", label: "Reason (optional)", textarea: true },
  ],
  "Complaint Letter": [
    { key: "name", label: "Your Name" },
    { key: "recipient", label: "Addressed To (Authority / Company)" },
    { key: "issue", label: "Issue / Complaint", textarea: true },
    { key: "expected", label: "Expected Resolution" },
  ],
  "Government Application (RTI / Certificate)": [
    { key: "name", label: "Applicant Name" },
    { key: "address", label: "Applicant Address" },
    { key: "department", label: "Department / Office Name" },
    { key: "purpose", label: "Purpose (RTI query, certificate type, etc.)", textarea: true },
    { key: "refs", label: "Reference Numbers (if any)" },
  ],
  "Bank Application": [
    { key: "name", label: "Account Holder Name" },
    { key: "account", label: "Account Number" },
    { key: "branch", label: "Branch Name" },
    { key: "purpose", label: "Purpose (chequebook, address change, etc.)", textarea: true },
  ],
  "School / College Application": [
    { key: "name", label: "Student Name" },
    { key: "classRoll", label: "Class / Roll No." },
    { key: "recipient", label: "Addressed To (Principal / HOD)" },
    { key: "purpose", label: "Purpose", textarea: true },
  ],
  "Business Letter": [
    { key: "sender", label: "Sender (Name / Company)" },
    { key: "recipient", label: "Recipient (Name / Company)" },
    { key: "subject", label: "Subject" },
    { key: "purpose", label: "Purpose / Message", textarea: true },
  ],
  Custom: [
    { key: "recipient", label: "Addressed To" },
    { key: "subject", label: "Subject" },
  ],
};

const LANGS = ["Hindi", "English", "Hinglish"] as const;
const TONES = ["Formal", "Polite / Respectful", "Urgent"] as const;

function LetterPage() {
  const [type, setType] = useState<LetterType>("Leave Application");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("English");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Formal");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [extra, setExtra] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const defs = useMemo(() => FIELDS[type], [type]);

  const set = (k: string, v: string) => setFields((f) => ({ ...f, [k]: v }));

  const run = async () => {
    setLoading(true);
    setOutput("");
    try {
      const fieldSummary = defs
        .map((d) => `${d.label}: ${fields[d.key]?.trim() || "(not provided)"}`)
        .join("\n");
      const langInstr =
        lang === "Hindi"
          ? "Write the letter entirely in shudh Hindi (Devanagari script)."
          : lang === "Hinglish"
          ? "Write in Hinglish (Roman-script Hindi mixed with English) as commonly used in India."
          : "Write in clear, professional Indian English.";
      const prompt = `Write a properly formatted Indian ${type}.

Tone: ${tone}.
${langInstr}

Applicant / details:
${fieldSummary}

Additional context from the user:
${extra || "(none)"}

Requirements:
- Follow Indian official letter conventions: sender block, date, recipient block, subject line, salutation, well-structured body, closing (e.g. "Yours faithfully / sincerely / भवदीय"), signature line.
- Use realistic placeholders like [Your Address], [Date] only where the user has not provided info.
- Keep length appropriate — concise but complete.
- Return only the letter text, no commentary or markdown fences.`;
      const text = await askAi(prompt, "You are an expert at drafting official Indian letters and applications.");
      setOutput(text.trim());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate letter");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const downloadPdf = async () => {
    if (!output.trim()) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(output, width);
    let y = margin;
    const lineHeight = 16;
    const pageHeight = doc.internal.pageSize.getHeight();
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    doc.save(`letter-${Date.now()}.pdf`);
  };

  const downloadDocx = async () => {
    if (!output.trim()) return;
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const paragraphs = output.split(/\n/).map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line || " ", font: "Calibri", size: 24 })],
        }),
    );
    const doc = new Document({
      sections: [
        {
          properties: { page: { size: { width: 12240, height: 15840 } } },
          children: paragraphs,
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `letter-${Date.now()}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AiToolShell slug="letter">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="grid gap-3">
          <div>
            <Label className="text-xs">Letter Type</Label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as LetterType);
                setFields({});
              }}
              className="mt-1 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
            >
              {LETTER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Language</Label>
              <div className="mt-1 flex flex-wrap gap-1">
                {LANGS.map((l) => (
                  <Button key={l} size="sm" variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}>
                    {l}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs">Tone</Label>
              <div className="mt-1 flex flex-wrap gap-1">
                {TONES.map((t) => (
                  <Button key={t} size="sm" variant={tone === t ? "default" : "outline"} onClick={() => setTone(t)}>
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            {defs.map((f) =>
              f.textarea ? (
                <div key={f.key}>
                  <Label className="text-xs">{f.label}</Label>
                  <Textarea
                    value={fields[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              ) : (
                <div key={f.key}>
                  <Label className="text-xs">{f.label}</Label>
                  <Input
                    value={fields[f.key] ?? ""}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="mt-1"
                  />
                </div>
              ),
            )}
          </div>

          <div>
            <Label className="text-xs">Extra context (any language)</Label>
            <Textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="Add any details in your own words — Hindi, English or Hinglish."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <Button
            onClick={run}
            disabled={loading}
            className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Generate Letter
          </Button>
        </div>

        {/* Output */}
        <div className="grid gap-3">
          <Label className="text-xs">Generated Letter (editable)</Label>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Your AI-drafted letter will appear here. You can edit it before downloading."
            className="min-h-[420px] font-serif text-sm leading-relaxed"
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={copy} disabled={!output.trim()}>
              <Copy className="mr-1 h-4 w-4" /> Copy
            </Button>
            <Button size="sm" variant="outline" onClick={downloadPdf} disabled={!output.trim()}>
              <Download className="mr-1 h-4 w-4" /> PDF
            </Button>
            <Button size="sm" variant="outline" onClick={downloadDocx} disabled={!output.trim()}>
              <Download className="mr-1 h-4 w-4" /> DOCX
            </Button>
          </div>
        </div>
      </div>
    </AiToolShell>
  );
}
