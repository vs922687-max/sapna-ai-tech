import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Calendar } from "lucide-react";

const BLOG_URL = "https://sapna-ai-tech.lovable.app/blog";
const BLOG_TITLE = "Blog — Bharat AI Sathi";
const BLOG_DESC = "Insights on AI in India: use cases, tutorials, product updates and more from the Bharat AI Sathi team.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: BLOG_TITLE },
      { name: "description", content: BLOG_DESC },
      { property: "og:title", content: BLOG_TITLE },
      { property: "og:description", content: BLOG_DESC },
      { property: "og:url", content: BLOG_URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: BLOG_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": BLOG_URL,
          url: BLOG_URL,
          name: BLOG_TITLE,
          description: BLOG_DESC,
          inLanguage: ["en-IN", "hi-IN"],
          publisher: {
            "@type": "Organization",
            name: "Bharat AI Sathi",
            url: "https://sapna-ai-tech.lovable.app/",
          },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.excerpt,
            datePublished: p.date,
            articleSection: p.tag,
            author: { "@type": "Organization", name: "Bharat AI Sathi" },
          })),
        }),
      },
    ],
  }),
  component: BlogPage,
});

const posts = [
  { title: "How Indian SMBs are using AI to grow revenue by 30%", tag: "Business", date: "Jul 2, 2026", excerpt: "Real stories from Mumbai, Bangalore and Jaipur founders using Bharat AI Sathi." },
  { title: "Hindi vs English: which language works better with AI?", tag: "Research", date: "Jun 24, 2026", excerpt: "We tested 500 prompts across both languages. The results are surprising." },
  { title: "10 ChatGPT alternatives made for India (2026 edition)", tag: "Guide", date: "Jun 10, 2026", excerpt: "A no-BS breakdown of Indian AI tools priced in ₹ and built for our workflows." },
  { title: "Building a Diwali marketing plan with AI in 20 minutes", tag: "Tutorial", date: "May 30, 2026", excerpt: "Walk through prompts, templates and images — all generated live." },
];

function BlogPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Blog</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            AI, <span className="text-gradient-tricolor">for Bharat.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Deep dives, tutorials, and product updates from the Bharat AI Sathi team.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <article
              key={p.title}
              className="glass rounded-2xl border border-border/60 p-6 transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 font-medium text-primary">{p.tag}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.date}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
