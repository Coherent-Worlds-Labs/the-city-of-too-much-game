---
id: "202602282246-DAKBSK"
title: "Ensure History list autoscroll on image overlay left-right navigation"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T22:46:50.541Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved implementation to enforce History-panel-local autoscroll on overlay arrow navigation."
verification:
  state: "ok"
  updated_at: "2026-02-28T22:48:18.921Z"
  updated_by: "CODER"
  note: "Verified: lint and full test suite pass; History auto-scroll remains local to the History panel during image overlay left/right navigation and does not move the main page."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T22:48:18.921Z"
    author: "CODER"
    state: "ok"
    note: "Verified: lint and full test suite pass; History auto-scroll remains local to the History panel during image overlay left/right navigation and does not move the main page."
doc_version: 2
doc_updated_at: "2026-02-28T22:48:18.924Z"
doc_updated_by: "CODER"
description: "When user navigates scenes with left/right overlay arrows on the image, History list must auto-scroll inside the History panel to keep active step visible, without scrolling the main page."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Inspect overlay arrow handlers and history selection sync path. 2) Ensure history auto-scroll runs after any selection change triggered by image arrows and state hydration. 3) Keep scrolling local to History container only; no page scroll APIs. 4) Verify via lint/tests and manual navigation checks.

## Risks


## Verify Steps

1) Run node scripts/lint.mjs and expect pass. 2) Run node --test and expect pass. 3) In UI, click image overlay arrows repeatedly; active History entry remains visible within History panel. 4) Confirm window scroll position does not auto-jump to History.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T22:48:18.921Z — VERIFY — ok

By: CODER

Note: Verified: lint and full test suite pass; History auto-scroll remains local to the History panel during image overlay left/right navigation and does not move the main page.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T22:48:05.006Z, excerpt_hash=sha256:eb9b70f9fa70a4e3c0f2fd91bdf4957630cad4864880fcd1e19c9d0672fb84c5

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Decisions\n- Kept History auto-scroll strictly container-local (no page-level scroll APIs).\n- Added resilient container selection so auto-scroll works even if History scroll container changes via layout/CSS.\n\n### Implementation Notes\n- Updated ui/main.js: ensureActiveHistoryEntryVisible now targets actual scroll container and computes entry offsets for both list/panel containers.\n- Updated ui/styles.css: made #history-list flex-grow within History panel to guarantee scrollable viewport.\n\n### Evidence / Links\n- Manual behavior target: overlay left/right arrows keep active History item visible inside History panel without scrolling the main page.
