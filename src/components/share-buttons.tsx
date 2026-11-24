import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { withUtm } from "@/lib/utm";

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

const base =
  "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground";

export function ShareButtons({ url, title, className = "" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  // Tag every shared link so visits from shares show their real source in analytics.
  const tagged = (source: string) => withUtm(url, source, "social", "share_button");

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} — ${tagged("whatsapp")}`)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(tagged("x"))}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(tagged("linkedin"))}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(tagged("facebook"))}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tagged("copied_link"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url: tagged("mobile_share") });
      } catch {
        /* dismissed */
      }
    } else {
      void copy();
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Share
      </span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={base}
          aria-label={`Share on ${l.label}`}
        >
          {l.label}
        </a>
      ))}
      <button type="button" onClick={copy} className={base} aria-label="Copy article link">
        {copied ? <Check className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
        {copied ? "Copied" : "Copy link"}
      </button>
      <button
        type="button"
        onClick={nativeShare}
        className={`${base} sm:hidden`}
        aria-label="Share article"
      >
        <Share2 className="h-3 w-3" /> More
      </button>
    </div>
  );
}
