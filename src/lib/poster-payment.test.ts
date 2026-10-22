import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { POSTER_PAYMENT, posterPaymentUrl, posterPaymentReceiptUrl } from "./poster-payment";

describe("poster payment", () => {
  it("uses the owner's requested Paytm payment address", () => {
    assert.equal(new URL(posterPaymentUrl()).searchParams.get("pa"), "8146896118@ptsbi");
  });
  it("requests ₹29 in INR", () => {
    const url = new URL(posterPaymentUrl());
    assert.equal(POSTER_PAYMENT.amount, 29);
    assert.equal(url.searchParams.get("am"), "29");
    assert.equal(url.searchParams.get("cu"), "INR");
  });
  it("sends receipts to the owner's WhatsApp for manual review", () => {
    const url = new URL(posterPaymentReceiptUrl("Test Shop", "Holi"));
    assert.equal(url.pathname, "/918146896118");
    assert.ok(url.searchParams.get("text")?.includes("Test Shop"));
  });
});