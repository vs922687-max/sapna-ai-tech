import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ActionBar, Field, copyText, downloadBlob, inputCls, textareaCls } from "./ui-primitives";

const I = inputCls();
const T = textareaCls();

function useImageLoader() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const load = (f: File) => {
    setName(f.name);
    const r = new FileReader();
    r.onload = () => {
      const image = new Image();
      image.onload = () => setImg(image);
      image.src = r.result as string;
    };
    r.readAsDataURL(f);
  };
  return { img, name, load };
}

function canvasToBlob(c: HTMLCanvasElement, type: string, q?: number): Promise<Blob> {
  return new Promise((res, rej) => c.toBlob((b) => b ? res(b) : rej(new Error("blob failed")), type, q));
}

function FileDrop({ onFile, accept = "image/*" }: { onFile: (f: File) => void; accept?: string }) {
  const inp = useRef<HTMLInputElement>(null);
  return (
    <div
      onClick={() => inp.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-border/70 bg-background/40 p-8 text-center transition-colors hover:border-primary/60"
    >
      <input ref={inp} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <p className="text-sm font-medium">Click to choose or drag & drop</p>
      <p className="mt-1 text-xs text-muted-foreground">All processing happens in your browser — nothing is uploaded.</p>
    </div>
  );
}

export function ImageCompressor() {
  const { img, name, load } = useImageLoader();
  const [q, setQ] = useState(70);
  const [out, setOut] = useState<{ url: string; size: number } | null>(null);
  useEffect(() => {
    if (!img) return;
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    c.getContext("2d")!.drawImage(img, 0, 0);
    canvasToBlob(c, "image/jpeg", q / 100).then((b) => setOut({ url: URL.createObjectURL(b), size: b.size }));
  }, [img, q]);
  return (
    <div>
      <FileDrop onFile={load} />
      {img && (
        <div className="mt-4">
          <Field label={`Quality: ${q}%`}><input type="range" min={10} max={100} value={q} onChange={(e) => setQ(+e.target.value)} className="w-full" /></Field>
          {out && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><p className="mb-1 text-xs">Original</p><img src={img.src} className="w-full rounded-lg border border-border/60" /></div>
              <div><p className="mb-1 text-xs">Compressed — {(out.size / 1024).toFixed(1)} KB</p><img src={out.url} className="w-full rounded-lg border border-border/60" /></div>
            </div>
          )}
          {out && <Button className="mt-4" onClick={async () => downloadBlob("compressed-" + name.replace(/\.\w+$/, "") + ".jpg", await (await fetch(out.url)).blob())}>Download</Button>}
        </div>
      )}
    </div>
  );
}

export function ResizeImage() {
  const { img, name, load } = useImageLoader();
  const [w, setW] = useState(800); const [h, setH] = useState(600); const [keep, setKeep] = useState(true);
  useEffect(() => { if (img) { setW(img.width); setH(img.height); } }, [img]);
  const [out, setOut] = useState<string | null>(null);
  const doResize = async () => {
    if (!img) return; const c = document.createElement("canvas"); c.width = w; c.height = h;
    c.getContext("2d")!.drawImage(img, 0, 0, w, h);
    const b = await canvasToBlob(c, "image/png"); setOut(URL.createObjectURL(b));
  };
  return (
    <div>
      <FileDrop onFile={load} />
      {img && (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Width (px)"><input type="number" className={I} value={w} onChange={(e) => { const nw = +e.target.value; setW(nw); if (keep) setH(Math.round(nw * (img.height / img.width))); }} /></Field>
            <Field label="Height (px)"><input type="number" className={I} value={h} onChange={(e) => { const nh = +e.target.value; setH(nh); if (keep) setW(Math.round(nh * (img.width / img.height))); }} /></Field>
            <label className="flex items-end gap-2 text-sm"><input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} /> Keep aspect ratio</label>
          </div>
          <Button onClick={doResize}>Resize</Button>
          {out && <div><img src={out} className="w-full rounded-lg border border-border/60" /><Button className="mt-3" onClick={async () => downloadBlob("resized-" + name, await (await fetch(out)).blob())}>Download</Button></div>}
        </div>
      )}
    </div>
  );
}

export function CropImage() {
  const { img, name, load } = useImageLoader();
  const [x, setX] = useState(0); const [y, setY] = useState(0); const [w, setW] = useState(200); const [h, setH] = useState(200);
  const [out, setOut] = useState<string | null>(null);
  useEffect(() => { if (img) { setW(Math.min(img.width, 400)); setH(Math.min(img.height, 400)); } }, [img]);
  const doCrop = async () => {
    if (!img) return; const c = document.createElement("canvas"); c.width = w; c.height = h;
    c.getContext("2d")!.drawImage(img, x, y, w, h, 0, 0, w, h);
    const b = await canvasToBlob(c, "image/png"); setOut(URL.createObjectURL(b));
  };
  return (
    <div>
      <FileDrop onFile={load} />
      {img && (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-4">
            <Field label="X"><input type="number" className={I} value={x} onChange={(e) => setX(+e.target.value)} /></Field>
            <Field label="Y"><input type="number" className={I} value={y} onChange={(e) => setY(+e.target.value)} /></Field>
            <Field label="Width"><input type="number" className={I} value={w} onChange={(e) => setW(+e.target.value)} /></Field>
            <Field label="Height"><input type="number" className={I} value={h} onChange={(e) => setH(+e.target.value)} /></Field>
          </div>
          <p className="text-xs text-muted-foreground">Original size: {img.width} × {img.height}px</p>
          <Button onClick={doCrop}>Crop</Button>
          {out && <div><img src={out} className="max-w-full rounded-lg border border-border/60" /><Button className="mt-3" onClick={async () => downloadBlob("cropped-" + name, await (await fetch(out)).blob())}>Download</Button></div>}
        </div>
      )}
    </div>
  );
}

