import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArrowLeft, Calendar, Clock, Home, User } from "lucide-react";
import { BLOG_POSTS, getPostBySlug, type BlogPost } from "@/lib/blog-posts";
import { AdSlot } from "@/components/ad-slot";
import { ShareButtons } from "@/components/share-buttons";
import { ogImageForPost } from "@/lib/og-image";

const BASE = "https://bharataisathi.com";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found — Bharat AI Sathi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const post = loaderData.post;
    const url = `${BASE}/blog/${params.slug}`;
    const ogImage = ogImageForPost(post);
    return {
      meta: [
        { title: `${post.title} — Bharat AI Sathi` },
        { name: "description", content: post.description },
        { name: "author", content: post.author },
        { property: "article:published_time", content: post.date },
        { property: "article:section", content: post.category },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "Bharat AI Sathi" },
        { property: "og:locale", content: "en_IN" },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: post.title },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:image:alt", content: post.title },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            articleSection: post.category,
            image: [ogImage],
            inLanguage: "en-IN",
            author: { "@type": "Person", name: post.author },
            publisher: {
              "@type": "Organization",
              name: "Bharat AI Sathi",
              url: BASE,
              logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
            },
            mainEntityOfPage: url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: BlogPostNotFound,
});

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={k}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-8 font-display text-xl font-semibold text-foreground">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-6 font-display text-base font-semibold text-foreground">
          {block.replace(/^###\s+/, "")}
        </h3>
      );
    }
    if (/^-\s/.test(block)) {
      const items = block.split(/\n/).map((l) => l.replace(/^-\s*/, ""));
      return (
        <ul key={i} className="mt-4 list-disc space-y-1 pl-6">
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(block)) {
      const items = block.split(/\n/).map((l) => l.replace(/^\d+\.\s*/, ""));
      return (
        <ol key={i} className="mt-4 list-decimal space-y-1 pl-6">
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="mt-4 leading-relaxed">
        {inline(block)}
      </p>
    );
  });
}

function relatedFor(post: BlogPost) {
  return BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = relatedFor(post);

  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Home className="h-3 w-3" /> Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{post.title}</span>
        </nav>

        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{post.category}</p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-muted-foreground">{post.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readMinutes} min read</span>
        </div>

        <ShareButtons
          url={`${BASE}/blog/${post.slug}`}
          title={post.title}
          className="mt-6 border-t border-border/50 pt-5"
        />

        <img
          src={ogImageForPost(post)}
          alt={`${post.title} — Bharat AI Sathi`}
          width={1200}
          height={630}
          loading="lazy"
          className="mt-8 w-full rounded-2xl border border-border/60"
        />

        <AdSlot name="articleTop" className="my-8" />


        <article className="mt-8 text-sm text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground">
          {renderBody(post.body)}
        </article>

        <AdSlot name="articleBottom" className="my-10" />


        <div className="mt-10 rounded-2xl border border-border/60 bg-card/30 p-5 text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">Editorial note.</strong> This article was written by the
            Bharat AI Sathi editorial team following our
            {" "}<Link to="/editorial-policy" className="text-primary hover:underline">Editorial Policy</Link>
            {" "}and <Link to="/ai-policy" className="text-primary hover:underline">AI Usage Policy</Link>.
            Spot a factual error? Email {" "}
            <a href="mailto:editorial@bharataisathi.com" className="text-primary hover:underline">
              editorial@bharataisathi.com
            </a>.
          </p>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">Related articles</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-primary/40"
                >
                  <p className="text-sm font-semibold hover:text-primary">{r.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all articles
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function BlogPostNotFound() {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">
          This article may have been moved or renamed. Browse all our articles instead.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
