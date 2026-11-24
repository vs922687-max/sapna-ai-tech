import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { withUtm } from "./utm";

describe("withUtm", () => {
  it("tags a WhatsApp share as social with its campaign", () => {
    assert.equal(
      withUtm("https://www.bharataisathi.com/blog/x", "whatsapp", "social", "blog_share"),
      "https://www.bharataisathi.com/blog/x?utm_source=whatsapp&utm_medium=social&utm_campaign=blog_share",
    );
  });

  it("keeps existing query values and replaces old tags", () => {
    assert.equal(
      withUtm("https://www.bharataisathi.com/?a=1&utm_source=old", "x"),
      "https://www.bharataisathi.com/?a=1&utm_source=x&utm_medium=social",
    );
  });

  it("returns non-absolute links unchanged", () => {
    assert.equal(withUtm("/blog/x", "facebook"), "/blog/x");
  });
});
