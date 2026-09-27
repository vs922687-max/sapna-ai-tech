export type YoutubePublishDetails = {
  title: string;
  description: string;
  tags: string;
  privacy: "private" | "unlisted" | "public";
  madeForKids: boolean;
};

/** Upload directly from the browser. Neither video nor Google token reaches our server. */
export async function uploadYoutubeVideo(video: Blob, token: string, details: YoutubePublishDetails): Promise<string> {
  if (!video.size) throw new Error("Video file is empty.");
  if (!details.title.trim()) throw new Error("Video title likhein.");
  const boundary = `shorts_${crypto.randomUUID().replaceAll("-", "")}`;
  const metadata = {
    snippet: {
      title: details.title.trim().slice(0, 100),
      description: details.description.trim().slice(0, 5000),
      tags: details.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 30),
      categoryId: "22",
    },
    status: { privacyStatus: details.privacy, selfDeclaredMadeForKids: details.madeForKids },
  };
  const body = new Blob([
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
    `--${boundary}\r\nContent-Type: ${video.type || "video/mp4"}\r\n\r\n`, video, `\r\n--${boundary}--\r\n`,
  ], { type: `multipart/related; boundary=${boundary}` });
  const response = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status", {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": `multipart/related; boundary=${boundary}` }, body,
  });
  const data = await response.json().catch(() => ({})) as { id?: string; error?: { message?: string } };
  if (!response.ok || !data.id) throw new Error(data.error?.message || `YouTube upload fail hua (${response.status}).`);
  return `https://www.youtube.com/watch?v=${encodeURIComponent(data.id)}`;
}