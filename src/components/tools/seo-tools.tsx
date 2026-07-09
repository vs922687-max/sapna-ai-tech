import { useMemo, useState } from "react";
import { ActionBar, Field, copyText, downloadText, inputCls, textareaCls } from "./ui-primitives";

const I = inputCls();
const T = textareaCls();

export function MetaTagGenerator() {
  const [title, setTitle] = useState("Bharat AI Sathi");
  const [desc, setDesc] = useState("India's AI suite");
  const [kw, setKw] = useState("ai, india, chat");
  const [author, setAuthor] = useState("");
  const out = `<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="keywords" content="${kw}" />
${author ? `<meta name="author" content="${author}" />\n` : ""}<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${desc}" />`;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title"><input className={I} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="Author (optional)"><input className={I} value={author} onChange={(e) => setAuthor(e.target.value)} /></Field>
        <Field label="Description"><input className={I} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
        <Field label="Keywords (comma-separated)"><input className={I} value={kw} onChange={(e) => setKw(e.target.value)} /></Field>
      </div>
      <textarea readOnly className={`${T} mt-3`} value={out} />
      <ActionBar onCopy={() => copyText(out)} onDownload={() => downloadText("meta-tags.html", out, "text/html")} />
    </div>
  );
}

export function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/contact");
  const [freq, setFreq] = useState("weekly");
  const xml = useMemo(() => {
    const items = urls.split("\n").map((u) => u.trim()).filter(Boolean);
    const today = new Date().toISOString().slice(0, 10);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n  </url>`).join("\n")}
</urlset>`;
  }, [urls, freq]);
  return (
    <div>
      <Field label="Change frequency">
        <select className={I} value={freq} onChange={(e) => setFreq(e.target.value)}>
          {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map(v => <option key={v}>{v}</option>)}
        </select>
      </Field>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <textarea className={T} placeholder="One URL per line" value={urls} onChange={(e) => setUrls(e.target.value)} />
        <textarea className={T} readOnly value={xml} />
      </div>
      <ActionBar onCopy={() => copyText(xml)} onDownload={() => downloadText("sitemap.xml", xml, "application/xml")} />
    </div>
  );
}

export function RobotsTxtGenerator() {
  const [agent, setAgent] = useState("*");
  const [allow, setAllow] = useState("/");
  const [disallow, setDisallow] = useState("/admin\n/private");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const out = `User-agent: ${agent}
${allow.split("\n").filter(Boolean).map(a => `Allow: ${a}`).join("\n")}
${disallow.split("\n").filter(Boolean).map(a => `Disallow: ${a}`).join("\n")}
${sitemap ? `\nSitemap: ${sitemap}` : ""}`;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="User-agent"><input className={I} value={agent} onChange={(e) => setAgent(e.target.value)} /></Field>
        <Field label="Sitemap URL"><input className={I} value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></Field>
        <Field label="Allow paths"><textarea className={T} value={allow} onChange={(e) => setAllow(e.target.value)} /></Field>
        <Field label="Disallow paths"><textarea className={T} value={disallow} onChange={(e) => setDisallow(e.target.value)} /></Field>
      </div>
      <textarea className={`${T} mt-3`} readOnly value={out} />
      <ActionBar onCopy={() => copyText(out)} onDownload={() => downloadText("robots.txt", out)} />
    </div>
  );
}

function OgCore({ twitter }: { twitter: boolean }) {
  const [title, setTitle] = useState("Page title");
  const [desc, setDesc] = useState("Page description");
  const [url, setUrl] = useState("https://example.com/");
  const [image, setImage] = useState("https://example.com/preview.jpg");
  const out = twitter
    ? `<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${title}" />\n<meta name="twitter:description" content="${desc}" />\n<meta name="twitter:image" content="${image}" />`
    : `<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:url" content="${url}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:type" content="website" />`;
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title"><input className={I} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="URL"><input className={I} value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
        <Field label="Description"><input className={I} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
        <Field label="Image URL"><input className={I} value={image} onChange={(e) => setImage(e.target.value)} /></Field>
      </div>
      <textarea className={`${T} mt-3`} readOnly value={out} />
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}
export const OgGenerator = () => <OgCore twitter={false} />;
export const TwitterCardGenerator = () => <OgCore twitter />;

export function SlugGenerator() {
  const [t, setT] = useState("Hello World! India @2026");
  const slug = t.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
  return (
    <div>
      <Field label="Title"><input className={I} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="mt-3 rounded-lg border border-border/60 bg-background/40 p-3 font-mono text-sm">{slug || "—"}</div>
      <ActionBar onCopy={() => copyText(slug)} />
    </div>
  );
}

