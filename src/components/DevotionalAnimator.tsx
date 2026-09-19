import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const DURATION = 9.5;

const POETRY = [
  { t0: 0, t1: 2.2, gurmukhi: "ਦੁਨੀਆਂ ਦਾ ਸਭ ਤੋਂ ਅਮੀਰ ਪਿਤਾ,", translit: "Duniya da sab ton ameer pita," },
  { t0: 2.2, t1: 4.5, gurmukhi: "ਆਪਣਾ ਸਭ ਸਾਡੇ ਲਈ ਵਾਰ ਕੇ,", translit: "Apna sab saade layi vaar ke," },
  { t0: 4.5, t1: 6.8, gurmukhi: "ਕੰਡਿਆਂ 'ਤੇ ਸੌਂਦਾ ਰਿਹਾ...", translit: "Kandiyan 'te saunda reha..." },
  { t0: 6.8, t1: 9.5, gurmukhi: "ਧੰਨ ਧੰਨ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ", translit: "Dhan Dhan Guru Gobind Singh Ji" },
] as const;

type WebkitAudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

function drawScene(ctx: CanvasRenderingContext2D, time: number) {
  const width = 1080;
  const height = 1920;
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#030712");
  sky.addColorStop(0.3, "#08142c");
  sky.addColorStop(0.7, "#0f2444");
  sky.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 40; i += 1) {
    const sx = (i * 127) % width;
    const sy = (i * 83) % (height * 0.55);
    ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * Math.sin(time * 2.5 + i)})`;
    ctx.beginPath();
    ctx.arc(sx, sy, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const moonX = 340;
  const moonY = 280;
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 40, moonX, moonY, 380);
  moonGlow.addColorStop(0, "rgba(254,240,138,.45)");
  moonGlow.addColorStop(0.5, "rgba(217,119,6,.12)");
  moonGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 380, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fef9c3";
  ctx.beginPath();
  ctx.arc(moonX, moonY, 65, 0, Math.PI * 2);
  ctx.fill();

  const zoom = time < 2 ? 1 : 1 + Math.min(1.2, (time - 2) * 0.45);
  const targetX = 720;
  const targetY = 1260;
  const cameraX = width * 0.5 + (targetX - width * 0.5) * (zoom - 1);
  const cameraY = height * 0.5 + (targetY - height * 0.5) * (zoom - 1);
  ctx.save();
  ctx.translate(width * 0.5, height * 0.5);
  ctx.scale(zoom, zoom);
  ctx.translate(-cameraX, -cameraY);

  const falconProgress = (time * 0.15) % 1;
  ctx.save();
  ctx.translate(width * (1.1 - falconProgress * 1.3), 200 + Math.sin(time * 2.5) * 40);
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(25, -20 * Math.sin(time * 6), 55, -8);
  ctx.quadraticCurveTo(20, 5, 0, 8);
  ctx.quadraticCurveTo(-20, 5, -55, -8);
  ctx.quadraticCurveTo(-25, -20 * Math.sin(time * 6), 0, 0);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "#09182d";
  ctx.beginPath();
  ctx.moveTo(0, height * 0.6);
  ctx.bezierCurveTo(width * 0.35, height * 0.65, width * 0.45, height * 0.8, 0, height);
  ctx.fill();
  for (let r = 0; r < 25; r += 1) {
    const riverY = height * 0.63 + r * 22;
    const riverX = 80 + Math.sin(riverY * 0.03 + time * 2.5) * 45;
    ctx.fillStyle = "rgba(254,240,138,.4)";
    ctx.fillRect(riverX, riverY, 50 + r * 3, 2.5);
  }

  ctx.fillStyle = "#140c06";
  ctx.beginPath();
  ctx.moveTo(850, 500);
  ctx.bezierCurveTo(890, 800, 810, 1100, 860, 1600);
  ctx.lineTo(1080, 1920);
  ctx.lineTo(650, 1920);
  ctx.bezierCurveTo(700, 1650, 770, 1400, 780, 1200);
  ctx.bezierCurveTo(800, 1000, 780, 800, 790, 500);
  ctx.fill();

  const guruX = 720;
  const guruY = 1260;
  const haloRadius = 250 + Math.sin(time * 3) * 15;
  const halo = ctx.createRadialGradient(guruX + 60, guruY - 160, 30, guruX + 60, guruY - 160, haloRadius);
  halo.addColorStop(0, "rgba(254,240,138,.95)");
  halo.addColorStop(0.3, "rgba(245,158,11,.7)");
  halo.addColorStop(0.7, "rgba(217,119,6,.25)");
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(guruX + 60, guruY - 160, haloRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(guruX + 60, guruY - 160);
  ctx.rotate(time * 0.35);
  for (let i = 0; i < 32; i += 1) {
    const angle = (i * Math.PI * 2) / 32;
    ctx.strokeStyle = i % 2 === 0 ? "rgba(254,240,138,.65)" : "rgba(245,158,11,.35)";
    ctx.lineWidth = i % 2 === 0 ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * 90, Math.sin(angle) * 90);
    ctx.lineTo(Math.cos(angle) * (180 + (i % 3) * 30), Math.sin(angle) * (180 + (i % 3) * 30));
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "#1e3a8a";
  ctx.beginPath();
  ctx.ellipse(guruX, guruY + 60, 95, 70, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(guruX - 180, guruY + 140, 170, 35);
  ctx.fillStyle = "#b91c1c";
  ctx.fillRect(guruX - 30, guruY + 50, 80, 28);
  ctx.fillStyle = "#e0a97a";
  ctx.beginPath();
  ctx.ellipse(guruX + 55, guruY - 130, 32, 40, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.ellipse(guruX + 55, guruY - 100, 26, 32, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1d4ed8";
  ctx.beginPath();
  ctx.ellipse(guruX + 58, guruY - 170, 48, 38, -0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(guruX + 30, guruY - 220, 10, 32, -0.2, 0, Math.PI * 2);
  ctx.fill();

  for (let p = 0; p < 50; p += 1) {
    const particleX = (p * 79 + time * 50) % width;
    const particleY = (p * 113 - time * 60) % height;
    ctx.fillStyle = "rgba(254,240,138,.85)";
    ctx.beginPath();
    ctx.arc(particleX, particleY < 0 ? height + particleY : particleY, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function DevotionalAnimator() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(true);
  const timeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    let animationId = 0;
    let lastFrame = performance.now();
    let lastUiUpdate = 0;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.width = 1080;
    canvas.height = 1920;

    const render = (now: number) => {
      const delta = Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      if (playingRef.current) timeRef.current = (timeRef.current + delta) % DURATION;
      drawScene(context, timeRef.current);
      if (now - lastUiUpdate > 100) {
        setPlaybackTime(timeRef.current);
        lastUiUpdate = now;
      }
      animationId = requestAnimationFrame(render);
    };
    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => () => {
    oscillatorsRef.current.forEach((oscillator) => oscillator.stop());
    void audioContextRef.current?.close();
  }, []);

  const toggleAudio = async () => {
    let audioContext = audioContextRef.current;
    if (!audioContext) {
      const AudioContextConstructor = window.AudioContext ?? (window as WebkitAudioWindow).webkitAudioContext;
      if (!AudioContextConstructor) return;
      audioContext = new AudioContextConstructor();
      audioContextRef.current = audioContext;
      const masterGain = audioContext.createGain();
      masterGain.gain.value = 0;
      masterGain.connect(audioContext.destination);
      masterGainRef.current = masterGain;
      oscillatorsRef.current = [68.05, 136.1, 204.15, 272.2].map((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = index === 1 ? "triangle" : "sine";
        oscillator.frequency.value = frequency;
        gain.gain.value = 0.2 / (index + 1);
        oscillator.connect(gain);
        gain.connect(masterGain);
        oscillator.start();
        return oscillator;
      });
    }
    if (audioContext.state === "suspended") await audioContext.resume();
    const nextAudioState = !isAudioOn;
    setIsAudioOn(nextAudioState);
    masterGainRef.current?.gain.setTargetAtTime(nextAudioState ? 0.25 : 0, audioContext.currentTime, 0.1);
  };

  const restart = () => {
    timeRef.current = 0;
    setPlaybackTime(0);
  };

  const activeVerse = POETRY.find((verse) => playbackTime >= verse.t0 && playbackTime < verse.t1) ?? POETRY[0];

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center rounded-xl border border-saffron/30 bg-card/70 px-3 py-6 shadow-2xl sm:px-6 sm:py-8">
      <div className="mb-5 max-w-lg text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-3 py-1 text-xs font-semibold text-saffron">
          <Sparkles className="size-3.5" aria-hidden="true" />
          <span>ਮਾਛੀਵਾੜਾ ਸਾਹਿਬ ਅਲੌਕਿਕ ਦਰਸ਼ਨ</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">Sacred Devotional Darshan</h2>
        <p className="mt-1 text-sm text-muted-foreground">Experience the divine presence of Guru Gobind Singh Ji</p>
      </div>

      <div className="relative aspect-[9/16] w-full max-w-[380px] overflow-hidden rounded-xl border border-saffron/30 bg-background shadow-glow">
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-pointer object-contain"
          onClick={() => setIsPlaying((current) => !current)}
          aria-label={isPlaying ? "Pause devotional scene" : "Play devotional scene"}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsPlaying((current) => !current);
            }
          }}
        />
        <div className="pointer-events-none absolute inset-x-3 bottom-4 rounded-lg border border-saffron/30 bg-background/75 p-3 text-center backdrop-blur-md sm:inset-x-4 sm:bottom-6 sm:p-4">
          <p className="text-lg font-bold text-saffron sm:text-2xl">{activeVerse.gurmukhi}</p>
          <p className="mt-1 text-xs italic text-foreground/80">{activeVerse.translit}</p>
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-[380px] flex-wrap items-center justify-center gap-2 sm:gap-3">
        <Button onClick={() => setIsPlaying((current) => !current)} size="lg" aria-label={isPlaying ? "Pause animation" : "Play animation"}>
          {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button onClick={restart} variant="outline" size="icon" className="h-10 w-10" title="Restart scene" aria-label="Restart scene">
          <RotateCcw aria-hidden="true" />
        </Button>
        <Button onClick={() => void toggleAudio()} variant={isAudioOn ? "secondary" : "outline"} size="lg" aria-pressed={isAudioOn}>
          {isAudioOn ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          {isAudioOn ? "Spiritual Dhun On" : "Play Sound"}
        </Button>
      </div>
      <div className="mt-4 h-1 w-full max-w-[380px] overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <div className="h-full bg-primary transition-[width] duration-100" style={{ width: `${(playbackTime / DURATION) * 100}%` }} />
      </div>
    </section>
  );
}