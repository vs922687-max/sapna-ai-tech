import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Home, Building2, Percent, AlertTriangle, ExternalLink, CheckCircle2, Landmark } from "lucide-react";

const TITLE = "Pradhan Mantri Awas Yojana (PMAY) - Simple Guide | Bharat AI Sathi";
const DESCRIPTION =
  "PMAY guide in Hindi/English: types of PMAY 2.0 (BLC, AHP, ISS), eligibility, documents and official application link. Simple, verified information only.";
const URL = "https://bharataisathi.com/pmay";

export const Route = createFileRoute("/pmay")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "PMAY, Pradhan Mantri Awas Yojana, PMAY 2.0, BLC, AHP, ISS, home loan subsidy, government housing scheme india" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "GovernmentService",
          name: "Pradhan Mantri Awas Yojana (PMAY)",
          url: URL,
          description: DESCRIPTION,
          serviceType: "Housing Scheme",
          provider: {
            "@type": "GovernmentOrganization",
            name: "Ministry of Housing and Urban Affairs, Government of India",
            url: "https://pmay-urban.gov.in/",
          },
        }),
      },
    ],
  }),
  component: PmayPage,
});

function PmayPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/gov" className="hover:text-primary">Government Services</Link>
          <span>/</span>
          <span className="text-foreground">PMAY</span>
        </nav>

        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs text-muted-foreground">
            <Landmark className="h-3.5 w-3.5" /> Government Scheme
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Pradhan Mantri Awas Yojana (PMAY) - Simple Guide
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Pradhan Mantri Awas Yojana (PMAY) Government of India ki ek flagship housing scheme hai,
            jiska maksad har parivar ke liye ek pucca ghar ensure karna hai. Yeh scheme urban aur rural
            dono ilakon mein ghar kharidne, banane ya renovate karne mein madad karti hai — specially
            low-income aur middle-income families ke liye.
          </p>
        </header>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold sm:text-2xl">PMAY 2.0 ke 3 Types</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TypeCard
              icon={<Home className="h-5 w-5" />}
              title="Beneficiary Led Construction (BLC)"
              hindi="लाभार्थी निर्माण"
            >
              Agar aapke paas apni zameen hai aur wahan naya ghar banana hai ya purana ghar
              renovate karna hai, to BLC aapke liye hai. Government financial assistance deti hai
              construction ya upgradation ke liye.
            </TypeCard>
            <TypeCard
              icon={<Building2 className="h-5 w-5" />}
              title="Affordable Housing in Partnership (AHP)"
              hindi="साझेदारी में किफायती आवास"
            >
              Yeh tab kaam aata hai jab aap builder ya government-partnership projects se ready ghar
              khareedna chahte hain. AHP affordable housing projects ko subsidy aur support deta hai.
            </TypeCard>
            <TypeCard
              icon={<Percent className="h-5 w-5" />}
              title="Interest Subsidy Scheme (ISS)"
              hindi="ब्याज सब्सिडी योजना"
            >
              Agar aap home loan le rahe hain, to ISS ke tehat aapko interest rate par subsidy milti
              hai. Isse EMI ka bojh kam hota hai aur ghar khareedna aasan ho jata hai.
            </TypeCard>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Eligibility ke liye zaroori baatein</h2>
          <ul className="mt-5 space-y-3 rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6">
            <EligibilityItem>Aapka Aadhaar card zaroori hai.</EligibilityItem>
            <EligibilityItem>Aapke household ki annual income details chahiye honge.</EligibilityItem>
            <EligibilityItem>Aapke paas India mein kahin bhi pucca ghar nahi hona chahiye.</EligibilityItem>
            <EligibilityItem>Pehle kisi bhi government housing scheme ka benefit nahi liya hona chahiye.</EligibilityItem>
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-[oklch(0.76_0.17_55)]/30 bg-[oklch(0.76_0.17_55)]/10 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[oklch(0.76_0.17_55)]" />
            <div>
              <h3 className="font-display text-base font-semibold sm:text-lg">Important Note</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Ye site sirf jaankari ke liye hai. Application, Aadhaar verification aur OTP jaisa
                sensitive kaam sirf official government portal par hi karein. Kabhi bhi apna OTP ya
                Aadhaar details kisi third-party site par share na karein.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="font-display text-xl font-bold">Official PMAY Website par Jayein</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Application aur latest updates ke liye hamesha official portal use karein.
            </p>
          </div>
          <a
            href="https://pmay-urban.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:text-base"
          >
            Official PMAY Website par Jayein <ExternalLink className="h-4 w-4" />
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function TypeCard({
  icon,
  title,
  hindi,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hindi: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/60 bg-card/40 p-5 transition hover:border-primary/40">
      <div className="flex items-center gap-2 text-primary">{icon}</div>
      <h3 className="mt-3 font-display text-base font-semibold sm:text-lg">{title}</h3>
      <p className="text-[11px] text-muted-foreground">{hindi}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function EligibilityItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <span>{children}</span>
    </li>
  );
}
