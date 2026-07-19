import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Download, FileSignature, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/agreement")({
  head: () => ({
    meta: [
      { title: "Agreement Generator — Rent, NDA, Offer Letter & More | Bharat AI Sathi" },
      {
        name: "description",
        content:
          "AI Agreement Generator for Indian users — draft rent agreements, NDAs, offer letters, freelance and partnership agreements. Editable, exportable to PDF/DOCX.",
      },
      { property: "og:url", content: "https://bharataisathi.com/agreement" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/agreement" }],
  }),
  component: AgreementPage,
});

type AgreementType =
  | "Rent Agreement"
  | "NDA (Non-Disclosure Agreement)"
  | "Offer Letter"
  | "Freelance / Service Agreement"
  | "Partnership Agreement"
  | "Custom";

const TYPES: AgreementType[] = [
  "Rent Agreement",
  "NDA (Non-Disclosure Agreement)",
  "Offer Letter",
  "Freelance / Service Agreement",
  "Partnership Agreement",
  "Custom",
];

type FieldDef = { key: string; label: string; placeholder?: string; textarea?: boolean };

const FIELDS: Record<AgreementType, FieldDef[]> = {
  "Rent Agreement": [
    { key: "landlord", label: "Landlord Name" },
    { key: "landlordAddr", label: "Landlord Address" },
    { key: "tenant", label: "Tenant Name" },
    { key: "tenantAddr", label: "Tenant Address" },
    { key: "property", label: "Property Address", textarea: true },
    { key: "rent", label: "Monthly Rent (INR)" },
    { key: "deposit", label: "Security Deposit (INR)" },
    { key: "duration", label: "Duration (e.g. 11 months)" },
    { key: "startDate", label: "Start Date" },
    { key: "city", label: "City / Jurisdiction" },
  ],
  "NDA (Non-Disclosure Agreement)": [
    { key: "party1", label: "Disclosing Party (Name / Company)" },
    { key: "party1Addr", label: "Disclosing Party Address" },
    { key: "party2", label: "Receiving Party (Name / Company)" },
    { key: "party2Addr", label: "Receiving Party Address" },
    { key: "purpose", label: "Purpose of Disclosure", textarea: true },
    { key: "duration", label: "Confidentiality Period (e.g. 3 years)" },
    { key: "effectiveDate", label: "Effective Date" },
    { key: "jurisdiction", label: "Jurisdiction (City / State)" },
  ],
  "Offer Letter": [
    { key: "company", label: "Company Name" },
    { key: "companyAddr", label: "Company Address" },
    { key: "candidate", label: "Candidate Name" },
    { key: "candidateAddr", label: "Candidate Address" },
    { key: "position", label: "Position / Designation" },
    { key: "ctc", label: "Annual CTC (INR)" },
    { key: "joinDate", label: "Joining Date" },
    { key: "location", label: "Work Location" },
    { key: "probation", label: "Probation Period" },
    { key: "notice", label: "Notice Period" },
  ],
  "Freelance / Service Agreement": [
    { key: "client", label: "Client (Name / Company)" },
    { key: "clientAddr", label: "Client Address" },
    { key: "freelancer", label: "Freelancer / Service Provider" },
    { key: "freelancerAddr", label: "Freelancer Address" },
    { key: "scope", label: "Scope of Work", textarea: true },
    { key: "fees", label: "Fees (INR) & Payment Terms" },
    { key: "duration", label: "Project Duration / Timeline" },
    { key: "startDate", label: "Start Date" },
    { key: "jurisdiction", label: "Jurisdiction" },
  ],
  "Partnership Agreement": [
    { key: "firmName", label: "Firm / Partnership Name" },
    { key: "businessAddr", label: "Business Address" },
    { key: "businessNature", label: "Nature of Business", textarea: true },
    { key: "partners", label: "Partner Names & Contributions", textarea: true },
    { key: "profitShare", label: "Profit / Loss Sharing Ratio" },
    { key: "startDate", label: "Commencement Date" },
    { key: "duration", label: "Duration (e.g. At-will / Fixed)" },
    { key: "jurisdiction", label: "Jurisdiction" },
  ],
  Custom: [
    { key: "party1", label: "Party 1" },
    { key: "party2", label: "Party 2" },
    { key: "subject", label: "Subject / Title" },
  ],
};