function Converter({ fromExt, toType, toExt }: { fromExt: string; toType: string; toExt: string }) {
  const { img, name, load } = useImageLoader();
  const [out, setOut] = useState<string | null>(null);
  useEffect(() => {
    if (!img) return;
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    c.getContext("2d")!.drawImage(img, 0, 0);
    canvasToBlob(c, toType, 0.92).then((b) => setOut(URL.createObjectURL(b)));
  }, [img, toType]);
  return (
    <div>
      <FileDrop onFile={load} accept={`image/${fromExt},image/*`} />
      {out && img && (
        <div className="mt-4">
          <img src={out} className="w-full rounded-lg border border-border/60" />
          <Button className="mt-3" onClick={async () => downloadBlob(name.replace(/\.\w+$/, "") + "." + toExt, await (await fetch(out)).blob())}>Download {toExt.toUpperCase()}</Button>
        </div>
      )}
    </div>
  );
}
export const JpgToPng = () => <Converter fromExt="jpeg" toType="image/png" toExt="png" />;
export const PngToJpg = () => <Converter fromExt="png" toType="image/jpeg" toExt="jpg" />;
export const WebpConverter = () => <Converter fromExt="*" toType="image/webp" toExt="webp" />;

export function ImageToBase64() {
  const { img, load } = useImageLoader();
  const [b64, setB64] = useState("");
  useEffect(() => {
    if (!img) return;
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    c.getContext("2d")!.drawImage(img, 0, 0);
    setB64(c.toDataURL("image/png"));
  }, [img]);
  return (
    <div>
      <FileDrop onFile={load} />
      {b64 && <><textarea className={`${T} mt-4`} readOnly value={b64} /><ActionBar onCopy={() => copyText(b64)} /></>}
    </div>
  );
}

export function Base64ToImage() {
  const [t, setT] = useState("");
  const [ok, setOk] = useState(false);
  useEffect(() => { setOk(t.startsWith("data:image/")); }, [t]);
  return (
    <div>
      <textarea className={T} placeholder="Paste data:image/... base64 URL" value={t} onChange={(e) => setT(e.target.value)} />
      {ok && <div className="mt-4"><img src={t} className="max-w-full rounded-lg border border-border/60" /><Button className="mt-3" onClick={async () => downloadBlob("image.png", await (await fetch(t)).blob())}>Download</Button></div>}
      {t && !ok && <p className="mt-2 text-sm text-destructive">Invalid data URL — must start with data:image/</p>}
    </div>
  );
}

function transformImg(img: HTMLImageElement, fn: (ctx: CanvasRenderingContext2D, c: HTMLCanvasElement) => void): Promise<string> {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  fn(ctx, c);
  return canvasToBlob(c, "image/png").then(URL.createObjectURL);
}

export function RotateImage() {
  const { img, name, load } = useImageLoader();
  const [deg, setDeg] = useState(90); const [out, setOut] = useState<string | null>(null);
  const doRotate = async () => {
    if (!img) return;
    const rad = (deg * Math.PI) / 180;
    const s = Math.abs(Math.sin(rad)); const co = Math.abs(Math.cos(rad));
    const url = await transformImg(img, (ctx, c) => {
      c.width = img.width * co + img.height * s; c.height = img.width * s + img.height * co;
      ctx.translate(c.width / 2, c.height / 2); ctx.rotate(rad); ctx.drawImage(img, -img.width / 2, -img.height / 2);
    });
    setOut(url);
  };
  return (
    <div>
      <FileDrop onFile={load} />
      {img && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">{[90, 180, 270, 45].map(d => <Button key={d} size="sm" variant={deg === d ? "default" : "outline"} onClick={() => setDeg(d)}>{d}°</Button>)}</div>
          <Button className="mt-3" onClick={doRotate}>Rotate</Button>
          {out && <div className="mt-3"><img src={out} className="max-w-full rounded-lg border border-border/60" /><Button className="mt-3" onClick={async () => downloadBlob("rotated-" + name, await (await fetch(out)).blob())}>Download</Button></div>}
        </div>
      )}
    </div>
  );
}

export function FlipImage() {
  const { img, name, load } = useImageLoader();
  const [out, setOut] = useState<string | null>(null);
  const doFlip = async (dir: "h" | "v") => {
    if (!img) return;
    const url = await transformImg(img, (ctx, c) => {
      c.width = img.width; c.height = img.height;
      if (dir === "h") { ctx.translate(c.width, 0); ctx.scale(-1, 1); }
      else { ctx.translate(0, c.height); ctx.scale(1, -1); }
      ctx.drawImage(img, 0, 0);
    });
    setOut(url); toast.success("Flipped");
  };
  return (
    <div>
      <FileDrop onFile={load} />
      {img && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => doFlip("h")}>Flip horizontal</Button>
          <Button variant="outline" onClick={() => doFlip("v")}>Flip vertical</Button>
        </div>
      )}
      {out && <div className="mt-3"><img src={out} className="max-w-full rounded-lg border border-border/60" /><Button className="mt-3" onClick={async () => downloadBlob("flipped-" + name, await (await fetch(out)).blob())}>Download</Button></div>}
    </div>
  );
}
