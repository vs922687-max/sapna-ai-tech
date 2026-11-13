import { describe, expect, it } from "bun:test";
import { PLANS } from "./plans";

const byName = (name: string) => PLANS.find((p) => p.name === name);

describe("pricing plans", () => {
  it("Free plan costs ₹0", () => {
    expect(byName("Free")?.priceNumber).toBe(0);
  });
  it("Pro plan costs ₹499", () => {
    expect(byName("Pro")?.priceNumber).toBe(499);
    expect(byName("Pro")?.price).toBe("₹499");
  });
  it("Team plan costs ₹1,499", () => {
    expect(byName("Team")?.priceNumber).toBe(1499);
  });
});
