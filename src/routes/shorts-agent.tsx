import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Mic,
  PlaySquare,
  Sparkles,
  Square,
  Upload,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateShorts } from "@/lib/shorts-agent.functions";
import { getYoutubeClientId } from "@/lib/youtube-client.functions";
import { supabase } from "@/integrations/supabase/client";
import { YOUTUBE_UPLOAD_SCOPE, googleAccounts, type GoogleTokenClient, type GoogleTokenResponse } from "@/lib/youtube-connect";
import { drawShortsPreview, exportShortsVideo, type CharacterStyle } from "@/lib/shorts-video-export";

const languages = ["Hindi", "Punjabi", "English"] as const;
type Language = (typeof languages)[number];

type ShortsResult = {
  script: string;
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
};

const emptyResult: ShortsResult = {
  script: "",
  title: "",
  description: "",
  tags: [],
  hashtags: [],
};

export const Route = createFileRoute("/shorts-agent")({
  head: () => ({
    meta: [
      { title: "YouTube Shorts Agent — Bharat AI Sathi" },
      {
        name: "description",
        content: "Generate a YouTube Shorts video script, title, description, tags, and hashtags in Hindi, Punjabi, or English.",
      },
      { property: "og:title", content: "YouTube Shorts Agent — Bharat AI Sathi" },
      {
        property: "og:description",
        content: "Create a complete, ready-to-record YouTube Shorts content package with AI.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://bharataisathi.com/shorts-agent" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/shorts-agent" }],
  }),
  component: ShortsAgentPage,
});

function ResultBox({
  title,
  icon: Icon,
  value,
  placeholder,
}: {
  title: string;
  icon: typeof PlaySquare;
  value: string;
  placeholder: string;
}) {
  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    toast.success(`${title} copied`);
  };

  return (
    <section className="flex min-h-[260px] flex-col rounded-lg border border-border/70 bg-card/70 p-5 shadow-elegant">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-royal/15 text-royal">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h2 className="font-display text-base font-semibold">{title}</h2>
        </div>
        <Button variant="ghost" size="icon" disabled={!value} onClick={copy} aria-label={`Copy ${title}`} title={`Copy ${title}`}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        readOnly
        value={value}
        placeholder={placeholder}
        aria-label={title}
        className="min-h-[180px] flex-1 resize-none border-border/60 bg-background/35 leading-relaxed"
      />
    </section>
  );
}

function ShortsAgentPage() {
  const runGeneration = useServerFn(generateShorts);
  const loadYoutubeClientId = useServerFn(getYoutubeClientId);
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<Language>("Hindi");
  const [result, setResult] = useState<ShortsResult>(emptyResult);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [channel, setChannel] = useState<{ id: string; title: string } | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [youtubeClientId, setYoutubeClientId] = useState<string | null>(null);
  const [youtubeConfigError, setYoutubeConfigError] = useState(false);
  const [style, setStyle] = useState<CharacterStyle>("sathi");
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [video, setVideo] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoBusy, setVideoBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [publishTitle, setPublishTitle] = useState("");
  const [publishDescription, setPublishDescription] = useState("");
  const [publishTags, setPublishTags] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "unlisted" | "public">("private");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingStream = useRef<MediaStream | null>(null);
  const recorderStartedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const uploadToken = useRef<string | null>(null);
  const tokenClient = useRef<GoogleTokenClient | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result.script) return;
    let frame = 0;
    const started = performance.now();
    const tick = () => {
      drawShortsPreview(canvas, result.script, result.title || topic, style, ((performance.now() - started) / 1000) % 30, 30);
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [result.script, result.title, topic, style]);

  useEffect(() => {
    return () => {
      mediaRecorder.current?.stop();
      recordingStream.current?.getTracks().forEach((track) => track.stop());
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  useEffect(() => () => { if (recordingUrl) URL.revokeObjectURL(recordingUrl); if (videoUrl) URL.revokeObjectURL(videoUrl); }, [recordingUrl, videoUrl]);

  const resetVideo = () => {
    setRecordedAudio(null); setRecordingUrl(""); setVideo(null); setVideoUrl(""); setUploadedUrl("");
  };

  const freeScript = () => {
    const clean = topic.trim();
    if (!clean) { toast.error("Pehle topic likhein."); return; }
    if (language !== "Hindi") { toast.error("Free animated flow abhi Hindi mein available hai. Hindi chunein."); return; }
    const script = `क्या आप ${clean} के बारे में जानना चाहते हैं? चलिए इसे आसान भाषा में समझते हैं। सबसे पहले, इस विषय की बुनियादी जानकारी भरोसेमंद स्रोतों से जाँचें। फिर एक छोटा लक्ष्य तय करें और उसे पूरा करने के लिए कदम-दर-कदम आगे बढ़ें। जो सीखें, उसे अपने अनुभव के साथ मिलाकर परखें। ज़्यादा जानकारी के लिए जुड़े रहें और अपनी राय कमेंट में बताएँ।`;
    const title = `${clean} | आसान हिंदी में #Shorts`.slice(0, 100);
    const next = { script, title, description: `${clean} पर संक्षिप्त जानकारी। कृपया महत्वपूर्ण जानकारी स्वतंत्र रूप से जाँचें। #Shorts #BharatAISathi`, tags: [clean, "Hindi shorts", "Bharat AI Sathi"], hashtags: ["#Shorts", "#Hindi", "#BharatAISathi"] };
    resetVideo(); setResult(next); setSaved(false);
    setPublishTitle(next.title); setPublishDescription(next.description); setPublishTags(next.tags.join(", "));
  };

  const stopRecording = () => { if (mediaRecorder.current?.state === "recording") mediaRecorder.current.stop(); };

  const startRecording = async () => {
    if (!result.script) { toast.error("Pehle script banayein."); return; }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { toast.error("Is browser mein microphone recording available nahi hai."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordingStream.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorder.current = recorder;
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => toast.error("Recording fail ho gayi. Dobara try karein.");
      recorder.onstop = () => {
        if (timer.current) clearInterval(timer.current);
        stream.getTracks().forEach((track) => track.stop());
        recordingStream.current = null;
        setRecording(false);
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        if (blob.size) { setRecordedAudio(blob); setRecordingUrl(URL.createObjectURL(blob)); setVideo(null); setVideoUrl(""); }
      };
      recorder.start(); setRecording(true); setRecordingSeconds(0);
      recorderStartedAt.current = Date.now();
      timer.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - recorderStartedAt.current) / 1000);
        setRecordingSeconds(elapsed);
        if (elapsed >= 59) stopRecording();
      }, 250);
    } catch { toast.error("Microphone permission dein, phir dobara try karein."); }
  };

  const makeMp4 = async () => {
    if (!recordedAudio) return;
    setVideoBusy(true); setVideoProgress(0);
    try {
      const context = new AudioContext();
      let decoded: AudioBuffer;
      try { decoded = await context.decodeAudioData(await recordedAudio.arrayBuffer()); }
      finally { await context.close(); }
      const blob = await exportShortsVideo(decoded, result.script, result.title, style, setVideoProgress);
      setVideo(blob); setVideoUrl(URL.createObjectURL(blob)); setUploadedUrl("");
      toast.success("9:16 MP4 tayyar hai. Preview dekhein, phir download ya upload karein.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "MP4 nahi ban saka."); }
    finally { setVideoBusy(false); }
  };

  const downloadMp4 = () => {
    if (!video) return;
    const link = document.createElement("a"); link.href = URL.createObjectURL(video); link.download = "bharat-ai-sathi-short.mp4";
    link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => { if (active) setSignedIn(Boolean(data.user)); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setSignedIn(Boolean(session?.user));
      if (!session) {
        uploadToken.current = null;
        setChannel(null);
      }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    let active = true;
    const onGoogleLoaded = () => { if (active) setGoogleReady(Boolean(googleAccounts()?.oauth2)); };
    void loadYoutubeClientId().then((id) => {
      if (active) setYoutubeClientId(id);
    }).catch(() => {
      if (active) setYoutubeConfigError(true);
    });
    const existing = document.querySelector<HTMLScriptElement>('script[data-youtube-google]');
    if (existing) {
      if (googleAccounts()?.oauth2) onGoogleLoaded();
      else existing.addEventListener("load", onGoogleLoaded);
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.dataset.youtubeGoogle = "true";
      script.addEventListener("load", onGoogleLoaded);
      document.head.appendChild(script);
    }
    return () => {
      active = false;
      document.querySelector<HTMLScriptElement>('script[data-youtube-google]')?.removeEventListener("load", onGoogleLoaded);
    };
  }, [loadYoutubeClientId]);

  const handleGoogleToken = async (response: GoogleTokenResponse) => {
    if (response.error || !response.access_token) {
      toast.error(response.error_description || response.error || "Google permission was not granted.");
      setConnecting(false);
      return;
    }
    try {
      const apiResponse = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
        headers: { Authorization: `Bearer ${response.access_token}` },
      });
      if (!apiResponse.ok) throw new Error(`YouTube channel could not be loaded (${apiResponse.status}). Check that YouTube Data API v3 is enabled for this Google project.`);
      const payload: { items?: Array<{ id: string; snippet?: { title?: string } }> } = await apiResponse.json();
      const item = payload.items?.[0];
      if (!item?.id) throw new Error("No YouTube channel was found for this Google account.");
      uploadToken.current = response.access_token;
      setChannel({ id: item.id, title: item.snippet?.title || "YouTube channel" });
      toast.success(`Connected to ${item.snippet?.title || "YouTube"}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not connect to YouTube.");
    } finally {
      setConnecting(false);
    }
  };

  const connectYoutube = () => {
    if (!youtubeClientId) { toast.error("Google connection is not configured yet."); return; }
    const oauth = googleAccounts()?.oauth2;
    if (!oauth) { toast.error("Google is still loading. Please try again."); return; }
    try {
      setConnecting(true);
      tokenClient.current ??= oauth.initTokenClient({
        client_id: youtubeClientId,
        scope: YOUTUBE_UPLOAD_SCOPE,
        callback: (response) => { void handleGoogleToken(response); },
        error_callback: (error) => {
          setConnecting(false);
          if (error.type !== "popup_closed") toast.error(`Google connection failed: ${error.type}`);
        },
      });
      tokenClient.current.requestAccessToken({ prompt: "consent" });
    } catch (error) {
      setConnecting(false);
      toast.error(error instanceof Error ? error.message : "Could not open Google sign-in.");
    }
  };

  const disconnectYoutube = () => {
    if (uploadToken.current) googleAccounts()?.oauth2.revoke(uploadToken.current);
    uploadToken.current = null;
    setChannel(null);
    toast.success("YouTube channel disconnected from this session.");
  };

  const generate = async () => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      toast.error("Please enter a topic.");
      return;
    }
    if (cleanTopic.length > 200) {
      toast.error("Topic must be 200 characters or less.");
      return;
    }

    setLoading(true);
    setSaved(false);
    try {
      const nextResult = await runGeneration({ data: { topic: cleanTopic, language } });
      resetVideo();
      setResult(nextResult);
      setPublishTitle(nextResult.title); setPublishDescription(nextResult.description); setPublishTags(nextResult.tags.join(", "));
      setSaved(true);
      toast.success("Shorts script generated and saved.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Shorts script generate nahi ho saka.";
      toast.error(message.includes("Unauthorized") ? "Please sign in to generate and save your Shorts script." : message);
    } finally {
      setLoading(false);
    }
  };

  const uploadToYoutube = async () => {
    if (!video || !channel || !uploadToken.current) { toast.error("Pehle MP4 banayein aur YouTube channel connect karein."); return; }
    if (!publishTitle.trim()) { toast.error("Video title likhein."); return; }
    setUploadBusy(true); setUploadedUrl("");
    try {
      // Multipart upload keeps the short-lived OAuth token and video bytes in browser memory.
      const boundary = `shorts_${crypto.randomUUID().replaceAll("-", "")}`;
      const metadata = { snippet: { title: publishTitle.trim().slice(0, 100), description: publishDescription.trim().slice(0, 5000), tags: publishTags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 30), categoryId: "22" }, status: { privacyStatus: privacy, selfDeclaredMadeForKids: false } };
      const body = new Blob([
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
        `--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`, video, `\r\n--${boundary}--\r\n`,
      ], { type: `multipart/related; boundary=${boundary}` });
      const response = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status", {
        method: "POST", headers: { Authorization: `Bearer ${uploadToken.current}`, "Content-Type": `multipart/related; boundary=${boundary}` }, body,
      });
      const data = await response.json().catch(() => ({})) as { id?: string; error?: { message?: string } };
      if (!response.ok || !data.id) throw new Error(data.error?.message || `YouTube upload fail hua (${response.status}).`);
      setUploadedUrl(`https://www.youtube.com/watch?v=${encodeURIComponent(data.id)}`);
      toast.success("Video YouTube par upload ho gaya.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Upload fail hua."); }
    finally { setUploadBusy(false); }
  };

  const titleAndDescription = result.title
    ? `${result.title}\n\n${result.description}`
    : "";
  const tagsAndHashtags = result.tags.length
    ? `Tags\n${result.tags.join(", ")}\n\nHashtags\n${result.hashtags.join(" ")}`
    : "";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <header className="mx-auto max-w-3xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-royal/15 text-royal shadow-glow">
            <Youtube className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">Creator Studio</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">
            Bharat AI Sathi - <span className="text-royal">Shorts Agent</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Topic चुनें और ready-to-record script, title, description, tags और hashtags एक साथ पाएँ।
          </p>
        </header>

        <section className="mx-auto mt-10 max-w-4xl rounded-lg border border-border/70 bg-card/75 p-5 shadow-elegant sm:p-7">
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_210px]">
            <div>
              <Label htmlFor="shorts-topic">Topic</Label>
              <Input
                id="shorts-topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !loading) void generate();
                }}
                maxLength={200}
                placeholder="Enter topic e.g. AI se paise kaise kamaye"
                className="mt-2 h-11 bg-background/40"
              />
            </div>
            <div>
              <Label htmlFor="shorts-language">Language</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger id="shorts-language" className="mt-2 h-11 bg-background/40">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            size="lg"
            onClick={generate}
            disabled={loading}
            className="mt-6 h-12 w-full bg-royal text-royal-foreground shadow-glow hover:bg-royal/90 sm:w-auto"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            {loading ? "Generating..." : "Generate Shorts Script"}
          </Button>
          <Button variant="outline" onClick={freeScript} disabled={loading} className="mt-3 h-12 w-full sm:ml-3 sm:w-auto"><Sparkles className="h-4 w-4" /> Create free Hindi Short</Button>
          {saved && (
            <p className="mt-3 flex items-center gap-2 text-sm text-india-green">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Saved to your account
            </p>
          )}
        </section>

        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          <ResultBox title="Video Script" icon={PlaySquare} value={result.script} placeholder="Your video script will appear here." />
          <ResultBox title="Title + Description" icon={Sparkles} value={titleAndDescription} placeholder="Your title and description will appear here." />
          <ResultBox title="Tags and Hashtags" icon={Youtube} value={tagsAndHashtags} placeholder="Your tags and hashtags will appear here." />
        </div>

        <section className="mt-10 border-t border-border/70 pt-9">
          <h2 className="font-display text-2xl font-bold">Animated Shorts video</h2>
          <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
            <div className="space-y-5">
              <div>
                <Label htmlFor="character-style">Character</Label>
                <Select value={style} onValueChange={(value) => { setStyle(value as CharacterStyle); setVideo(null); setVideoUrl(""); }}>
                  <SelectTrigger id="character-style" className="mt-2"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="sathi">Sathi</SelectItem><SelectItem value="creator">Creator</SelectItem><SelectItem value="teacher">Teacher</SelectItem></SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">Script ko apni Hindi awaaz mein padhein. Microphone recording aur character video sirf is browser mein rehte hain.</p>
              <div className="flex flex-wrap items-center gap-3">
                {recording ? <Button variant="destructive" onClick={stopRecording}><Square className="h-4 w-4" /> Stop recording · {recordingSeconds}s</Button> : <Button variant="outline" onClick={startRecording} disabled={!result.script || videoBusy}><Mic className="h-4 w-4" /> Record Hindi voice</Button>}
                {recordingUrl && <audio src={recordingUrl} controls aria-label="Voice recording preview" className="h-10 max-w-full" />}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={makeMp4} disabled={!recordedAudio || recording || videoBusy}><PlaySquare className="h-4 w-4" /> {videoBusy ? `Creating MP4 ${videoProgress}%` : "Create 9:16 MP4"}</Button>
                {video && <Button variant="outline" onClick={downloadMp4}><Download className="h-4 w-4" /> Download MP4</Button>}
              </div>
              {video && <video controls playsInline src={videoUrl} aria-label="Shorts MP4 preview" className="aspect-[9/16] max-h-[430px] w-full bg-background object-contain" />}
            </div>
            <div className="mx-auto w-full max-w-[360px]"><canvas ref={canvasRef} width={540} height={960} aria-label="Animated character and subtitle preview" role="img" className="aspect-[9/16] w-full rounded border border-border bg-background" /></div>
          </div>
        </section>

        <section className="mt-7 flex flex-col items-start justify-between gap-5 rounded-lg border border-border/70 bg-card/60 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="font-display text-lg font-semibold">YouTube publishing</h2>
            <p className="mt-1 text-sm text-muted-foreground">{channel ? `Connected: ${channel.title}` : youtubeConfigError ? "Google connection अभी उपलब्ध नहीं है।" : "Upload करने के लिए अपना YouTube channel जोड़ें।"}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {signedIn ? (
              <Button variant="outline" onClick={channel ? disconnectYoutube : connectYoutube} disabled={connecting || (!channel && (!googleReady || !youtubeClientId))} className="h-11">
                {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Youtube className="h-4 w-4" />}
                {channel ? "Disconnect YouTube" : connecting ? "Connecting..." : "Connect YouTube Channel"}
              </Button>
            ) : (
              <Button variant="outline" asChild className="h-11"><Link to="/auth" search={{ next: "/shorts-agent" }}><Youtube className="h-4 w-4" /> Sign in to connect YouTube</Link></Button>
            )}
          </div>
        </section>
        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="publish-title">YouTube title</Label><Input id="publish-title" className="mt-2" maxLength={100} value={publishTitle} onChange={(e) => setPublishTitle(e.target.value)} /></div>
          <div><Label htmlFor="publish-tags">Tags (comma separated)</Label><Input id="publish-tags" className="mt-2" value={publishTags} onChange={(e) => setPublishTags(e.target.value)} /></div>
          <div className="sm:col-span-2"><Label htmlFor="publish-description">Description</Label><Textarea id="publish-description" className="mt-2" maxLength={5000} value={publishDescription} onChange={(e) => setPublishDescription(e.target.value)} /></div>
          <div><Label htmlFor="publish-privacy">Visibility</Label><Select value={privacy} onValueChange={(value) => setPrivacy(value as typeof privacy)}><SelectTrigger id="publish-privacy" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="private">Private</SelectItem><SelectItem value="unlisted">Unlisted</SelectItem><SelectItem value="public">Public</SelectItem></SelectContent></Select></div>
          <div className="flex items-end"><Button onClick={uploadToYoutube} disabled={!video || !channel || uploadBusy || !publishTitle.trim()} className="h-11 w-full bg-royal text-royal-foreground hover:bg-royal/90"><Upload className="h-4 w-4" /> {uploadBusy ? "Uploading…" : "Upload to YouTube"}</Button></div>
          {uploadedUrl && <a className="text-sm text-primary underline sm:col-span-2" href={uploadedUrl} target="_blank" rel="noopener noreferrer">View uploaded video on YouTube</a>}
        </section>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Existing full Creator Studio tools are also available in <Link to="/creator" className="font-medium text-primary hover:underline">Creator Studio</Link>.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}