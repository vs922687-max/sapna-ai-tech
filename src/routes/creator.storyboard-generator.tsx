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
import { textareaCls } from "@/components/tools/ui-primitives";

const tool = creatorTool("storyboard-generator");

const FAQS = [
  { q: "Storyboard kaise madad karta hai?", a: "Shoot se pehle pata chal jaata hai kitne shots chahiye, har shot kitna lamba hai aur kya bolna hai — isse retake aur editing time bahut kam ho jaata hai." },
  { q: "Kya main apni script paste kar sakta hoon?", a: "Haan. Script box mein apni script paste karein, ya khaali chhod dein to AI topic se hi scenes bana dega." },
  { q: "Kya mobile shoot ke liye instructions milti hain?", a: "Haan — camera angle, background aur lighting phone-friendly rakhi jaati hain, koi mehnga setup zaroori nahi." },
  { q: "Scenes ko editor mein kaise use karun?", a: "Storyboard download karke Video Editor mein clip trim karte waqt scene durations follow karein." },
];

export const Route = createFileRoute("/creator/storyboard-generator")({
  head: () => ({
    meta: [
      { title: "AI Storyboard Generator — Scene by Scene Video Plan | Bharat AI Sathi" },
      { name: "description", content: "Turn a topic or script into a numbered storyboard with scene duration, visuals, voice-over lines, on-screen text and transitions for phone shooting." },
      { property: "og:title", content: "AI Storyboard Generator — Bharat AI Sathi" },
      { property: "og:description", content: "Scene-by-scene shooting plan for your next video." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/storyboard-generator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/storyboard-generator" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: StoryboardPage,
});

function StoryboardPage() {
  const { project, patch, setOutput, save } = useCreatorProject();
  const [loading, setLoading] = useState(false);
  const script = project.outputs.script ?? "";

  const generate = async () => {
    if (!project.topic.trim() && !script.trim()) {
      toast.error("Topic likhein ya script paste karein.");
      return;
    }
    setLoading(true);
    try {
      const text = await askAi(
        `${briefLine(project)}\n\n${script.trim() ? `Use this script as the source:\n${script}` : "No script provided — create one from the topic."}\n\nBuild a shooting storyboard for the full ${project.duration}.\nFor every scene output these labelled lines:\nSCENE n\n- Duration:\n- Shot type (phone-friendly):\n- Visual / action:\n- Voice-over line (exact words):\n- On-screen text:\n- Transition to next:\n\nEnd with:\nSHOT LIST\n- Bullet list of everything to film.\nPROPS & LOCATION\n- Simple, low-budget suggestions.`,
        CREATOR_SYSTEM,
      );
      setOutput("storyboard", text);
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
            Storyboard Generator aapki script ko numbered scenes mein todta hai. Har scene ke saath duration, shot
            type, visual, exact voice-over line, on-screen text aur transition milta hai — plus poori shot list, jisse
            aap ek hi baithak mein saare clips shoot kar sakein.
          </p>
          <p>
            Agar aapne Script Generator se script save ki hai, wo automatically neeche script box mein aa jaati hai.
            Chahein to apni script paste karke bhi storyboard bana sakte hain.
          </p>
        </>
      }
    >
      <CreatorBrief project={project} patch={patch} />
      <label className="mt-4 block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">
          Script (optional — Script Generator se save ki gayi script yahan aa jaati hai)
        </span>
        <textarea
          value={script}
          onChange={(e) => setOutput("script", e.target.value)}
          placeholder="Apni script yahan paste karein…"
          className={textareaCls()}
        />
      </label>
      <div className="mt-4">
        <Button onClick={generate} disabled={loading} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
          Generate storyboard
        </Button>
      </div>
      <div className="mt-5">
        <OutputPanel
          value={project.outputs.storyboard ?? ""}
          onChange={(v) => setOutput("storyboard", v)}
          onRegenerate={generate}
          onSave={() => { save(); toast.success("Storyboard save ho gaya"); }}
          loading={loading}
          filename={`storyboard-${project.topic || "bharat-ai-sathi"}`}
          minHeight={380}
        />
      </div>
    </CreatorShell>
  );
}
