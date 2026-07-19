import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { openCookiePreferences } from "@/components/cookie-consent";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/50 bg-background/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.76_0.17_55)] via-white to-[oklch(0.66_0.16_155)]">
              <Sparkles className="h-4 w-4 text-[oklch(0.18_0.03_60)]" />
            </div>
            <span className="font-display text-lg font-bold">Bharat AI Sathi</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            A premium, made-for-India AI suite. Chat, create, translate, code and build —
            in Hindi, English and every major Indian language.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Product
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/tools" className="hover:text-primary">All AI tools</Link></li>
            <li><Link to="/gov" className="hover:text-primary">Government</Link></li>
            <li><Link to="/chat" className="hover:text-primary">AI Chat</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-primary">About us</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Legal
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms &amp; Conditions</Link></li>
            <li><Link to="/disclaimer" className="hover:text-primary">Disclaimer</Link></li>
            <li><Link to="/cookies" className="hover:text-primary">Cookie Policy</Link></li>
            <li><Link to="/ai-policy" className="hover:text-primary">AI Usage Policy</Link></li>
            <li><Link to="/editorial-policy" className="hover:text-primary">Editorial Policy</Link></li>
            <li>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="text-left hover:text-primary"
                aria-label="Manage cookie preferences"
              >
                Cookie preferences
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Bharat AI Sathi. Made with ❤️ in India.</p>
          <p className="flex items-center gap-1" aria-hidden="true">
            <span className="inline-block h-2 w-6 rounded-sm bg-[oklch(0.76_0.17_55)]" />
            <span className="inline-block h-2 w-6 rounded-sm bg-white" />
            <span className="inline-block h-2 w-6 rounded-sm bg-[oklch(0.66_0.16_155)]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
