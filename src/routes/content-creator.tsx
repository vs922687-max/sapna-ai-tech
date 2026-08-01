import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiToolShell } from "@/components/ai-tool-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Copy, Lightbulb, Hash, FileVideo, Clock, TrendingUp, FileText, Sheet } from "lucide-react";
import { toast } from "sonner";
import { askAi } from "@/lib/ai-client";
import { downloadCsv, downloadTxt, textToCsvRows } from "@/lib/export-file";


export const Route = createFileRoute("/content-creator")({
  head: () => ({
    meta: [
      { title: "Content Creator Hub — AI Ideas, Titles, Hashtags & Scripts | Bharat AI Sathi" },
      {
        name: "description",
        content:
          "Free AI Content Creator Hub for Indian creators: trending video ideas, platform-wise titles, descriptions, hashtags, voiceover scripts, growth tips and best posting time.",
      },
      { property: "og:title", content: "Content Creator Hub — Grow Views & Reach with AI" },
      {
        property: "og:description",
        content: "AI video ideas, titles, hashtags, scripts plus Hindi + English growth tips for YouTube Shorts, Instagram Reels and Facebook Reels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://bharataisathi.com/content-creator" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/content-creator" }],
  }),
  component: ContentCreatorPage,
});

const PLATFORMS = ["YouTube Shorts", "Instagram Reels", "Facebook Reels"] as const;
type Platform = (typeof PLATFORMS)[number];
const DURATIONS = ["10 sec", "30 sec", "60 sec"] as const;

const TABS = [
  { id: "ideas", label: "Content Ideas", hindi: "आइडिया", icon: Lightbulb },
  { id: "meta", label: "Title & Hashtags", hindi: "टाइटल-हैशटैग", icon: Hash },
  { id: "script", label: "Video Script", hindi: "स्क्रिप्ट", icon: FileVideo },
  { id: "growth", label: "Growth Tips", hindi: "ग्रोथ टिप्स", icon: TrendingUp },
  { id: "timing", label: "Best Posting Time", hindi: "सही समय", icon: Clock },
] as const;
type TabId = (typeof TABS)[number]["id"];

const SYSTEM =
  "You are a senior short-form video strategist who has grown multiple Indian creator channels (Hindi + Hinglish audience) past 1M views. You give specific, actionable, non-generic output. Never give vague advice like 'post good content'. Use concrete numbers, exact words, exact hashtags and real Indian audience context. Format with clean markdown-free plain text headings and dashes.";

function ContentCreatorPage() {
  const [tab, setTab] = useState<TabId>("ideas");

  return (
    <AiToolShell slug="content-creator">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={tab === t.id ? "default" : "outline"}
            onClick={() => setTab(t.id)}
            className="gap-1"
          >
            <t.icon className="h-4 w-4" />
            <span>{t.label}</span>
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "ideas" && <IdeasTab />}
        {tab === "meta" && <MetaTab />}
        {tab === "script" && <ScriptTab />}
        {tab === "growth" && <GrowthTips />}
        {tab === "timing" && <PostingTime />}
      </div>
    </AiToolShell>
  );
}

function ExportBar({
  text,
  name,
  csvRows,
  csvHeader,
}: {
  text: string;
  name: string;
  csvRows?: string[][];
  csvHeader?: [string, string];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
          } catch {
            toast.error("Copy failed — please select and copy manually");
          }
        }}
      >
        <Copy className="mr-1 h-4 w-4" />
        Copy
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          downloadTxt(name, text);
          toast.success("TXT downloaded");
        }}
      >
        <FileText className="mr-1 h-4 w-4" />
        TXT
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          downloadCsv(name, csvRows ?? textToCsvRows(text, csvHeader));
          toast.success("CSV downloaded");
        }}
      >
        <Sheet className="mr-1 h-4 w-4" />
        CSV
      </Button>
    </div>
  );
}

function Output({ text, name }: { text: string; name: string }) {
  if (!text) return null;
  return (
    <div className="glass rounded-2xl border border-border/60 p-4">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{text}</pre>
      <div className="mt-3">
        <ExportBar text={text} name={name} />
      </div>
    </div>
  );
}


function useAiRun() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const run = async (prompt: string) => {
    setLoading(true);
    setOutput("");
    try {
      const text = await askAi(prompt, SYSTEM);
      setOutput(text.trim());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return { output, loading, run };
}

function PlatformPicker({ value, onChange }: { value: Platform; onChange: (p: Platform) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PLATFORMS.map((p) => (
        <Button key={p} size="sm" variant={value === p ? "default" : "outline"} onClick={() => onChange(p)}>
          {p}
        </Button>
      ))}
    </div>
  );
}

