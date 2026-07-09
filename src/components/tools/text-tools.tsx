import { useMemo, useState } from "react";
import { ActionBar, Field, Stat, copyText, downloadText, inputCls, textareaCls } from "./ui-primitives";

const T = textareaCls();
const I = inputCls();

export function WordCounter() {
  const [t, setT] = useState("");
  const stats = useMemo(() => {
    const trim = t.trim();
    const words = trim ? trim.split(/\s+/).length : 0;
    const chars = t.length;
    const noSpace = t.replace(/\s/g, "").length;
    const sentences = trim ? (trim.match(/[.!?]+(?=\s|$)/g)?.length || 1) : 0;
    const paragraphs = trim ? trim.split(/\n{2,}/).filter(Boolean).length : 0;
    const readingMin = Math.max(1, Math.round(words / 200));
    return { words, chars, noSpace, sentences, paragraphs, readingMin };
  }, [t]);
  return (
    <div>
      <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} placeholder="Type or paste text here…" />
      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="No spaces" value={stats.noSpace} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading min" value={stats.readingMin} />
      </div>
      <ActionBar onCopy={() => copyText(t)} onReset={() => setT("")} />
    </div>
  );
}

export function CharacterCounter() {
  const [t, setT] = useState("");
  const chars = t.length; const noSpace = t.replace(/\s/g, "").length;
  const letters = (t.match(/\p{L}/gu) || []).length;
  const digits = (t.match(/\d/g) || []).length;
  return (
    <div>
      <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} placeholder="Type text…" />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Chars" value={chars} />
        <Stat label="No spaces" value={noSpace} />
        <Stat label="Letters" value={letters} />
        <Stat label="Digits" value={digits} />
      </div>
      <ActionBar onCopy={() => copyText(t)} onReset={() => setT("")} />
    </div>
  );
}

export function CaseConverter() {
  const [t, setT] = useState("");
  const transforms = {
    UPPER: t.toUpperCase(),
    lower: t.toLowerCase(),
    Title: t.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
    Sentence: t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    camelCase: t.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toLowerCase()),
    snake_case: t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
    "kebab-case": t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  } as const;
  return (
    <div>
      <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} placeholder="Type text…" />
      <div className="mt-4 space-y-2">
        {Object.entries(transforms).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 p-3">
            <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wider text-primary">{k}</span>
            <span className="flex-1 truncate font-mono text-sm">{v || "—"}</span>
            <button className="text-xs text-primary hover:underline" onClick={() => copyText(v)}>Copy</button>
          </div>
        ))}
      </div>
      <ActionBar onReset={() => setT("")} />
    </div>
  );
}

export function RemoveDuplicateLines() {
  const [t, setT] = useState("");
  const [ci, setCi] = useState(false);
  const [trim, setTrim] = useState(true);
  const out = useMemo(() => {
    const seen = new Set<string>(); const res: string[] = [];
    for (const raw of t.split("\n")) {
      const line = trim ? raw.trim() : raw;
      const key = ci ? line.toLowerCase() : line;
      if (!seen.has(key)) { seen.add(key); res.push(raw); }
    }
    return res.join("\n");
  }, [t, ci, trim]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} placeholder="Input lines…" value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <div className="mt-3 flex gap-4 text-xs">
        <label className="flex items-center gap-2"><input type="checkbox" checked={ci} onChange={(e) => setCi(e.target.checked)} /> Case insensitive</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={trim} onChange={(e) => setTrim(e.target.checked)} /> Trim whitespace</label>
      </div>
      <ActionBar onCopy={() => copyText(out)} onReset={() => setT("")} onDownload={() => downloadText("deduped.txt", out)} />
    </div>
  );
}

export function RemoveEmptyLines() {
  const [t, setT] = useState("");
  const out = useMemo(() => t.split("\n").filter((l) => l.trim() !== "").join("\n"), [t]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} placeholder="Input…" value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <ActionBar onCopy={() => copyText(out)} onReset={() => setT("")} onDownload={() => downloadText("cleaned.txt", out)} />
    </div>
  );
}

