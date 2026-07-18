import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";
import { Button } from "@/components/ui/button";
import { openCookiePreferences } from "@/components/cookie-consent";

const TITLE = "Cookie Policy — Bharat AI Sathi";
const DESCRIPTION = "How Bharat AI Sathi uses essential, analytics, preference and third-party cookies — and how you can manage or change your consent at any time.";
const URL = "https://bharataisathi.com/cookies";
const UPDATED = "18 July 2026";

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

      <h2>1. Essential cookies</h2>
      <p>
        Required for the Platform to function — for example, keeping you signed in, remembering your dark/light theme and securing your session. These cannot be disabled.
      </p>

      <h2>2. Analytics cookies</h2>
      <p>
        Help us understand which pages and tools are used most, so we can improve them. Only set after you accept them in the cookie banner.
      </p>

      <h2>3. Preference cookies</h2>
      <p>
        Remember choices like your language (Hindi/English), notification settings and cookie consent state.
      </p>

      <h2>4. Third-party cookies</h2>
      <p>
        Some features rely on trusted third parties which may set their own cookies:
      </p>
      <ul>
        <li><strong>Google</strong> — sign-in, Fonts, Analytics/Search Console.</li>
        <li><strong>Lovable Cloud / Supabase</strong> — authentication session cookies.</li>
        <li><strong>YouTube</strong> — if we embed videos on blog posts.</li>
      </ul>

      <h2>5. Managing cookie preferences</h2>
      <p>
        You can Accept, Reject or customise non-essential cookies at any time using the button below or by clearing your browser cookies.
      </p>
      <div className="not-prose mt-3">
        <Button size="sm" onClick={openCookiePreferences}>Manage cookie preferences</Button>
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
