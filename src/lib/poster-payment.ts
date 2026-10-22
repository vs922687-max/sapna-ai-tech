export const POSTER_PAYMENT = {
  upiId: "8146896118@ptsbi",
  payeeName: "Varinder Singh",
  amount: 29,
  whatsappNumber: "918146896118",
} as const;

export function posterPaymentUrl() {
  const params = new URLSearchParams({
    pa: POSTER_PAYMENT.upiId,
    pn: POSTER_PAYMENT.payeeName,
    am: String(POSTER_PAYMENT.amount),
    cu: "INR",
    tn: "Bharat AI Sathi HD Festival Poster",
  });
  return `upi://pay?${params.toString()}`;
}

export function posterPaymentReceiptUrl(shopName: string, festival: string) {
  const text = `Namaste! HD festival poster ke liye ₹${POSTER_PAYMENT.amount} payment ki receipt bhej raha/rahi hoon. Dukaan: ${shopName.trim()}. Festival: ${festival}. Kripya payment check karke watermark-free poster bhej dein.`;
  return `https://wa.me/${POSTER_PAYMENT.whatsappNumber}?text=${encodeURIComponent(text)}`;
}