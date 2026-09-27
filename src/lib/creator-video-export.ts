// Browser-only MP4 encoding. Loaded dynamically after a user starts an export.
import { AudioBufferSource, BufferTarget, CanvasSource, Mp4OutputFormat, Output, Quality, canEncodeAudio, canEncodeVideo } from "mediabunny";

export type VideoScene = { text: string; image?: File };

const W = 540;
const H = 960;
const FPS = 15;

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number, fontSize: number) {
  ctx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) { lines.push(line); line = word; }
    else line = candidate;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines && fontSize > 24) {
    return fitText(ctx, text, maxWidth, maxLines, Math.max(24, fontSize - 3));
  }
  if (lines.length > maxLines) {
    const visible = lines.slice(0, maxLines);
    visible[maxLines - 1] = `${visible[maxLines - 1].slice(0, 26)}…`;
    return visible;
  }
  return lines;
}

function draw(ctx: CanvasRenderingContext2D, scene: VideoScene, image: HTMLImageElement | null, index: number, count: number, progress: number, topic: string) {
  const colors = ["#e39a39", "#48b98d", "#4c8cdb", "#d86977"];
  const accent = colors[index % colors.length];
  const background = ctx.createLinearGradient(0, 0, W, H);
  background.addColorStop(0, "#111a2c"); background.addColorStop(1, "#182b32");
  ctx.fillStyle = background; ctx.fillRect(0, 0, W, H);
  if (image) {
    const scale = Math.max(W / image.width, H / image.height);
    const iw = image.width * scale, ih = image.height * scale;
    // A gentle documentary pan prevents a static slide even with one image.
    ctx.drawImage(image, (W - iw) / 2 + (1 - progress) * 12, (H - ih) / 2, iw, ih);
    const shade = ctx.createLinearGradient(0, 100, 0, H);
    shade.addColorStop(0, "#101a2b44"); shade.addColorStop(0.5, "#101a2b99"); shade.addColorStop(1, "#101a2bee");
    ctx.fillStyle = shade; ctx.fillRect(0, 0, W, H);
  } else {
    ctx.save(); ctx.translate(W * 0.65, H * 0.37); ctx.rotate(-0.25 + progress * 0.08);
    ctx.strokeStyle = accent; ctx.globalAlpha = 0.17;
    for (let i = 0; i < 9; i++) { ctx.lineWidth = 1 + i * 2; ctx.strokeRect(-125 - i * 20, -195 - i * 20, 250 + i * 40, 390 + i * 40); }
    ctx.restore();
    ctx.fillStyle = accent; ctx.globalAlpha = 0.1; ctx.beginPath(); ctx.arc(440 - progress * 30, 300, 170, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }
  ctx.fillStyle = accent; ctx.fillRect(36, 50, 42, 5);
  ctx.font = '600 19px "Space Grotesk", sans-serif'; ctx.fillStyle = "#ffffff"; ctx.fillText("BHARAT AI SATHI", 92, 69);
  ctx.font = '600 21px "Space Grotesk", sans-serif'; ctx.fillStyle = accent; ctx.fillText(`SCENE ${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`, 38, 480);
  const lines = fitText(ctx, scene.text, W - 76, image ? 3 : 8, image ? 34 : 42);
  ctx.fillStyle = "#ffffff";
  if (image) { ctx.fillStyle = "#101a2bcc"; ctx.fillRect(0, 660, W, 260); ctx.fillStyle = "#ffffff"; }
  lines.forEach((line, i) => ctx.fillText(line, 38, (image ? 720 : 550) + i * (image ? 46 : 54)));
  ctx.font = '500 19px "Space Grotesk", sans-serif'; ctx.fillStyle = "#d0d8dd";
  const topicLine = fitText(ctx, topic, W - 76, 2, 19);
  topicLine.forEach((line, i) => ctx.fillText(line, 38, 868 + i * 24));
  ctx.fillStyle = "#ffffff55"; ctx.fillRect(38, 920, W - 76, 3);
  ctx.fillStyle = accent; ctx.fillRect(38, 920, (W - 76) * progress, 3);
}

export async function exportCreatorMp4(audio: AudioBuffer, scenes: VideoScene[], topic: string, onProgress: (progress: number) => void): Promise<Blob> {
  if (!scenes.length || audio.duration <= 0 || audio.duration > 65) throw new Error("Narration must be 65 seconds or shorter.");
  if (!await canEncodeVideo("avc", { width: W, height: H, bitrate: 1_000_000 }) || !await canEncodeAudio("aac")) {
    throw new Error("This browser cannot export MP4. Please use the latest Chrome or Edge on desktop.");
  }
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Video canvas is not available.");
  const images = await Promise.all(scenes.map(async ({ image }) => {
    if (!image) return null;
    const bitmap = await createImageBitmap(image);
    const element = document.createElement("canvas"); element.width = bitmap.width; element.height = bitmap.height;
    element.getContext("2d")?.drawImage(bitmap, 0, 0); bitmap.close();
    const img = new Image(); img.src = element.toDataURL("image/jpeg", 0.85);
    await img.decode(); return img;
  }));
  const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });
  const video = new CanvasSource(canvas, { codec: "avc", bitrate: new Quality("medium") });
  const narration = new AudioBufferSource({ codec: "aac", bitrate: 96000 });
  output.addVideoTrack(video);
  output.addAudioTrack(narration);
  await output.start();
  const frameCount = Math.ceil(audio.duration * FPS);
  const sceneLength = audio.duration / scenes.length;
  try {
    await narration.add(audio);
    for (let frame = 0; frame < frameCount; frame++) {
      const time = frame / FPS;
      const index = Math.min(scenes.length - 1, Math.floor(time / sceneLength));
      draw(ctx, scenes[index], images[index], index, scenes.length, (time - index * sceneLength) / sceneLength, topic);
      await video.add(time, Math.min(1 / FPS, audio.duration - time));
      if (frame % 10 === 0) onProgress(Math.round((frame / frameCount) * 100));
    }
    await output.finalize();
    const buffer = output.target.buffer;
    if (!buffer) throw new Error("MP4 export was empty.");
    onProgress(100);
    return new Blob([buffer], { type: "video/mp4" });
  } catch (error) {
    await output.cancel();
    throw error;
  }
}