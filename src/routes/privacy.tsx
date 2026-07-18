import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

const TITLE = "Privacy Policy — Bharat AI Sathi";
const DESCRIPTION = "How Bharat AI Sathi collects, uses, stores and protects your data. Cookies, analytics, AI, government services, third-party services and your rights.";
const URL = "https://bharataisathi.com/privacy";
const UPDATED = "18 July 2026";

export const Route = createFileRoute("/privacy")({
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
    <LegalShell title="Privacy Policy" subtitle="Your privacy matters to us." updated={UPDATED}>
      <p>
        Bharat AI Sathi ("we", "our", "us") operates <strong>bharataisathi.com</strong> ("the Platform"). This Privacy Policy explains what we collect, how we use it, and the choices you have.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Account information</strong> — name, email and profile picture when you sign up (including via Google).</li>
        <li><strong>User-provided content</strong> — chats, prompts, uploaded files (PDF/OCR), form data and government profile fields you save.</li>
        <li><strong>Usage data</strong> — pages visited, features used, device/browser type, approximate location (from IP), timestamps.</li>
        <li><strong>Payment metadata</strong> — where paid plans exist, we store only order references; card data is handled by our payment provider.</li>
      </ul>

      <h2>2. Cookies</h2>
      <p>
        We use essential cookies to keep you signed in and preference cookies to remember your theme, language and consent choices. See our <a href="/cookies">Cookie Policy</a> for details.
      </p>

      <h2>3. Analytics</h2>
      <p>
        We may use privacy-respecting analytics (page views, feature usage) to improve the Platform. Analytics cookies are only set after you accept them in the cookie banner.
      </p>

      <h2>4. AI usage</h2>
      <p>
        Prompts and content you submit to AI features are sent to our AI provider (e.g. Google Gemini via a gateway) to generate a response. We do not sell your prompts. Do not submit passwords, government secrets or highly sensitive personal data to AI features.
      </p>

      <h2>5. Contact forms</h2>
      <p>
        Messages submitted via <a href="/contact">/contact</a> are delivered to our support inbox via EmailJS. We use them only to reply to you.
      </p>

      <h2>6. Government services usage</h2>
      <p>
        Profile data, saved forms, bookmarks and reminders you create in the Government module are stored primarily in your browser (localStorage) and, where you're signed in, in your account. We do <strong>not</strong> submit anything to any government portal on your behalf.
      </p>

      <h2>7. Third-party services</h2>
      <ul>
        <li>Google (Sign-in, Fonts, Analytics/Search Console)</li>
        <li>Lovable Cloud / Supabase (authentication and database hosting)</li>
        <li>AI providers (Google Gemini)</li>
        <li>EmailJS (contact form delivery)</li>
      </ul>
      <p>Each has its own privacy policy governing data it processes.</p>

      <h2>8. Data storage & retention</h2>
      <p>
        Account and content data is stored on secure cloud infrastructure. You can delete your account at any time from the dashboard; residual backups are purged within 90 days.
      </p>

      <h2>9. Your rights</h2>
      <ul>
        <li>Access, correct or delete your personal data.</li>
        <li>Withdraw consent for analytics/preference cookies at any time.</li>
        <li>Export your saved government profile data.</li>
        <li>Complain to a data-protection authority.</li>
      </ul>

      <h2>10. Security</h2>
      <p>
        Data is transmitted over HTTPS. Database access uses Row-Level Security. We follow reasonable industry practices, but no system is 100% secure.
      </p>

      <h2>11. Children's privacy</h2>
      <p>
        The Platform is not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us data, please contact us and we will delete it.
      </p>

      <h2>12. Changes</h2>
      <p>We may update this policy; the "Last updated" date above will change accordingly.</p>

      <h2>13. Contact</h2>
      <p>Email us at <a href="mailto:support@bharataisathi.com">support@bharataisathi.com</a> or via <a href="/contact">/contact</a>.</p>
    </LegalShell>
  ),
});
