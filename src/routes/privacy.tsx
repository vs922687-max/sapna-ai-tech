import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

const TITLE = "Privacy Policy — Bharat AI Sathi";
const DESCRIPTION = "How Bharat AI Sathi collects, uses and protects your data — Google AdSense and cookies, visitor analytics, Gemini AI, UPI payments, third-party services and your rights.";
const URL = "https://bharataisathi.com/privacy";
const UPDATED = "12 November 2026";

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
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" subtitle="Your privacy matters to us." updated={UPDATED}>
      <p>
        Bharat AI Sathi ("we", "our", "us") operates <strong>bharataisathi.com</strong> ("the Platform"). This Privacy Policy explains what we collect, how we use it, who receives it, and the choices you have. This page is also available at <a href="/privacy-policy">/privacy-policy</a>.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Account information</strong> — name, email and profile picture when you sign up with email or Google.</li>
        <li><strong>Content you provide</strong> — chats, prompts, uploaded files (PDF/OCR), saved scripts, form data, government profile fields, job posts and applications you save.</li>
        <li><strong>Contact messages</strong> — the name, email, optional phone number and message you send through our contact form.</li>
        <li><strong>Payment details you send us</strong> — when you pay by UPI and share a receipt, we receive your UPI transaction ID, amount and the name/number shown on the receipt.</li>
        <li><strong>Usage data</strong> — described in sections 3 and 4 below.</li>
      </ul>

      <h2>2. Cookies and browser storage</h2>
      <p>
        We use necessary browser storage to keep you signed in and secure, and to remember your cookie choices. Some tools save your work in your browser's local storage (for example Creator Studio projects, government profile drafts, poster details and a one-time visit counter flag). Advertising cookies are set by Google AdSense as described in section 5. You can change your choices any time with <strong>Cookie settings</strong> in the site footer. See our <a href="/cookies">Cookie Policy</a>.
      </p>

      <h2>3. Visitor analytics (Lovable)</h2>
      <p>
        We use Lovable's built-in visitor analytics to understand how the site is used. It uses no cookies, stores nothing on your device, doesn't keep IP addresses and doesn't identify visitors. Lovable collects this data for us. <a href="https://lovable.dev/privacy" target="_blank" rel="noopener noreferrer">Lovable's privacy policy</a> explains how it handles it.
      </p>
      <p>
        On this site it records the pages visited, where visitors came from, their country, browser, operating system and device type (desktop, mobile or tablet), how long they stay, how fast pages load, errors, and which buttons and links are clicked. Detailed data is kept for 90 days and daily summaries for a year.
      </p>
      <p>
        Clicks are recorded only after you accept analytics if you visit from the EU/EEA, the UK, Switzerland or Canada; for everyone else they are recorded unless you reject analytics. Clicks are never recorded if your browser sends Global Privacy Control, even if you accept. Page visits, time on page, page speed and errors are recorded for every visitor, without cookies and without identifying anyone. Your choice is saved in your browser for up to 12 months.
      </p>

      <h2>4. Sign-in, database and hosting</h2>
      <p>
        Accounts, sign-in (including "Sign in with Google") and saved data are handled by Lovable Cloud, our hosting and database provider. Each account's saved data is protected by access rules so only its owner (and, where a feature needs it, the other party in a job or application) can read it. Our site also records an anonymous total visit count.
      </p>

      <h2>5. Google AdSense and advertising cookies</h2>
      <ul>
        <li>We use <strong>Google AdSense</strong> to show advertisements. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.</li>
        <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet.</li>
        <li>You may opt out of personalised advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, or opt out of some third-party vendors' cookies at <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">aboutads.info</a>.</li>
        <li>Learn <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses information from sites that use its services</a>.</li>
        <li>Our cookie banner passes your advertising choice to Google using Google Consent Mode. If you reject advertising, Google is told not to use advertising cookies; ads may still appear but are not personalised.</li>
      </ul>

      <h2>6. AI features (Google Gemini and other AI models)</h2>
      <p>
        When you use an AI tool, your prompt and any text or file content you submit is sent through the Lovable AI Gateway to the AI model that powers that tool — mainly Google Gemini, and for some tools OpenAI models — to generate the answer. We do not sell your prompts. AI providers process this data under their own terms. Do not submit passwords, OTPs, bank details, Aadhaar/PAN numbers or other highly sensitive data to AI features.
      </p>

      <h2>7. Payments</h2>
      <p>
        Paid features are currently paid by UPI (Paytm UPI QR / UPI ID). The payment itself is processed by your UPI app and bank — we never see your UPI PIN or bank login. We keep the receipt details you send us only to confirm your payment and deliver what you bought. Card or net-banking payments through <strong>Razorpay</strong> are not active yet; if we add Razorpay, it will process your payment details under its own privacy policy and this section will be updated. See our <a href="/refund-policy">Refund Policy</a>.
      </p>

      <h2>8. Other services we use</h2>
      <ul>
        <li><strong>EmailJS</strong> — delivers contact-form messages to our inbox.</li>
        <li><strong>WhatsApp</strong> — if you tap a WhatsApp link, your chat with us is handled by WhatsApp (Meta).</li>
        <li><strong>YouTube (Google)</strong> — if you connect your channel in Creator Studio or Shorts Agent, Google gives your browser a short-lived access token. Videos upload directly from your browser to YouTube; we don't store the token or your video.</li>
        <li><strong>Google Fonts</strong> — some poster templates load fonts from Google, which receives your browser's request.</li>
        <li><strong>Google Search Console</strong> — shows us how our pages appear in Google Search (no visitor-level data).</li>
      </ul>
      <p>Photos you add to Poster Maker and many document tools are processed inside your browser and are not uploaded to us.</p>

      <h2>9. Government services usage</h2>
      <p>
        Profile data, saved forms, bookmarks and reminders you create in the Government module are stored in your browser and, when you're signed in, in your account. We do <strong>not</strong> submit anything to any government portal on your behalf.
      </p>

      <h2>10. Data retention</h2>
      <p>
        We keep account and content data while your account is active. You can delete saved items from your dashboard, or ask us to delete your account and data by emailing us.
      </p>

      <h2>11. Your rights</h2>
      <ul>
        <li>Access, correct or delete your personal data.</li>
        <li>Withdraw consent for analytics or advertising at any time via Cookie settings.</li>
        <li>Export your saved government profile data.</li>
        <li>Complain to a data-protection authority.</li>
      </ul>

      <h2>12. Security</h2>
      <p>
        Data is transmitted over HTTPS and database access is restricted per account. We follow reasonable industry practices, but no system is 100% secure.
      </p>

      <h2>13. Children's privacy</h2>
      <p>
        The Platform is not directed at children under 13. We do not knowingly collect personal data from children. If you believe a child has provided us data, contact us and we will delete it.
      </p>

      <h2>14. Changes</h2>
      <p>We may update this policy; the "Last updated" date above will change accordingly.</p>

      <h2>15. Contact</h2>
      <p>Email us at <a href="mailto:support@bharataisathi.com">support@bharataisathi.com</a> or use our <a href="/contact">contact form</a>.</p>
    </LegalShell>
  );
}
