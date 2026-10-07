/** Browser-safe request choices; instruction text lives only on the server. */
export type AiPresetSelection = string | {
  preset: string;
  language?: "hi" | "en" | "hinglish" | "Hindi" | "English" | "Hinglish";
  serviceSlug?: string;
};