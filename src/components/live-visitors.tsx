import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Live visitor count via realtime presence (no data stored). */
export function LiveVisitors({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const id = Math.random().toString(36).slice(2);
    const channel = supabase.channel("live-visitors", {
      config: { presence: { key: id } },
    });

    const sync = () => {
      const state = channel.presenceState();
      setCount(Object.keys(state).length);
    };

    channel
      .on("presence", { event: "sync" }, sync)
      .on("presence", { event: "join" }, sync)
      .on("presence", { event: "leave" }, sync)
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          void channel.track({ at: Date.now() });
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  if (count === null) return null;

  return (
    <p className={`flex items-center gap-2 ${className}`} aria-live="polite">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.66_0.16_155)] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.66_0.16_155)]" />
      </span>
      <span>
        <strong className="font-semibold text-foreground">{count}</strong> live visitor{count === 1 ? "" : "s"}
      </span>
    </p>
  );
}
