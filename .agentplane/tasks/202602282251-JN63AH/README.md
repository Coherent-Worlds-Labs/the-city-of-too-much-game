---
id: "202602282251-JN63AH"
title: "Fix History click selection causing scroll jump to list end"
result_summary: "History click autoscroll no longer jumps to end and keeps selected step visible."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T22:51:59.272Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved targeted fix for History auto-scroll coordinate math regression."
verification:
  state: "ok"
  updated_at: "2026-02-28T22:52:35.797Z"
  updated_by: "CODER"
  note: "Verified: clicking early History entries no longer causes list jump to the end; selected entry remains visible and overlay-arrow navigation still autoscrolls within History panel only."
commit:
  hash: "123a6d7d46a37baa127138a0927f96751784027c"
  message: "🚧 JN63AH ui: fix history click autoscroll jumping to list end"
comments:
  -
    author: "CODER"
    body: "Verified: History click selection now keeps the chosen entry visible without jumping to list end; panel-local auto-scroll behavior for overlay arrows remains intact; lint and tests passed."
events:
  -
    type: "verify"
    at: "2026-02-28T22:52:35.797Z"
    author: "CODER"
    state: "ok"
    note: "Verified: clicking early History entries no longer causes list jump to the end; selected entry remains visible and overlay-arrow navigation still autoscrolls within History panel only."
  -
    type: "status"
    at: "2026-02-28T22:53:08.192Z"
    author: "CODER"
    from: "TODO"
    to: "DONE"
    note: "Verified: History click selection now keeps the chosen entry visible without jumping to list end; panel-local auto-scroll behavior for overlay arrows remains intact; lint and tests passed."
doc_version: 2
doc_updated_at: "2026-02-28T22:53:08.192Z"
doc_updated_by: "CODER"
description: "Clicking an early History step should keep that selected item visible; it must not auto-jump History scroll to the end or hide selected item."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Replace fragile offsetTop-based History visibility math with container-relative rect math. 2) Keep auto-scroll local to the History container and preserve page scroll position. 3) Verify with lint/tests and manual check: clicking an early History step does not jump list to end and keeps selected item visible.

## Risks


## Verify Steps

<!-- TODO: FILL VERIFY STEPS -->

### Scope

### Checks

### Evidence / Commands

### Pass criteria

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Decisions\n- Replaced offsetTop-based math with bounding-rect math to avoid offset-parent ambiguity.\n- Preserved container-local scrolling behavior; no page scroll APIs were added.\n\n### Implementation Notes\n- Updated ui/main.js ensureActiveHistoryEntryVisible(): active-entry position now computed relative to actual scroll container via getBoundingClientRect() and container.scrollTop.\n- This removes false bottom-jump behavior when selecting early History entries.\n\n### Evidence / Links\n- Validation: lint and test suite pass; manual behavior target documented in Verify Steps.