function GenerateButton({ loading, disabled, onClick, label }: { loading: boolean; disabled: boolean; onClick: () => void; label: string }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground"
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {label}
    </Button>
  );
}

/* 1. Idea generator */
function IdeasTab() {
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState<Platform>("YouTube Shorts");
  const { output, loading, run } = useAiRun();

  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted-foreground">
        Apna niche likhein (जैसे "government schemes", "cooking", "fitness") — AI 8 trending video ideas + hook denge.
      </p>
      <Input placeholder="Your niche / topic, e.g. government schemes" value={niche} onChange={(e) => setNiche(e.target.value)} />
      <PlatformPicker value={platform} onChange={setPlatform} />
      <GenerateButton
        loading={loading}
        disabled={!niche.trim()}
        label="Generate 8 Video Ideas"
        onClick={() =>
          run(
            `Niche: ${niche}\nPlatform: ${platform}\nAudience: India (Hindi/Hinglish speaking, mobile-first).\n\nGive exactly 8 video ideas that can realistically trend in the next 30 days for this niche. For each idea output:\n1) Idea number + specific video concept (one line, concrete — mention the exact angle, not a topic name)\n2) Hook: the exact first-3-second spoken line in Hinglish (max 12 words, curiosity or loss-driven)\n3) Title: a scroll-stopping ${platform} title under 60 characters\n4) Why it works: one short line about the search/scroll behaviour or trend it taps\n\nAvoid repeating the same format 8 times — mix listicle, myth-busting, before/after, mistake, tutorial, news-hook, comparison and story formats. No generic ideas.`,
          )
        }
      />
      <Output text={output} name="content-ideas" />
    </div>
  );
}

/* 2. Title, description, hashtags */
function MetaTab() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("YouTube Shorts");
  const { output, loading, run } = useAiRun();

  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted-foreground">
        Video ka topic likhein — platform ke hisaab se optimized title, description aur hashtags milenge.
      </p>
      <Input placeholder="Video topic, e.g. PM Kisan 2000 rupees kab aayenge" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <PlatformPicker value={platform} onChange={setPlatform} />
      <GenerateButton
        loading={loading}
        disabled={!topic.trim()}
        label="Generate Title, Description & Hashtags"
        onClick={() =>
          run(
            `Video topic: ${topic}\nPlatform: ${platform}\nAudience: India.\n\nProduce a ready-to-paste pack, following ${platform}'s own format rules (character limits, hashtag count, keyword placement, first-line visibility):\n\nTITLES (5 options)\n- Each under the platform's practical limit, keyword-front-loaded, with the specific number/benefit in it.\n\nDESCRIPTION\n- Written for ${platform}. First line must work as the visible preview line. Include 2-3 searchable keywords naturally, a clear CTA, and 3 line-break-separated sections. Add relevant Hindi keywords too.\n\nHASHTAGS\n- Give the exact count that performs on ${platform} (Shorts ~3-5, Reels ~8-12, Facebook ~5-8), split into: 2 broad, rest niche + local (Indian) tags. Output them on one copy-paste line.\n\nEXTRA\n- One suggested on-screen text overlay and one thumbnail/cover text idea (max 4 words).`,
          )
        }
      />
      <Output text={output} name="titles-hashtags" />
    </div>
  );
}

/* 4. Script generator */
function ScriptTab() {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>("30 sec");
  const [lang, setLang] = useState<"Hinglish" | "Hindi" | "English">("Hinglish");
  const { output, loading, run } = useAiRun();

  const words = duration === "10 sec" ? "25-30" : duration === "30 sec" ? "70-85" : "140-160";

  return (
    <div className="grid gap-3">
      <p className="text-sm text-muted-foreground">Topic + duration select karein — ready-to-record voiceover script milegi.</p>
      <Input placeholder="Video topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {DURATIONS.map((d) => (
          <Button key={d} size="sm" variant={duration === d ? "default" : "outline"} onClick={() => setDuration(d)}>
            {d}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(["Hinglish", "Hindi", "English"] as const).map((l) => (
          <Button key={l} size="sm" variant={lang === l ? "default" : "outline"} onClick={() => setLang(l)}>
            {l}
          </Button>
        ))}
      </div>
      <GenerateButton
        loading={loading}
        disabled={!topic.trim()}
        label={`Generate ${duration} Script`}
        onClick={() =>
          run(
            `Write a ${duration} short-form video voiceover script in ${lang}.\nTopic: ${topic}\nTarget spoken length: ${words} words total (strict — count and stay in range so it fits ${duration} at natural Indian narration speed).\n\nStructure with timestamps:\n[0-3s] HOOK — exact spoken line, curiosity/problem driven\n[middle] VALUE — the actual specific information, broken into short spoken lines with timestamps\n[last 3s] CTA — a specific ask (follow/save/comment a keyword)\n\nAfter the script add:\nON-SCREEN TEXT — one short overlay line per section\nB-ROLL / VISUAL — what to show for each section (shoot-able with just a phone)\nRETENTION NOTE — one specific line about where viewers usually drop and how this script prevents it.\n\nNo filler sentences. Every line must carry information.`,
          )
        }
      />
      <Output text={output} name="video-script" />
    </div>
  );
}

