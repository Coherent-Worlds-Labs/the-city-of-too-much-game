---
id: "202602282038-98PSFD"
title: "Auto-scroll History list to active step on arrow navigation"
result_summary: "History list keeps the selected step visible during arrow-based navigation."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T20:39:09.776Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved history auto-scroll behavior for arrow navigation."
verification:
  state: "ok"
  updated_at: "2026-02-28T20:39:51.166Z"
  updated_by: "CODER"
  note: "Verified: Active History item is auto-scrolled into view during step navigation; lint and tests passed."
commit:
  hash: "362c5846e1f897111f0091356572d7612f8f2678"
  message: "🚧 98PSFD ui: auto-scroll history to active step on arrow navigation"
comments:
  -
    author: "CODER"
    body: "Start: Implementing auto-scroll to keep active History step visible during scene arrow navigation."
  -
    author: "CODER"
    body: "Verified: Active History item now auto-scrolls into view when step selection changes via scene arrows; lint/tests pass."
events:
  -
    type: "status"
    at: "2026-02-28T20:39:18.609Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Implementing auto-scroll to keep active History step visible during scene arrow navigation."
  -
    type: "verify"
    at: "2026-02-28T20:39:51.166Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Active History item is auto-scrolled into view during step navigation; lint and tests passed."
  -
    type: "status"
    at: "2026-02-28T20:40:39.040Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Active History item now auto-scrolls into view when step selection changes via scene arrows; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T20:40:39.040Z"
doc_updated_by: "CODER"
description: "Ensure active History entry is brought into view when changing steps via scene left/right arrows."
id_source: "generated"
---
## Summary


## Scope

In scope: ui/main.js. Out of scope: backend and styles.

## Plan

1) Add helper to find active history entry after render. 2) Scroll active entry into nearest visible area when selection changes. 3) Keep click behavior intact. 4) Run lint/tests and record verification.

## Risks

Unconditional scroll on every render may feel jumpy; mitigate by scrolling only when active entry is outside viewport bounds.

## Verify Steps

1) node scripts/lint.mjs exits 0. 2) node --test exits 0. 3) Manual UI check: when using scene left/right arrows, active History item auto-scrolls into view.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T20:39:51.166Z — VERIFY — ok

By: CODER

Note: Verified: Active History item is auto-scrolled into view during step navigation; lint and tests passed.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T20:39:18.609Z, excerpt_hash=sha256:152237989ae29da2091afdc823307be9f12c766ecd0f88eed6fd2f8ef1951e9e

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert task commit to restore previous History behavior without auto-scroll.

## Notes

### Implementation Notes\n- Added visibility check for active .history-entry and auto-scroll into nearest viewport area when out of bounds.\n- Auto-scroll triggers after History list render, covering arrow-based step navigation updates.\n\n### Evidence / Links\n- lint: node scripts/lint.mjs\n- tests: node --test
