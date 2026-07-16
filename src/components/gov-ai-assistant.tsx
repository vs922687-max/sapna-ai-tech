import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { askAi } from "@/lib/ai-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { GovService } from "@/lib/gov-services";

type Lang = "hi" | "en" | "hinglish";
type Msg = { role: "user" | "assistant"; content: string };

const LANG_LABEL: Record<Lang, string> = { hi: "हिंदी", en: "English", hinglish: "Hinglish" };

const QUICK: { hi: string; en: string; hinglish: string }[] = [
  { hi: "मैं eligible हूँ या नहीं?", en: "Am I eligible?", hinglish: "Kya main eligible hoon?" },
  { hi: "कौन से documents चाहिए?", en: "Which documents are required?", hinglish: "Konse documents chahiye?" },
  { hi: "कितनी fee लगती है?", en: "How much fee is required?", hinglish: "Kitni fee lagegi?" },
  { hi: "कितने दिन लगेंगे?", en: "How many days will it take?", hinglish: "Kitne din lagenge?" },
  { hi: "क्या online apply कर सकते हैं?", en: "Can I apply online?", hinglish: "Online apply kar sakte hain?" },
  { hi: "कौन सी गलतियां न करें?", en: "What mistakes should I avoid?", hinglish: "Kaunsi mistakes avoid karein?" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any;

export function GovAiAssistant({ service }: { service: GovService }) {
  const [lang, setLang] = useState<Lang>("hi");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SR>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  const buildSystem = () =>
    `You are Bharat AI Sathi's assistant for the Indian government service "${service.name}" (${service.hindi}), managed by ${service.ministry}. Official site: ${service.official}.

Known eligibility: ${service.eligibility.join("; ")}.
Documents: ${service.documents.join("; ")}.
Steps: ${service.steps.map((s) => `${s.title}: ${s.detail}`).join(" | ")}.
Notes: ${service.notes.join(" | ")}.

Rules:
- Answer ONLY about this service. If unrelated, politely redirect.
- Be accurate, concise (5-8 short bullets max).
- Explain government/legal terms simply.
- Reply in ${lang === "hi" ? "simple Hindi" : lang === "hinglish" ? "Hinglish (Roman Hindi + easy English words)" : "simple English"}.
- Never invent fees or deadlines — say "check official website" if unsure.
- Always recommend applying only on: ${service.official}`;

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const next = [...msgs, { role: "user" as const, content: q }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const history = next
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");
      const reply = await askAi(history, buildSystem());
      setMsgs((m) => [...m, { role: "assistant", content: reply.trim() }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Assistant failed");
    } finally {
      setLoading(false);
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
      setInput(t);
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
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Text-to-speech not supported");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "en" ? "en-IN" : "hi-IN";
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="font-display text-base font-bold">AI Assistant</h2>
        </div>
        <div className="flex gap-1">
          {(["hi", "en", "hinglish"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px]",
                lang === l
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border/60 text-muted-foreground",
              )}
            >
              {LANG_LABEL[l]}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="mb-3 max-h-80 min-h-[8rem] space-y-2 overflow-y-auto rounded-lg border border-border/50 bg-background/40 p-3 text-sm"
      >
        {msgs.length === 0 && !loading && (
          <p className="text-xs text-muted-foreground">
            Ask anything about {service.name} — eligibility, documents, fees, timelines, official process.
          </p>
        )}
        {msgs.map((m, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg px-3 py-2",
              m.role === "user"
                ? "ml-6 bg-primary/10 text-foreground"
                : "mr-6 bg-muted/40 text-foreground/90",
            )}
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {m.role === "user" ? "You" : "Sathi"}
              </span>
              {m.role === "assistant" && (
                <button
                  onClick={() => speak(m.content)}
                  className="text-muted-foreground hover:text-primary"
                  aria-label="Read aloud"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{m.content}</pre>
          </div>
        ))}
        {loading && (
          <div className="mr-6 flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
          </div>
        )}
      </div>

      {msgs.length === 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {QUICK.map((q) => (
            <button
              key={q.en}
              onClick={() => void send(q[lang])}
              className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              {q[lang]}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === "hi" ? "अपना सवाल लिखें…" : lang === "hinglish" ? "Apna sawaal likhein…" : "Type your question…"}
          className="flex-1 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
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
        <Button type="submit" size="sm" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
