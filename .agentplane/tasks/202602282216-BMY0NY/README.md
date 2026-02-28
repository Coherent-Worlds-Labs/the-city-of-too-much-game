---
id: "202602282216-BMY0NY"
title: "Extract mathematical game model into standalone documentation article"
result_summary: "Standalone docs/math-model.md added with cross-links from existing docs."
risk_level: "low"
status: "DONE"
priority: "high"
owner: "DOCS"
depends_on: []
tags:
  - "docs"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T22:17:50.603Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved extraction of standalone mathematical model article."
verification:
  state: "ok"
  updated_at: "2026-02-28T22:19:44.108Z"
  updated_by: "TESTER"
  note: "Standalone mathematical model article added and linked."
commit:
  hash: "183bd30415a58487603229b77416123b112ea497"
  message: "🚧 BMY0NY docs: extract standalone mathematical model article"
comments:
  -
    author: "INTEGRATOR"
    body: "Verified: Mathematical model was extracted into a dedicated article and linked from mechanics and root README for clearer separation of formal and practical documentation."
events:
  -
    type: "verify"
    at: "2026-02-28T22:19:44.108Z"
    author: "TESTER"
    state: "ok"
    note: "Standalone mathematical model article added and linked."
  -
    type: "status"
    at: "2026-02-28T22:20:15.800Z"
    author: "INTEGRATOR"
    from: "TODO"
    to: "DONE"
    note: "Verified: Mathematical model was extracted into a dedicated article and linked from mechanics and root README for clearer separation of formal and practical documentation."
doc_version: 2
doc_updated_at: "2026-02-28T22:20:15.800Z"
doc_updated_by: "INTEGRATOR"
description: "Move the formal mathematical model into a separate docs article and keep mechanics doc focused on runtime behavior with cross-links."
id_source: "generated"
---
## Summary

Create a dedicated math-model article and reference it from existing documentation.

## Scope

In scope: docs/math-model.md creation and links from docs/mechanics.md and README.md. Out of scope: gameplay implementation changes.

## Plan

1. Draft docs/math-model.md with formal state definitions, turn transition, judge function contract, outcome thresholds, and progression constraints matching current implementation.\n2. Add links to the new article from docs/mechanics.md and root README.\n3. Run lint/tests and finalize task artifacts.

## Risks

Risk: formal notation can drift from code constants. Mitigation: document exact current thresholds and cite source modules.

## Verify Steps

1. node scripts/lint.mjs\n2. node --test\n3. Ensure README and mechanics link to docs/math-model.md and content is English-only.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T22:19:44.108Z — VERIFY — ok

By: TESTER

Note: Standalone mathematical model article added and linked.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T22:17:42.863Z, excerpt_hash=sha256:245d11737a7d0af4a7b02398c6521380f227fea0c49c5b54fb551a5cdca1cfd8

Details:

Passed: node scripts/lint.mjs; node --test. README and mechanics now reference docs/math-model.md.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert the task commit to remove the standalone math-model article and restore prior links.

## Context

User requested the mathematical model as a separate article. Current mechanics doc is broad and should link out to a focused formal model reference.

## Notes

### Approvals / Overrides\nNo overrides requested.\n\n### Decisions\nPending implementation.\n\n### Implementation Notes\nPending implementation.\n\n### Evidence / Links\nPending verification evidence.
