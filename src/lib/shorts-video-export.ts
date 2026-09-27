// A completely local renderer: the narration never leaves the browser.
import { AudioBufferSource, BufferTarget, CanvasSource, Mp4OutputFormat, Output, Quality, canEncodeAudio, canEncodeVideo } from "mediabunny";

export type CharacterStyle = "sathi" | "creator" | "teacher";

const W = 540;
const H = 960;
const FPS = 15;

export function captionSegments(script: string): string[] {
  const parts = script.trim().split(/(?<=[।.!?])\s+|\n+/u).map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) return parts.flatMap((part) => part.length > 95 ? part.match(/.{1,85}(?:\s|$)|.{1,85}/gu)?.map((text) => text.trim()) ?? [part] : [part]);
  return script.trim().match(/.{1,70}(?:\s|$)|.{1,70}/gu)?.map((text) => text.trim()) ?? [];
}

function wrapped(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function render(ctx: CanvasRenderingContext2D, title: string, segments: string[], style: CharacterStyle, time: number, duration: number) {
  const colors = style === "teacher" ? ["#163c36", "#1b6155", "#60d1ad"] : style === "creator" ? ["#34263c", "#814f55", "#ffbd77"] : ["#132c48", "#285780", "#fbb768"];
  const sky = ctx.createLinearGradient(0, 0, W, H);
  sky.addColorStop(0, colors[0]); sky.addColorStop(1, colors[1]);
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = 0.12; ctx.strokeStyle = colors[2];
  for (let i = 0; i < 10; i++) {
    ctx.beginPath(); ctx.arc(270, 450, 190 + i * 48 + Math.sin(time + i) * 5, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = colors[2]; ctx.fillRect(40, 64, 38, 5);
  ctx.font = "bold 20px sans-serif"; ctx.fillStyle = "#ffffff"; ctx.fillText("BHARAT AI SATHI", 94, 82);
  ctx.font = "bold 28px sans-serif";
  const titleLines = wrapped(ctx, title, 460).slice(0, 2);
  titleLines.forEach((line, i) => ctx.fillText(line, 40, 162 + 37 * i));

  // Illustrated host: moving arms, blink, head bob and speaking mouth.
  const bob = Math.sin(time * 3) * 5;
  ctx.save(); ctx.translate(270, bob);
  ctx.fillStyle = "#101c2b"; ctx.beginPath(); ctx.ellipse(0, 842, 204, 29, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = style === "teacher" ? "#f2aa54" : style === "creator" ? "#df6267" : "#478ee0";
  ctx.beginPath(); ctx.ellipse(0, 754, 171, 171, 0, Math.PI, Math.PI * 2); ctx.lineTo(171, 830); ctx.lineTo(-171, 830); ctx.fill();
  ctx.strokeStyle = "#d8936a"; ctx.lineWidth = 31; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-139, 717); ctx.lineTo(-190, 755 - 16 * Math.sin(time * 2)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(139, 717); ctx.lineTo(189, 723 + 22 * Math.sin(time * 2)); ctx.stroke();
  ctx.fillStyle = "#e2a77c"; ctx.fillRect(-29, 614, 58, 63);
  ctx.fillStyle = "#242635"; ctx.beginPath(); ctx.ellipse(0, 471, 127, 151, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#efbb91"; ctx.beginPath(); ctx.ellipse(0, 513, 113, 138, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#252735"; ctx.beginPath(); ctx.ellipse(0, 415, 116, 69, -0.14, Math.PI, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#252735";
  const blink = Math.sin(time * 1.7) > 0.993;
  for (const x of [-42, 42]) { ctx.beginPath(); ctx.ellipse(x, 517, 7, blink ? 1 : 8, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = "#874a46"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 560, 22, 0.16, Math.PI - 0.16); ctx.stroke();
  ctx.fillStyle = "#713f40"; ctx.beginPath(); ctx.ellipse(0, 575, 16, 3 + Math.abs(Math.sin(time * 13)) * 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  const index = Math.min(segments.length - 1, Math.floor((time / duration) * segments.length));
  ctx.fillStyle = "#101d2af0"; ctx.fillRect(0, 694, W, 198);
  const caption = segments[index] ?? "";
  let size = 36;
  ctx.font = `bold ${size}px sans-serif`;
  let lines = wrapped(ctx, caption, 460);
  while (lines.length > 3 && size > 24) { size -= 2; ctx.font = `bold ${size}px sans-serif`; lines = wrapped(ctx, caption, 460); }
  ctx.textAlign = "center"; ctx.fillStyle = "#ffffff";
  lines.forEach((line, i) => ctx.fillText(line, W / 2, 755 + i * (size + 9)));
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff55"; ctx.fillRect(40, 914, W - 80, 4);
  ctx.fillStyle = colors[2]; ctx.fillRect(40, 914, (W - 80) * Math.min(1, time / duration), 4);
}

export function drawShortsPreview(canvas: HTMLCanvasElement, script: string, title: string, style: CharacterStyle, time: number, duration: number) {
  const ctx = canvas.getContext("2d");
  if (ctx) render(ctx, title, captionSegments(script), style, time, duration);
}

export async function exportShortsVideo(audio: AudioBuffer, script: string, title: string, style: CharacterStyle, onProgress: (value: number) => void): Promise<Blob> {
  if (!audio.duration || audio.duration > 60) throw new Error("Recording 60 seconds se chhoti rakhein.");
  if (!await canEncodeVideo("avc", { width: W, height: H, bitrate: 1_000_000 }) || !await canEncodeAudio("aac")) {
    throw new Error("Is browser mein MP4 export available nahi hai. Latest Chrome ya Edge desktop par kholein.");
  }
  const segments = captionSegments(script);
  if (!segments.length) throw new Error("Video script likhein.");
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Video canvas available nahi hai.");
  const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });
  const video = new CanvasSource(canvas, { codec: "avc", bitrate: new Quality("medium") });
  const narration = new AudioBufferSource({ codec: "aac", bitrate: 96000 });
  output.addVideoTrack(video); output.addAudioTrack(narration);
  await output.start();
  try {
    await narration.add(audio);
    const frames = Math.ceil(audio.duration * FPS);
    for (let frame = 0; frame < frames; frame++) {
      const time = frame / FPS;
      render(ctx, title, segments, style, time, audio.duration);
      await video.add(time, Math.min(1 / FPS, audio.duration - time));
      if (frame % 12 === 0) onProgress(Math.round(frame / frames * 100));
    }
    await output.finalize();
    const buffer = output.target.buffer;
    if (!buffer) throw new Error("MP4 export empty hai.");
    onProgress(100);
    return new Blob([buffer], { type: "video/mp4" });
  } catch (error) { await output.cancel(); throw error; }
}