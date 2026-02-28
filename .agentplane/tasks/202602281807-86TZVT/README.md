---
id: "202602281807-86TZVT"
title: "Fix motifs display and push image generation to ultra-cheap wide profile"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T18:07:58.436Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved motifs display and ultra-cheap wide image defaults."
verification:
  state: "ok"
  updated_at: "2026-02-28T18:09:57.652Z"
  updated_by: "TESTER"
  note: "Motifs + image defaults + log truncation verified"
commit: null
comments:
  -
    author: "CODER"
    body: "Start: fixing motif rendering quality in UI and tuning image generation defaults to wider and cheaper profile."
events:
  -
    type: "status"
    at: "2026-02-28T18:07:59.447Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: fixing motif rendering quality in UI and tuning image generation defaults to wider and cheaper profile."
  -
    type: "verify"
    at: "2026-02-28T18:09:57.652Z"
    author: "TESTER"
    state: "ok"
    note: "Motifs + image defaults + log truncation verified"
doc_version: 2
doc_updated_at: "2026-02-28T18:09:57.653Z"
doc_updated_by: "TESTER"
description: "Show concrete active motifs in UI without generic placeholders, reduce image output defaults further, and keep debug logs concise by truncating base64 payloads."
id_source: "generated"
---
## Summary

Remove generic motif placeholders by normalizing motif extraction in UI, and make image generation both cheaper and wider by default.

## Scope

In scope: ui/main.js motif rendering logic, runtime image default settings, .env.example defaults, and tests around image payload + debug truncation behavior.

## Plan

1) Improve motif extraction to support object/string motif forms and hide invalid placeholders. 2) Move image defaults to ultra-cheap wide profile. 3) Tighten debug truncation to show first 100 chars then ellipsis for base64-like payloads. 4) Update tests and run lint/tests.

## Risks

Risk: over-filtering motifs could hide useful data. Mitigation: preserve valid names from multiple key variants and provide explicit fallback text when none exist.

## Verify Steps

1. node scripts/lint.mjs passes. 2. node --test passes. 3. UI motif list displays meaningful entries or clear fallback text (not repeated generic 'motif'). 4. Image payload defaults reflect cheaper + wider profile.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T18:09:57.652Z — VERIFY — ok

By: TESTER

Note: Motifs + image defaults + log truncation verified

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T18:09:56.751Z, excerpt_hash=sha256:c3152e5b1dcd7cdda63079f60c52199a184837de29b659d1f429425a6d007ea0

Details:

UI no longer prints generic motif placeholders when motif labels are missing; image defaults now 21:9 + 672x288 + low quality; debug logs truncate data-url and raw base64 payloads.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert UI motif rendering and image default config changes if readability or provider compatibility worsens.

## Context

User observes repetitive 'motif' labels and asks for concrete motifs. Also requests lower image cost and wider generation frame.

## Notes

### Approvals / Overrides
