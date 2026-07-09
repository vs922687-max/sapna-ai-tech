import { toast } from "sonner";
import { Copy, RotateCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export function ActionBar({
  onCopy, onReset, onDownload, extra,
}: {
  onCopy?: () => void;
  onReset?: () => void;
  onDownload?: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {onCopy && <Button size="sm" variant="outline" onClick={onCopy}><Copy className="mr-1 h-4 w-4" />Copy</Button>}
      {onDownload && <Button size="sm" variant="outline" onClick={onDownload}><Download className="mr-1 h-4 w-4" />Download</Button>}
      {onReset && <Button size="sm" variant="ghost" onClick={onReset}><RotateCcw className="mr-1 h-4 w-4" />Reset</Button>}
      {extra}
    </div>
  );
}

export async function copyText(text: string, label = "Copied to clipboard") {
  if (!text) { toast.error("Nothing to copy"); return; }
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error("Copy failed");
  }
}

export function downloadText(filename: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type });
  downloadBlob(filename, blob);
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-3 text-center">
      <div className="font-display text-xl font-bold text-primary">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

export function inputCls() {
  return "w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30";
}

export function textareaCls() {
  return "w-full rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm font-mono outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 min-h-[180px]";
}
