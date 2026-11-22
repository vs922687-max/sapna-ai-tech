import { Check, CheckCircle2, Copy, ExternalLink, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import paytmQr from "@/assets/paytm-payment-qr.jpeg.asset.json";
import { supabase } from "@/integrations/supabase/client";
import {
  PLAN_PAYMENT,
  planPaymentErrorMessage,
  planPaymentUrl,
  planReceiptWhatsappUrl,
  utrSchema,
  type PaidPlanName,
} from "@/lib/plan-payment";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  planName: PaidPlanName;
  amount: number;
  onActivated: () => void;
};

type Done = { utr: string; expiresAt: string | null };

export function PlanPaymentDialog({ open, onOpenChange, userId, planName, amount, onActivated }: Props) {
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    if (open) { setUtr(""); setError(null); setDone(null); }
  }, [open, planName]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = utrSchema.safeParse(utr);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Invalid UTR"); return; }
    setSaving(true);
    setError(null);
    const { error: insertError } = await supabase
      .from("plan_payments")
      .insert({ user_id: userId, plan_name: planName, amount, utr_number: parsed.data });
    if (insertError) {
      setSaving(false);
      setError(planPaymentErrorMessage(insertError));
      return;
    }
    const { data: plan } = await supabase.from("user_plans").select("expires_at").eq("user_id", userId).maybeSingle();
    setSaving(false);
    setDone({ utr: parsed.data, expiresAt: plan?.expires_at ?? null });
    onActivated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        {done ? (
          <div className="space-y-4 py-2 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[oklch(0.72_0.16_155)]" aria-hidden />
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl">Your {planName} plan is active!</DialogTitle>
              <DialogDescription>
                Thank you! We saved your payment of ₹{amount.toLocaleString("en-IN")} (UTR {done.utr}).
                {done.expiresAt ? ` Your plan runs until ${new Date(done.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.` : ""}
              </DialogDescription>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">
              We match every UTR with our bank statement. If the payment is not found, the plan is switched back to Free.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => onOpenChange(false)}>Done</Button>
              <Button asChild variant="outline">
                <a href={planReceiptWhatsappUrl(planName, amount, done.utr)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> Send screenshot on WhatsApp (optional)
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Upgrade to {planName} — ₹{amount.toLocaleString("en-IN")}/month</DialogTitle>
              <DialogDescription>
                Scan the QR with Paytm, PhonePe, Google Pay or any UPI app and pay exactly ₹{amount.toLocaleString("en-IN")} to {PLAN_PAYMENT.payeeName}.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-2xl border border-border/60 bg-card/40 p-3 text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Amount to pay</p>
              <p className="font-display text-3xl font-bold">₹{amount.toLocaleString("en-IN")}</p>
            </div>

            <img
              src={paytmQr.url}
              alt={`${PLAN_PAYMENT.payeeName} Paytm UPI QR code — ${PLAN_PAYMENT.upiId}`}
              className="mx-auto h-auto w-full max-w-56 rounded-lg"
            />

            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">UPI ID:</span>
              <span className="break-all font-medium">{PLAN_PAYMENT.upiId}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Copy UPI ID"
                title="Copy UPI ID"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(PLAN_PAYMENT.upiId);
                    setCopied(true);
                    toast.success("UPI ID copied");
                    window.setTimeout(() => setCopied(false), 1500);
                  } catch {
                    toast.error("Could not copy. Please copy the UPI ID manually.");
                  }
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <Button asChild type="button" variant="outline" className="w-full sm:hidden">
              <a href={planPaymentUrl(planName, amount)}><ExternalLink className="h-4 w-4" /> Open UPI app to pay ₹{amount.toLocaleString("en-IN")}</a>
            </Button>

            <div className="space-y-2">
              <Label htmlFor="utr">12-digit UPI UTR / Transaction Reference number</Label>
              <Input
                id="utr"
                inputMode="numeric"
                autoComplete="off"
                placeholder="e.g. 412345678901"
                maxLength={14}
                value={utr}
                onChange={(e) => { setUtr(e.target.value.replace(/[^\d\s]/g, "")); setError(null); }}
                aria-invalid={error ? true : undefined}
                aria-describedby="utr-help"
              />
              <p id="utr-help" className="text-xs text-muted-foreground">
                After paying, find the 12-digit UTR (also called UPI Ref No.) in your UPI app's payment details.
              </p>
              {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Submit & activate {planName}
              </Button>
            </DialogFooter>
            <p className="text-center text-[11px] text-muted-foreground">Never share your UPI PIN or OTP with anyone.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
