import { z } from "zod";
import { POSTER_PAYMENT } from "@/lib/poster-payment";

// Plan checkout uses the same Paytm UPI account as Poster Maker.
export const PLAN_PAYMENT = {
  upiId: POSTER_PAYMENT.upiId,
  payeeName: POSTER_PAYMENT.payeeName,
  whatsappNumber: POSTER_PAYMENT.whatsappNumber,
} as const;

export type PaidPlanName = "Pro" | "Team";

export const utrSchema = z
  .string()
  .transform((v) => v.replace(/\s+/g, ""))
  .pipe(z.string().regex(/^\d{12}$/, "UTR number must be exactly 12 digits"));

export function planPaymentUrl(planName: PaidPlanName, amount: number) {
  const params = new URLSearchParams({
    pa: PLAN_PAYMENT.upiId,
    pn: PLAN_PAYMENT.payeeName,
    am: String(amount),
    cu: "INR",
    tn: `Bharat AI Sathi ${planName} plan`,
  });
  return `upi://pay?${params.toString()}`;
}

export function planReceiptWhatsappUrl(planName: PaidPlanName, amount: number, utr: string) {
  const text = `Namaste! Maine Bharat AI Sathi ${planName} plan ke liye ₹${amount} pay kiya hai. UTR: ${utr}. Screenshot bhej raha/rahi hoon.`;
  return `https://wa.me/${PLAN_PAYMENT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/** Friendly message for a failed plan payment save. */
export function planPaymentErrorMessage(error: { code?: string; message?: string } | null): string {
  if (!error) return "Something went wrong. Please try again.";
  if (error.code === "23505") return "This UTR number has already been submitted.";
  if (error.message?.includes("Too many payments")) return "You already have 3 payments waiting to be checked. Please contact us on WhatsApp.";
  if (error.code === "23514") return "Please enter a valid 12-digit UTR number.";
  return "Could not save your payment. Please try again.";
}
