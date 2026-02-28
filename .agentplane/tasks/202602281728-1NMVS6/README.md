---
id: "202602281728-1NMVS6"
title: "Enhanced OpenRouter debug payload logging with colored output"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T17:29:08.930Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved enhanced colored payload logging for OpenRouter debug."
verification:
  state: "ok"
  updated_at: "2026-02-28T17:30:22.113Z"
  updated_by: "TESTER"
  note: "Colored payload debug logging added"
commit: null
comments:
  -
    author: "CODER"
    body: "Start: implementing full request/response debug payload logging with bright-white/gray color hierarchy for OpenRouter adapters."
events:
  -
    type: "status"
    at: "2026-02-28T17:29:09.867Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing full request/response debug payload logging with bright-white/gray color hierarchy for OpenRouter adapters."
  -
    type: "verify"
    at: "2026-02-28T17:30:22.113Z"
    author: "TESTER"
    state: "ok"
    note: "Colored payload debug logging added"
doc_version: 2
doc_updated_at: "2026-02-28T17:30:22.114Z"
doc_updated_by: "TESTER"
description: "Log outgoing and incoming OpenRouter payloads with bright white primary lines and gray expanded details for judge and image requests."
id_source: "generated"
---
## Summary

Improve OpenRouter debug diagnostics by logging what the runtime sends and receives, with color hierarchy for quick visual parsing in terminal logs.

## Scope

In scope: src/infra/openrouter-judge.mjs and src/infra/image-pipeline.mjs (plus shared helper if needed). Out of scope: non-debug runtime behavior and API contract changes.

## Plan

1) Add ANSI color helpers for bright white headline and gray details. 2) Log request payload before OpenRouter call for judge/image in debug mode. 3) Log response payload/body on success and failure. 4) Run lint/tests and record evidence.

## Risks

Risk: noisy logs and potential sensitive output. Mitigation: log only request/response payloads already sent/received by runtime; avoid logging auth headers or secrets.

## Verify Steps

1. Run node scripts/lint.mjs (pass). 2. Run node --test (all pass). 3. Start with OPENROUTER_DEBUG=true and trigger one turn; confirm bright white header lines and gray detailed request/response blocks in logs.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T17:30:22.113Z — VERIFY — ok

By: TESTER

Note: Colored payload debug logging added

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T17:30:15.411Z, excerpt_hash=sha256:7c98e1e00851173f9f68752e2c3b811b3fe56d7b2312ffbd86805a44e402f995

Details:

Added bright-white headline logs and gray expanded payload logs for OpenRouter judge/image request and response paths. Lint/tests pass.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert OpenRouter debug logging changes if output readability regresses or runtime behavior is affected.

## Context

Current logs show only model/status and validation errors; user needs full payload visibility while keeping readable output.

## Notes

### Approvals / Overrides
