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

const tool = creatorTool("script-generator");

const FAQS = [
  { q: "Script kitni lambi hoti hai?", a: "Aapke chune gaye duration ke hisaab se — 30 sec ke liye chhoti aur tight, 10 min ke liye chapter-wise lambi script banti hai." },
  { q: "Kya timestamps milte hain?", a: "Haan, har section par [0-5s] jaisa timestamp hota hai jisse shoot aur edit karna aasan ho jaata hai." },
  { q: "Hinglish script kaisi hoti hai?", a: "Roman script mein Hindi-English mix — jaisa creators asli video mein bolte hain, padhna aasan." },
  { q: "Script se scenes kaise banaun?", a: "Script save karke Storyboard Generator kholein — wahi script scene-by-scene shooting plan mein badal jaayegi." },
];

export const Route = createFileRoute("/creator/script-generator")({
  head: () => ({
    meta: [
      { title: "AI Video Script Generator (Hindi, Hinglish, Punjabi) | Bharat AI Sathi" },
      { name: "description", content: "Free AI script generator for YouTube, Shorts and Reels with timestamps, hook, body and CTA in Hindi, English, Hinglish or Punjabi." },
      { property: "og:title", content: "AI Video Script Generator — Bharat AI Sathi" },
      { property: "og:description", content: "Timestamped, ready-to-shoot video scripts in your language." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/script-generator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/script-generator" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: ScriptGeneratorPage,
});

function ScriptGeneratorPage() {
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
        `${briefLine(project)}\n\nWrite a complete spoken video script.\n\nHOOK\n- First 3 seconds, exact words.\n\nSCRIPT\n- Timestamped blocks like [0-5s], [5-15s] covering the whole ${project.duration}.\n- Only spoken words plus short (visual: ...) notes.\n- Keep sentences short enough to say out loud comfortably.\n\nCTA\n- One natural closing line asking for follow/save/share.\n\nRETENTION TIPS\n- 3 specific tips for THIS script (pattern interrupts, where to add text, where to cut).`,
        CREATOR_SYSTEM,
      );
      setOutput("script", text);
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
            Script Generator aapke topic ko bolne-layak script mein badalta hai. Duration ke hisaab se AI shabdon ki
            ginti control karta hai, isliye 30 second ki reel mein 10 minute ka content nahi ghusta. Har block par
            timestamp hota hai aur beech-beech mein visual notes, taaki shoot karte waqt confusion na ho.
          </p>
          <p>
            Script pasand aane par “Save to project” dabaayein — uske baad Voice-over Studio mein usse sunn sakte hain,
            Storyboard Generator se scenes bana sakte hain aur Subtitle tool se captions nikal sakte hain.
          </p>
        </>
      }
    >
      <CreatorBrief project={project} patch={patch} />
      <div className="mt-4">
        <Button onClick={generate} disabled={loading} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
          Generate script
        </Button>
      </div>
      <div className="mt-5">
        <OutputPanel
          value={project.outputs.script ?? ""}
          onChange={(v) => setOutput("script", v)}
          onRegenerate={generate}
          onSave={() => { save(); toast.success("Script save ho gayi"); }}
          loading={loading}
          filename={`script-${project.topic || "bharat-ai-sathi"}`}
          minHeight={380}
        />
      </div>
    </CreatorShell>
  );
}
