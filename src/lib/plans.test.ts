import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PLANS } from "./plans";

const byName = (name: string) => PLANS.find((p) => p.name === name);

describe("pricing plans", () => {
  it("Free plan costs ₹0", () => {
    assert.equal(byName("Free")?.priceNumber, 0);
  });
  it("Pro plan costs ₹499", () => {
    assert.equal(byName("Pro")?.priceNumber, 499);
    assert.equal(byName("Pro")?.price, "₹499");
  });
  it("Team plan costs ₹1,499", () => {
    assert.equal(byName("Team")?.priceNumber, 1499);
  });
});
