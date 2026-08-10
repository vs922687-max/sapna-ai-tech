import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Copy as CopyIcon, PenLine, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  CREATOR_TOOLS,
  deleteProject,
  duplicateProject,
  emptyProject,
  loadProjects,
  setActiveProjectId,
  upsertProject,
  type CreatorProject,
} from "@/lib/creator-studio";

const TITLE = "AI Creator Studio — Script, Shorts, Subtitles & Thumbnail Tools | Bharat AI Sathi";
const DESC =
  "Free AI Creator Studio for Indian creators: content generator, script and shorts packages, hook and storyboard tools, auto subtitles, voice-over studio, thumbnail maker and a browser video editor.";

const FAQS = [
  {
    q: "Creator Studio free hai?",
    a: "Haan — saare Creator Studio tools free plan par use kar sakte hain. AI generation par roz ki fair-use limit lagti hai; heavy use ke liye premium plan aage aayega.",
  },
  {
    q: "Kya mera video server par upload hota hai?",
    a: "Video editor aur thumbnail maker poori tarah aapke browser mein chalte hain — file kahin upload nahi hoti. Subtitle generator ke liye audio sirf transcription ke liye securely bheja jaata hai.",
  },
  {
    q: "Kaun si languages support hain?",
    a: "Hindi, English, Hinglish aur Punjabi — script, hook, caption aur voice-over sab in bhaashaon mein ban sakte hain.",
  },
  {
    q: "Project save kaise hota hai?",
    a: "Aapka topic, platform aur generate kiya gaya content aapke browser mein save hota hai, isliye ek tool se dusre tool mein jaakar dobara details bharne ki zaroorat nahi.",
  },
];

export const Route = createFileRoute("/creator/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: "AI Creator Studio — Bharat AI Sathi" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/creator" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/creator" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: CreatorHub,
});

const STEPS = [
  "Topic",
  "AI script",
  "Hook",
  "Scenes",
  "Voice-over",
  "Captions",
  "Title",
  "Description",
  "Hashtags",
  "Thumbnail text",
  "Video editing",
];

function CreatorHub() {
  const [projects, setProjects] = useState<CreatorProject[]>([]);

  useEffect(() => setProjects(loadProjects()), []);

  const createProject = () => {
    const p = emptyProject(`Project ${projects.length + 1}`);
    setProjects(upsertProject(p));
    setActiveProjectId(p.id);
    toast.success("Naya project ban gaya — ab Content Generator kholein.");
  };

  const rename = (p: CreatorProject) => {
    const name = window.prompt("Project ka naam", p.name);
    if (!name?.trim()) return;
    setProjects(upsertProject({ ...p, name: name.trim() }));
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
        <div className="glass-strong rounded-2xl border border-border/60 p-6 shadow-elegant sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">क्रिएटर स्टूडियो</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">AI Creator Studio</h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
            Idea se final video tak — script, hook, scenes, voice-over, captions, title, description, hashtags,
            thumbnail aur editing, sab ek jagah. Hindi, English, Hinglish aur Punjabi mein.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/creator/content-generator">
                <Sparkles className="mr-1 h-4 w-4" /> One-click content package
              </Link>
            </Button>
            <Button variant="outline" onClick={createProject}>
              <Plus className="mr-1 h-4 w-4" /> New project
            </Button>
          </div>
        </div>

        {/* Workflow */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold sm:text-2xl">One-click workflow</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ek hi brief se poora package — har step aage badhta hai, details dobara nahi bharni padti.
          </p>
          <ol className="mt-4 flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs">
                <span className="font-semibold text-primary">{i + 1}</span> {s}
              </li>
            ))}
          </ol>
        </section>

        {/* Tools */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Creator tools</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CREATOR_TOOLS.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.slug}
                  to={t.to as "/creator"}
                  className="group flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur transition-colors hover:border-primary/40"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold group-hover:text-primary">
                      {t.title}
                      {t.existing && (
                        <span className="rounded bg-[oklch(0.66_0.16_155)]/15 px-1.5 py-0.5 text-[10px] font-medium text-[oklch(0.66_0.16_155)]">
                          Existing tool
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Projects */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Your projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Projects aapke browser mein save hote hain — koi login zaroori nahi.
          </p>
          {projects.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-border/60 bg-card/30 p-6 text-center text-sm text-muted-foreground">
              Abhi koi project nahi. “New project” dabaayein ya seedha Content Generator kholein.
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {projects.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.topic ? p.topic : "No topic yet"} · {p.platform} · {new Date(p.updatedAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveProjectId(p.id);
                        toast.success("Project active hai — koi bhi tool kholein.");
                      }}
                    >
                      Continue <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => rename(p)} aria-label="Rename project">
                      <PenLine className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setProjects(duplicateProject(p.id))} aria-label="Duplicate project">
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label="Delete project"
                      onClick={() => {
                        if (window.confirm(`"${p.name}" delete karein?`)) setProjects(deleteProject(p.id));
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Content */}
        <section className="mt-12 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Indian creators ke liye ek complete studio
          </h2>
          <p>
            Bharat AI Sathi ka Creator Studio un logon ke liye bana hai jo phone se hi content banate hain. Ek topic
            likhiye — AI aapko pehle 3 second ka hook, poori script timestamps ke saath, scene-by-scene shooting
            instructions, voice-over text, on-screen text, caption, title, description, hashtags aur thumbnail text de
            deta hai. Uske baad usi jagah subtitle bana sakte hain, voice-over sun sakte hain, thumbnail design kar
            sakte hain aur video ko trim, crop aur export kar sakte hain.
          </p>
          <p>
            Video editing aur thumbnail design poori tarah browser mein hoti hai, isliye aapki file kisi server par
            nahi jaati aur mobile data bhi bachta hai. AI se bana content ek draft hota hai — publish karne se pehle
            facts, numbers aur government-related jaankari zaroor verify karein. Government schemes par content bana
            rahe hain to{" "}
            <Link to="/gov" className="text-primary hover:underline">Government Services</Link> section se sahi
            details lein, blogging ke liye{" "}
            <Link to="/blog-writer" className="text-primary hover:underline">AI Blog Writer</Link> aur growth tips ke
            liye <Link to="/content-creator" className="text-primary hover:underline">Content Creator Hub</Link>{" "}
            dekhein.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="glass group rounded-xl border border-border/60 p-4 open:shadow-glow">
                <summary className="cursor-pointer list-none text-sm font-medium">
                  <span className="mr-2 text-primary">▸</span>
                  {f.q}
                </summary>
                <p className="mt-2 pl-5 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </section>
      <SiteFooter />
    </div>
  );
}
