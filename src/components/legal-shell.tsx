import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function LegalShell({
  title,
  subtitle,
  updated,
  children,
}: {
  title: string;
  subtitle?: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <header>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          <p className="mt-2 text-xs text-muted-foreground">Last updated: {updated}</p>
        </header>
        <article className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary prose-strong:text-foreground">
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

// dummy default route so this file itself is not treated as a route
export const Route = createFileRoute("/_legal-shell")({
  component: () => null,
}).update ? undefined as never : undefined as never;
