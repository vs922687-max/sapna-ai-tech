import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { toast } from "sonner";
import { ActionBar, Field, Stat, copyText, downloadBlob, inputCls, textareaCls } from "./ui-primitives";
import { Button } from "@/components/ui/button";

const I = inputCls();
const T = textareaCls();

export function QrCodeGenerator() {
  const [text, setText] = useState("https://sapna-ai-tech.lovable.app");
  const [size, setSize] = useState(300);
  const [dark, setDark] = useState("#000000");
  const [light, setLight] = useState("#ffffff");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!text) { setUrl(""); return; }
    QRCode.toDataURL(text, { width: size, color: { dark, light }, margin: 2 }).then(setUrl).catch(() => setUrl(""));
  }, [text, size, dark, light]);
  const download = async () => {
    if (!url) return;
    const blob = await (await fetch(url)).blob();
    downloadBlob("qrcode.png", blob);
  };
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Content"><textarea className={T} value={text} onChange={(e) => setText(e.target.value)} /></Field>
        <div className="space-y-3">
          <Field label="Size (px)"><input type="number" className={I} min={100} max={1000} value={size} onChange={(e) => setSize(+e.target.value || 300)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dark"><input type="color" value={dark} onChange={(e) => setDark(e.target.value)} className="h-10 w-full rounded" /></Field>
            <Field label="Light"><input type="color" value={light} onChange={(e) => setLight(e.target.value)} className="h-10 w-full rounded" /></Field>
          </div>
        </div>
      </div>
      {url && <div className="mt-4 flex flex-col items-center gap-3">
        <img src={url} alt="QR" className="rounded-lg border border-border/60" style={{ maxWidth: size, width: "100%" }} />
        <Button size="sm" onClick={download}>Download PNG</Button>
      </div>}
    </div>
  );
}

export function BarcodeGenerator() {
  const [text, setText] = useState("BHARATAI2026");
  const [format, setFormat] = useState("CODE128");
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;
    try { JsBarcode(svgRef.current, text, { format, displayValue: true, background: "#ffffff" }); }
    catch { /* invalid input for this format */ }
  }, [text, format]);
  const dl = (type: "svg" | "png") => {
    if (!svgRef.current) return;
    if (type === "svg") {
      const s = new XMLSerializer().serializeToString(svgRef.current);
      downloadBlob("barcode.svg", new Blob([s], { type: "image/svg+xml" }));
    } else {
      const s = new XMLSerializer().serializeToString(svgRef.current);
      const img = new Image(); const bb = svgRef.current.getBoundingClientRect();
      img.onload = () => {
        const c = document.createElement("canvas"); c.width = bb.width; c.height = bb.height;
        c.getContext("2d")!.drawImage(img, 0, 0);
        c.toBlob((b) => b && downloadBlob("barcode.png", b));
      };
      img.src = "data:image/svg+xml;base64," + btoa(s);
    }
  };
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Text / number"><input className={I} value={text} onChange={(e) => setText(e.target.value)} /></Field>
        <Field label="Format">
          <select className={I} value={format} onChange={(e) => setFormat(e.target.value)}>
            {["CODE128", "CODE39", "EAN13", "EAN8", "UPC", "ITF14", "MSI", "pharmacode"].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
      </div>
      <div className="mt-4 flex flex-col items-center gap-3 rounded-lg bg-white p-4">
        <svg ref={svgRef} />
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => dl("svg")}>Download SVG</Button>
        <Button size="sm" variant="outline" onClick={() => dl("png")}>Download PNG</Button>
      </div>
    </div>
  );
}

export function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [up, setUp] = useState(true); const [lo, setLo] = useState(true);
  const [nu, setNu] = useState(true); const [sy, setSy] = useState(true);
  const [pw, setPw] = useState("");
  const gen = () => {
    const sets: string[] = [];
    if (up) sets.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
    if (lo) sets.push("abcdefghijkmnopqrstuvwxyz");
    if (nu) sets.push("23456789");
    if (sy) sets.push("!@#$%^&*_-+=?");
    const all = sets.join(""); if (!all) return;
    const arr = new Uint32Array(len); crypto.getRandomValues(arr);
    setPw(Array.from(arr, (v) => all[v % all.length]).join(""));
  };
  useEffect(gen, [len, up, lo, nu, sy]); // eslint-disable-line
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label={`Length: ${len}`}><input type="range" min={6} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full" /></Field>
        <div className="flex flex-wrap gap-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={up} onChange={(e) => setUp(e.target.checked)} /> A-Z</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={lo} onChange={(e) => setLo(e.target.checked)} /> a-z</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={nu} onChange={(e) => setNu(e.target.checked)} /> 0-9</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={sy} onChange={(e) => setSy(e.target.checked)} /> Symbols</label>
        </div>
      </div>
      <div className="mt-4 break-all rounded-lg border border-border/60 bg-background/40 p-4 font-mono text-lg tracking-wider">{pw}</div>
      <ActionBar onCopy={() => copyText(pw)} extra={<Button size="sm" onClick={gen}>Regenerate</Button>} />
    </div>
  );
}

