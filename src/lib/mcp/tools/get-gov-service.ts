import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getGovService } from "@/lib/gov-services";

export default defineTool({
  name: "get_gov_service",
  title: "Get Indian government service details",
  description:
    "Get full details for one Indian government service by slug: eligibility, documents, steps, notes, FAQs, and the official portal URL.",
  inputSchema: {
    slug: z.string().min(1).describe("Service slug, e.g. 'aadhaar', 'pan-card', 'pmay'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const s = getGovService(slug);
    if (!s) {
      return { content: [{ type: "text", text: `No service found for slug '${slug}'.` }], isError: true };
    }
    const payload = {
      slug: s.slug,
      name: s.name,
      hindi: s.hindi,
      category: s.category,
      ministry: s.ministry,
      official: s.official,
      tagline: s.tagline,
      eligibility: s.eligibility,
      documents: s.documents,
      steps: s.steps,
      notes: s.notes,
      faqs: s.faqs,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
