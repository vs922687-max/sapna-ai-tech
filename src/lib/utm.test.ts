import { describe, expect, it } from "vitest";
import { withUtm } from "./utm";

describe("withUtm", () => {
  it("tags a WhatsApp share as social with its campaign", () => {
    expect(withUtm("https://www.bharataisathi.com/blog/x", "whatsapp", "social", "blog_share")).toBe(
      "https://www.bharataisathi.com/blog/x?utm_source=whatsapp&utm_medium=social&utm_campaign=blog_share",
    );
  });

  it("keeps existing query values and replaces old tags", () => {
    expect(withUtm("https://www.bharataisathi.com/?a=1&utm_source=old", "x")).toBe(
      "https://www.bharataisathi.com/?a=1&utm_source=x&utm_medium=social",
    );
  });

  it("returns non-absolute links unchanged", () => {
    expect(withUtm("/blog/x", "facebook")).toBe("/blog/x");
  });
});
