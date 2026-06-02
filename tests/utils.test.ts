import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { wasUpdatedAfterPublish } from "../lib/utils";

describe("wasUpdatedAfterPublish", () => {
  it("returns false when dates are missing", () => {
    assert.equal(wasUpdatedAfterPublish(null, "2026-01-02T00:00:00.000Z"), false);
    assert.equal(wasUpdatedAfterPublish("2026-01-01T00:00:00.000Z", null), false);
  });

  it("returns false when updated is within one minute of published", () => {
    assert.equal(
      wasUpdatedAfterPublish(
        "2026-01-01T00:00:00.000Z",
        "2026-01-01T00:00:30.000Z",
      ),
      false,
    );
  });

  it("returns true when updated is meaningfully later", () => {
    assert.equal(
      wasUpdatedAfterPublish(
        "2026-01-01T00:00:00.000Z",
        "2026-06-01T00:00:00.000Z",
      ),
      true,
    );
  });
});
