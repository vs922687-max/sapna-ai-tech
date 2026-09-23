import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Loader2,
  PlaySquare,
  Sparkles,
  Upload,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { askAi } from "@/lib/ai-client";

const languages = ["Hindi", "Punjabi", "English"] as const;
type Language = (typeof languages)[number];

type ShortsResult = {
  script: string;
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
};

const emptyResult: ShortsResult = {
  script: "",
  title: "",
  description: "",
  tags: [],
  hashtags: [],
};

export const Route = createFileRoute("/shorts-agent")({
  head: () => ({
    meta: [
      { title: "YouTube Shorts Agent — Bharat AI Sathi" },
      {
        name: "description",
        content: "Generate a YouTube Shorts video script, title, description, tags, and hashtags in Hindi, Punjabi, or English.",
      },
      { property: "og:title", content: "YouTube Shorts Agent — Bharat AI Sathi" },
      {
        property: "og:description",
        content: "Create a complete, ready-to-record YouTube Shorts content package with AI.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/shorts-agent" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/shorts-agent" }],
  }),
  component: ShortsAgentPage,
});

function extractSection(text: string, start: string, end?: string) {
  const startIndex = text.indexOf(start);
  if (startIndex < 0) return "";
  const contentStart = startIndex + start.length;
  const endIndex = end ? text.indexOf(end, contentStart) : -1;
  return text.slice(contentStart, endIndex >= 0 ? endIndex : undefined).trim();
}

function parseList(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 20);
}

function parseResult(text: string): ShortsResult {
  const script = extractSection(text, "[[SCRIPT]]", "[[TITLE]]");
  const title = extractSection(text, "[[TITLE]]", "[[DESCRIPTION]]");
  const description = extractSection(text, "[[DESCRIPTION]]", "[[TAGS]]");
  const tags = parseList(extractSection(text, "[[TAGS]]", "[[HASHTAGS]]"));
  const hashtags = parseList(extractSection(text, "[[HASHTAGS]]"));

  if (!script || !title || !description) {
    throw new Error("AI response adhura tha. Please generate again.");
  }

  return { script, title, description, tags, hashtags };
}

function ResultBox({
  title,
  icon: Icon,
  value,
  placeholder,
}: {
  title: string;
  icon: typeof PlaySquare;
  value: string;
  placeholder: string;
}) {
  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success(`${title} copied`);
  };

  return (
    <section className="flex min-h-[260px] flex-col rounded-lg border border-border/70 bg-card/70 p-5 shadow-elegant">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-royal/15 text-royal">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="font-display text-base font-semibold">{title}</h2>
        </div>
        <Button variant="ghost" size="icon" disabled={!value} onClick={copy} aria-label={`Copy ${title}`} title={`Copy ${title}`}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        readOnly
        value={value}
        placeholder={placeholder}
        aria-label={title}
        className="min-h-[180px] flex-1 resize-none border-border/60 bg-background/35 leading-relaxed"
      />
    </section>
  );
}

