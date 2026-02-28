---
id: "202602281748-9FCRD0"
title: "Fix OpenRouter image generation endpoint to chat/completions"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T17:48:49.163Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved OpenRouter image endpoint fix."
verification:
  state: "ok"
  updated_at: "2026-02-28T17:50:15.440Z"
  updated_by: "TESTER"
  note: "OpenRouter image endpoint fix verified"
commit: null
comments:
  -
    author: "CODER"
    body: "Start: replacing image generation request path with OpenRouter chat/completions multimodal flow and updating parser/tests."
events:
  -
    type: "status"
    at: "2026-02-28T17:48:50.034Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: replacing image generation request path with OpenRouter chat/completions multimodal flow and updating parser/tests."
  -
    type: "verify"
    at: "2026-02-28T17:50:15.440Z"
    author: "TESTER"
    state: "ok"
    note: "OpenRouter image endpoint fix verified"
doc_version: 2
doc_updated_at: "2026-02-28T17:50:15.441Z"
doc_updated_by: "TESTER"
description: "Replace unsupported /images/generations calls with OpenRouter-supported chat/completions image flow and update parser/tests."
id_source: "generated"
---
## Summary

Fix image generation transport for OpenRouter by using the documented chat/completions multimodal endpoint instead of the unsupported images/generations route.

## Scope

In scope: src/infra/image-pipeline.mjs and related tests. Out of scope: model changes, UI changes, judge contract.

## Plan

1) Switch image request endpoint to /chat/completions with modalities/output format for image. 2) Update response parser to support OpenRouter image payload shape. 3) Update tests to the new payload shape. 4) Run lint and tests.

## Risks

Risk: payload schema mismatch across providers. Mitigation: accept both common image payload variants in parser and keep detailed debug logs.

## Verify Steps

1. node scripts/lint.mjs passes. 2. node --test passes. 3. OPENROUTER_DEBUG=true and one seed-scene request logs response status 200 (not 404) for image call.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T17:50:15.440Z — VERIFY — ok

By: TESTER

Note: OpenRouter image endpoint fix verified

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T17:50:06.523Z, excerpt_hash=sha256:65c56155902c6f2f78fe836b248a124ac4f61aa452de2542384662c359f060d2

Details:

Image pipeline now targets /chat/completions multimodal route and parses image data URL payload. Unit tests assert new endpoint path. Lint/tests pass.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert image pipeline endpoint/parser changes and restore previous behavior if runtime regressions appear.

## Context

Runtime logs show HTTP 404 for /api/v1/images/generations returning OpenRouter not-found HTML. OpenRouter docs specify chat/completions for image models like openai/gpt-5-image.

## Notes

### Approvals / Overrides
