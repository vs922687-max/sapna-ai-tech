import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, Mic, MicOff, Volume2, ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gov/ask")({
  head: () => ({
    meta: [
      { title: "AI Government Expert — Ask Any Sarkari Question | Bharat AI Sathi" },
      {
        name: "description",
        content:
          "Ask India's AI Government Expert about any scheme, document, eligibility, fees or process — in Hindi, English or Hinglish. Streaming answers with voice support.",
      },
      { property: "og:title", content: "AI Government Expert — Bharat AI Sathi" },
      { property: "og:description", content: "Ask any Sarkari question and get simple, verified guidance." },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/gov/ask" }],
  }),
  component: GovAsk,
});

type Lang = "hi" | "en" | "hinglish";
type Msg = { role: "user" | "assistant"; content: string };

const LANG_LABEL: Record<Lang, string> = { hi: "हिंदी", en: "English", hinglish: "Hinglish" };

const SUGGEST: Record<Lang, string[]> = {
  hi: [
    "मेरे लिए कौन सी सरकारी योजना सबसे अच्छी है?",
    "PM Kisan के लिए documents क्या चाहिए?",
    "Aadhaar में address update कैसे करें?",
    "Ayushman Bharat card कैसे बनवाएँ?",
  ],
  en: [
    "Which government scheme is best for a small farmer?",
    "How do I apply for a new PAN card online?",
    "What documents are required for a passport?",
    "How can I check my Ayushman Bharat eligibility?",
  ],
  hinglish: [
    "Mujhe kaunsi sarkari scheme apply karni chahiye?",
    "Driving licence banwane ka process kya hai?",
    "PM Awas Yojana ke liye eligibility batao",
    "E-Shram card ke fayde kya hain?",
  ],
};

const buildSystem = (lang: Lang) =>
  `You are Bharat AI Sathi — India's AI Government Expert.
Help users understand Indian government schemes, documents, eligibility, fees, timelines and application processes.

Rules:
- Reply in ${lang === "hi" ? "simple Hindi" : lang === "hinglish" ? "Hinglish (Roman Hindi + easy English)" : "simple English"}.
- Be concise: short paragraphs or 5-8 bullets max.
- Explain sarkari / legal terms in plain language.
- Always recommend the official government website for the final application; never invent fees, deadlines or portal URLs.
- If unsure, say "please verify on the official website" and suggest which ministry/department to check.
- If the question is not about Indian government services, politely redirect.
- Do not ask users to share Aadhaar, PAN, OTPs, passwords or bank details.`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any;

function GovAsk() {
  const [lang, setLang] = useState<Lang>("hi");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SR>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, streaming]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [streaming]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || streaming) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }, { role: "assistant", content: "" }];
    setMsgs(next);
    setInput("");
    setStreaming(true);
    try {
      const { aiAuthHeaders } = await import("@/lib/ai-client");
      let auth: Record<string, string>;
      try { auth = await aiAuthHeaders(); } catch (e) {
        toast.error((e as Error).message);
        setMsgs((m) => m.slice(0, -1));
        setStreaming(false);
        return;
      }
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({
          system: buildSystem(lang),
          messages: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        if (res.status === 429) toast.error("Rate limited — please retry in a moment.");
        else if (res.status === 402) toast.error("AI credits exhausted. Please upgrade.");
        else toast.error(errText || "Assistant failed");
        setMsgs((m) => m.slice(0, -1));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const data = t.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              assistant += delta;
              setMsgs((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Network error");
      setMsgs((m) => m.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  };

  const toggleVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = window as any;
    const SRC = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SRC) {
      toast.error("Voice input not supported in this browser");
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec: SR = new SRC();
    rec.lang = lang === "en" ? "en-IN" : "hi-IN";
    rec.interimResults = false;
    rec.onresult = (ev: SR) => {
      const t = ev.results[0][0].transcript as string;
      setListening(false);
      void send(t);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "en" ? "en-IN" : "hi-IN";
    window.speechSynthesis.speak(u);
  };

  const clearChat = () => {
    if (streaming) return;
    setMsgs([]);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/gov" className="inline-flex items-center gap-1 hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Government Services
          </Link>
          <span>/</span>
          <span className="text-foreground">AI Expert</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.76_0.17_55)]/25 to-[oklch(0.66_0.16_155)]/25 ring-1 ring-border/60">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">AI Government Expert</p>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">Ask any Sarkari question</h1>
            </div>
          </div>
          <div className="flex gap-1">
            {(["hi", "en", "hinglish"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  lang === l
                    ? "border-primary/60 bg-primary/15 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {LANG_LABEL[l]}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-6 max-h-[55vh] min-h-[16rem] space-y-3 overflow-y-auto rounded-2xl border border-border/60 bg-card/40 p-4"
        >
          {msgs.length === 0 && !streaming && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {lang === "hi"
                ? "किसी भी योजना, document या process के बारे में पूछें।"
                : lang === "hinglish"
                ? "Kisi bhi scheme, document ya process ke baare mein poochein."
                : "Ask about any scheme, document or process."}
            </div>
          )}
          {msgs.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded-xl px-3 py-2 text-sm",
                m.role === "user" ? "ml-8 bg-primary/10" : "mr-8 bg-muted/40",
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.role === "user" ? "You" : "Sathi"}
                </span>
                {m.role === "assistant" && m.content && (
                  <button
                    onClick={() => speak(m.content)}
                    className="text-muted-foreground hover:text-primary"
                    aria-label="Read aloud"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {m.content || (streaming && i === msgs.length - 1 ? "…" : "")}
              </pre>
            </div>
          ))}
          {streaming && msgs[msgs.length - 1]?.content === "" && (
            <div className="mr-8 flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
            </div>
          )}
        </div>

        {msgs.length === 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGEST[lang].map((s) => (
              <button
                key={s}
                onClick={() => void send(s)}
                className="rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="mt-4 flex items-end gap-2 rounded-2xl border border-border/60 bg-card/40 p-2"
        >
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder={
              lang === "hi"
                ? "अपना सवाल लिखें… (Shift+Enter for new line)"
                : lang === "hinglish"
                ? "Apna sawaal likhein…"
                : "Type your question…"
            }
            className="min-h-10 flex-1 resize-none border-0 bg-transparent focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={toggleVoice}
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition",
              listening
                ? "border-red-500/60 bg-red-500/10 text-red-500"
                : "border-border/60 text-muted-foreground hover:text-primary",
            )}
            aria-label="Voice input"
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <Button type="submit" size="icon" disabled={streaming || !input.trim()}>
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>

        <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Never share Aadhaar/PAN/OTP/passwords with any AI.</span>
          {msgs.length > 0 && (
            <button onClick={clearChat} className="hover:text-primary" disabled={streaming}>
              Clear
            </button>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