function ShortsAgentPage() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<Language>("Hindi");
  const [result, setResult] = useState<ShortsResult>(emptyResult);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const generate = async () => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      toast.error("Please enter a topic.");
      return;
    }
    if (cleanTopic.length > 200) {
      toast.error("Topic must be 200 characters or less.");
      return;
    }

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      toast.error("Please sign in to generate and save your Shorts script.");
      return;
    }

    setLoading(true);
    setSaved(false);
    try {
      const text = await askAi(
        `Create a complete YouTube Shorts content package about: ${cleanTopic}\nLanguage: ${language}\n\nUse exactly these section markers and no other section headings:\n[[SCRIPT]]\nA compelling 35-55 second spoken video script with a strong first-3-second hook, clear value, natural pacing cues, and a concise call to action.\n[[TITLE]]\nOne clickable YouTube Shorts title, maximum 70 characters.\n[[DESCRIPTION]]\nA concise YouTube description with a call to action.\n[[TAGS]]\n10 relevant comma-separated tags without # symbols.\n[[HASHTAGS]]\n5 relevant comma-separated hashtags, each beginning with #.\n\nWrite all audience-facing content in ${language}. Keep the section markers exactly in English.`,
        "You are Bharat AI Sathi's expert YouTube Shorts strategist for Indian creators. Be practical, original, culturally natural, and never make unsupported income or performance guarantees.",
      );
      const nextResult = parseResult(text);
      setResult(nextResult);

      const { error } = await supabase.from("generated_shorts").insert({
        user_id: authData.user.id,
        topic: cleanTopic,
        language,
        script: nextResult.script,
        title: nextResult.title,
        description: nextResult.description,
        tags: [...nextResult.tags, ...nextResult.hashtags],
        status: "generated",
      });
      if (error) throw new Error(error.message);
      setSaved(true);
      toast.success("Shorts script generated and saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Shorts script generate nahi ho saka.");
    } finally {
      setLoading(false);
    }
  };

  const youtubeReadyNotice = () => {
    toast.info("YouTube connection is ready for a future setup. No channel has been connected yet.");
  };

  const titleAndDescription = result.title
    ? `${result.title}\n\n${result.description}`
    : "";
  const tagsAndHashtags = result.tags.length
    ? `Tags\n${result.tags.join(", ")}\n\nHashtags\n${result.hashtags.join(" ")}`
    : "";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-royal/15 text-royal shadow-glow">
            <Youtube className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">Creator Studio</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">
            Bharat AI Sathi - <span className="text-royal">Shorts Agent</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Topic चुनें और ready-to-record script, title, description, tags और hashtags एक साथ पाएँ।
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-4xl rounded-lg border border-border/70 bg-card/75 p-5 shadow-elegant sm:p-7">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_210px]">
            <div>
              <Label htmlFor="shorts-topic">Topic</Label>
              <Input
                id="shorts-topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !loading) void generate();
                }}
                maxLength={200}
                placeholder="Enter topic e.g. AI se paise kaise kamaye"
                className="mt-2 h-11 bg-background/40"
              />
            </div>
            <div>
              <Label htmlFor="shorts-language">Language</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger id="shorts-language" className="mt-2 h-11 bg-background/40">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            onClick={generate}
            disabled={loading}
            className="mt-6 h-12 w-full bg-royal text-royal-foreground shadow-glow hover:bg-royal/90 sm:w-auto"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {loading ? "Generating..." : "Generate Shorts Script"}
          </Button>
          {saved && (
            <p className="mt-3 flex items-center gap-2 text-sm text-india-green">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Saved to your account
            </p>
          )}
        </section>

        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          <ResultBox title="Video Script" icon={PlaySquare} value={result.script} placeholder="Your video script will appear here." />
          <ResultBox title="Title + Description" icon={Sparkles} value={titleAndDescription} placeholder="Your title and description will appear here." />
          <ResultBox title="Tags and Hashtags" icon={Youtube} value={tagsAndHashtags} placeholder="Your tags and hashtags will appear here." />
        </div>

        <section className="mt-7 flex flex-col items-start justify-between gap-5 rounded-lg border border-border/70 bg-card/60 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="font-display text-lg font-semibold">YouTube publishing</h2>
            <p className="mt-1 text-sm text-muted-foreground">Channel connection और direct upload अभी active नहीं हैं।</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button variant="outline" onClick={youtubeReadyNotice} className="h-11">
              <Youtube className="h-4 w-4" /> Connect YouTube Channel
            </Button>
            <Button onClick={youtubeReadyNotice} className="h-11 bg-royal text-royal-foreground hover:bg-royal/90">
              <Upload className="h-4 w-4" /> Upload to YouTube
            </Button>
          </div>
        </section>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Existing full Creator Studio tools are also available in <Link to="/creator" className="font-medium text-primary hover:underline">Creator Studio</Link>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}