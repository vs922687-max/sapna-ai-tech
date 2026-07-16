// Shared download utility — writes a text/html blob and records it in the
// Download Center store. Keeps everything client-side (no cloud storage).
import { readGovStore, writeGovStore } from "./gov-store";

export type DownloadItem = {
  id: string;
  name: string;
  kind: "Form" | "Document" | "Letter" | "Certificate" | "Receipt";
  category?: string;
  createdAt: number;
  content?: string; // optional content for re-download
};

const KEY = "downloads";

export function listDownloads(): DownloadItem[] {
  return readGovStore<DownloadItem[]>(KEY, []);
}
export function saveDownloadRecord(item: DownloadItem) {
  const list = listDownloads();
  writeGovStore(KEY, [{ ...item }, ...list].slice(0, 200));
}
export function removeDownload(id: string) {
  writeGovStore(KEY, listDownloads().filter((d) => d.id !== id));
}

function triggerBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a);
  a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadTextFile(filename: string, content: string, record?: DownloadItem) {
  triggerBlob(filename, new Blob([content], { type: "text/plain;charset=utf-8" }));
  if (record) saveDownloadRecord({ ...record, content });
}

export function downloadHtmlAsDoc(filename: string, title: string, htmlBody: string, record?: DownloadItem) {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:'Times New Roman',serif;padding:40px;line-height:1.6;color:#111;}h1{font-size:20px;text-align:center;}pre{white-space:pre-wrap;font-family:inherit;}</style>
</head><body>${htmlBody}</body></html>`;
  triggerBlob(filename, new Blob([html], { type: "application/msword" }));
  if (record) saveDownloadRecord({ ...record, content: htmlBody });
}

export function printHtml(title: string, htmlBody: string) {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) return;
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
<style>body{font-family:'Times New Roman',serif;padding:40px;line-height:1.6;color:#111;max-width:800px;margin:auto;}pre{white-space:pre-wrap;font-family:inherit;}@media print{body{padding:20px;}}</style>
</head><body>${htmlBody}<script>window.onload=()=>{window.print();};</script></body></html>`);
  w.document.close();
}
