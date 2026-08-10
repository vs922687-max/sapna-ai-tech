import { useEffect, useState } from "react";
import { Copy, Download, RefreshCw, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadTxt } from "@/lib/export-file";

/**
 * Editable AI output with the standard Creator Studio actions:
 * Copy · Regenerate · Edit (inline) · Save · Download.
 */
export function OutputPanel({
  value,
  onChange,
  onRegenerate,
  onSave,
  loading,
  filename,
  emptyHint = "Output yahan dikhega — pehle details bharke Generate dabaayein.",
  minHeight = 320,
}: {
  value: string;
  onChange: (next: string) => void;
  onRegenerate?: () => void;
  onSave?: () => void;
  loading?: boolean;
  filename: string;
  emptyHint?: string;
  minHeight?: number;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const commit = (next: string) => {
    setDraft(next);
    onChange(next);
  };

  if (loading && !draft) {
    return (
      <div className="flex min-h-[200px] items-center justify-center gap-2 rounded-xl border border-border/60 bg-card/40 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" /> AI likh raha hai… (thoda samay lag sakta hai)
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 px-4 text-center text-sm text-muted-foreground">
        {emptyHint}
      </div>
    );
  }

  return (
    <div>
      <textarea
        value={draft}
        onChange={(e) => commit(e.target.value)}
        spellCheck={false}
        aria-label="Generated output (editable)"
        style={{ minHeight }}
        className="w-full rounded-xl border border-border/60 bg-background/60 p-3 text-sm leading-relaxed outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(draft);
              toast.success("Copy ho gaya");
            } catch {
              toast.error("Copy nahi hua — text select karke manually copy karein.");
            }
          }}
        >
          <Copy className="mr-1 h-4 w-4" /> Copy
        </Button>
        <Button size="sm" variant="outline" onClick={() => downloadTxt(filename, draft)}>
          <Download className="mr-1 h-4 w-4" /> Download
        </Button>
        {onSave && (
          <Button size="sm" variant="outline" onClick={onSave}>
            <Save className="mr-1 h-4 w-4" /> Save to project
          </Button>
        )}
        {onRegenerate && (
          <Button size="sm" variant="ghost" onClick={onRegenerate} disabled={loading}>
            {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1 h-4 w-4" />}
            Regenerate
          </Button>
        )}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Output edit kar sakte hain — AI se bani cheezein publish karne se pehle check karein.
      </p>
    </div>
  );
}
