import {
  Wand2,
  FileVideo,
  Clapperboard,
  Captions,
  AudioLines,
  Image as ImageIcon,
  Zap,
  Lightbulb,
  Hash,
  LayoutList,
  Scissors,
  type LucideIcon,
} from "lucide-react";

export const SITE = "https://bharataisathi.com";

export type CreatorTool = {
  slug: string;
  /** Route path — may point at an EXISTING tool elsewhere in the app (no duplicates). */
  to: string;
  title: string;
  hindi: string
  description: string;
  icon: LucideIcon;
  /** true when this links to a pre-existing Bharat AI Sathi tool. */
  existing?: boolean;
  needsAi?: boolean;
};

export const CREATOR_TOOLS: CreatorTool[] = [
  {
    slug: "content-generator",
    to: "/creator/content-generator",
    title: "AI Content Generator",
    hindi: "एआई कंटेंट जनरेटर",
    description:
      "One-click content package: hook, full script, scene breakdown, voice-over, captions, title, description, hashtags and thumbnail text.",
    icon: Wand2,
    needsAi: true,
  },
  {
    slug: "script-generator",
    to: "/creator/script-generator",
    title: "Script Generator",
    hindi: "स्क्रिप्ट जनरेटर",
    description: "Timestamped video scripts for YouTube, Shorts and Reels in Hindi, English, Hinglish or Punjabi.",
    icon: FileVideo,
    needsAi: true,
  },
  {
    slug: "shorts-generator",
    to: "/creator/shorts-generator",
    title: "Shorts & Reels Generator",
    hindi: "शॉर्ट्स जनरेटर",
    description: "15/30/45/60 second short-video packages with a viral hook and a scene-by-scene timeline.",
    icon: Zap,
    needsAi: true,
  },
  {
    slug: "hook-generator",
    to: "/creator/hook-generator",
    title: "Hook Generator",
    hindi: "हुक जनरेटर",
    description: "Scroll-stopping first-3-second lines across curiosity, question, problem, story and emotional angles.",
    icon: Lightbulb,
    needsAi: true,
  },
  {
    slug: "storyboard-generator",
    to: "/creator/storyboard-generator",
    title: "Storyboard Generator",
    hindi: "स्टोरीबोर्ड",
    description: "Turn any script into numbered scenes with duration, visuals, voice-over, on-screen text and transitions.",
    icon: LayoutList,
    needsAi: true,
  },
  {
    slug: "thumbnail-maker",
    to: "/creator/thumbnail-maker",
    title: "Thumbnail Maker",
    hindi: "थंबनेल मेकर",
    description: "Canvas thumbnail editor with presets, multiple text layers, shapes and one-click PNG download.",
    icon: ImageIcon,
  },
  {
    slug: "subtitles",
    to: "/creator/subtitles",
    title: "Auto Subtitle Generator",
    hindi: "सबटाइटल जनरेटर",
    description: "Transcribe a video, edit the subtitle timeline, preview the overlay and export SRT or VTT.",
    icon: Captions,
  },
  {
    slug: "voice-over",
    to: "/creator/voice-over",
    title: "AI Voice-over Studio",
    hindi: "वॉइस-ओवर स्टूडियो",
    description: "Read any script aloud in Hindi, English or Punjabi with speed and pitch control using your device voices.",
    icon: AudioLines,
  },
  {
    slug: "video-editor",
    to: "/creator/video-editor",
    title: "Video Editor",
    hindi: "वीडियो एडिटर",
    description: "Lightweight in-browser editor: trim, crop, rotate, speed, text, watermark, music and 9:16 / 16:9 / 1:1 export.",
    icon: Scissors,
  },
  // Existing Bharat AI Sathi tools — integrated, never duplicated.
  {
    slug: "content-ideas",
    to: "/content-creator",
    title: "Content Ideas Generator",
    hindi: "आइडिया जनरेटर",
    description: "Trending video ideas with hooks and titles — already part of the Content Creator Hub.",
    icon: Clapperboard,
    existing: true,
    needsAi: true,
  },
  {
    slug: "title-hashtags",
    to: "/content-creator",
    title: "Title, Description & Hashtags",
    hindi: "टाइटल-हैशटैग",
    description: "Platform-wise titles, descriptions and hashtag packs from the existing Content Creator Hub.",
    icon: Hash,
    existing: true,
    needsAi: true,
  },
];

