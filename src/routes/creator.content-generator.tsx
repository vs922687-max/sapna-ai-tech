import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreatorShell, creatorSchema } from "@/components/creator/creator-shell";
import { CreatorBrief } from "@/components/creator/creator-brief";
import { OutputPanel } from "@/components/creator/output-panel";
import { useCreatorProject } from "@/hooks/use-creator-project";
import { askAi } from "@/lib/ai-client";
import { CREATOR_SYSTEM, briefLine, creatorTool } from "@/lib/creator-studio";

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
  const out = project.outputs.package ?? "";

  const generate = async () => {
    if (!project.topic.trim()) {
      toast.error("Pehle topic likhein.");
      return;
    }
    setLoading(true);
    try {
      const text = await askAi(
        `${briefLine(project)}\n\nProduce a complete, production-ready content package with EXACTLY these sections in this order:\n\nHOOK\n- The exact spoken first 3 seconds (max 14 words).\n\nFULL SCRIPT\n- Spoken script that fits ${project.duration} at natural Indian narration speed, with timestamps like [0-3s].\n\nSCENE BREAKDOWN\n- Scene 1..N with: Duration | Visual to shoot (phone-friendly) | Voice-over line | On-screen text | Transition.\n\nVOICE-OVER SCRIPT\n- Clean narration-only text, no directions, ready to read aloud.\n\nON-SCREEN TEXT\n- Short overlay lines, one per scene.\n\nCAPTION\n- Platform-appropriate caption for ${project.platform} with a clear CTA.\n\nTITLE\n- 3 options, keyword-front-loaded, within ${project.platform} limits.\n\nDESCRIPTION\n- First line works as the visible preview; include searchable Hindi + English keywords and a CTA.\n\nHASHTAGS\n- The right count for ${project.platform}, one copy-paste line, mixing broad + niche + Indian local tags.\n\nTHUMBNAIL TEXT\n- 3 options, max 4 words each, high contrast wording.`,
        CREATOR_SYSTEM,
      );
      setOutput("package", text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation fail ho gaya — dobara koshish karein.");
    } finally {
      setLoading(false);
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
          value={out}
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
