import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type PaymentRow = {
  id: string;
  user_email: string | null;
  plan_name: string;
  amount: number;
  utr_number: string;
  status: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Active · not checked yet",
  approved: "Checked · payment received",
  rejected: "Rejected · plan removed",
};

export function AdminPlanPayments() {
  const [rows, setRows] = useState<PaymentRow[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("plan_payments")
      .select("id, user_email, plan_name, amount, utr_number, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) { toast.error("Could not load plan payments"); setRows([]); return; }
    setRows(data ?? []);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const review = async (id: string, status: "approved" | "rejected") => {
    setBusy(id);
    const { error } = await supabase.from("plan_payments").update({ status }).eq("id", id);
    setBusy(null);
    if (error) { toast.error("Could not update this payment"); return; }
    toast.success(status === "approved" ? "Marked as received" : "Payment rejected and plan removed");
    void load();
  };

  return (
    <div className="mt-8 glass rounded-2xl border border-border/60 p-6">
      <div className="mb-4 flex items-center gap-2">
        <IndianRupee className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-bold">Plan payments (UPI)</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Plans turn on as soon as a user submits a UTR. Match each UTR with your Paytm statement, then mark it received — or reject it to switch that user back to Free.
      </p>
      {rows === null ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No plan payments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="py-2 pr-3">Date</th><th className="pr-3">User</th><th className="pr-3">Plan</th><th className="pr-3">Amount</th><th className="pr-3">UTR</th><th className="pr-3">Status</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-border/40">
                  <td className="py-2 pr-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                  <td className="pr-3 break-all">{r.user_email ?? "—"}</td>
                  <td className="pr-3">{r.plan_name}</td>
                  <td className="pr-3">₹{Number(r.amount).toLocaleString("en-IN")}</td>
                  <td className="pr-3 font-mono">{r.utr_number}</td>
                  <td className="pr-3">{STATUS_LABEL[r.status] ?? r.status}</td>
                  <td className="py-2 whitespace-nowrap text-right">
                    {r.status === "pending" && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" disabled={busy === r.id} onClick={() => review(r.id, "approved")}>Received</Button>
                        <Button size="sm" variant="outline" disabled={busy === r.id} onClick={() => review(r.id, "rejected")}>Reject</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
