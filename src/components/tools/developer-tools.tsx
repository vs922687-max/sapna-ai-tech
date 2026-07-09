import { useMemo, useState } from "react";
import { ActionBar, Field, copyText, downloadText, inputCls, textareaCls } from "./ui-primitives";

const I = inputCls();
const T = textareaCls();

export function JsonFormatter() {
  const [t, setT] = useState('{"hello":"world","n":[1,2,3]}');
  const [indent, setIndent] = useState(2);
  const [err, setErr] = useState("");
  const out = useMemo(() => {
    try { const p = JSON.parse(t); setErr(""); return JSON.stringify(p, null, indent); }
    catch (e) { setErr((e as Error).message); return ""; }
  }, [t, indent]);
  return (
    <div>
      <Field label="Indent">
        <select className={I} value={indent} onChange={(e) => setIndent(+e.target.value)}>
          <option value={2}>2 spaces</option><option value={4}>4 spaces</option><option value={0}>Minified</option>
        </select>
      </Field>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      {err && <p className="mt-2 text-sm text-destructive">✗ {err}</p>}
      <ActionBar onCopy={() => copyText(out)} onDownload={() => downloadText("formatted.json", out, "application/json")} />
    </div>
  );
}

export function JsonValidator() {
  const [t, setT] = useState("");
  const result = useMemo(() => {
    if (!t.trim()) return null;
    try { JSON.parse(t); return { ok: true, msg: "Valid JSON" }; }
    catch (e) { return { ok: false, msg: (e as Error).message }; }
  }, [t]);
  return (
    <div>
      <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} placeholder="Paste JSON here…" />
      {result && <div className={`mt-3 rounded-lg border p-3 text-sm ${result.ok ? "border-[oklch(0.66_0.16_155)]/40 bg-[oklch(0.66_0.16_155)]/10 text-[oklch(0.72_0.16_155)]" : "border-destructive/40 bg-destructive/10 text-destructive"}`}>
        {result.ok ? "✓ " : "✗ "}{result.msg}
      </div>}
    </div>
  );
}

function TreeNode({ k, v, depth = 0 }: { k: string; v: unknown; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = v && typeof v === "object";
  if (!isObj) return <div className="ml-4 text-sm font-mono"><span className="text-primary">{k}:</span> <span className="text-muted-foreground">{JSON.stringify(v)}</span></div>;
  const entries = Array.isArray(v) ? v.map((x, i) => [i, x] as [string | number, unknown]) : Object.entries(v as object);
  return (
    <div className="ml-4 font-mono text-sm">
      <button onClick={() => setOpen(!open)} className="text-primary hover:underline">{open ? "▾" : "▸"} {k} <span className="text-muted-foreground">({entries.length})</span></button>
      {open && <div>{entries.map(([kk, vv]) => <TreeNode key={String(kk)} k={String(kk)} v={vv} depth={depth + 1} />)}</div>}
    </div>
  );
}

export function JsonViewer() {
  const [t, setT] = useState('{"user":{"name":"Priya","age":24,"skills":["React","AI"]}}');
  const [err, setErr] = useState(""); const [data, setData] = useState<unknown>(null);
  useMemo(() => { try { setData(JSON.parse(t)); setErr(""); } catch (e) { setErr((e as Error).message); setData(null); } }, [t]);
  return (
    <div>
      <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} />
      {err && <p className="mt-2 text-sm text-destructive">✗ {err}</p>}
      {data !== null && <div className="mt-3 max-h-[400px] overflow-auto rounded-lg border border-border/60 bg-background/40 p-3"><TreeNode k="root" v={data} /></div>}
    </div>
  );
}

export function HtmlFormatter() {
  const [t, setT] = useState('<div><p>Hello</p><span>World</span></div>');
  const out = useMemo(() => {
    let indent = 0; const lines: string[] = [];
    const tokens = t.replace(/>\s*</g, "><").replace(/></g, ">\n<").split("\n");
    for (const line of tokens) {
      const trimmed = line.trim(); if (!trimmed) continue;
      if (trimmed.startsWith("</")) indent = Math.max(0, indent - 1);
      lines.push("  ".repeat(indent) + trimmed);
      if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && !/<(br|hr|img|input|meta|link)\b/.test(trimmed) && trimmed.includes("</") === false && trimmed.endsWith(">")) indent++;
    }
    return lines.join("\n");
  }, [t]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}

function Minifier({ label }: { label: "CSS" | "JS" }) {
  const [t, setT] = useState("");
  const out = useMemo(() => {
    if (label === "CSS") return t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{}:;,])\s*/g, "$1").replace(/\s+/g, " ").trim();
    return t.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s*([{};,()=+*\-<>!])\s*/g, "$1").replace(/\s+/g, " ").trim();
  }, [t, label]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} placeholder={`Paste ${label} code…`} value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">Original: {t.length} • Minified: {out.length} • Savings: {t.length ? Math.round((1 - out.length / t.length) * 100) : 0}%</div>
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}
export const CssMinifier = () => <Minifier label="CSS" />;
export const JsMinifier = () => <Minifier label="JS" />;