/* 3. Growth tips (static, bilingual) */
const TIPS: { en: string; hi: string; points: { en: string; hi: string }[] }[] = [
  {
    en: "First 3 seconds decide everything",
    hi: "पहले 3 सेकंड ही सब तय करते हैं",
    points: [
      {
        en: "Open with the result, the number or the problem — never with 'Hello friends, welcome to my channel'.",
        hi: "शुरुआत सीधे result, number या problem से करें — 'नमस्कार दोस्तों, स्वागत है' से कभी न करें।",
      },
      {
        en: "Show movement or a visual change within the first second so the scroll stops.",
        hi: "पहले सेकंड में कोई movement या visual change दिखाएँ, जिससे scroll रुक जाए।",
      },
      {
        en: "If your 3-second retention is under 70%, re-shoot only the hook — not the whole video.",
        hi: "अगर 3-second retention 70% से कम है, तो पूरी video नहीं — सिर्फ hook दोबारा शूट करें।",
      },
    ],
  },
  {
    en: "Consistency beats perfection",
    hi: "Consistency, perfection से ज़्यादा ज़रूरी है",
    points: [
      { en: "Start with 4-5 Shorts/Reels per week for the first 90 days — the algorithm needs data to find your audience.", hi: "पहले 90 दिन हफ़्ते में 4-5 Shorts/Reels डालें — algorithm को आपकी audience ढूँढने के लिए data चाहिए।" },
      { en: "Batch record: shoot 6-8 videos in one sitting, post daily. This is how small creators stay regular.", hi: "Batch recording करें: एक बार में 6-8 videos शूट करें और रोज़ पोस्ट करें। छोटे creators ऐसे ही regular रहते हैं।" },
      { en: "Never delete a slow video — old Shorts often pick up views weeks later.", hi: "कम views वाली video delete न करें — पुरानी Shorts कई हफ़्तों बाद भी चल जाती हैं।" },
    ],
  },
  {
    en: "Use trending audio the smart way",
    hi: "Trending audio का सही इस्तेमाल",
    points: [
      { en: "Pick audio that is rising (under ~50k uses) instead of already saturated tracks.", hi: "ऐसा audio चुनें जो अभी बढ़ रहा हो (लगभग 50k से कम uses), पहले से saturated track नहीं।" },
      { en: "For talking/informational videos keep trending audio at 5-10% volume in the background — you still get the audio signal.", hi: "बोलने वाली/informational video में trending audio को 5-10% volume पर background में रखें — audio signal फिर भी मिलता है।" },
      { en: "Instagram Reels rewards trending audio more than YouTube Shorts, where the topic matters more.", hi: "Instagram Reels में trending audio ज़्यादा काम करता है; YouTube Shorts में topic ज़्यादा मायने रखता है।" },
    ],
  },
  {
    en: "Hashtag strategy: mix broad + niche",
    hi: "Hashtag strategy: broad + niche का mix",
    points: [
      { en: "Formula: 2 broad (#reels #shorts) + 4 niche (#pmkisan #sarkariyojana) + 2 local (#india #uttarpradesh).", hi: "Formula: 2 broad (#reels #shorts) + 4 niche (#pmkisan #sarkariyojana) + 2 local (#india #uttarpradesh)।" },
      { en: "YouTube Shorts: 3-5 hashtags only; more looks spammy and dilutes topic signals.", hi: "YouTube Shorts में सिर्फ 3-5 hashtags रखें; ज़्यादा spammy लगते हैं और topic signal कमज़ोर होता है।" },
      { en: "Repeat 3-4 core niche hashtags in every video so the platform learns your category.", hi: "हर video में 3-4 core niche hashtags दोहराएँ, जिससे platform आपकी category समझ जाए।" },
    ],
  },
  {
    en: "Thumbnail & cover image impact",
    hi: "Thumbnail और cover image का असर",
    points: [
      { en: "Use max 3-4 large words on the cover — readable on a 5-inch screen at 20% size.", hi: "Cover पर सिर्फ 3-4 बड़े शब्द रखें — 5-inch स्क्रीन पर 20% size में भी पढ़े जाने चाहिए।" },
      { en: "One face with a clear expression + one bold number outperforms busy designs.", hi: "साफ़ expression वाला एक चेहरा + एक bold number, भरे-भरे design से बेहतर चलता है।" },
      { en: "Keep the Instagram grid cover consistent (same font/colour) so your profile converts visitors into followers.", hi: "Instagram grid cover एक जैसा रखें (same font/colour) ताकि profile visitors follower बनें।" },
    ],
  },
  {
    en: "Read the right numbers",
    hi: "सही numbers देखें",
    points: [
      { en: "Track average view duration and shares, not likes. Shares are the strongest reach signal.", hi: "Likes नहीं, average view duration और shares देखें। Shares सबसे तगड़ा reach signal है।" },
      { en: "If 60%+ viewers watch to the end, re-make the same topic in a new format within 7 days.", hi: "अगर 60%+ लोग पूरी video देखते हैं, तो 7 दिन में उसी topic को नए format में दोबारा बनाएँ।" },
      { en: "Reply to every comment in the first hour — comment velocity pushes distribution.", hi: "पहले एक घंटे में हर comment का जवाब दें — comment velocity distribution बढ़ाती है।" },
    ],
  },
];

