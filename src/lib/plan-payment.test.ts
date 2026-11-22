import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PLAN_PAYMENT, planPaymentUrl, utrSchema } from "./plan-payment";

describe("plan payment UTR input", () => {
  it("accepts exactly 12 digits", () => {
    assert.equal(utrSchema.parse("412345678901"), "412345678901");
  });
  it("ignores spaces the user types", () => {
    assert.equal(utrSchema.parse(" 4123 4567 8901 "), "412345678901");
  });
  it("rejects 11 or 13 digits and letters", () => {
    assert.equal(utrSchema.safeParse("41234567890").success, false);
    assert.equal(utrSchema.safeParse("4123456789012").success, false);
    assert.equal(utrSchema.safeParse("41234567890A").success, false);
  });
});

describe("plan UPI link", () => {
  it("pays 8146896118@ptsbi the plan amount", () => {
    const url = new URL(planPaymentUrl("Pro", 499).replace("upi://", "https://"));
    assert.equal(PLAN_PAYMENT.upiId, "8146896118@ptsbi");
    assert.equal(url.searchParams.get("pa"), "8146896118@ptsbi");
    assert.equal(url.searchParams.get("am"), "499");
  });
});
