import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2, ArrowLeft, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Bharat AI Sathi" },
      { name: "description", content: "Multilingual AI chat in Hindi, English and Indian languages. Powered by Gemini." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SYSTEM = `You are Bharat AI Sathi, a friendly, culturally-aware AI companion made for India.
- Respond in the same language the user writes in (Hindi, English, Hinglish, or any Indian language).
- Be concise, warm, and helpful.
- Use markdown when it improves clarity.
- When appropriate, reference Indian context (₹ pricing, UPI, cities, festivals, etc).`;

function ChatPage() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [streaming]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: text }, { role: "assistant", content: "" }];
    setMessages(next);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM,
          messages: next.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text();
        if (res.status === 429) toast.error("Rate limited — please retry in a moment.");
        else if (res.status === 402) toast.error("AI credits exhausted. Please upgrade.");
        else toast.error(errText || "Chat failed");
        setMessages((m) => m.slice(0, -1));
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
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              assistant += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            /* ignore parse errors on partial frames */
          }
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Network error");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  };

  const suggestions = [
    "मुझे स्टार्टअप आइडिया दो",
    "Write a LinkedIn post about AI in India",
    "Explain UPI to a 10-year-old",
    "Diwali marketing plan for a D2C brand",
  ];

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <header className="glass-strong flex h-14 items-center justify-between border-b border-border/50 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => nav({ to: "/" })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.76_0.17_55)] via-white to-[oklch(0.66_0.16_155)]">
              <Sparkles className="h-4 w-4 text-[oklch(0.18_0.03_60)]" />
            </div>
            <div className="leading-none">
              <div className="font-display text-sm font-bold">AI Chat</div>
              <div className="text-[10px] text-muted-foreground">Gemini 2.5 Flash</div>
            </div>
          </div>
        </div>
        <div>
          {user ? (
            <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
              <UserIcon className="h-3 w-3" /> {user.email}
            </div>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/auth">Sign in to save chats</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          {messages.length === 0 ? (
            <div className="mt-10 text-center">
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                नमस्ते! I'm your <span className="text-gradient-tricolor">AI Sathi</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Ask me anything in Hindi, English, or any Indian language.
              </p>
              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="glass rounded-xl border border-border/60 p-3 text-left text-sm hover:border-primary/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex gap-3",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {m.role === "assistant" && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.76_0.17_55)] via-white to-[oklch(0.66_0.16_155)]">
                      <Sparkles className="h-4 w-4 text-[oklch(0.18_0.03_60)]" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-gradient-to-br from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground"
                        : "glass border border-border/40",
                    )}
                  >
                    {m.content || (
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="glass flex items-end gap-2 rounded-2xl border border-border/60 p-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask anything... (Shift+Enter for new line)"
              rows={1}
              className="min-h-10 flex-1 resize-none border-0 bg-transparent focus-visible:ring-0"
            />
            <Button
              onClick={send}
              disabled={streaming || !input.trim()}
              size="icon"
              className="shrink-0 bg-gradient-to-br from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
            >
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Bharat AI Sathi can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