export function SqlFormatter() {
  const [t, setT] = useState("select id,name from users where active=1 order by id");
  const out = useMemo(() => {
    const kws = ["SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "HAVING", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "JOIN", "ON", "LIMIT", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM"];
    let s = t.replace(/\s+/g, " ").trim();
    kws.forEach((k) => { s = s.replace(new RegExp(`\\b${k}\\b`, "gi"), "\n" + k); });
    return s.replace(/^\n/, "").replace(/,\s*/g, ",\n  ");
  }, [t]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}

export function XmlFormatter() {
  const [t, setT] = useState('<root><item id="1">a</item><item id="2">b</item></root>');
  const out = useMemo(() => {
    let indent = 0; const lines: string[] = [];
    const s = t.replace(/>\s*</g, ">\n<");
    for (const line of s.split("\n")) {
      const trimmed = line.trim(); if (!trimmed) continue;
      if (trimmed.startsWith("</")) indent = Math.max(0, indent - 1);
      lines.push("  ".repeat(indent) + trimmed);
      if (/^<[^!?/][^>]*[^/]>$/.test(trimmed) && !/<\/.+>/.test(trimmed)) indent++;
    }
    return lines.join("\n");
  }, [t]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} />
        <textarea className={T} readOnly value={out} />
      </div>
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}

function EncoderDecoder({ mode, algo }: { mode: "encode" | "decode"; algo: "url" | "base64" }) {
  const [t, setT] = useState("");
  const [err, setErr] = useState("");
  const out = useMemo(() => {
    try {
      setErr("");
      if (algo === "url") return mode === "encode" ? encodeURIComponent(t) : decodeURIComponent(t);
      if (mode === "encode") return btoa(unescape(encodeURIComponent(t)));
      return decodeURIComponent(escape(atob(t)));
    } catch (e) { setErr((e as Error).message); return ""; }
  }, [t, mode, algo]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} placeholder={`Text to ${mode}…`} />
        <textarea className={T} readOnly value={out} />
      </div>
      {err && <p className="mt-2 text-sm text-destructive">✗ {err}</p>}
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}
export const UrlEncoder = () => <EncoderDecoder mode="encode" algo="url" />;
export const UrlDecoder = () => <EncoderDecoder mode="decode" algo="url" />;
export const Base64Encoder = () => <EncoderDecoder mode="encode" algo="base64" />;
export const Base64Decoder = () => <EncoderDecoder mode="decode" algo="base64" />;

export function UuidGenerator() {
  const [n, setN] = useState(10);
  const [list, setList] = useState<string[]>([]);
  const gen = () => setList(Array.from({ length: n }, () => crypto.randomUUID()));
  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Count"><input type="number" min={1} max={500} className={I} value={n} onChange={(e) => setN(+e.target.value || 1)} /></Field>
        <button onClick={gen} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow">Generate</button>
      </div>
      <textarea className={`${T} mt-3`} readOnly value={list.join("\n")} />
      <ActionBar onCopy={() => copyText(list.join("\n"))} />
    </div>
  );
}

