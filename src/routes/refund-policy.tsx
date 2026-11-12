import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

const TITLE = "Refund & Cancellation Policy — Bharat AI Sathi";
const DESCRIPTION =
  "How cancellations and refunds work for Bharat AI Sathi paid plans and HD poster downloads paid by UPI, including failed or duplicate payments.";
const URL = "https://bharataisathi.com/refund-policy";
const UPDATED = "12 November 2026";

export const Route = createFileRoute("/refund-policy")({
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
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <LegalShell
      title="Refund & Cancellation Policy"
      subtitle="Simple, fair rules for anything you pay us for."
      updated={UPDATED}
    >
      <p>
        Most of Bharat AI Sathi is free to use. This policy applies only when you pay us — for a paid
        plan (such as Pro or Team) or for a one-time item such as an HD poster download without watermark.
      </p>

      <h2>1. How payments are made</h2>
      <p>
        Payments are currently accepted by <strong>UPI</strong> (for example by scanning our Paytm UPI QR
        code or paying UPI ID <strong>8146896118@ptsbi</strong>). Card and net-banking payments through a
        payment gateway such as Razorpay are not active yet; if we add them, this policy will be updated.
        We never ask for your UPI PIN, OTP, card number or bank password.
      </p>

      <h2>2. Cancel anytime</h2>
      <ul>
        <li>You can cancel a paid plan at any time by emailing support@bharataisathi.com or messaging us on WhatsApp.</li>
        <li>After you cancel, you will not be charged for the next billing period.</li>
        <li>Your paid features stay active until the end of the period you already paid for, after which your account moves to the Free plan. Your saved data is not deleted when you cancel.</li>
      </ul>

      <h2>3. When you can get a refund</h2>
      <ul>
        <li><strong>Duplicate payment</strong> — you paid twice for the same plan or poster.</li>
        <li><strong>Payment taken, nothing delivered</strong> — money left your account but you did not receive the plan access or HD file, and we cannot deliver it.</li>
        <li><strong>Wrong amount</strong> — you were charged more than the price shown on the site.</li>
      </ul>
      <p>
        In these cases we refund the full amount back to the same UPI account you paid from, after we
        confirm the transaction.
      </p>

      <h2>4. When refunds are not given</h2>
      <ul>
        <li>An HD poster or other digital file that has already been delivered to you, because it cannot be returned.</li>
        <li>A plan period you have already used, unless the service did not work because of a problem on our side.</li>
        <li>Mistakes in content you typed yourself (for example a misspelt shop name on a poster). Tell us — we will usually help fix it.</li>
      </ul>

      <h2>5. How to request a refund</h2>
      <p>Send us the following by email or WhatsApp:</p>
      <ul>
        <li>Your name and the email or phone number you used on the site</li>
        <li>The UPI transaction ID (UTR) and a screenshot of the payment</li>
        <li>What you paid for and what went wrong</li>
      </ul>
      <p>
        Email: <a href="mailto:support@bharataisathi.com">support@bharataisathi.com</a> · WhatsApp:{" "}
        <a href="https://wa.me/918146896118" target="_blank" rel="noopener noreferrer">+91 81468 96118</a>.
        We review every request and reply with the outcome. Bank and UPI refunds may take a few working
        days to show in your account, depending on your bank.
      </p>

      <h2>6. Fraud warning</h2>
      <p>
        Bharat AI Sathi never charges fees for government services, and we never ask for OTPs or PINs.
        If anyone asks you to pay "processing fees" in our name, do not pay and report it to us.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>We may update this policy. The "Last updated" date above shows the latest version.</p>
    </LegalShell>
  );
}
