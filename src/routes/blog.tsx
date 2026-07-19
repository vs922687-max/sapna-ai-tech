import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Calendar, Clock, User } from "lucide-react";
import { useMemo, useState } from "react";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-posts";

const BLOG_URL = "https://bharataisathi.com/blog";
const BLOG_TITLE = "Blog — Bharat AI Sathi";
const BLOG_DESC =
  "Tutorials, government service walkthroughs, AI research and productivity guides from the Bharat AI Sathi editorial team. New articles every week.";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: BLOG_TITLE },
      { name: "description", content: BLOG_DESC },
      { property: "og:title", content: BLOG_TITLE },
      { property: "og:description", content: BLOG_DESC },
      { property: "og:url", content: BLOG_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: BLOG_TITLE },
      { name: "twitter:description", content: BLOG_DESC },
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
            url: "https://bharataisathi.com",
          },
          blogPost: BLOG_POSTS.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            dateModified: p.date,
            articleSection: p.category,
            author: { "@type": "Person", name: p.author },
            mainEntityOfPage: `${BLOG_URL}/${p.slug}`,
          })),
        }),
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [category, setCategory] = useState<string>("All");
  const [q, setQ] = useState("");

  const posts = useMemo(() => {
    const term = q.trim().toLowerCase();
    return BLOG_POSTS.filter((p) => (category === "All" ? true : p.category === category))
      .filter((p) =>
        term === ""
          ? true
          : p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term),
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [category, q]);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Blog</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            AI, <span className="text-gradient-tricolor">for Bharat.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Long-form tutorials, government service walkthroughs and AI research from our editorial
            team — updated every week.
          </p>
        </header>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles"
            aria-label="Search blog articles"
            className="w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm outline-none focus:border-primary sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {["All", ...BLOG_CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  category === c
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="glass rounded-2xl border border-border/60 p-6 transition-all hover:border-primary/40 hover:shadow-glow"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 font-medium text-primary">
                  {p.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" aria-hidden="true" />{" "}
                  {new Date(p.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" /> {p.readMinutes} min read
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="hover:text-primary"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-3 w-3" aria-hidden="true" /> {p.author}
                </span>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="font-medium text-primary hover:underline"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground">No articles match your search.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
