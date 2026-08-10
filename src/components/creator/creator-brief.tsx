import {
  CONTENT_TYPES,
  DURATIONS,
  LANGUAGES,
  PLATFORMS,
  TONES,
  type CreatorProject,
} from "@/lib/creator-studio";

function selectCls() {
  return "w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30";
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

/** Shared brief inputs — the same values flow into every Creator Studio tool. */
export function CreatorBrief({
  project,
  patch,
  fields = ["topic", "platform", "language", "duration", "contentType", "tone"],
  topicLabel = "Topic / idea",
  topicPlaceholder = 'जैसे "PM Kisan ki 19th installment kab aayegi"',
}: {
  project: CreatorProject;
  patch: (updates: Partial<CreatorProject>) => void;
  fields?: ("topic" | "platform" | "language" | "duration" | "contentType" | "tone")[];
  topicLabel?: string;
  topicPlaceholder?: string;
}) {
  const has = (f: string) => fields.includes(f as never);
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {has("topic") && (
        <div className="sm:col-span-2">
          <Labeled label={topicLabel}>
            <input
              value={project.topic}
              onChange={(e) => patch({ topic: e.target.value })}
              placeholder={topicPlaceholder}
              className={selectCls()}
            />
          </Labeled>
        </div>
      )}
      {has("platform") && (
        <Labeled label="Platform">
          <select
            value={project.platform}
            onChange={(e) => patch({ platform: e.target.value as CreatorProject["platform"] })}
            className={selectCls()}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Labeled>
      )}
      {has("language") && (
        <Labeled label="Language / भाषा">
          <select
            value={project.language}
            onChange={(e) => patch({ language: e.target.value as CreatorProject["language"] })}
            className={selectCls()}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </Labeled>
      )}
      {has("duration") && (
        <Labeled label="Video duration">
          <select value={project.duration} onChange={(e) => patch({ duration: e.target.value })} className={selectCls()}>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Labeled>
      )}
      {has("contentType") && (
        <Labeled label="Content type">
          <select value={project.contentType} onChange={(e) => patch({ contentType: e.target.value })} className={selectCls()}>
            {CONTENT_TYPES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Labeled>
      )}
      {has("tone") && (
        <Labeled label="Tone">
          <select value={project.tone} onChange={(e) => patch({ tone: e.target.value })} className={selectCls()}>
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Labeled>
      )}
    </div>
  );
}
