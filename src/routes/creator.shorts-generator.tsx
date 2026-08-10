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

const tool = creatorTool("shorts-generator");

const FAQS = [
  { q: "Konsi duration best hai?", a: "Indian audience ke liye 30-45 second sweet spot hai — hook strong ho to 60 sec bhi chalta hai. Tool aapke chune duration ke hisaab se exact timeline banata hai." },
  { q: "Kya Reels aur Shorts ke liye alag output hai?", a: "Haan, platform choose karne par caption length, hashtag count aur CTA style us platform ke hisaab se badal jaate hain." },
  { q: "Editing instructions bhi milti hain?", a: "Har scene ke saath duration, visual, on-screen text aur transition hota hai — seedha editor mein follow kar sakte hain." },
  { q: "Music suggestion milta hai?", a: "Haan, trending sound ka type aur beat placement bataaya jaata hai (specific copyrighted track ka naam nahi)." },
];

export const Route = createFileRoute("/creator/shorts-generator")({
  head: () => ({
    meta: [
      { title: "AI Shorts & Reels Generator — 15 to 60 Second Video Packages | Bharat AI Sathi" },
      { name: "description", content: "Generate complete YouTube Shorts and Instagram Reels packages with AI: viral hook, scene timeline, on-screen text, caption, hashtags and music cues." },
      { property: "og:title", content: "AI Shorts & Reels Generator — Bharat AI Sathi" },
      { property: "og:description", content: "Viral hook se hashtags tak, poora short-video plan ek click mein." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/shorts-generator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/shorts-generator" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: ShortsGeneratorPage,
});

function ShortsGeneratorPage() {
  const { project, patch, setOutput, save } = useCreatorProject();
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!project.topic.trim()) {
      toast.error("Pehle topic likhein.");
      return;
    }
    setLoading(true);
    try {
      const text = await askAi(
        `${briefLine(project)}\n\nCreate a vertical short-video package for exactly ${project.duration}.\n\nVIRAL HOOK\n- 3 alternative first-lines (max 12 words each).\n\nTIMELINE\n- Second-by-second blocks (e.g. 0-3s, 3-8s) covering the full duration with: spoken line | visual | on-screen text | cut or transition.\n\nON-SCREEN TEXT\n- One punchy overlay per block.\n\nMUSIC & SOUND\n- Type of trending sound, energy level and where the beat drop should land.\n\nCAPTION\n- ${project.platform} caption with CTA.\n\nHASHTAGS\n- One copy-paste line, right count for ${project.platform}.\n\nWHY THIS CAN WORK\n- 3 short reasons tied to this specific idea.`,
        CREATOR_SYSTEM,
      );
      setOutput("shorts", text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation fail ho gaya.");
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
            Short-form video mein pehle 3 second sab kuch decide karte hain. Yeh tool aapko teen alag hook options,
            second-by-second timeline, on-screen text aur music placement deta hai — sab aapke chune gaye duration aur
            platform ke hisaab se. Isse shoot karte waqt sochna nahi padta, sirf follow karna hota hai.
          </p>
          <p>
            Package ready hone par Thumbnail Maker se cover bana lein aur Video Editor mein clip ko 9:16 mein trim
            karke text add karein — dono tools aapke browser mein hi chalte hain.
          </p>
        </>
      }
    >
      <CreatorBrief project={project} patch={patch} />
      <div className="mt-4">
        <Button onClick={generate} disabled={loading} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
          Generate shorts package
        </Button>
      </div>
      <div className="mt-5">
        <OutputPanel
          value={project.outputs.shorts ?? ""}
          onChange={(v) => setOutput("shorts", v)}
          onRegenerate={generate}
          onSave={() => { save(); toast.success("Shorts package save ho gaya"); }}
          loading={loading}
          filename={`shorts-${project.topic || "bharat-ai-sathi"}`}
          minHeight={380}
        />
      </div>
    </CreatorShell>
  );
}
