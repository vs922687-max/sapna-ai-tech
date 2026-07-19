import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const FAQS = [
  {
    q: "Bharat AI Sathi kya hai?",
    a: "Bharat AI Sathi ek premium, made-for-India AI suite hai jismein chat, image generation, translator, PDF chat, voice assistant, coding assistant aur 100+ utility tools shamil hain — Hindi, English aur 10+ Indian languages mein.",
  },
  {
    q: "Kya Bharat AI Sathi free hai?",
    a: "Haan, Free plan hamesha ke liye free hai — unlimited AI chat, basic image generation aur 10+ Indian languages ke saath. Pro plan ₹499/month se shuru hota hai.",
  },
  {
    q: "Kaunsa AI model use hota hai?",
    a: "Hum Google Gemini 2.5 Flash aur Pro models use karte hain, Lovable AI Gateway ke through — fast responses aur superior Hindi/Indian language understanding ke liye.",
  },
  {
    q: "Kya mera data secure hai?",
    a: "Bilkul. Aapki conversations end-to-end encrypted hain, hum aapka data kabhi bhi third parties ko sell nahi karte, aur aap kabhi bhi apna account aur data delete kar sakte hain.",
  },
  {
    q: "Kaunsi Indian languages support hoti hain?",
    a: "Hindi, English, Tamil, Bengali, Marathi, Telugu, Gujarati, Kannada, Malayalam, Punjabi aur Odia — sab natively supported hain, sirf translated nahi.",
  },
  {
    q: "Kya main mobile par use kar sakta hun?",
    a: "Haan, poori website fully responsive hai aur mobile, tablet aur desktop — sab par smoothly kaam karti hai. Tier 2 aur Tier 3 cities ke slow networks ke liye bhi optimized hai.",
  },
  {
    q: "Payment kaise karein?",
    a: "Hum UPI, credit/debit cards, net banking aur wallets accept karte hain — sab kuch ₹ INR mein, koi dollar surprises nahi.",
  },
  {
    q: "Refund policy kya hai?",
    a: "7-day money-back guarantee — agar Pro ya Team plan pasand nahi aaye, poora refund milega, no questions asked.",
  },
];

const URL = "https://bharataisathi.com/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Bharat AI Sathi" },
      { name: "description", content: "Bharat AI Sathi ke baare mein sabhi frequently asked questions — pricing, features, languages, security aur payments." },
      { property: "og:title", content: "FAQ — Bharat AI Sathi" },
      { property: "og:description", content: "Common questions about Bharat AI Sathi — India's premium AI companion." },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-14 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Help Center</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Frequently asked <span className="text-gradient-tricolor">questions</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Bharat AI Sathi ke baare mein sab kuch jo aap jaanna chahte hain.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="glass group rounded-2xl border border-border/60 p-6 open:border-primary/40"
            >
              <summary className="cursor-pointer list-none font-display text-lg font-semibold marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