export function PasswordStrength() {
  const [pw, setPw] = useState("");
  const score = useMemo(() => {
    let s = 0; if (pw.length >= 8) s++; if (pw.length >= 12) s++; if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++; if (/\d/.test(pw)) s++; if (/[^\w\s]/.test(pw)) s++;
    return s;
  }, [pw]);
  const label = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong", "Excellent"][score];
  const colors = ["bg-destructive", "bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600", "bg-emerald-500"];
  return (
    <div>
      <Field label="Password"><input type="text" className={I} value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full transition-all ${colors[score]}`} style={{ width: `${(score / 6) * 100}%` }} />
      </div>
      <p className="mt-2 text-sm">{pw ? label : "—"}</p>
      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
        <li>{pw.length >= 12 ? "✓" : "✗"} At least 12 characters</li>
        <li>{/[A-Z]/.test(pw) ? "✓" : "✗"} Uppercase letter</li>
        <li>{/[a-z]/.test(pw) ? "✓" : "✗"} Lowercase letter</li>
        <li>{/\d/.test(pw) ? "✓" : "✗"} Number</li>
        <li>{/[^\w\s]/.test(pw) ? "✓" : "✗"} Special character</li>
      </ul>
    </div>
  );
}

export function RandomNumber() {
  const [min, setMin] = useState(1); const [max, setMax] = useState(100); const [n, setN] = useState(1);
  const [out, setOut] = useState<number[]>([]);
  const gen = () => {
    const lo = Math.min(min, max), hi = Math.max(min, max);
    setOut(Array.from({ length: n }, () => Math.floor(Math.random() * (hi - lo + 1)) + lo));
  };
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Min"><input type="number" className={I} value={min} onChange={(e) => setMin(+e.target.value)} /></Field>
        <Field label="Max"><input type="number" className={I} value={max} onChange={(e) => setMax(+e.target.value)} /></Field>
        <Field label="Count"><input type="number" className={I} value={n} onChange={(e) => setN(+e.target.value)} /></Field>
      </div>
      <Button className="mt-3" onClick={gen}>Generate</Button>
      <div className="mt-3 min-h-[60px] rounded-lg border border-border/60 bg-background/40 p-3 font-mono text-sm">{out.join(", ") || "—"}</div>
      <ActionBar onCopy={() => copyText(out.join(", "))} />
    </div>
  );
}

export function ColorPicker() {
  const [c, setC] = useState("#f97316");
  const rgb = useMemo(() => { const n = parseInt(c.slice(1), 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }; }, [c]);
  const hsl = useMemo(() => {
    const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }, [rgb]);
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  return (
    <div>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <input type="color" value={c} onChange={(e) => setC(e.target.value)} className="h-32 w-32 cursor-pointer rounded-2xl border-4 border-border" />
        <div className="w-full space-y-2">
          {[["HEX", c.toUpperCase()], ["RGB", rgbStr], ["HSL", hslStr]].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/40 p-3">
              <span className="w-14 shrink-0 text-xs font-semibold uppercase tracking-wider text-primary">{k}</span>
              <span className="flex-1 truncate font-mono text-sm">{v}</span>
              <button className="text-xs text-primary hover:underline" onClick={() => copyText(v)}>Copy</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HexToRgb() {
  const [hex, setHex] = useState("#3b82f6");
  const clean = hex.replace("#", "");
  const ok = /^[0-9a-fA-F]{6}$/.test(clean);
  const n = ok ? parseInt(clean, 16) : 0;
  const rgb = `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
  return (
    <div>
      <Field label="HEX"><input className={I} value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#3b82f6" /></Field>
      <div className="mt-3 rounded-lg border border-border/60 bg-background/40 p-4">
        <div className="h-16 rounded-lg" style={{ background: ok ? hex : "transparent" }} />
        <p className="mt-3 font-mono text-sm">{ok ? rgb : "Invalid HEX"}</p>
      </div>
      <ActionBar onCopy={() => copyText(rgb)} />
    </div>
  );
}

export function RgbToHex() {
  const [r, setR] = useState(59); const [g, setG] = useState(130); const [b, setB] = useState(246);
  const hex = "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="R"><input type="number" min={0} max={255} className={I} value={r} onChange={(e) => setR(+e.target.value)} /></Field>
        <Field label="G"><input type="number" min={0} max={255} className={I} value={g} onChange={(e) => setG(+e.target.value)} /></Field>
        <Field label="B"><input type="number" min={0} max={255} className={I} value={b} onChange={(e) => setB(+e.target.value)} /></Field>
      </div>
      <div className="mt-3 rounded-lg border border-border/60 p-4">
        <div className="h-16 rounded-lg" style={{ background: hex }} />
        <p className="mt-3 font-mono text-sm">{hex.toUpperCase()}</p>
      </div>
      <ActionBar onCopy={() => copyText(hex)} />
    </div>
  );
}

