import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { GOV_SERVICES } from "@/lib/gov-services";

export default defineTool({
  name: "list_gov_services",
  title: "List Indian government services",
  description:
    "List Indian government services documented on Bharat AI Sathi. Optionally filter by category. Returns slug, name, Hindi name, category, ministry, official website.",
  inputSchema: {
    category: z.string().optional().describe("Optional category filter, e.g. Identity, Welfare, Tax."),
    limit: z.number().int().optional().describe("Max services to return. Defaults to 50."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, limit }) => {
    const cap = Math.min(Math.max(limit ?? 50, 1), 300);
    const filtered = GOV_SERVICES.filter((s) =>
      category ? s.category.toLowerCase() === category.toLowerCase() : true,
    ).slice(0, cap);
    const items = filtered.map((s) => ({
      slug: s.slug,
      name: s.name,
      hindi: s.hindi,
      category: s.category,
      ministry: s.ministry,
      official: s.official,
      tagline: s.tagline,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify({ count: items.length, items }, null, 2) }],
      structuredContent: { count: items.length, items },
    };
  },
});
