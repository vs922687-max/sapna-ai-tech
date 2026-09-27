import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { getYoutubeClientId } from "@/lib/youtube-client.functions";
import { googleAccounts, YOUTUBE_READ_SCOPE, YOUTUBE_UPLOAD_SCOPE, type GoogleTokenClient, type GoogleTokenResponse } from "@/lib/youtube-connect";
import { uploadYoutubeVideo, type YoutubePublishDetails } from "@/lib/youtube-upload";

export function YoutubePublisher({ video, defaultTitle }: { video: Blob | null; defaultTitle: string }) {
  const loadClientId = useServerFn(getYoutubeClientId);
  const [signedIn, setSignedIn] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [configError, setConfigError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [channel, setChannel] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [details, setDetails] = useState<YoutubePublishDetails>({ title: defaultTitle.slice(0, 100), description: "", tags: "", privacy: "private", madeForKids: false });
  const token = useRef<string | null>(null);
  const tokenClient = useRef<GoogleTokenClient | null>(null);
  const mounted = useRef(true);
  const readyVideo = video ?? selectedVideo;

  useEffect(() => { setDetails((current) => ({ ...current, title: defaultTitle.slice(0, 100) })); }, [defaultTitle]);
  useEffect(() => { setUploadedUrl(""); }, [video, selectedVideo]);
  useEffect(() => {
    mounted.current = true;
    void supabase.auth.getUser().then(({ data }) => { if (mounted.current) setSignedIn(Boolean(data.user)); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted.current) return;
      setSignedIn(Boolean(session?.user));
      if (!session) { token.current = null; setChannel(null); }
    });
    return () => { mounted.current = false; listener.subscription.unsubscribe(); token.current = null; };
  }, []);

  useEffect(() => {
    let active = true;
    void loadClientId().then((id) => { if (active) setClientId(id); }).catch((error) => {
      if (active) setConfigError(error instanceof Error ? error.message : "Google connection is unavailable.");
    });
    const loaded = () => { if (active) setGoogleReady(Boolean(googleAccounts()?.oauth2)); };
    const existing = document.querySelector<HTMLScriptElement>('script[data-youtube-google]');
    if (existing) {
      if (googleAccounts()?.oauth2) loaded();
      else existing.addEventListener("load", loaded);
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.dataset.youtubeGoogle = "true";
      script.addEventListener("load", loaded);
      script.addEventListener("error", () => { if (active) setConfigError("Google connection could not load."); });
      document.head.appendChild(script);
    }
    return () => { active = false; existing?.removeEventListener("load", loaded); };
  }, [loadClientId]);

  const onToken = async (response: GoogleTokenResponse) => {
    if (response.error || !response.access_token) {
      if (mounted.current) { setConnecting(false); toast.error(response.error_description || response.error || "Google permission was not granted."); }
      return;
    }
    try {
      const result = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
        headers: { Authorization: `Bearer ${response.access_token}` },
      });
      const data = await result.json().catch(() => ({})) as { items?: Array<{ id: string; snippet?: { title?: string } }>; error?: { message?: string } };
      if (!result.ok) throw new Error(data.error?.message || `YouTube channel could not be loaded (${result.status}). Check YouTube Data API v3.`);
      const item = data.items?.[0];
      if (!item?.id) throw new Error("No YouTube channel was found for this Google account.");
      if (!mounted.current) return;
      token.current = response.access_token;
      setChannel(item.snippet?.title || "YouTube channel");
      toast.success(`Connected to ${item.snippet?.title || "YouTube"}`);
    } catch (error) {
      if (mounted.current) toast.error(error instanceof Error ? error.message : "Could not connect to YouTube.");
    } finally { if (mounted.current) setConnecting(false); }
  };

  const connect = () => {
    const oauth = googleAccounts()?.oauth2;
    if (!clientId || !oauth) { toast.error(configError || "Google connection is not ready yet."); return; }
    try {
      setConnecting(true);
      tokenClient.current ??= oauth.initTokenClient({
        client_id: clientId,
        scope: `${YOUTUBE_READ_SCOPE} ${YOUTUBE_UPLOAD_SCOPE}`,
        callback: (response) => { void onToken(response); },
        error_callback: (error) => {
          if (!mounted.current) return;
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

  const disconnect = () => {
    if (token.current) googleAccounts()?.oauth2.revoke(token.current);
    token.current = null;
    setChannel(null);
    toast.success("YouTube channel disconnected from this session.");
  };

  const upload = async () => {
    const accessToken = token.current;
    if (!readyVideo || !channel || !accessToken) { toast.error("Pehle video banayein aur YouTube channel connect karein."); return; }
    setUploading(true); setUploadedUrl("");
    try {
      const url = await uploadYoutubeVideo(readyVideo, accessToken, details);
      if (mounted.current) { setUploadedUrl(url); toast.success("Video YouTube par upload ho gaya."); }
    } catch (error) {
      if (mounted.current) toast.error(error instanceof Error ? error.message : "YouTube upload fail hua.");
    } finally { if (mounted.current) setUploading(false); }
  };

  return (
    <section className="mt-7 border-t border-border/60 pt-6" aria-label="YouTube publishing">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Publish to YouTube</h2>
          <p className="mt-1 text-sm text-muted-foreground">{channel ? `Connected: ${channel}` : configError || "Connect your channel to upload this video."}</p>
        </div>
        {signedIn ? (
          <Button variant="outline" onClick={channel ? disconnect : connect} disabled={connecting || uploading || (!channel && (!googleReady || !clientId))}>
            {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Youtube className="h-4 w-4" />}
            {channel ? "Disconnect YouTube" : connecting ? "Connecting…" : "Connect YouTube Channel"}
          </Button>
        ) : (
          <Button asChild variant="outline"><Link to="/auth" search={{ next: "/creator/auto-video" }}><Youtube className="h-4 w-4" /> Sign in to connect</Link></Button>
        )}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="studio-youtube-title">YouTube title</Label><Input id="studio-youtube-title" className="mt-2" maxLength={100} value={details.title} onChange={(event) => setDetails((current) => ({ ...current, title: event.target.value }))} /></div>
        <div><Label htmlFor="studio-youtube-tags">Tags (comma separated)</Label><Input id="studio-youtube-tags" className="mt-2" value={details.tags} onChange={(event) => setDetails((current) => ({ ...current, tags: event.target.value }))} /></div>
        <div className="sm:col-span-2"><Label htmlFor="studio-youtube-description">Description</Label><Textarea id="studio-youtube-description" className="mt-2" maxLength={5000} value={details.description} onChange={(event) => setDetails((current) => ({ ...current, description: event.target.value }))} /></div>
        <div><Label htmlFor="studio-youtube-privacy">Visibility</Label><Select value={details.privacy} onValueChange={(value) => setDetails((current) => ({ ...current, privacy: value as YoutubePublishDetails["privacy"] }))}><SelectTrigger id="studio-youtube-privacy" className="mt-2"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="private">Private</SelectItem><SelectItem value="unlisted">Unlisted</SelectItem><SelectItem value="public">Public</SelectItem></SelectContent></Select></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={details.madeForKids} onChange={(event) => setDetails((current) => ({ ...current, madeForKids: event.target.checked }))} className="accent-primary" /> This video is made for kids</label>
        {!video && <div className="sm:col-span-2">
          <Label htmlFor="studio-youtube-file">Already have an MP4?</Label>
          <Input id="studio-youtube-file" type="file" accept="video/mp4,.mp4" className="mt-2 h-auto py-2" onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) { setSelectedVideo(null); return; }
            if (!file.name.toLowerCase().endsWith(".mp4") || !file.size) { toast.error("Valid MP4 video chunein."); event.target.value = ""; setSelectedVideo(null); return; }
            setSelectedVideo(file);
          }} />
        </div>}
        <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
          <Button onClick={upload} disabled={!readyVideo || !channel || !signedIn || uploading || !details.title.trim()} className="bg-royal text-royal-foreground hover:bg-royal/90"><Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload to YouTube"}</Button>
          {!readyVideo && <span className="text-xs text-muted-foreground">Create the MP4 above or select one from your device.</span>}
          {uploadedUrl && <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">View uploaded video on YouTube</a>}
        </div>
      </div>
    </section>
  );
}