export function DigitalClock() {
  const [now, setNow] = useState(new Date());
  const [h24, setH24] = useState(true);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="text-center">
      <div className="font-display text-7xl font-bold text-gradient-tricolor sm:text-8xl">{now.toLocaleTimeString("en-IN", { hour12: !h24 })}</div>
      <div className="mt-2 text-muted-foreground">{now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
      <label className="mt-4 inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={h24} onChange={(e) => setH24(e.target.checked)} /> 24-hour format</label>
    </div>
  );
}

export function CountdownTimer() {
  const [target, setTarget] = useState(60);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((v) => { if (v <= 1) { setRunning(false); toast.success("Time's up!"); return 0; } return v - 1; }), 1000);
    return () => clearInterval(t);
  }, [running]);
  const fmt = (s: number) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div>
      <Field label="Duration (seconds)"><input type="number" className={I} value={target} onChange={(e) => setTarget(+e.target.value)} /></Field>
      <div className="mt-4 text-center font-display text-6xl font-bold text-primary">{fmt(left || target)}</div>
      <div className="mt-4 flex justify-center gap-2">
        <Button onClick={() => { setLeft(target); setRunning(true); }}>Start</Button>
        <Button variant="outline" onClick={() => setRunning(false)}>Pause</Button>
        <Button variant="ghost" onClick={() => { setRunning(false); setLeft(0); }}>Reset</Button>
      </div>
    </div>
  );
}

export function Stopwatch() {
  const [ms, setMs] = useState(0); const [run, setRun] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  useEffect(() => { if (!run) return; const start = Date.now() - ms; const t = setInterval(() => setMs(Date.now() - start), 10); return () => clearInterval(t); }, [run]); // eslint-disable-line
  const fmt = (m: number) => `${String(Math.floor(m / 60000)).padStart(2, "0")}:${String(Math.floor((m % 60000) / 1000)).padStart(2, "0")}.${String(Math.floor((m % 1000) / 10)).padStart(2, "0")}`;
  return (
    <div>
      <div className="text-center font-display text-6xl font-bold text-primary">{fmt(ms)}</div>
      <div className="mt-4 flex justify-center gap-2">
        <Button onClick={() => setRun(!run)}>{run ? "Pause" : "Start"}</Button>
        <Button variant="outline" onClick={() => setLaps([ms, ...laps])} disabled={!run}>Lap</Button>
        <Button variant="ghost" onClick={() => { setRun(false); setMs(0); setLaps([]); }}>Reset</Button>
      </div>
      {laps.length > 0 && <ul className="mt-4 space-y-1 font-mono text-sm">
        {laps.map((l, i) => <li key={i} className="flex justify-between rounded border border-border/40 px-3 py-1"><span>Lap {laps.length - i}</span><span>{fmt(l)}</span></li>)}
      </ul>}
    </div>
  );
}

export function CalendarTool() {
  const [d, setD] = useState(new Date());
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const startDay = first.getDay();
  const today = new Date();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button size="sm" variant="outline" onClick={() => setD(new Date(d.getFullYear(), d.getMonth() - 1, 1))}>◂</Button>
        <div className="font-display text-lg font-bold">{d.toLocaleString("en-IN", { month: "long", year: "numeric" })}</div>
        <Button size="sm" variant="outline" onClick={() => setD(new Date(d.getFullYear(), d.getMonth() + 1, 1))}>▸</Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((x) => <div key={x} className="p-2 font-semibold text-muted-foreground">{x}</div>)}
        {Array.from({ length: startDay }, (_, i) => <div key={"e" + i} />)}
        {Array.from({ length: days }, (_, i) => {
          const dayN = i + 1;
          const isToday = today.getFullYear() === d.getFullYear() && today.getMonth() === d.getMonth() && today.getDate() === dayN;
          return <div key={dayN} className={`rounded-lg p-2 text-sm ${isToday ? "bg-primary text-primary-foreground font-bold" : "hover:bg-muted/50"}`}>{dayN}</div>;
        })}
      </div>
    </div>
  );
}

export function Notepad() {
  const [t, setT] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("bas_notepad") || "" : ""));
  useEffect(() => { localStorage.setItem("bas_notepad", t); }, [t]);
  return (
    <div>
      <textarea className={`${T} min-h-[400px]`} value={t} onChange={(e) => setT(e.target.value)} placeholder="Write anything — auto-saves in your browser…" />
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{t.length} characters — saved locally</span>
        <Button size="sm" variant="ghost" onClick={() => { setT(""); toast.success("Cleared"); }}>Clear</Button>
      </div>
      <ActionBar onCopy={() => copyText(t)} />
    </div>
  );
}

export function ClipboardTool() {
  const [t, setT] = useState("");
  return (
    <div>
      <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} placeholder="Paste or type text…" />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => copyText(t)}>Copy to clipboard</Button>
        <Button size="sm" variant="outline" onClick={async () => { try { setT(await navigator.clipboard.readText()); toast.success("Pasted"); } catch { toast.error("Paste blocked by browser"); } }}>Paste from clipboard</Button>
        <Button size="sm" variant="ghost" onClick={() => setT("")}>Clear</Button>
      </div>
      <Stat label="Length" value={t.length} />
    </div>
  );
}
