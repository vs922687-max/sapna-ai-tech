import { createFileRoute } from "@tanstack/react-router";
import { PosterMaker } from "@/components/poster-maker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const TITLE = "AI Dukaan Festival Poster Maker - Apni Dukaan Ka Poster 5 Sec Me";
const DESCRIPTION = "Apni dukaan ke liye Diwali, Holi, Independence Day, Dussehra, New Year aur Eid poster browser mein free banayein.";

export const Route = createFileRoute("/poster-maker")({
  head: () => ({
    meta: [
      { title: `${TITLE} | Bharat AI Sathi` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/poster-maker" }],
  }),
  component: PosterMakerPage,
});

function PosterMakerPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <header className="mx-auto mb-9 max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-poster/30 bg-poster/10 px-3 py-1 text-xs font-semibold text-poster">Made for Indian shops • Free canvas tool</div>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            <span className="text-poster">AI Dukaan Festival Poster Maker</span>
            <span className="mt-2 block text-foreground">Apni Dukaan Ka Poster 5 Sec Me</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">Dukaan ka naam, photo aur festival chunein. Aapka square social poster live taiyar ho jayega—koi photo server par upload nahi hoti.</p>
        </header>
        <PosterMaker />
      </main>
      <SiteFooter />
    </div>
  );
}