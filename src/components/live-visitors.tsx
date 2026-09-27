import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recordSiteVisit } from "@/lib/visit-count.functions";

/**
 * Cumulative visitor count shown in the footer.
 *
 * `HISTORICAL_BASE` is the all-time unique-visitor total captured from project
 * analytics before this counter existed. From here on, each new browser
 * records one visit in the `site_visits` table (guarded by localStorage), so
 * the displayed number = base + count of recorded visits.
 */
const HISTORICAL_BASE = 166;

export function LiveVisitors({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
         // Record this browser once through a server function that accepts no row data.
        const counted =
          typeof window !== "undefined"
            ? window.localStorage.getItem("bas_visitor_counted")
            : "1";
        if (!counted) {
           try {
             await recordSiteVisit();
            window.localStorage.setItem("bas_visitor_counted", "1");
           } catch { /* Still show the last recorded total below. */ }
        }

        const { data, error } = await supabase
          .from("site_visit_metrics")
          .select("total")
          .single();

        if (error) throw error;
        if (!cancelled) setCount(HISTORICAL_BASE + Number(data.total ?? 0));
      } catch {
        if (!cancelled) setCount(null);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <p className={`flex items-center gap-2 ${className}`} aria-live="polite">
      <Users className="h-3.5 w-3.5 text-[oklch(0.66_0.16_155)]" />
      <span>
        <strong className="font-semibold text-foreground">
          {count.toLocaleString("en-IN")}
        </strong>{" "}
        total visitors
      </span>
    </p>
  );
}
