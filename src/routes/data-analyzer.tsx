import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Send, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export const Route = createFileRoute("/data-analyzer")({
  head: () => ({
    meta: [
      { title: "AI Data Analyzer — Bharat AI Sathi" },
      {
        name: "description",
        content:
          "Upload CSV or Excel files and chat with your data. Get instant insights, summaries, error detection and auto-generated charts.",
      },
    ],
  }),
  component: DataAnalyzerPage,
});

type Row = Record<string, string | number | null>;
type Msg = { role: "user" | "assistant"; content: string };
type ColStats = {
  name: string;
  type: "number" | "string" | "date";
  count: number;
  nulls: number;
  unique: number;
  min?: number;
  max?: number;
  mean?: number;
  sample: (string | number | null)[];
  topValues?: { value: string; count: number }[];
};

const PALETTE = [
  "oklch(0.76 0.17 55)",
  "oklch(0.72 0.16 155)",
  "oklch(0.72 0.15 260)",
  "oklch(0.68 0.2 30)",
  "oklch(0.7 0.18 200)",
  "oklch(0.75 0.15 100)",
];

function inferType(vals: (string | number | null)[]): ColStats["type"] {
  const nonEmpty = vals.filter((v) => v !== null && v !== "" && v !== undefined);
  if (!nonEmpty.length) return "string";
  const nums = nonEmpty.filter((v) => typeof v === "number" || (!isNaN(Number(v)) && String(v).trim() !== ""));
  if (nums.length / nonEmpty.length > 0.8) return "number";
  const dates = nonEmpty.filter((v) => !isNaN(Date.parse(String(v))));
  if (dates.length / nonEmpty.length > 0.8) return "date";
  return "string";
}

function analyzeColumns(rows: Row[]): ColStats[] {
  if (!rows.length) return [];
  const cols = Object.keys(rows[0]);
  return cols.map((c) => {
    const vals = rows.map((r) => r[c] ?? null);
    const nonNull = vals.filter((v) => v !== null && v !== "");
    const type = inferType(vals);
    const unique = new Set(nonNull.map(String)).size;
    const stat: ColStats = {
      name: c,
      type,
      count: nonNull.length,
      nulls: vals.length - nonNull.length,
      unique,
      sample: vals.slice(0, 5),
    };
    if (type === "number") {
      const nums = nonNull.map((v) => Number(v)).filter((n) => !isNaN(n));
      if (nums.length) {
        stat.min = Math.min(...nums);
        stat.max = Math.max(...nums);
        stat.mean = nums.reduce((a, b) => a + b, 0) / nums.length;
      }
    } else {
      const counts = new Map<string, number>();
      nonNull.forEach((v) => {
        const k = String(v);
        counts.set(k, (counts.get(k) ?? 0) + 1);
      });
      stat.topValues = Array.from(counts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([value, count]) => ({ value, count }));
    }
    return stat;
  });
}

type Chart =
  | { kind: "bar"; title: string; data: { name: string; value: number }[]; xLabel: string; yLabel: string }
  | { kind: "line"; title: string; data: { name: string; value: number }[]; xLabel: string; yLabel: string }
  | { kind: "pie"; title: string; data: { name: string; value: number }[] };

