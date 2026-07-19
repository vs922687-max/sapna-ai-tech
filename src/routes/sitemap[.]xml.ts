import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { UTILITY_TOOLS } from "@/lib/utility-tools";
import { BLOG_POSTS } from "@/lib/blog-posts";

const BASE_URL = "https://bharataisathi.com";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/tools", changefreq: "weekly", priority: "0.9" },
          { path: "/chat", changefreq: "weekly", priority: "0.9" },
          
          { path: "/voice", changefreq: "monthly", priority: "0.7" },
          { path: "/pdf", changefreq: "monthly", priority: "0.7" },
          { path: "/translator", changefreq: "monthly", priority: "0.7" },
          { path: "/coder", changefreq: "monthly", priority: "0.7" },
          { path: "/resume", changefreq: "monthly", priority: "0.7" },
          { path: "/invoice", changefreq: "monthly", priority: "0.8" },
          { path: "/meeting-notes", changefreq: "monthly", priority: "0.8" },
          { path: "/presentation", changefreq: "monthly", priority: "0.8" },

          { path: "/letter", changefreq: "monthly", priority: "0.8" },
          { path: "/data-analyzer", changefreq: "monthly", priority: "0.8" },
          { path: "/hr-assistant", changefreq: "monthly", priority: "0.8" },
          { path: "/agreement", changefreq: "monthly", priority: "0.8" },


          { path: "/pricing", changefreq: "monthly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.6" },
          { path: "/faq", changefreq: "monthly", priority: "0.6" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.5" },
          { path: "/auth", changefreq: "monthly", priority: "0.4" },
          { path: "/gov", changefreq: "weekly", priority: "0.9" },
          { path: "/gov/forms", changefreq: "weekly", priority: "0.8" },
          { path: "/gov/documents", changefreq: "monthly", priority: "0.7" },
          { path: "/gov/eligibility", changefreq: "monthly", priority: "0.7" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
          { path: "/cookies", changefreq: "yearly", priority: "0.3" },
          { path: "/ai-policy", changefreq: "yearly", priority: "0.4" },
          { path: "/editorial-policy", changefreq: "yearly", priority: "0.4" },
          ...BLOG_POSTS.map((p) => ({ path: `/blog/${p.slug}`, changefreq: "monthly" as const, priority: "0.6" })),
          ...UTILITY_TOOLS.map((t) => ({ path: `/tools/${t.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
        ];

        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