export function RemoveExtraSpaces() {
  const [t, setT] = useState("");
  const out = useMemo(() => t.replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim(), [t]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} placeholder="Input…" value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <ActionBar onCopy={() => copyText(out)} onReset={() => setT("")} />
    </div>
  );
}

export function ReverseText() {
  const [t, setT] = useState("");
  const [mode, setMode] = useState<"chars" | "words" | "lines">("chars");
  const out = useMemo(() => {
    if (mode === "chars") return [...t].reverse().join("");
    if (mode === "words") return t.split(/\s+/).reverse().join(" ");
    return t.split("\n").reverse().join("\n");
  }, [t, mode]);
  return (
    <div>
      <Field label="Mode">
        <select className={I} value={mode} onChange={(e) => setMode(e.target.value as never)}>
          <option value="chars">Reverse characters</option>
          <option value="words">Reverse words</option>
          <option value="lines">Reverse lines</option>
        </select>
      </Field>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <textarea className={T} placeholder="Input…" value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <ActionBar onCopy={() => copyText(out)} onReset={() => setT("")} />
    </div>
  );
}

export function SortText() {
  const [t, setT] = useState("");
  const [dir, setDir] = useState<"asc" | "desc" | "len">("asc");
  const out = useMemo(() => {
    const lines = t.split("\n");
    const sorted = [...lines].sort((a, b) => dir === "len" ? a.length - b.length : a.localeCompare(b));
    if (dir === "desc") sorted.reverse();
    return sorted.join("\n");
  }, [t, dir]);
  return (
    <div>
      <Field label="Order">
        <select className={I} value={dir} onChange={(e) => setDir(e.target.value as never)}>
          <option value="asc">Alphabetical A → Z</option>
          <option value="desc">Alphabetical Z → A</option>
          <option value="len">By length</option>
        </select>
      </Field>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <textarea className={T} placeholder="Input lines…" value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <ActionBar onCopy={() => copyText(out)} onReset={() => setT("")} />
    </div>
  );
}

export function TextCompare() {
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const diff = useMemo(() => {
    const la = a.split("\n"); const lb = b.split("\n");
    const max = Math.max(la.length, lb.length);
    const rows: { l: string; r: string; same: boolean }[] = [];
    for (let i = 0; i < max; i++) rows.push({ l: la[i] ?? "", r: lb[i] ?? "", same: la[i] === lb[i] });
    return rows;
  }, [a, b]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} placeholder="Text A" value={a} onChange={(e) => setA(e.target.value)} />
        <textarea className={T} placeholder="Text B" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      <div className="mt-4 max-h-[400px] overflow-auto rounded-lg border border-border/60 bg-background/40 font-mono text-xs">
        {diff.map((row, i) => (
          <div key={i} className={`grid grid-cols-2 gap-2 border-b border-border/40 px-3 py-1 last:border-0 ${row.same ? "" : "bg-primary/10"}`}>
            <span className="truncate">{row.l || "\u00A0"}</span>
            <span className="truncate">{row.r || "\u00A0"}</span>
          </div>
        ))}
      </div>
      <ActionBar onReset={() => { setA(""); setB(""); }} />
    </div>
  );
}

export function LoremIpsum() {
  const [n, setN] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const source = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat".split(" ");
  const rand = (max: number) => Math.floor(Math.random() * max);
  const words = (k: number) => Array.from({ length: k }, () => source[rand(source.length)]).join(" ");
  const sentence = () => { const s = words(6 + rand(10)); return s[0].toUpperCase() + s.slice(1) + "."; };
  const paragraph = () => Array.from({ length: 4 + rand(4) }, sentence).join(" ");
  const out = useMemo(() => {
    if (unit === "words") return words(n);
    if (unit === "sentences") return Array.from({ length: n }, sentence).join(" ");
    return Array.from({ length: n }, paragraph).join("\n\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, unit]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Count"><input type="number" min={1} max={100} value={n} onChange={(e) => setN(+e.target.value || 1)} className={I} /></Field>
        <Field label="Unit">
          <select value={unit} onChange={(e) => setUnit(e.target.value as never)} className={I}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </Field>
      </div>
      <textarea className={`${T} mt-3`} readOnly value={out} />
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}
