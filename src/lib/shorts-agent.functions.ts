import { createServerFn } from "@tanstack/react-start";
import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  topic: z.string().trim().min(1, "Please enter a topic.").max(200),
  language: z.enum(["Hindi", "Punjabi", "English"]),
});

const outputSchema = z.object({
  script: z.string(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  hashtags: z.array(z.string()),
});

export const generateShorts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) throw new Error("AI service is not configured.");

    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });

    const generation = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      output: Output.object({ schema: outputSchema }),
      system: "You are Bharat AI Sathi's YouTube Shorts strategist for Indian creators. Be practical, original and culturally natural. Never make unsupported income or performance guarantees.",
      prompt: `Create one YouTube Shorts content package about: ${data.topic}. Write all audience-facing content in ${data.language}. Return a 35-55 second spoken script with a first-three-second hook, natural pacing cues and a concise CTA; one clickable title under 70 characters; a concise description with CTA; 10 relevant tags without #; and 5 relevant hashtags beginning with #. Keep each field concise and return the requested structured object.`,
      maxRetries: 0,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const output = await generation.output;
    if (!output) throw new Error("AI did not return a complete Shorts package. Please try again.");
    const script = output.script.trim().slice(0, 12000);
    const title = output.title.trim().slice(0, 200);
    const description = output.description.trim().slice(0, 5000);
    const tags = output.tags.map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean).slice(0, 20);
    const hashtags = output.hashtags.map((tag) => `#${tag.trim().replace(/^#/, "")}`).filter((tag) => tag.length > 1).slice(0, 20);
    if (!script || !title || !description) throw new Error("AI did not return a complete Shorts package. Please try again.");

    const result = { script, title, description, tags, hashtags };
    const { error } = await context.supabase.from("generated_shorts").insert({
      user_id: context.userId,
      topic: data.topic,
      language: data.language,
      script,
      title,
      description,
      tags: [...tags, ...hashtags],
      status: "generated",
    });

    if (error) throw new Error("Script bana, lekin save nahi ho saka. Please try again.");
    return result;
  });