import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

test("bootstrap scaffold folders exist", () => {
  for (const requiredPath of ["src/app", "src/api", "src/domain", "src/infra", "scripts", "worlds"]) {
    assert.equal(existsSync(requiredPath), true, `missing path: ${requiredPath}`);
  }
});
