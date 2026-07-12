import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";

export const Route = createFileRoute("/voice")({
  head: () => ({ meta: [{ title: "AI Voice Assistant — Bharat AI Sathi" }, { name: "description", content: "Speak to AI in Hindi or English. Voice in, voice out — using your browser." }] }),
  component: VoicePage,
});

type SpeechRec = {
  lang: string; continuous: boolean; interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void; stop: () => void;
};

function VoicePage() {
  const [lang, setLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRec | null>(null);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) { setSupported(false); return; }
    const r = new Ctor();
    r.continuous = false; r.interimResults = false; r.lang = lang;
    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      void ask(text);
    };
    r.onerror = (e) => { toast.error(`Mic error: ${e.error}`); setListening(false); };
    r.onend = () => setListening(false);
    recRef.current = r;
  }, [lang]);

  const ask = async (text: string) => {
    setLoading(true); setReply("");
    try {
      const answer = await askAi(text, "You are a friendly voice assistant. Reply concisely in the same language as the user. Keep it under 4 sentences.");
      setReply(answer);
      const u = new SpeechSynthesisUtterance(answer);
      u.lang = lang;
      speechSynthesis.speak(u);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const toggle = () => {
    if (!recRef.current) return;
    if (listening) { recRef.current.stop(); setListening(false); }
    else { setTranscript(""); setReply(""); recRef.current.start(); setListening(true); }
  };

  if (!supported) {
    return (
      <AiToolShell slug="voice">
        <div className="glass rounded-2xl border border-border/60 p-6 text-center text-sm text-muted-foreground">
          Your browser doesn't support Web Speech API. Please use Chrome or Edge on desktop/Android.
        </div>
      </AiToolShell>
    );
  }

  return (
    <AiToolShell slug="voice">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Language:</span>
        <Button size="sm" variant={lang === "en-IN" ? "default" : "outline"} onClick={() => setLang("en-IN")}>English</Button>
        <Button size="sm" variant={lang === "hi-IN" ? "default" : "outline"} onClick={() => setLang("hi-IN")}>Hindi</Button>
      </div>
      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          onClick={toggle}
          className={`grid h-28 w-28 place-items-center rounded-full border-2 transition ${listening ? "border-red-500 bg-red-500/20 animate-pulse" : "border-primary bg-primary/10 hover:bg-primary/20"}`}
        >
          {listening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
        </button>
        <p className="text-sm text-muted-foreground">{listening ? "Listening..." : "Tap to speak"}</p>
      </div>
      {transcript && (
        <div className="glass mt-6 rounded-2xl border border-border/60 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">You said</div>
          <p className="mt-1 text-sm">{transcript}</p>
        </div>
      )}
      {loading && <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Thinking...</div>}
      {reply && (
        <div className="glass mt-4 rounded-2xl border border-border/60 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">AI Reply</div>
            <Button size="sm" variant="ghost" onClick={() => { const u = new SpeechSynthesisUtterance(reply); u.lang = lang; speechSynthesis.speak(u); }}>
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1 text-sm leading-relaxed">{reply}</p>
        </div>
      )}
    </AiToolShell>
  );
}