function suggestCharts(rows: Row[], stats: ColStats[]): Chart[] {
  const charts: Chart[] = [];
  const numCols = stats.filter((s) => s.type === "number");
  const catCols = stats.filter((s) => s.type === "string" && s.unique <= 20 && s.unique >= 2);
  const dateCols = stats.filter((s) => s.type === "date");

  // 1. Category vs numeric aggregate (bar)
  if (catCols.length && numCols.length) {
    const cat = catCols[0];
    const num = numCols[0];
    const agg = new Map<string, number>();
    rows.forEach((r) => {
      const k = String(r[cat.name] ?? "—");
      const v = Number(r[num.name]);
      if (!isNaN(v)) agg.set(k, (agg.get(k) ?? 0) + v);
    });
    const data = Array.from(agg.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
    if (data.length)
      charts.push({ kind: "bar", title: `${num.name} by ${cat.name}`, data, xLabel: cat.name, yLabel: num.name });
  }

  // 2. Date vs numeric trend (line)
  if (dateCols.length && numCols.length) {
    const d = dateCols[0];
    const num = numCols[0];
    const agg = new Map<string, number>();
    rows.forEach((r) => {
      const dt = Date.parse(String(r[d.name]));
      if (isNaN(dt)) return;
      const k = new Date(dt).toISOString().slice(0, 10);
      const v = Number(r[num.name]);
      if (!isNaN(v)) agg.set(k, (agg.get(k) ?? 0) + v);
    });
    const data = Array.from(agg.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-30)
      .map(([name, value]) => ({ name, value }));
    if (data.length > 1)
      charts.push({ kind: "line", title: `${num.name} over ${d.name}`, data, xLabel: d.name, yLabel: num.name });
  }

  // 3. Category distribution (pie)
  if (catCols.length) {
    const cat = catCols[0];
    const data = (cat.topValues ?? []).slice(0, 6).map((t) => ({ name: t.value, value: t.count }));
    if (data.length && !charts.some((c) => c.kind === "pie"))
      charts.push({ kind: "pie", title: `Distribution of ${cat.name}`, data });
  }

  // Fallback: numeric-only dataset — bar of column means
  if (!charts.length && numCols.length >= 2) {
    const data = numCols.slice(0, 8).map((n) => ({ name: n.name, value: Math.round((n.mean ?? 0) * 100) / 100 }));
    charts.push({ kind: "bar", title: "Average by column", data, xLabel: "Column", yLabel: "Mean" });
  }

  return charts.slice(0, 3);
}

function DataAnalyzerPage() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const chartsRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => analyzeColumns(rows), [rows]);
  const charts = useMemo(() => suggestCharts(rows, stats), [rows, stats]);
  const columns = useMemo(() => (rows[0] ? Object.keys(rows[0]) : []), [rows]);

  const parseFile = async (file: File) => {
    setFileName(file.name);
    setRows([]);
    setMsgs([]);
    setParsing(true);
    try {
      const ext = file.name.toLowerCase().split(".").pop();
      let parsed: Row[] = [];
      if (ext === "csv" || ext === "tsv" || ext === "txt") {
        const Papa = (await import("papaparse")).default;
        const text = await file.text();
        const res = Papa.parse<Row>(text, { header: true, skipEmptyLines: true, dynamicTyping: true });
        parsed = res.data as Row[];
      } else if (ext === "xlsx" || ext === "xls") {
        const XLSX = await import("xlsx");
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        parsed = XLSX.utils.sheet_to_json(ws, { defval: null }) as Row[];
      } else {
        throw new Error("Unsupported file. Please upload CSV or XLSX.");
      }
      if (!parsed.length) throw new Error("No data rows detected");
      setRows(parsed);
      toast.success(`Loaded ${parsed.length.toLocaleString()} rows`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to parse file");
    } finally {
      setParsing(false);
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void parseFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void parseFile(f);
  };

  const buildContext = () => {
    const summary = {
      fileName,
      totalRows: rows.length,
      columns: stats.map((s) => ({
        name: s.name,
        type: s.type,
        nonNull: s.count,
        nulls: s.nulls,
        unique: s.unique,
        ...(s.type === "number"
          ? { min: s.min, max: s.max, mean: s.mean }
          : { topValues: s.topValues?.slice(0, 5) }),
      })),
      sampleRows: rows.slice(0, 20),
    };
    return JSON.stringify(summary, null, 2).slice(0, 40000);
  };

  const ask = async (preset?: string) => {
    const question = (preset ?? q).trim();
    if (!question || !rows.length) return;
    if (!preset) setQ("");
    setMsgs((m) => [...m, { role: "user", content: question }]);
    setLoading(true);
    try {
      const ctx = buildContext();
      const answer = await askAi(
        `You are analyzing a user's dataset. Here is a structured summary and a sample of the data (JSON):\n\n${ctx}\n\nUser question: ${question}\n\nAnswer clearly in plain language. When helpful, include a small markdown table. Point out data-quality issues (nulls, duplicates, outliers) when relevant. Do not invent numbers — if a full-dataset computation is beyond the sample provided, say so and give the best estimate from the summary.`,
        "You are an expert data analyst who explains findings clearly and concisely.",
      );
      setMsgs((m) => [...m, { role: "assistant", content: answer.trim() }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to analyze");
      setMsgs((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!rows.length) return;
    toast.info("Building report...");
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const insights =
        msgs.filter((m) => m.role === "assistant").slice(-3).map((m) => m.content).join("\n\n") ||
        (await askAi(
          `Data summary:\n${buildContext()}\n\nGive a concise executive summary with 5 key insights and 2 recommendations.`,
          "You are an expert data analyst.",
        ));

      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      let y = margin;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("Data Analysis Report", margin, y);
      y += 22;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text(`File: ${fileName}   •   Rows: ${rows.length}   •   Columns: ${columns.length}`, margin, y);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, y + 12);
      pdf.setTextColor(0);
      y += 32;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("Key Insights", margin, y);
      y += 16;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const lines = pdf.splitTextToSize(insights, pageW - margin * 2);
      lines.forEach((line: string) => {
        if (y > pageH - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += 13;
      });

      if (chartsRef.current) {
        const canvas = await html2canvas(chartsRef.current, {
          backgroundColor: "#0b0b0f",
          scale: 2,
        });
        const img = canvas.toDataURL("image/png");
        const imgW = pageW - margin * 2;
        const imgH = (canvas.height * imgW) / canvas.width;
        pdf.addPage();
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.text("Charts", margin, margin);
        pdf.addImage(img, "PNG", margin, margin + 12, imgW, Math.min(imgH, pageH - margin * 2 - 12));
      }

      pdf.save(`${fileName.replace(/\.[^.]+$/, "") || "report"}-analysis.pdf`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to build report");
    }
  };

  const preview = rows.slice(0, 20);

  return (
    <AiToolShell slug="data-analyzer">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT: upload + preview + chat */}
        <div className="grid gap-4">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`glass flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-6 transition-colors ${
              dragOver ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50"
            }`}
          >
            <Upload className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="text-sm font-medium">
                {parsing ? "Parsing..." : fileName || "Upload CSV or Excel — drag & drop or click"}
              </div>
              <div className="text-xs text-muted-foreground">.csv, .tsv, .xlsx, .xls</div>
            </div>
            <input
              type="file"
              accept=".csv,.tsv,.txt,.xlsx,.xls"
              className="hidden"
              onChange={onFile}
              disabled={parsing}
            />
          </label>

          {rows.length > 0 && (
            <div className="glass rounded-2xl border border-border/60 p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Preview — {preview.length} of {rows.length.toLocaleString()} rows, {columns.length} cols
                </span>
              </div>
              <div className="max-h-[240px] overflow-auto rounded-md border border-border/50">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-background">
                    <tr>
                      {columns.map((c) => (
                        <th key={c} className="whitespace-nowrap border-b border-border/50 px-2 py-1.5 text-left font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((r, i) => (
                      <tr key={i} className="odd:bg-muted/20">
                        {columns.map((c) => (
                          <td key={c} className="whitespace-nowrap border-b border-border/30 px-2 py-1 text-muted-foreground">
                            {r[c] === null || r[c] === undefined || r[c] === "" ? "—" : String(r[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {rows.length > 0 && (
            <div className="glass rounded-2xl border border-border/60 p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" /> Ask your data
              </div>
              <div className="mb-2 flex flex-wrap gap-1">
                {["Give me a summary", "Find errors or duplicates", "Top trends & outliers"].map((p) => (
                  <Button key={p} size="sm" variant="outline" onClick={() => ask(p)} disabled={loading}>
                    {p}
                  </Button>
                ))}
              </div>
              <div className="mb-3 max-h-[280px] space-y-2 overflow-auto">
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    className={`rounded-lg p-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-primary/10 text-foreground"
                        : "bg-muted/40 text-foreground/90"
                    }`}
                  >
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {m.role}
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm">{m.content}</pre>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. Which month had highest sales?"
                  onKeyDown={(e) => e.key === "Enter" && !loading && ask()}
                />
                <Button onClick={() => ask()} disabled={loading || !q.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: charts + download */}
        <div className="grid gap-4">
          {rows.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Auto-generated charts</div>
                <Button size="sm" variant="outline" onClick={downloadReport}>
                  <Download className="mr-1 h-4 w-4" /> PDF report
                </Button>
              </div>
              <div ref={chartsRef} className="grid gap-4">
                {charts.length === 0 && (
                  <div className="glass rounded-2xl border border-border/60 p-6 text-center text-sm text-muted-foreground">
                    Not enough structure detected for auto-charts. Ask a question on the left.
                  </div>
                )}
                {charts.map((c, i) => (
                  <div key={i} className="glass rounded-2xl border border-border/60 p-3">
                    <div className="mb-2 text-xs font-semibold text-muted-foreground">{c.title}</div>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {c.kind === "bar" ? (
                          <BarChart data={c.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                            <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            <Bar dataKey="value" fill={PALETTE[i % PALETTE.length]} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        ) : c.kind === "line" ? (
                          <LineChart data={c.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                            <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            <Line type="monotone" dataKey="value" stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false} />
                          </LineChart>
                        ) : (
                          <PieChart>
                            <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Pie data={c.data} dataKey="value" nameKey="name" outerRadius={70} label>
                              {c.data.map((_, idx) => (
                                <Cell key={idx} fill={PALETTE[idx % PALETTE.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="glass rounded-2xl border border-border/60 p-8 text-center text-sm text-muted-foreground">
              Upload a CSV or Excel file to see auto-generated charts and chat with your data.
            </div>
          )}
        </div>
      </div>
    </AiToolShell>
  );
}
