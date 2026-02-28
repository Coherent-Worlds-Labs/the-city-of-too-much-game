---
id: "202602282140-D3ZZ8Z"
title: "Strengthen image prompt with explicit multi-turn history context"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T21:41:31.616Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved prompt continuity enhancement with compact multi-turn history context."
verification:
  state: "ok"
  updated_at: "2026-02-28T21:42:52.956Z"
  updated_by: "TESTER"
  note: "Image prompt now includes explicit cumulative multi-turn history context."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T21:42:52.956Z"
    author: "TESTER"
    state: "ok"
    note: "Image prompt now includes explicit cumulative multi-turn history context."
doc_version: 2
doc_updated_at: "2026-02-28T21:42:52.958Z"
doc_updated_by: "TESTER"
description: "Augment continuity prompt with concise evolution trail from recent turns so image generation reflects accumulated history, not only latest card."
id_source: "generated"
---
## Summary


## Scope

In scope: src/api/runtime-api.mjs history-to-prompt summarization, src/infra/image-pipeline.mjs prompt assembly, tests/image-pipeline.test.mjs coverage. Out of scope: judge contract and UI rendering.

## Plan

1. Add history-context argument to continuity prompt builder and include it as a dedicated prompt clause.\n2. Build compact multi-turn evolution trail in runtime API from recent history and pass it into image pipeline calls.\n3. Add/adjust tests to verify history clause presence and run lint/tests.

## Risks

Risk: prompt bloat can increase token cost or dilute composition constraints. Mitigation: strict truncation and last-N turn compression.

## Verify Steps

1. node scripts/lint.mjs\nExpected: pass.\n2. node --test\nExpected: pass.\n3. Inspect prompt logs in debug mode and confirm Evolution trail includes multiple prior turns, not only the latest card.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T21:42:52.956Z — VERIFY — ok

By: TESTER

Note: Image prompt now includes explicit cumulative multi-turn history context.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T21:42:43.808Z, excerpt_hash=sha256:04895a65adb5a9b381eb90fc1243206798f72d1cc0c7c00629873b5506c5db43

Details:

Passed: node scripts/lint.mjs; node --test. Continuity prompt now contains Evolution trail clause sourced from recent history turns.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert the task commit to restore previous prompt-building behavior if continuity quality regresses.

## Context

Current image continuity relies mostly on prior-frame hint and broad anchors, which can make each new frame overfit the latest card. We need explicit accumulation cues from history.

## Notes

### Approvals / Overrides\nNo overrides requested.\n\n### Decisions\nAdded explicit evolution trail to continuity prompt and switched previous-frame hint from URL text to camera/framing continuity instruction.\n\n### Implementation Notes\nUpdated src/infra/image-pipeline.mjs to accept historyContext and emit Evolution trail clause with cumulative layering instruction. Updated src/api/runtime-api.mjs to build compact multi-turn history context from recent turns and pass it to image pipeline. Added test coverage in tests/image-pipeline.test.mjs for history context clause.\n\n### Evidence / Links\nVerification commands executed: node scripts/lint.mjs; node --test.
