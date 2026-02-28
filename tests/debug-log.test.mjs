import test from "node:test";
import assert from "node:assert/strict";
import { logDebugDetails, logDebugRawText } from "../src/infra/debug-log.mjs";

test("logDebugDetails truncates base64-like strings", () => {
  const originalConsoleLog = console.log;
  const lines = [];
  console.log = (line) => {
    lines.push(String(line));
  };

  try {
    const longDataUrl = `data:image/png;base64,${"A".repeat(500)}`;
    logDebugDetails("response payload", {
      choices: [{ message: { images: [{ image_url: { url: longDataUrl } }] } }],
      data: [{ b64_json: "B".repeat(500) }]
    });
  } finally {
    console.log = originalConsoleLog;
  }

  const output = lines.join("\n");
  assert.equal(output.includes("data:image/png;base64,"), true);
  assert.equal(output.includes("..."), true);
  assert.equal(output.includes("A".repeat(200)), false);
  assert.equal(output.includes("B".repeat(200)), false);
});

test("logDebugRawText prints full prompt text without truncation", () => {
  const originalConsoleLog = console.log;
  const lines = [];
  console.log = (line) => {
    lines.push(String(line));
  };

  try {
    const fullPrompt = `Prompt start ${"X".repeat(700)} prompt end`;
    logDebugRawText("request prompt (full)", fullPrompt);
  } finally {
    console.log = originalConsoleLog;
  }

  const output = lines.join("\n");
  assert.equal(output.includes("request prompt (full)"), true);
  assert.equal(output.includes("X".repeat(700)), true);
  assert.equal(output.includes("..."), false);
});
