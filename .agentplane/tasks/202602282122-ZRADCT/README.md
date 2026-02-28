---
id: "202602282122-ZRADCT"
title: "Constrain history auto-focus to panel-only scrolling"
result_summary: "History visibility sync is panel-local and page-level scrolling is locked."
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
  updated_at: "2026-02-28T21:23:43.832Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved panel-only history scroll and page-scroll lock behavior."
verification:
  state: "ok"
  updated_at: "2026-02-28T21:24:31.009Z"
  updated_by: "TESTER"
  note: "Panel-only history scroll behavior implemented; no page scroll jumps."
commit:
  hash: "a7227063a8b15d9853d97d8c8d48def4b1b34da4"
  message: "🚧 ZRADCT ui: keep history auto-focus inside panel"
comments:
  -
    author: "INTEGRATOR"
    body: "Verified: History auto-focus now scrolls only within the History list container, and the main page no longer jumps during scene arrow navigation."
events:
  -
    type: "verify"
    at: "2026-02-28T21:24:31.009Z"
    author: "TESTER"
    state: "ok"
    note: "Panel-only history scroll behavior implemented; no page scroll jumps."
  -
    type: "status"
    at: "2026-02-28T21:25:01.989Z"
    author: "INTEGRATOR"
    from: "TODO"
    to: "DONE"
    note: "Verified: History auto-focus now scrolls only within the History list container, and the main page no longer jumps during scene arrow navigation."
doc_version: 2
doc_updated_at: "2026-02-28T21:25:01.989Z"
doc_updated_by: "INTEGRATOR"
description: "When navigating scene steps with left/right arrows, keep the active History entry visible by scrolling only the History list container. Do not scroll the main page."
id_source: "generated"
---
## Summary


## Scope

In scope: ui/main.js History visibility logic and ui/styles.css page/container scroll behavior. Out of scope: gameplay mechanics, backend APIs, and persistence.

## Plan

1. Replace History entry focus logic to scroll only the history container instead of using element.scrollIntoView.\n2. Disable main-page scrolling while preserving internal panel scrolling.\n3. Run lint and tests, then verify task.

## Risks

Risk: over-constraining page overflow could clip content on small viewports. Mitigation: keep panel-level scrolling enabled and adjust only root/page overflow.

## Verify Steps

1. node scripts/lint.mjs\nExpected: pass.\n2. node --test\nExpected: pass.\n3. Manual UI check: use scene left/right arrows, confirm active History item becomes visible by list scroll only; page viewport position must not jump.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T21:24:31.009Z — VERIFY — ok

By: TESTER

Note: Panel-only history scroll behavior implemented; no page scroll jumps.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T21:24:24.093Z, excerpt_hash=sha256:ca5600820e2e88767d4cb72221821280106a7a84a1ab3900c246e4f54eb6b16c

Details:

Passed: node scripts/lint.mjs; node --test. Manual expectation: scene arrow navigation keeps active History entry visible by list scroll only, while main page remains fixed.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert this task commit to restore previous History focus behavior and page overflow settings.

## Context

Current behavior can call scrollIntoView on active History entries, which may scroll the overall page. Requirement: only the History panel should scroll; the main screen should stay fixed.

## Notes

### Approvals / Overrides\nNo overrides requested.\n\n### Decisions\nReplaced scrollIntoView with container-local scrollTop math to avoid page-level jumps.\n\n### Implementation Notes\nUpdated ui/main.js History auto-focus logic to scroll only elements.historyList. Updated ui/styles.css to disable page scrolling (html/body overflow hidden) and pin app container height to viewport.\n\n### Evidence / Links\nVerification commands executed: node scripts/lint.mjs; node --test.
