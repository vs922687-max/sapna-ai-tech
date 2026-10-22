import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PartyPopper, Shield } from "lucide-react";
import { FootballPoster } from "@/components/football-poster";
import { PosterMaker } from "@/components/poster-maker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

const TITLE = "AI Dukaan Festival Poster Maker - Apni Dukaan Ka Poster 5 Sec Me";
const DESCRIPTION = "Apni dukaan ke liye Diwali, Holi, Independence Day, Dussehra, New Year aur Eid poster browser mein free banayein. Football player posters bhi banayein.";

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
    links: [
      { rel: "canonical", href: "https://bharataisathi.com/poster-maker" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Oswald:wght@700&display=swap" },
    ],
  }),
  component: PosterMakerPage,
});

function PosterMakerPage() {
  const [mode, setMode] = useState<"festival" | "football">("festival");
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
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">Dukaan ka naam, photo aur festival chunein—ya football player poster banayein. Sab kuch browser mein, koi photo server par upload nahi hoti.</p>
          <div className="mt-6 inline-flex rounded-full border border-poster/30 bg-card/60 p-1">
            <button
              type="button"
              onClick={() => setMode("festival")}
              className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors", mode === "festival" ? "bg-poster text-poster-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <PartyPopper className="h-4 w-4" /> Festival Poster
            </button>
            <button
              type="button"
              onClick={() => setMode("football")}
              className={cn("inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors", mode === "football" ? "bg-poster text-poster-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Shield className="h-4 w-4" /> Football Poster
              <span className="rounded bg-poster px-1.5 py-0.5 text-[9px] font-bold text-poster-foreground">NEW</span>
            </button>
          </div>
        </header>
        {mode === "festival" ? <PosterMaker /> : <FootballPoster />}
      </main>
      <SiteFooter />
    </div>
  );
}