export function CanonicalGenerator() {
  const [url, setUrl] = useState("https://example.com/page");
  const out = `<link rel="canonical" href="${url}" />`;
  return (
    <div>
      <Field label="Canonical URL"><input className={I} value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
      <textarea className={`${T} mt-3`} readOnly value={out} />
      <ActionBar onCopy={() => copyText(out)} />
    </div>
  );
}

export function KeywordDensity() {
  const [t, setT] = useState("");
  const results = useMemo(() => {
    const words = t.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
    const total = words.length; if (!total) return { total: 0, top: [] as [string, number, number][] };
    const map = new Map<string, number>();
    for (const w of words) if (w.length > 2) map.set(w, (map.get(w) || 0) + 1);
    const top = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([k, v]) => [k, v, (v / total) * 100] as [string, number, number]);
    return { total, top };
  }, [t]);
  return (
    <div>
      <textarea className={T} placeholder="Paste article text…" value={t} onChange={(e) => setT(e.target.value)} />
      <div className="mt-4 text-xs text-muted-foreground">Total words: {results.total}</div>
      <div className="mt-2 overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground"><tr><th className="p-2 text-left">Keyword</th><th className="p-2 text-right">Count</th><th className="p-2 text-right">Density</th></tr></thead>
          <tbody>{results.top.map(([k, c, d]) => <tr key={k} className="border-t border-border/40"><td className="p-2">{k}</td><td className="p-2 text-right">{c}</td><td className="p-2 text-right">{d.toFixed(2)}%</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export function SchemaGenerator() {
  const [type, setType] = useState<"Article" | "Product" | "FAQPage" | "Organization" | "LocalBusiness">("Article");
  const [name, setName] = useState("Example Name");
  const [url, setUrl] = useState("https://example.com/");
  const [desc, setDesc] = useState("Description");
  const [image, setImage] = useState("https://example.com/img.jpg");
  const [price, setPrice] = useState("999");
  const json = useMemo(() => {
    const base: Record<string, unknown> = { "@context": "https://schema.org", "@type": type };
    if (type === "Article") Object.assign(base, { headline: name, description: desc, image, mainEntityOfPage: url, author: { "@type": "Person", name: "Author" }, datePublished: new Date().toISOString() });
    if (type === "Product") Object.assign(base, { name, description: desc, image, offers: { "@type": "Offer", price, priceCurrency: "INR", availability: "https://schema.org/InStock" } });
    if (type === "FAQPage") Object.assign(base, { mainEntity: [{ "@type": "Question", name: "Sample question?", acceptedAnswer: { "@type": "Answer", text: desc } }] });
    if (type === "Organization" || type === "LocalBusiness") Object.assign(base, { name, url, description: desc, logo: image });
    return `<script type="application/ld+json">\n${JSON.stringify(base, null, 2)}\n</script>`;
  }, [type, name, url, desc, image, price]);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Schema type">
          <select className={I} value={type} onChange={(e) => setType(e.target.value as never)}>
            {["Article", "Product", "FAQPage", "Organization", "LocalBusiness"].map(v => <option key={v}>{v}</option>)}
          </select>
        </Field>
        <Field label="Name / Headline"><input className={I} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="URL"><input className={I} value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
        <Field label="Image URL"><input className={I} value={image} onChange={(e) => setImage(e.target.value)} /></Field>
        <Field label="Description"><input className={I} value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
        {type === "Product" && <Field label="Price (INR)"><input className={I} value={price} onChange={(e) => setPrice(e.target.value)} /></Field>}
      </div>
      <textarea className={`${T} mt-3`} readOnly value={json} />
      <ActionBar onCopy={() => copyText(json)} />
    </div>
  );
}

export function SitemapValidator() {
  const [xml, setXml] = useState("");
  const result = useMemo(() => {
    if (!xml.trim()) return null;
    try {
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      const err = doc.querySelector("parsererror");
      if (err) return { ok: false, msg: err.textContent || "Parse error", urls: 0 };
      const urls = doc.querySelectorAll("url > loc").length;
      if (!urls) return { ok: false, msg: "No <url><loc> entries found", urls: 0 };
      return { ok: true, msg: `Valid sitemap with ${urls} URL(s)`, urls };
    } catch (e) { return { ok: false, msg: String(e), urls: 0 }; }
  }, [xml]);
  return (
    <div>
      <textarea className={T} placeholder="Paste your sitemap.xml here…" value={xml} onChange={(e) => setXml(e.target.value)} />
      {result && (
        <div className={`mt-3 rounded-lg border p-3 text-sm ${result.ok ? "border-[oklch(0.66_0.16_155)]/40 bg-[oklch(0.66_0.16_155)]/10 text-[oklch(0.72_0.16_155)]" : "border-destructive/40 bg-destructive/10 text-destructive"}`}>
          {result.ok ? "✓ " : "✗ "}{result.msg}
        </div>
      )}
    </div>
  );
}
