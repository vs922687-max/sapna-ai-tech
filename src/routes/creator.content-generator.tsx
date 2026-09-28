import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreatorShell, creatorSchema } from "@/components/creator/creator-shell";
import { CreatorBrief } from "@/components/creator/creator-brief";
import { OutputPanel } from "@/components/creator/output-panel";
import { useCreatorProject } from "@/hooks/use-creator-project";
import { askAi } from "@/lib/ai-client";
import { CREATOR_SYSTEM, VIRAL_HOOK_ENGINE, briefLine, creatorTool, isShortForm } from "@/lib/creator-studio";

const tool = creatorTool("content-generator");

const FAQS = [
  {
    q: "Ek baar mein kya kya milta hai?",
    a: "Hook, poori script, scene-by-scene breakdown, voice-over script, on-screen text, caption, title, description, hashtags aur thumbnail text — sab ek hi generation mein.",
  },
  {
    q: "Kya main output edit kar sakta hoon?",
    a: "Haan, output box editable hai. Edit karke Copy, Download ya Save to project kar sakte hain.",
  },
  {
    q: "Sign in zaroori hai?",
    a: "AI generation ke liye sign in zaroori hai kyunki har request par AI cost lagti hai. Thumbnail maker aur video editor bina login chalte hain.",
  },
  {
    q: "Kya AI content bilkul sahi hota hai?",
    a: "Nahi — AI draft deta hai. Numbers, dates, scheme details aur claims publish karne se pehle verify karein.",
  },
];

export const Route = createFileRoute("/creator/content-generator")({
  head: () => ({
    meta: [
      { title: "AI Content Generator — Full Video Package in One Click | Bharat AI Sathi" },
      {
        name: "description",
        content:
          "Generate a complete video package with AI: hook, script, scene breakdown, voice-over, captions, title, description, hashtags and thumbnail text in Hindi, English, Hinglish or Punjabi.",
      },
      { property: "og:title", content: "AI Content Generator — Bharat AI Sathi Creator Studio" },
      {
        property: "og:description",
        content: "Ek topic likhein — hook se hashtags tak poora video package AI se banayein.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/content-generator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/content-generator" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: ContentGeneratorPage,
});

function ContentGeneratorPage() {
  const { project, patch, setOutput, save } = useCreatorProject();
  const [loading, setLoading] = useState(false);
  const [streamedOutput, setStreamedOutput] = useState("");
  const activeRequest = useRef<AbortController | null>(null);
  const out = project.outputs.package ?? "";

  useEffect(() => () => activeRequest.current?.abort(), []);

  const generate = async () => {
    if (loading) return;
    if (!project.topic.trim()) {
      toast.error("Pehle topic likhein.");
      return;
    }
    const controller = new AbortController();
    activeRequest.current?.abort();
    activeRequest.current = controller;
    setStreamedOutput("");
    setLoading(true);
    try {
      const text = await askAi(
        `${briefLine(project)}\n\n${isShortForm(project) ? VIRAL_HOOK_ENGINE : ""}\n\nCreate one complete, ready-to-record content package. Write every spoken line in ${project.language}; keep technical names unchanged when translation would be misleading. Match ${project.duration} at a natural Indian speaking pace. Never invent statistics, dates, prices, scheme rules, guarantees, or sources; mark uncertain factual claims as [VERIFY BEFORE PUBLISHING]. Do not stop early or omit a section.\n\nUse EXACTLY these headings in this order:\n\nHOOK\n- Exact first spoken line, max 14 words${isShortForm(project) ? "; truthful contrarian opening within 3 seconds" : "; specific and relevant"}.\n\nFULL SCRIPT\n- Complete spoken script with continuous timestamps such as [0-3s].\n- Keep the word count realistic; no filler or repeated paragraphs.${isShortForm(project) ? "\n- Put the CTA before the final loop-back line." : ""}\n\nSCENE BREAKDOWN\n- Number every scene. Use exactly: TIME | VISUAL | VOICE-OVER | ON-SCREEN TEXT | TRANSITION.\n- Visuals must be concrete, phone-friendly and directly related to the spoken line.${isShortForm(project) ? "\n- Include a visible change in every scene and a final-to-first-frame transition." : ""}\n\nVOICE-OVER SCRIPT\n- Narration-only copy matching FULL SCRIPT; remove timestamps and directions.${isShortForm(project) ? " Keep the same opening hook and final loop line." : ""}\n\nON-SCREEN TEXT\n- Numbered short overlay line for every scene.\n\nCAPTION\n- One platform-ready caption with a natural CTA; no unsupported claims.\n\nTITLE\n- 3 distinct keyword-front-loaded options within normal ${project.platform} limits.\n\nDESCRIPTION\n- Searchable description. The first line must work as the visible preview; include relevant Hindi and English search terms naturally, then one CTA.\n\nHASHTAGS\n- One copy-ready line with an appropriate mix of broad, niche and India-relevant hashtags; no unrelated trending tags.\n\nTHUMBNAIL TEXT\n- 3 distinct options, maximum 4 words each, readable and truthful.\n\nFINAL QUALITY CHECK\n- Confirm all 10 sections are present, timestamps cover ${project.duration}, scene count matches overlays, language is ${project.language}, and uncertain factual claims are marked [VERIFY BEFORE PUBLISHING].`,
        CREATOR_SYSTEM,
        { signal: controller.signal, onProgress: setStreamedOutput },
      );
      setOutput("package", text);
      setStreamedOutput("");
      toast.success("Complete content package tayyar hai.");
    } catch (e) {
      setStreamedOutput("");
      if (!(e instanceof DOMException && e.name === "AbortError")) toast.error(e instanceof Error ? e.message : "Generation fail ho gaya — dobara koshish karein.");
    } finally {
      if (activeRequest.current === controller) { activeRequest.current = null; setLoading(false); }
    }
  };

  return (
    <CreatorShell
      tool={tool}
      faqs={FAQS}
      intro={
        <>
          <p>
            Topic, platform, bhasha, duration, content type aur tone chunein aur ek baar Generate dabaayein. AI aapko
            poora package deta hai — hook se lekar thumbnail text tak. Yahi brief Creator Studio ke baaki tools
            (Shorts Generator, Storyboard, Voice-over) mein bhi use hota hai, isliye details dobara bharni nahi
            padtin.
          </p>
          <p>
            Output box editable hai: line hata sakte hain, apni bhasha mein badal sakte hain, phir Copy, Download ya
            Save to project kar sakte hain. Save karne ke baad “Your projects” list se kabhi bhi wapas aa sakte hain.
          </p>
        </>
      }
    >
      <CreatorBrief project={project} patch={patch} />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={generate}
          disabled={loading}
          className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
        >
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
          Generate package
        </Button>
      </div>
      <div className="mt-5">
        <OutputPanel
          value={streamedOutput || out}
          onChange={(v) => setOutput("package", v)}
          onRegenerate={generate}
          onSave={() => {
            save();
            toast.success("Project save ho gaya");
          }}
          loading={loading}
          filename={`content-package-${project.topic || "bharat-ai-sathi"}`}
          minHeight={420}
        />
      </div>
    </CreatorShell>
  );
}
