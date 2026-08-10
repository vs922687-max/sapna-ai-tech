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

const tool = creatorTool("hook-generator");

const FAQS = [
  { q: "Hook kitne milte hain?", a: "Har generation par 20 hooks — curiosity, question, problem, story, emotional, number aur contrarian angles mein baante hue." },
  { q: "Hook kitna chhota hona chahiye?", a: "3 second mein bol paayein, matlab 8-14 shabd. Tool isi limit ke andar hooks banata hai." },
  { q: "Kya yeh YouTube long video ke liye bhi kaam karta hai?", a: "Haan — platform YouTube chunein to hook thoda informative aur title-friendly style mein banta hai." },
  { q: "Best hook kaise chunein?", a: "Wo hook chunein jisme viewer ka apna faayda ya sawaal saaf dikhe. Do hooks par same video test karna sabse accha tareeka hai." },
];

export const Route = createFileRoute("/creator/hook-generator")({
  head: () => ({
    meta: [
      { title: "AI Hook Generator — Scroll-Stopping First 3 Seconds | Bharat AI Sathi" },
      { name: "description", content: "Generate 20 scroll-stopping video hooks in Hindi, English, Hinglish or Punjabi across curiosity, question, problem, story and emotional angles." },
      { property: "og:title", content: "AI Hook Generator — Bharat AI Sathi" },
      { property: "og:description", content: "Pehle 3 second ke liye 20 ready-to-speak hooks." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator/hook-generator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator/hook-generator" }],
    scripts: [{ type: "application/ld+json", children: creatorSchema(tool, FAQS) }],
  }),
  component: HookGeneratorPage,
});

function HookGeneratorPage() {
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
        `${briefLine(project)}\n\nWrite 20 spoken video hooks for the first 3 seconds, grouped under these headings with a number list under each: CURIOSITY, QUESTION, PROBLEM, STORY, EMOTIONAL, NUMBER/LIST, CONTRARIAN.\nRules: each hook is one sentence, 8-14 words, speakable, no clickbait lies, no emoji.\nEnd with a section BEST 3 PICKS explaining in one line each why they work for ${project.platform}.`,
        CREATOR_SYSTEM,
      );
      setOutput("hooks", text);
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
            Achha video kam views laata hai jab hook kamzor ho. Yeh tool aapke topic par 20 hooks banata hai, saat
            different angles mein, taaki aap apni audience ke mood ke hisaab se chun sakein. Har hook 3 second mein bol
            paane layak hota hai — na lamba, na jhoothha clickbait.
          </p>
          <p>
            Pasandeeda hook copy karke Script Generator ya Shorts Generator mein use karein, phir usi hook ko thumbnail
            text banakar Thumbnail Maker mein daal dein — consistency se click-through better hota hai.
          </p>
        </>
      }
    >
      <CreatorBrief project={project} patch={patch} fields={["topic", "platform", "language", "contentType", "tone"]} />
      <div className="mt-4">
        <Button onClick={generate} disabled={loading} className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
          {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
          Generate 20 hooks
        </Button>
      </div>
      <div className="mt-5">
        <OutputPanel
          value={project.outputs.hooks ?? ""}
          onChange={(v) => setOutput("hooks", v)}
          onRegenerate={generate}
          onSave={() => { save(); toast.success("Hooks save ho gaye"); }}
          loading={loading}
          filename={`hooks-${project.topic || "bharat-ai-sathi"}`}
        />
      </div>
    </CreatorShell>
  );
}
