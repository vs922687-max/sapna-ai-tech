// Small client-side export helpers (TXT / CSV) used by AI tool outputs.

function trigger(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function slugifyName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "export"
  );
}

export function downloadTxt(name: string, content: string) {
  trigger(`${slugifyName(name)}.txt`, new Blob([content], { type: "text/plain;charset=utf-8" }));
}

export function csvCell(value: string): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function downloadCsv(name: string, rows: string[][]) {
  const csv = "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  trigger(`${slugifyName(name)}.csv`, new Blob([csv], { type: "text/csv;charset=utf-8" }));
}

/** Turns plain-text AI output into Section / Line CSV rows. */
export function textToCsvRows(text: string, header: [string, string] = ["Section", "Line"]): string[][] {
  const rows: string[][] = [header];
  let section = "General";
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const isHeading =
      line.length <= 60 && /[A-Z]/.test(line) && line === line.toUpperCase() && !/^[-•\d]/.test(line);
    if (isHeading) {
      section = line.replace(/[:]+$/, "");
      continue;
    }
    rows.push([section, line.replace(/^[-•]\s*/, "")]);
  }
  return rows;
}
