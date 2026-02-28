---
id: "202602282239-M1R1MB"
title: "Harden history list auto-scroll on scene arrow navigation"
result_summary: "Active history step remains visible during left/right navigation without moving the main page."
risk_level: "low"
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T22:40:23.228Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved reliability hardening for history auto-scroll behavior."
verification:
  state: "ok"
  updated_at: "2026-02-28T22:41:22.582Z"
  updated_by: "TESTER"
  note: "Arrow navigation now reliably keeps active history item in visible list area."
commit:
  hash: "164afcaf53570b2c5374d3c3e613776d7afec74b"
  message: "🚧 M1R1MB ui: harden history visibility on arrow navigation"
comments:
  -
    author: "INTEGRATOR"
    body: "Verified: Scene arrow navigation now enforces History list visibility for the active step via container-local scrolling only, with no page-level auto-scroll behavior."
events:
  -
    type: "verify"
    at: "2026-02-28T22:41:22.582Z"
    author: "TESTER"
    state: "ok"
    note: "Arrow navigation now reliably keeps active history item in visible list area."
  -
    type: "status"
    at: "2026-02-28T22:42:01.924Z"
    author: "INTEGRATOR"
    from: "TODO"
    to: "DONE"
    note: "Verified: Scene arrow navigation now enforces History list visibility for the active step via container-local scrolling only, with no page-level auto-scroll behavior."
doc_version: 2
doc_updated_at: "2026-02-28T22:42:01.924Z"
doc_updated_by: "INTEGRATOR"
description: "Ensure left/right step navigation always scrolls History container so active item is visible, without any main-page scroll movement."
id_source: "generated"
---
## Summary

Strengthen history auto-scroll behavior so arrow navigation always keeps active history step visible inside list viewport only.

## Scope


## Plan

1. Extract history visibility logic into a reusable helper.\n2. Call helper after render and after arrow-navigation render tick to guarantee active entry visibility.\n3. Run lint/tests and verify no page-level auto-scroll APIs are introduced.

## Risks

Risk: excessive scroll adjustments may feel jumpy. Mitigation: only adjust when active item is outside visible list bounds.

## Verify Steps

1. node scripts/lint.mjs\n2. node --test\n3. Manual check: arrow navigation moves history list to keep active item visible; main page scroll position does not change automatically.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T22:41:22.582Z — VERIFY — ok

By: TESTER

Note: Arrow navigation now reliably keeps active history item in visible list area.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T22:41:22.490Z, excerpt_hash=sha256:c1fd725bb622fa95d128848ee4f67b1d597a2d84fc5379a61ca6f77476b981a5

Details:

Passed: node scripts/lint.mjs; node --test. Behavior: History list scrolls to active item after left/right scene navigation without page-level auto-scroll API.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert this task commit to restore previous history scrolling behavior.

## Context

User reports active history step is not reliably brought into visible list area when navigating with scene arrows. Requirement explicitly forbids main page auto-scroll.

## Notes

### Approvals / Overrides\nNo overrides requested.\n\n### Decisions\nKept container-local scrollTop adjustments and added an extra post-render visibility pass for arrow navigation robustness.\n\n### Implementation Notes\nRefactored history visibility logic into top-level ensureActiveHistoryEntryVisible helper in ui/main.js. Called helper from renderHistory and again via requestAnimationFrame after moveSelectedSceneEntry arrow transitions. No scrollIntoView usage introduced.\n\n### Evidence / Links\nVerification commands executed: node scripts/lint.mjs; node --test.