// MD5 pure-JS implementation
function md5(s: string): string {
  function rh(n: number) { const s = "0123456789abcdef"; let j = ""; for (let i = 0; i <= 3; i++) j += s.charAt((n >> (i * 8 + 4)) & 15) + s.charAt((n >> (i * 8)) & 15); return j; }
  function ad(x: number, y: number) { const l = (x & 0xFFFF) + (y & 0xFFFF); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xFFFF); }
  function rl(n: number, c: number) { return (n << c) | (n >>> (32 - c)); }
  function cm(q: number, a: number, b: number, x: number, s: number, t: number) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b); }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(c ^ (b | ~d), a, b, x, s, t); }
  function sb(str: string) {
    const n = ((str.length + 8) >> 6) + 1; const b = new Array(n * 16).fill(0);
    for (let i = 0; i < str.length; i++) b[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    b[str.length >> 2] |= 0x80 << ((str.length % 4) * 8); b[n * 16 - 2] = str.length * 8; return b;
  }
  const x = sb(unescape(encodeURIComponent(s)));
  let a = 1732584193, bb = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const oa = a, ob = bb, oc = c, od = d;
    a = ff(a, bb, c, d, x[i], 7, -680876936); d = ff(d, a, bb, c, x[i + 1], 12, -389564586); c = ff(c, d, a, bb, x[i + 2], 17, 606105819); bb = ff(bb, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, bb, c, d, x[i + 4], 7, -176418897); d = ff(d, a, bb, c, x[i + 5], 12, 1200080426); c = ff(c, d, a, bb, x[i + 6], 17, -1473231341); bb = ff(bb, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, bb, c, d, x[i + 8], 7, 1770035416); d = ff(d, a, bb, c, x[i + 9], 12, -1958414417); c = ff(c, d, a, bb, x[i + 10], 17, -42063); bb = ff(bb, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, bb, c, d, x[i + 12], 7, 1804603682); d = ff(d, a, bb, c, x[i + 13], 12, -40341101); c = ff(c, d, a, bb, x[i + 14], 17, -1502002290); bb = ff(bb, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, bb, c, d, x[i + 1], 5, -165796510); d = gg(d, a, bb, c, x[i + 6], 9, -1069501632); c = gg(c, d, a, bb, x[i + 11], 14, 643717713); bb = gg(bb, c, d, a, x[i], 20, -373897302);
    a = gg(a, bb, c, d, x[i + 5], 5, -701558691); d = gg(d, a, bb, c, x[i + 10], 9, 38016083); c = gg(c, d, a, bb, x[i + 15], 14, -660478335); bb = gg(bb, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, bb, c, d, x[i + 9], 5, 568446438); d = gg(d, a, bb, c, x[i + 14], 9, -1019803690); c = gg(c, d, a, bb, x[i + 3], 14, -187363961); bb = gg(bb, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, bb, c, d, x[i + 13], 5, -1444681467); d = gg(d, a, bb, c, x[i + 2], 9, -51403784); c = gg(c, d, a, bb, x[i + 7], 14, 1735328473); bb = gg(bb, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, bb, c, d, x[i + 5], 4, -378558); d = hh(d, a, bb, c, x[i + 8], 11, -2022574463); c = hh(c, d, a, bb, x[i + 11], 16, 1839030562); bb = hh(bb, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, bb, c, d, x[i + 1], 4, -1530992060); d = hh(d, a, bb, c, x[i + 4], 11, 1272893353); c = hh(c, d, a, bb, x[i + 7], 16, -155497632); bb = hh(bb, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, bb, c, d, x[i + 13], 4, 681279174); d = hh(d, a, bb, c, x[i], 11, -358537222); c = hh(c, d, a, bb, x[i + 3], 16, -722521979); bb = hh(bb, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, bb, c, d, x[i + 9], 4, -640364487); d = hh(d, a, bb, c, x[i + 12], 11, -421815835); c = hh(c, d, a, bb, x[i + 15], 16, 530742520); bb = hh(bb, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, bb, c, d, x[i], 6, -198630844); d = ii(d, a, bb, c, x[i + 7], 10, 1126891415); c = ii(c, d, a, bb, x[i + 14], 15, -1416354905); bb = ii(bb, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, bb, c, d, x[i + 12], 6, 1700485571); d = ii(d, a, bb, c, x[i + 3], 10, -1894986606); c = ii(c, d, a, bb, x[i + 10], 15, -1051523); bb = ii(bb, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, bb, c, d, x[i + 8], 6, 1873313359); d = ii(d, a, bb, c, x[i + 15], 10, -30611744); c = ii(c, d, a, bb, x[i + 6], 15, -1560198380); bb = ii(bb, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, bb, c, d, x[i + 4], 6, -145523070); d = ii(d, a, bb, c, x[i + 11], 10, -1120210379); c = ii(c, d, a, bb, x[i + 2], 15, 718787259); bb = ii(bb, c, d, a, x[i + 9], 21, -343485551);
    a = ad(a, oa); bb = ad(bb, ob); c = ad(c, oc); d = ad(d, od);
  }
  return rh(a) + rh(bb) + rh(c) + rh(d);
}

export function Md5Generator() {
  const [t, setT] = useState("");
  const out = t ? md5(t) : "";
  return (
    <div>
      <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} placeholder="Text to hash…" />
      <div className="mt-3 break-all rounded-lg border border-border/60 bg-background/40 p-3 font-mono text-sm">{out || "—"}</div>
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}

export function Sha256Generator() {
  const [t, setT] = useState("");
  const [out, setOut] = useState("");
  useMemo(() => {
    if (!t) { setOut(""); return; }
    const enc = new TextEncoder().encode(t);
    crypto.subtle.digest("SHA-256", enc).then((buf) => {
      const arr = Array.from(new Uint8Array(buf));
      setOut(arr.map((b) => b.toString(16).padStart(2, "0")).join(""));
    });
  }, [t]);
  return (
    <div>
      <textarea className={T} value={t} onChange={(e) => setT(e.target.value)} placeholder="Text to hash…" />
      <div className="mt-3 break-all rounded-lg border border-border/60 bg-background/40 p-3 font-mono text-sm">{out || "—"}</div>
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}