function GrowthTips() {
  const text = TIPS.map(
    (t) => `${t.en.toUpperCase()} / ${t.hi}\n${t.points.map((p) => `- ${p.en}\n  ${p.hi}`).join("\n")}`,
  ).join("\n\n");
  const csvRows: string[][] = [
    ["Topic (EN)", "Topic (HI)", "Tip (EN)", "Tip (HI)"],
    ...TIPS.flatMap((t) => t.points.map((p) => [t.en, t.hi, p.en, p.hi])),
  ];

  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Practical growth playbook — Hindi + English. हर tip actionable है, generic advice नहीं.
      </p>
      <ExportBar text={text} name="growth-tips" csvRows={csvRows} />
      {TIPS.map((t) => (

        <div key={t.en} className="glass rounded-2xl border border-border/60 p-5">
          <h2 className="font-display text-lg font-semibold">{t.en}</h2>
          <p className="text-xs text-primary">{t.hi}</p>
          <ul className="mt-3 grid gap-3">
            {t.points.map((p) => (
              <li key={p.en} className="border-l-2 border-primary/40 pl-3">
                <p className="text-sm">{p.en}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.hi}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* 5. Best posting time */
const TIMING: { platform: string; slots: string[]; note: { en: string; hi: string } }[] = [
  {
    platform: "YouTube Shorts",
    slots: ["7:00–9:00 AM IST", "1:00–2:30 PM IST", "8:00–11:00 PM IST"],
    note: {
      en: "Night slot is strongest in India. Upload 30-45 minutes before the slot so processing finishes.",
      hi: "भारत में रात का slot सबसे मज़बूत है। Processing पूरी हो, इसलिए slot से 30-45 मिनट पहले upload करें।",
    },
  },
  {
    platform: "Instagram Reels",
    slots: ["8:00–10:00 AM IST", "12:30–2:00 PM IST", "7:00–10:30 PM IST"],
    note: {
      en: "Weekdays 7-10 PM converts best; Sunday morning works well for family/lifestyle niches.",
      hi: "Weekdays रात 7-10 बजे सबसे अच्छा; Sunday सुबह family/lifestyle niche के लिए बढ़िया है।",
    },
  },
  {
    platform: "Facebook Reels",
    slots: ["6:30–8:30 AM IST", "6:00–9:00 PM IST"],
    note: {
      en: "Facebook's Indian audience skews Tier-2/3 and older — early morning and post-dinner perform best.",
      hi: "Facebook की भारतीय audience ज़्यादातर Tier-2/3 और older है — सुबह जल्दी और खाने के बाद सबसे अच्छा चलता है।",
    },
  },
];

function PostingTime() {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        Indian audience (IST) ke liye best posting windows — platform ke hisaab se.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {TIMING.map((t) => (
          <div key={t.platform} className="glass rounded-2xl border border-border/60 p-5">
            <h2 className="font-display text-base font-semibold">{t.platform}</h2>
            <ul className="mt-3 grid gap-2">
              {t.slots.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs">{t.note.en}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.note.hi}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl border border-border/60 p-5">
        <h2 className="font-display text-base font-semibold">Apna time kaise pata karein?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          2 hafte tak alag-alag slots test karein aur Insights &gt; "Most active times" dekhein. Apni audience ke peak se
          1 ghanta pehle post karna sabse accha kaam karta hai. / अपनी audience के peak से 1 घंटा पहले पोस्ट करना सबसे
          अच्छा काम करता है।
        </p>
      </div>
    </div>
  );
}
