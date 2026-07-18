import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

const TITLE = "Terms & Conditions — Bharat AI Sathi";
const DESCRIPTION = "The rules for using Bharat AI Sathi — acceptable use, AI limitations, government information disclaimer, intellectual property, liability and governing law (India).";
const URL = "https://bharataisathi.com/terms";
const UPDATED = "18 July 2026";

export const Route = createFileRoute("/terms")({
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
    <LegalShell title="Terms & Conditions" subtitle="Please read these terms before using Bharat AI Sathi." updated={UPDATED}>
      <p>
        By accessing or using <strong>bharataisathi.com</strong> ("the Platform") you agree to these Terms. If you don't agree, please don't use the Platform.
      </p>

      <h2>1. User responsibilities</h2>
      <ul>
        <li>Provide accurate information when signing up.</li>
        <li>Keep your account credentials secure.</li>
        <li>Use the Platform only for lawful purposes.</li>
      </ul>

      <h2>2. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Attack, reverse-engineer or overload the Platform.</li>
        <li>Generate illegal, hateful, defamatory, sexually explicit or violent content.</li>
        <li>Impersonate any person or government authority.</li>
        <li>Use the AI tools to produce misleading content presented as official government communication.</li>
        <li>Scrape or resell data or AI outputs at scale.</li>
      </ul>

      <h2>3. AI limitations</h2>
      <p>
        AI outputs may be inaccurate, outdated or biased. Always verify important information — especially medical, legal, financial or government-related answers — with a qualified professional or official source. AI-generated content is not professional advice.
      </p>

      <h2>4. Government information disclaimer</h2>
      <p>
        Bharat AI Sathi is <strong>not a government website</strong> and is not affiliated with any government of India department. Details about schemes, eligibility, fees, documents and processes are provided for guidance only and may change without notice. Always confirm details on the official government portal linked from each service page. See our full <a href="/disclaimer">Disclaimer</a>.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        The Platform's design, branding, code and content are owned by Bharat AI Sathi and protected by law. You keep ownership of content you submit; you grant us a limited licence to process it in order to provide the service.
      </p>

      <h2>6. Third-party links</h2>
      <p>
        The Platform links to third-party sites (including government portals). We are not responsible for their content, availability, terms or practices.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Bharat AI Sathi and its team are not liable for any indirect, incidental or consequential damages, lost profits, or losses arising from decisions made using AI-generated information or the Platform.
      </p>

      <h2>8. Account rules</h2>
      <ul>
        <li>One person per account. No shared accounts.</li>
        <li>We may suspend or terminate accounts that violate these Terms.</li>
        <li>You may delete your account at any time from the dashboard.</li>
      </ul>

      <h2>9. Content policy</h2>
      <p>
        You are responsible for content you submit. We may remove content that violates law or these Terms without notice.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of <strong>India</strong>. Courts at the seat of our registered operations shall have exclusive jurisdiction, subject to any mandatory consumer-protection rules.
      </p>

      <h2>11. Changes</h2>
      <p>We may update these Terms; continued use after changes means you accept the new Terms.</p>

      <h2>12. Contact</h2>
      <p>Reach us at <a href="mailto:support@bharataisathi.com">support@bharataisathi.com</a> or via <a href="/contact">/contact</a>.</p>
    </LegalShell>
  ),
});
