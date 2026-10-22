import { Check, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { useState } from "react";
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
import paytmQr from "@/assets/paytm-payment-qr.jpeg.asset.json";
import { POSTER_PAYMENT, posterPaymentUrl } from "@/lib/poster-payment";

type PosterPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  posterLabel: string;
  receiptUrl: string;
  onReceiptClick?: () => void;
};

export function PosterPaymentDialog({ open, onOpenChange, posterLabel, receiptUrl, onReceiptClick }: PosterPaymentDialogProps) {
  const [copied, setCopied] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto border-poster/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>HD {posterLabel} — ₹{POSTER_PAYMENT.amount}</DialogTitle>
          <DialogDescription>Paytm ya kisi bhi UPI app se ₹{POSTER_PAYMENT.amount} {POSTER_PAYMENT.payeeName} ko pay karein. QR scan karte waqt amount ₹{POSTER_PAYMENT.amount} dalein aur naam check karein.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <img src={paytmQr.url} alt={`${POSTER_PAYMENT.payeeName} ka Paytm payment QR — UPI ${POSTER_PAYMENT.upiId}`} className="mx-auto h-auto w-full max-w-60 rounded-lg" />
          <div className="flex items-center justify-center gap-2">
            <span className="break-all font-medium">{POSTER_PAYMENT.upiId}</span>
            <Button size="icon" variant="ghost" aria-label="Copy UPI ID" title="Copy UPI ID" onClick={async () => {
              try { await navigator.clipboard.writeText(POSTER_PAYMENT.upiId); setCopied(true); toast.success("UPI ID copy ho gayi"); window.setTimeout(() => setCopied(false), 1500); }
              catch { toast.error("Copy nahi hui. UPI ID manually copy karein."); }
            }}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button>
          </div>
          <Button asChild className="w-full bg-poster text-poster-foreground hover:bg-poster/90"><a href={posterPaymentUrl()}><ExternalLink className="h-4 w-4" /> UPI App Mein ₹{POSTER_PAYMENT.amount} Pay Karein</a></Button>
          <p className="text-xs leading-relaxed text-muted-foreground">Payment apne-aap verify nahi hoti aur HD download yahan unlock nahi hoga. Receipt aur free downloaded poster WhatsApp par bhejein; payment confirm hone ke baad watermark-free HD poster wahin milega. OTP ya UPI PIN kabhi share na karein.</p>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button asChild className="h-auto min-h-10 whitespace-normal"><a href={receiptUrl} target="_blank" rel="noopener noreferrer" onClick={onReceiptClick}><MessageCircle className="h-4 w-4" /> Receipt WhatsApp Par Bhejein</a></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
