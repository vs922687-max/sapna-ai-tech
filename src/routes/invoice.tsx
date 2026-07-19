import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Plus, Trash2, Receipt, LogIn } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const URL_SELF = "https://bharataisathi.com/invoice";
const TITLE = "Invoice Generator — Free GST Invoice Maker | Bharat AI Sathi";
const DESC = "Create professional GST-ready invoices in INR with live preview and one-click PDF download. Free, no signup required.";

export const Route = createFileRoute("/invoice")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL_SELF },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL_SELF }],
  }),
  component: InvoicePage,
});

type LineItem = { id: string; description: string; qty: number; rate: number };

type Labels = Record<
  | "invoice" | "invoiceNo" | "date" | "from" | "billTo" | "gstin"
  | "address" | "businessName" | "clientName" | "description" | "qty"
  | "rate" | "amount" | "subtotal" | "gst" | "total" | "notes"
  | "addItem" | "download" | "logo" | "english" | "hindi" | "language",
  string
>;

const EN: Labels = {
  invoice: "INVOICE", invoiceNo: "Invoice No.", date: "Date", from: "From",
  billTo: "Bill To", gstin: "GSTIN", address: "Address",
  businessName: "Business Name", clientName: "Client Name",
  description: "Description", qty: "Qty", rate: "Rate", amount: "Amount",
  subtotal: "Subtotal", gst: "GST", total: "Grand Total",
  notes: "Notes", addItem: "Add Item", download: "Download PDF",
  logo: "Logo", english: "English", hindi: "हिंदी", language: "Language",
};
const HI: Labels = {
  invoice: "इनवॉइस", invoiceNo: "इनवॉइस सं.", date: "दिनांक", from: "प्रेषक",
  billTo: "प्राप्तकर्ता", gstin: "जीएसटीआईएन", address: "पता",
  businessName: "व्यवसाय का नाम", clientName: "ग्राहक का नाम",
  description: "विवरण", qty: "मात्रा", rate: "दर", amount: "राशि",
  subtotal: "उप-योग", gst: "जीएसटी", total: "कुल योग",
  notes: "टिप्पणी", addItem: "आइटम जोड़ें", download: "पीडीएफ डाउनलोड",
  logo: "लोगो", english: "English", hindi: "हिंदी", language: "भाषा",
};

const inr = (n: number) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(isFinite(n) ? n : 0);

