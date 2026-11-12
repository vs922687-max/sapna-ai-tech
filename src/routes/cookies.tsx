import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { Button } from "@/components/ui/button";
import { openCookiePreferences } from "@/components/cookie-consent";

const TITLE = "Cookie Policy — Bharat AI Sathi";
const DESCRIPTION = "How Bharat AI Sathi uses essential, analytics, preference and third-party cookies — and how you can manage or change your consent at any time.";
const URL = "https://bharataisathi.com/cookies";
const UPDATED = "12 November 2026";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: () => (
    <LegalShell title="Cookie Policy" subtitle="What cookies we use and how you can control them." updated={UPDATED}>
      <p>
        This policy explains how <strong>bharataisathi.com</strong> uses cookies and similar technologies on your device.
      </p>

      <h2>1. Necessary cookies and storage</h2>
      <p>
        Required for the Platform to work — keeping you signed in, securing your session and remembering your cookie choices. Some tools also save your drafts in your browser's local storage. These cannot be switched off.
      </p>

      <h2>2. Analytics (no cookies)</h2>
      <p>
        Our visitor analytics, provided by Lovable, uses no cookies and stores nothing on your device. It counts page visits, time on page, page speed and errors for every visitor without identifying anyone. Click measurement follows your Analytics choice in Cookie settings. Details are in our <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>3. Advertising cookies (Google AdSense)</h2>
      <p>
        We show ads through Google AdSense. Google and its partners may use cookies to show and measure ads, including ads based on your visits to this and other websites. Your Advertising choice in Cookie settings is passed to Google through Google Consent Mode. You can also manage ad personalisation at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
      </p>

      <h2>4. Other third-party cookies</h2>
      <ul>
        <li><strong>Google</strong> — "Sign in with Google" and, if you connect it, YouTube.</li>
        <li><strong>Lovable Cloud</strong> — sign-in session storage.</li>
      </ul>

      <h2>5. Managing cookie preferences</h2>
      <p>
        You can Accept all, Reject all or choose per purpose at any time using the button below or the Cookie settings link in the footer. Clearing your browser storage also resets your choice.
      </p>
      <div className="not-prose mt-3">
        <Button size="sm" onClick={openCookiePreferences}>Cookie settings</Button>
      </div>

      <h2>6. Browser controls</h2>
      <p>
        Most browsers let you view, delete and block cookies from Settings → Privacy. Blocking essential cookies may break sign-in and some features.
      </p>

      <h2>7. Changes</h2>
      <p>We may update this Cookie Policy from time to time; check the "Last updated" date above.</p>

      <h2>8. Contact</h2>
      <p>Questions? Email <a href="mailto:support@bharataisathi.com">support@bharataisathi.com</a>.</p>
    </LegalShell>
  ),
});