export function creatorTool(slug: string): CreatorTool {
  const t = CREATOR_TOOLS.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown creator tool: ${slug}`);
  return t;
}

/* ------------------------------------------------------------------ */
/* Creator project state — shared across the studio, stored locally.   */
/* ------------------------------------------------------------------ */

export const PLATFORMS = [
  "YouTube",
  "YouTube Shorts",
  "Instagram Reels",
  "Facebook Reels",
  "TikTok",
  "LinkedIn",
] as const;
export type CreatorPlatform = (typeof PLATFORMS)[number];

export const LANGUAGES = ["Hindi", "English", "Hinglish", "Punjabi"] as const;
export type CreatorLanguage = (typeof LANGUAGES)[number];

export const CONTENT_TYPES = [
  "Educational",
  "Entertainment",
  "News-style",
  "Motivational",
  "Story",
  "Product promotion",
  "Religious/spiritual",
  "Business",
  "Tutorial",
] as const;

export const TONES = ["Friendly", "Energetic", "Serious", "Funny", "Inspiring", "Professional"] as const;

export const DURATIONS = ["15 sec", "30 sec", "45 sec", "60 sec", "3 min", "5 min", "10 min"] as const;

export type CreatorProject = {
  id: string;
  name: string;
  updatedAt: number;
  topic: string;
  platform: CreatorPlatform;
  language: CreatorLanguage;
  duration: string;
  contentType: string;
  tone: string;
  /** Generated text keyed by step id (script, hook, scenes, captions, …). */
  outputs: Record<string, string>;
};

const KEY = "bas.creator.projects.v1";
const ACTIVE_KEY = "bas.creator.active.v1";

export function emptyProject(name = "Untitled project"): CreatorProject {
  return {
    id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    updatedAt: Date.now(),
    topic: "",
    platform: "YouTube Shorts",
    language: "Hinglish",
    duration: "30 sec",
    contentType: "Educational",
    tone: "Friendly",
    outputs: {},
  };
}

function canStore() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadProjects(): CreatorProject[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as CreatorProject[]) : [];
    return Array.isArray(list) ? list.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

export function saveProjects(list: CreatorProject[]) {
  if (!canStore()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — state stays in memory only */
  }
}

export function upsertProject(project: CreatorProject): CreatorProject[] {
  const next = loadProjects().filter((p) => p.id !== project.id);
  next.unshift({ ...project, updatedAt: Date.now() });
  saveProjects(next);
  return next;
}

export function deleteProject(id: string): CreatorProject[] {
  const next = loadProjects().filter((p) => p.id !== id);
  saveProjects(next);
  if (activeProjectId() === id) setActiveProjectId(null);
  return next;
}

export function duplicateProject(id: string): CreatorProject[] {
  const src = loadProjects().find((p) => p.id === id);
  if (!src) return loadProjects();
  const copy: CreatorProject = { ...src, ...emptyProject(`${src.name} (copy)`), outputs: { ...src.outputs } };
  copy.topic = src.topic;
  copy.platform = src.platform;
  copy.language = src.language;
  copy.duration = src.duration;
  copy.contentType = src.contentType;
  copy.tone = src.tone;
  return upsertProject(copy);
}

export function activeProjectId(): string | null {
  if (!canStore()) return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProjectId(id: string | null) {
  if (!canStore()) return;
  if (id) localStorage.setItem(ACTIVE_KEY, id);
  else localStorage.removeItem(ACTIVE_KEY);
}

export function loadActiveProject(): CreatorProject | null {
  const id = activeProjectId();
  if (!id) return null;
  return loadProjects().find((p) => p.id === id) ?? null;
}

/** Shared system prompt so every Creator tool speaks with one voice. */
export const CREATOR_SYSTEM =
  "You are a senior Indian short-form and YouTube content strategist. You write specific, production-ready output for Hindi, English, Hinglish and Punjabi audiences in India. Never give vague advice. Use exact spoken lines, exact timestamps, exact hashtags and concrete visual instructions. Output clean plain text with UPPERCASE section headings and dashes — no markdown symbols.";

export function briefLine(p: Pick<CreatorProject, "topic" | "platform" | "language" | "duration" | "contentType" | "tone">) {
  return `Topic: ${p.topic}\nPlatform: ${p.platform}\nLanguage: ${p.language}\nTarget duration: ${p.duration}\nContent type: ${p.contentType}\nTone: ${p.tone}\nAudience: India, mobile-first.`;
}
