import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { GOV_SERVICES } from "@/lib/gov-services";

export default defineTool({
  name: "search_gov_services",
  title: "Search Indian government services",
  description:
    "Search Bharat AI Sathi's Indian government services by keyword (matches name, Hindi name, category, ministry, tagline).",
  inputSchema: {
    query: z.string().min(1).describe("Keyword to search for."),
    limit: z.number().int().optional().describe("Max matches. Defaults to 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase().trim();
    const cap = Math.min(Math.max(limit ?? 20, 1), 100);
    const matches = GOV_SERVICES.filter((s) =>
      [s.name, s.hindi, s.category, s.ministry, s.tagline, s.slug]
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
      .slice(0, cap)
      .map((s) => ({
        slug: s.slug,
        name: s.name,
        hindi: s.hindi,
        category: s.category,
        ministry: s.ministry,
        official: s.official,
        tagline: s.tagline,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify({ query, count: matches.length, matches }, null, 2) }],
      structuredContent: { query, count: matches.length, matches },
    };
  },
});
