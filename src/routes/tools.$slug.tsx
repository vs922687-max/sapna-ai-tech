import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { TOOL_BY_SLUG } from "@/lib/utility-tools";
import { TOOL_COMPONENTS } from "@/lib/tool-components";
import { ToolLayout } from "@/components/tool-layout";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

const BASE = "https://bharataisathi.com";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = TOOL_BY_SLUG[params.slug];
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Tool not found — Bharat AI Sathi" }, { name: "robots", content: "noindex" }] };
    const { tool } = loaderData;
    const url = `${BASE}/tools/${params.slug}`;
    const title = `${tool.title} — Free Online Tool | Bharat AI Sathi`;
    const desc = tool.description;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "keywords", content: tool.keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.title,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            description: desc,
            url,
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: tool.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" },
              { "@type": "ListItem", position: 2, name: "Tools", item: BASE + "/tools" },
              { "@type": "ListItem", position: 3, name: tool.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ToolPage,
  notFoundComponent: NotFound,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const Comp = TOOL_COMPONENTS[tool.slug];
  return (
    <ToolLayout tool={tool}>
      {Comp ? <Comp /> : <p className="text-sm text-muted-foreground">Tool coming soon.</p>}
    </ToolLayout>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-bold">Tool not found</h1>
        <p className="mt-3 text-muted-foreground">This tool doesn't exist. Browse the full directory below.</p>
        <Button asChild className="mt-6"><Link to="/tools">Browse all tools</Link></Button>
      </section>
      <SiteFooter />
    </div>
  );
}