const LANGS = ["English", "Hindi", "Bilingual"] as const;

const DISCLAIMER =
  "This is an AI-generated draft for reference only and is not a substitute for professional legal advice. Please consult a lawyer before signing any legal document.";

function AgreementPage() {
  const [type, setType] = useState<AgreementType>("Rent Agreement");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("English");
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
      const summary = defs
        .map((d) => `${d.label}: ${fields[d.key]?.trim() || "(not provided)"}`)
        .join("\n");
      const langInstr =
        lang === "Hindi"
          ? "Draft the entire agreement in shudh Hindi (Devanagari script)."
          : lang === "Bilingual"
          ? "Draft the agreement in English but include a short Hindi (Devanagari) summary of each major clause below it."
          : "Draft in clear, professional Indian legal English.";
      const prompt = `Draft a complete, professionally formatted Indian ${type}.

${langInstr}

Party / clause details:
${summary}

Additional context from the user:
${extra || "(none)"}

Requirements:
- Follow the structure of standard Indian ${type} templates commonly used in practice.
- Include: title, parties block with addresses, recitals/WHEREAS clauses (where relevant), numbered operative clauses (definitions, term, obligations, payment, confidentiality, termination, dispute resolution, governing law & jurisdiction, notices, entire agreement, severability), and signature block for both parties with witness lines.
- Use realistic placeholders like [Date], [Address], [PAN] only where the user hasn't provided info.
- Reference Indian laws where appropriate (e.g. Indian Contract Act 1872, applicable Rent Control Act, Companies Act 2013) in a general, non-advisory manner.
- Do NOT add legal disclaimers inside the document — a separate disclaimer is shown by the app.
- Return ONLY the agreement text. No markdown code fences, no commentary.`;
      const text = await askAi(
        prompt,
        "You are an experienced Indian contracts drafter producing clean, well-structured legal-style agreements.",
      );
      setOutput(text.trim());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate agreement");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!output.trim()) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const downloadPdf = async () => {
    if (!output.trim()) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(output, width);
    let y = margin;
    const lineHeight = 16;
    lines.forEach((line: string) => {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    // Disclaimer footer on last page
    if (y + 40 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    y += 12;
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120);
    const disc = doc.splitTextToSize(DISCLAIMER, width);
    disc.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 12;
    });
    doc.save(`agreement-${Date.now()}.pdf`);
  };

  const downloadDocx = async () => {
    if (!output.trim()) return;
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const bodyParas = output.split(/\n/).map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line || " ", font: "Calibri", size: 24 })],
        }),
    );
    const discPara = new Paragraph({
      children: [new TextRun({ text: DISCLAIMER, font: "Calibri", size: 18, italics: true, color: "666666" })],
    });
    const doc = new Document({
      sections: [
        {
          properties: { page: { size: { width: 12240, height: 15840 } } },
          children: [...bodyParas, new Paragraph({ children: [new TextRun(" ")] }), discPara],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agreement-${Date.now()}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AiToolShell slug="agreement">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="grid gap-3">
          <div>
            <Label className="text-xs">Agreement Type</Label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as AgreementType);
                setFields({});
              }}
              className="mt-1 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

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
            <Label className="text-xs">Extra clauses / context (optional)</Label>
            <Textarea
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="Any special clauses, exceptions, or context — Hindi, English or Hinglish."
              className="mt-1 min-h-[90px]"
            />
          </div>

          <Button
            onClick={run}
            disabled={loading}
            className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSignature className="mr-2 h-4 w-4" />}
            Generate Agreement
          </Button>
        </div>

        {/* Output */}
        <div className="grid gap-3">
          <Label className="text-xs">Generated Agreement (editable)</Label>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Your AI-drafted agreement will appear here. You can edit it before downloading."
            className="min-h-[440px] font-serif text-sm leading-relaxed"
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

          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </AiToolShell>
  );
}
