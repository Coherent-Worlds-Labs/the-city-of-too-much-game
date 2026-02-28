---
id: "202602281756-DBXXW2"
title: "Reduce image generation cost and improve startup loading UX"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T17:57:10.576Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved cost + startup UX + log truncation changes."
verification:
  state: "ok"
  updated_at: "2026-02-28T17:59:38.797Z"
  updated_by: "TESTER"
  note: "Cost/UX/log updates verified"
commit: null
comments:
  -
    author: "CODER"
    body: "Start: reducing image cost defaults, improving initial loading UX, and truncating base64-heavy debug logs for readability."
events:
  -
    type: "status"
    at: "2026-02-28T17:57:11.425Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: reducing image cost defaults, improving initial loading UX, and truncating base64-heavy debug logs for readability."
  -
    type: "verify"
    at: "2026-02-28T17:59:38.797Z"
    author: "TESTER"
    state: "ok"
    note: "Cost/UX/log updates verified"
doc_version: 2
doc_updated_at: "2026-02-28T17:59:38.799Z"
doc_updated_by: "TESTER"
description: "Lower image generation cost defaults, add clear bootstrapping UI before seed scene arrives, and truncate base64 payloads in debug logs."
id_source: "generated"
---
## Summary

Reduce default image generation cost, provide explicit startup loading state while seed scene and hand are preparing, and keep debug logs readable by truncating base64 payloads.

## Scope

In scope: src/infra/runtime-config.mjs, src/infra/image-pipeline.mjs, src/infra/debug-log.mjs, ui/main.js, .env.example, tests for image/debug behavior. Out of scope: gameplay mechanics.

## Plan

1) Add runtime image output controls and set lower-cost defaults (smaller output + lower quality). 2) Apply settings in image request payload. 3) Add startup loading state with visible spinner/text and safe placeholder cards before createGame resolves. 4) Truncate base64-like log strings to first 100 chars + ellipsis. 5) Update tests, run lint/tests.

## Risks

Risk: unsupported image params by provider. Mitigation: keep response diagnostics and configurable env values to adjust quickly.

## Verify Steps

1. node scripts/lint.mjs passes. 2. node --test passes. 3. Startup UI shows loading text/spinner before seed scene. 4. Debug log payload truncates base64 content to 100 chars with ellipsis.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T17:59:38.797Z — VERIFY — ok

By: TESTER

Note: Cost/UX/log updates verified

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T17:59:37.720Z, excerpt_hash=sha256:d2d295f2c0fdcfef0085f022ed6976cce27f19d81fb3a0d8bcbc22faf6495fd5

Details:

Image defaults now request 768x432 low-quality output; startup UI shows explicit bootstrap loading state; debug logs truncate base64-like content to preview form; lint/tests pass.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert modified files to prior defaults if provider compatibility or UX regressions appear.

## Context

User reported high image cost, unclear initial UI during seed generation, and excessive logs due full base64 dumps.

## Notes

### Approvals / Overrides
