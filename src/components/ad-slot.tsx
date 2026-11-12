import { useEffect, useRef, useState } from "react";
import { ADSENSE_PUBLISHER_ID, ADSENSE_SLOTS, type AdSlotName } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  name: AdSlotName;
  /** Optional label shown above the ad (AdSense policy: ads must be distinguishable) */
  label?: string;
  className?: string;
  format?: string;
  /**
   * Reserve a labelled, empty space while the AdSense unit id is not set yet.
   * Keeps layout stable once real units are added in src/lib/adsense.ts.
   */
  placeholder?: boolean;
  /** Reserved height for the placeholder box, in px. */
  minHeight?: number;
};

/**
 * Renders a responsive AdSense unit. Renders nothing when the slot id is not
 * configured yet, so pages never show blank ad frames.
 */
export function AdSlot({
  name,
  label = "Advertisement",
  className,
  format = "auto",
  placeholder = false,
  minHeight = 250,
}: Props) {
  const slot = ADSENSE_SLOTS[name];
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ad blocker or script not ready */
    }
  }, [mounted, slot]);

  if (!slot) {
    if (!placeholder) return null;
    return (
      <aside className={className ?? "my-8"} aria-label={label} data-ad-placeholder={name}>
        <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <div
          className="rounded-xl border border-dashed border-border/60 bg-muted/20"
          style={{ minHeight }}
        />
      </aside>
    );
  }
  if (!mounted) return null;

  return (
    <aside
      className={className ?? "my-8"}
      aria-label={label}
      role="complementary"
    >
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