const genInvoiceNo = () => {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${stamp}-${rand}`;
};

const uid = () => Math.random().toString(36).slice(2, 9);

function InvoicePage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const L = lang === "en" ? EN : HI;

  const [biz, setBiz] = useState({ name: "", address: "", gstin: "" });
  const [client, setClient] = useState({ name: "", address: "", gstin: "" });
  const [logo, setLogo] = useState<string>("");
  const [invNo, setInvNo] = useState(genInvoiceNo());
  const [invDate, setInvDate] = useState(new Date().toISOString().slice(0, 10));
  const [gstRate, setGstRate] = useState<number>(18);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: uid(), description: "", qty: 1, rate: 0 },
  ]);

  const [signedIn, setSignedIn] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.rate) || 0), 0),
    [items],
  );
  const gstAmt = useMemo(() => (subtotal * gstRate) / 100, [subtotal, gstRate]);
  const total = subtotal + gstAmt;

  const previewRef = useRef<HTMLDivElement>(null);

  const onLogo = (f: File | null) => {
    if (!f) { setLogo(""); return; }
    const reader = new FileReader();
    reader.onload = () => setLogo(String(reader.result || ""));
    reader.readAsDataURL(f);
  };

  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const addItem = () => setItems((prev) => [...prev, { id: uid(), description: "", qty: 1, rate: 0 }]);
  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id).length ? prev.filter((it) => it.id !== id) : prev);

  const download = async () => {
    if (!previewRef.current) return;
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
    const w = canvas.width * ratio;
    const h = canvas.height * ratio;
    pdf.addImage(imgData, "PNG", (pageW - w) / 2, 20, w, h);
    pdf.save(`${invNo || "invoice"}.pdf`);

    if (!signedIn) {
      try {
        const count = Number(localStorage.getItem("invoice_count") || "0") + 1;
        localStorage.setItem("invoice_count", String(count));
        if (count >= 1) setShowSignInPrompt(true);
      } catch { /* ignore */ }
    }
  };

  const inputCls = "w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30";
  const labelCls = "mb-1 block text-xs font-medium text-muted-foreground";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Invoice Generator</p>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              GST-ready invoices, <span className="text-gradient-tricolor">instantly.</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Fill your details, watch the live preview update, and download a clean PDF invoice in INR.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/40 p-1 text-xs">
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-3 py-1 ${lang === "en" ? "bg-primary text-primary-foreground" : ""}`}
            >English</button>
            <button
              onClick={() => setLang("hi")}
              className={`rounded-full px-3 py-1 ${lang === "hi" ? "bg-primary text-primary-foreground" : ""}`}
            >हिंदी</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* FORM */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
              <h2 className="font-display text-lg font-semibold">{L.from}</h2>
              <div className="mt-3 grid gap-3">
                <div>
                  <label className={labelCls}>{L.businessName}</label>
                  <input className={inputCls} value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>{L.address}</label>
                  <textarea className={inputCls} rows={2} value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>{L.gstin} <span className="opacity-60">(optional)</span></label>
                    <input className={inputCls} value={biz.gstin} onChange={(e) => setBiz({ ...biz, gstin: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>{L.logo} <span className="opacity-60">(optional)</span></label>
                    <input type="file" accept="image/*" className={inputCls} onChange={(e) => onLogo(e.target.files?.[0] || null)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
              <h2 className="font-display text-lg font-semibold">{L.billTo}</h2>
              <div className="mt-3 grid gap-3">
                <div>
                  <label className={labelCls}>{L.clientName}</label>
                  <input className={inputCls} value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>{L.address}</label>
                  <textarea className={inputCls} rows={2} value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>{L.gstin} <span className="opacity-60">(optional)</span></label>
                  <input className={inputCls} value={client.gstin} onChange={(e) => setClient({ ...client, gstin: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>{L.invoiceNo}</label>
                  <input className={inputCls} value={invNo} onChange={(e) => setInvNo(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{L.date}</label>
                  <input type="date" className={inputCls} value={invDate} onChange={(e) => setInvDate(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>{L.gst} %</label>
                  <select className={inputCls} value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))}>
                    {[0, 5, 12, 18, 28].map((r) => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Line Items</h2>
                <Button size="sm" variant="outline" onClick={addItem}>
                  <Plus className="mr-1 h-4 w-4" />{L.addItem}
                </Button>
              </div>
              <div className="mt-3 space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="grid grid-cols-12 gap-2">
                    <input
                      className={`${inputCls} col-span-6`}
                      placeholder={L.description}
                      value={it.description}
                      onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    />
                    <input
                      type="number" min={0} step="0.01"
                      className={`${inputCls} col-span-2`}
                      placeholder={L.qty}
                      value={it.qty}
                      onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) })}
                    />
                    <input
                      type="number" min={0} step="0.01"
                      className={`${inputCls} col-span-3`}
                      placeholder={L.rate}
                      value={it.rate}
                      onChange={(e) => updateItem(it.id, { rate: Number(e.target.value) })}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="col-span-1 grid place-items-center rounded-lg border border-border/60 text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <label className={`${labelCls} mt-4`}>{L.notes}</label>
                <textarea className={inputCls} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>

            <Button onClick={download} className="w-full" size="lg">
              <Download className="mr-2 h-4 w-4" />{L.download}
            </Button>

            {showSignInPrompt && !signedIn && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm">
                <p className="font-semibold">Sign in to save your invoices</p>
                <p className="mt-1 text-muted-foreground text-xs">Create a free account to keep a history of every invoice and re-download anytime.</p>
                <Button asChild size="sm" className="mt-3">
                  <Link to="/auth"><LogIn className="mr-1 h-4 w-4" />Sign in</Link>
                </Button>
              </div>
            )}
          </div>

          {/* PREVIEW */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Live preview</div>
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-white text-slate-900 shadow-xl">
              <div ref={previewRef} className="p-8" style={{ fontFamily: "'Helvetica','Arial',sans-serif" }}>
                <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    {logo && <img src={logo} alt="logo" className="h-14 w-14 object-contain" />}
                    <div>
                      <div className="text-lg font-bold">{biz.name || "Your Business"}</div>
                      <div className="whitespace-pre-line text-xs text-slate-600">{biz.address}</div>
                      {biz.gstin && <div className="text-xs text-slate-600">{L.gstin}: {biz.gstin}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold tracking-wide text-slate-800">{L.invoice}</div>
                    <div className="mt-1 text-xs text-slate-600">{L.invoiceNo}: <span className="font-medium text-slate-800">{invNo}</span></div>
                    <div className="text-xs text-slate-600">{L.date}: <span className="font-medium text-slate-800">{invDate}</span></div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{L.billTo}</div>
                  <div className="mt-1 text-sm font-semibold">{client.name || "Client Name"}</div>
                  <div className="whitespace-pre-line text-xs text-slate-600">{client.address}</div>
                  {client.gstin && <div className="text-xs text-slate-600">{L.gstin}: {client.gstin}</div>}
                </div>

                <table className="mt-6 w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-800 text-left text-xs uppercase tracking-wider text-slate-700">
                      <th className="py-2">{L.description}</th>
                      <th className="py-2 text-right">{L.qty}</th>
                      <th className="py-2 text-right">{L.rate}</th>
                      <th className="py-2 text-right">{L.amount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it) => (
                      <tr key={it.id} className="border-b border-slate-100">
                        <td className="py-2">{it.description || "—"}</td>
                        <td className="py-2 text-right">{it.qty}</td>
                        <td className="py-2 text-right">{inr(it.rate)}</td>
                        <td className="py-2 text-right">{inr((it.qty || 0) * (it.rate || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex justify-end">
                  <div className="w-64 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">{L.subtotal}</span><span>{inr(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">{L.gst} ({gstRate}%)</span><span>{inr(gstAmt)}</span></div>
                    <div className="mt-2 flex justify-between border-t border-slate-800 pt-2 text-base font-bold"><span>{L.total}</span><span>{inr(total)}</span></div>
                  </div>
                </div>

                {notes && (
                  <div className="mt-6 border-t border-slate-200 pt-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{L.notes}</div>
                    <div className="whitespace-pre-line text-xs text-slate-700">{notes}</div>
                  </div>
                )}

                <div className="mt-6 text-center text-[10px] text-slate-400">
                  Generated with Bharat AI Sathi · bharataisathi.com
                </div>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
              <Receipt className="h-3 w-3" /> Preview updates as you type
            </p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
