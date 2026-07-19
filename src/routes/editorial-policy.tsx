import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/legal-shell";

const URL = "https://bharataisathi.com/editorial-policy";
const TITLE = "Editorial Policy — Bharat AI Sathi";
const DESC = "Bharat AI Sathi editorial standards: how we research, write, fact-check, attribute and correct content across our blog, help articles and government service explainers.";

export const Route = createFileRoute("/editorial-policy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: EditorialPolicyPage,
});

function EditorialPolicyPage() {
  return (
    <LegalShell
      title="Editorial Policy"
      subtitle="Our standards for research, sourcing, fact-checking and corrections."
      updated="July 19, 2026"
    >
      <p>
        The Bharat AI Sathi editorial team publishes tutorials, product updates, government service
        explainers and long-form guides across our blog and help centre. This page describes the
        standards every piece of published content follows.
      </p>

      <h2>1. Independence</h2>
      <p>
        Editorial decisions are made by our in-house team. Advertisers, partners and sponsors have
        no influence on which topics we cover, how we cover them, or what conclusions we reach.
        Sponsored content, when present, is clearly labelled as such.
      </p>

      <h2>2. Sourcing</h2>
      <ul>
        <li>Government scheme details are sourced from official Ministry portals, gazette notifications and PIB releases.</li>
        <li>Statistics are attributed to their primary source (NSO, RBI, MeitY, UIDAI, NITI Aayog, etc.).</li>
        <li>Third-party product claims are verified against the vendor's official documentation.</li>
      </ul>

      <h2>3. Use of AI in the editorial process</h2>
      <p>
        We use AI to help draft outlines, summarise long documents and translate between Hindi and
        English. Every published article is then rewritten, fact-checked and edited by a human
        editor. We never publish raw, unreviewed AI output. See our
        {" "}<a href="/ai-policy">AI Usage Policy</a> for detail.
      </p>

      <h2>4. Bylines and expertise</h2>
      <p>
        Long-form articles carry the author's name and a short bio describing their relevant
        experience. When an article is a collaboration or is written by the editorial team as a
        whole, it is bylined "Bharat AI Sathi Editorial".
      </p>

      <h2>5. Accuracy and corrections</h2>
      <p>
        We aim for accuracy in every article. If you spot a factual error, email
        {" "}<a href="mailto:editorial@bharataisathi.com">editorial@bharataisathi.com</a> with the
        URL and the correction. Confirmed corrections are made inline and noted at the bottom of
        the article with the date of change.
      </p>

      <h2>6. Updates and freshness</h2>
      <p>
        Government scheme details, eligibility criteria and application steps change frequently.
        We review evergreen articles at least once every six months and update the "Last updated"
        date accordingly. Time-sensitive articles are updated as soon as an official change is
        published.
      </p>

      <h2>7. Conflicts of interest</h2>
      <p>
        Writers must disclose any financial or personal relationship with a company, product or
        scheme they cover. Where a conflict cannot be avoided, the article is reassigned or a
        prominent disclosure is added.
      </p>

      <h2>8. Reader feedback</h2>
      <p>
        We take reader feedback seriously. Reach us at
        {" "}<a href="mailto:editorial@bharataisathi.com">editorial@bharataisathi.com</a> for
        editorial concerns, or use our <a href="/contact">contact page</a> for general enquiries.
      </p>
    </LegalShell>
  );
}
