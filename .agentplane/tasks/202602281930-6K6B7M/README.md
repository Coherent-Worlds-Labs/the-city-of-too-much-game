---
id: "202602281930-6K6B7M"
title: "Restore carnival subtitle and equalize bottom panel heights"
result_summary: "Header subtitle restored and bottom dashboard panels now share equal height."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T19:31:14.978Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved header subtitle restore and equal-height bottom panels."
verification:
  state: "ok"
  updated_at: "2026-02-28T19:32:13.545Z"
  updated_by: "CODER"
  note: "Verified: Header includes carnival subtitle and bottom dashboard panels are equal height on desktop with internal scrolling; lint/tests pass."
commit:
  hash: "f24c719a170376b1ed20fee7b1324c8aad124b26"
  message: "🚧 6K6B7M ui: restore carnival subtitle and equalize bottom panels"
comments:
  -
    author: "CODER"
    body: "Start: Restoring carnival subtitle under title and making bottom dashboard panels equal height with internal scrolling."
  -
    author: "CODER"
    body: "Verified: Added carnival subtitle under title and made History/City Initiatives/Status equal height on desktop with internal scroll behavior; lint/tests pass."
events:
  -
    type: "status"
    at: "2026-02-28T19:31:22.380Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Restoring carnival subtitle under title and making bottom dashboard panels equal height with internal scrolling."
  -
    type: "verify"
    at: "2026-02-28T19:32:13.545Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Header includes carnival subtitle and bottom dashboard panels are equal height on desktop with internal scrolling; lint/tests pass."
  -
    type: "status"
    at: "2026-02-28T19:32:37.207Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Added carnival subtitle under title and made History/City Initiatives/Status equal height on desktop with internal scroll behavior; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T19:32:37.207Z"
doc_updated_by: "CODER"
description: "Add a carnival-themed subtitle under the main title and make History, City Initiatives, and Status panels equal height on desktop."
id_source: "generated"
---
## Summary

Reintroduce a carnival subtitle in the header and make the three bottom panels visually aligned to equal height.

## Scope

In scope: ui/index.html, ui/styles.css. Out of scope: gameplay logic and backend APIs.

## Plan

1) Add a subtitle line under The City of Too Much mentioning carnival. 2) Set consistent desktop panel height for History/Hand/Status via board and panel styles. 3) Keep internal list/card areas scrollable where needed. 4) Run lint/tests and record verification.

## Risks


## Verify Steps

1) node scripts/lint.mjs exits 0. 2) node --test exits 0. 3) Manual UI check: subtitle appears under main title; History/City Initiatives/Status have equal heights on desktop.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T19:32:13.545Z — VERIFY — ok

By: CODER

Note: Verified: Header includes carnival subtitle and bottom dashboard panels are equal height on desktop with internal scrolling; lint/tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T19:32:04.223Z, excerpt_hash=sha256:7d416d7e88611f9bddc2f5da0b4a492cdb383508eae7f69b3a7a987841861c0f

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert task commits to restore previous header and panel sizing behavior.

## Notes

### Implementation Notes\n- Restored a carnival subtitle line under the main title in header.\n- Set equal desktop heights for History/City Initiatives/Status panels and enabled internal scrolling for History list and initiatives grid.\n\n### Evidence / Links\n- lint: node scripts/lint.mjs\n- tests: node --test
