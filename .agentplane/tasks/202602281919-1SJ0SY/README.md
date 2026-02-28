---
id: "202602281919-1SJ0SY"
title: "Overlay applied-card caption and image step arrows"
result_summary: "Scene overlay now supports direct step navigation with applied-card caption."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T19:20:11.048Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved implementation plan for overlay caption and step arrows."
verification:
  state: "ok"
  updated_at: "2026-02-28T19:21:58.134Z"
  updated_by: "CODER"
  note: "Verified: Added in-image applied-card caption and arrow step navigation; automated verification passed via node scripts/lint.mjs and node --test."
commit:
  hash: "138041ab61b7a9bea9b64df065bcb7d9b0ed631c"
  message: "🚧 1SJ0SY ui: add in-scene step arrows and applied-card caption"
comments:
  -
    author: "CODER"
    body: "Start: Implementing in-image step caption and left/right scene navigation controls with history-synced rendering and responsive styling."
  -
    author: "CODER"
    body: "Verified: Added applied-card overlay text at scene bottom-left and in-image previous/next navigation arrows; lint and tests pass."
events:
  -
    type: "status"
    at: "2026-02-28T19:20:17.222Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Implementing in-image step caption and left/right scene navigation controls with history-synced rendering and responsive styling."
  -
    type: "verify"
    at: "2026-02-28T19:21:58.134Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Added in-image applied-card caption and arrow step navigation; automated verification passed via node scripts/lint.mjs and node --test."
  -
    type: "status"
    at: "2026-02-28T19:23:02.751Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Added applied-card overlay text at scene bottom-left and in-image previous/next navigation arrows; lint and tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T19:23:02.751Z"
doc_updated_by: "CODER"
description: "Show applied card text in scene bottom-left overlay and add left/right overlay arrow controls for previous/next step navigation directly on the image."
id_source: "generated"
---
## Summary

Implement scene overlay controls for step navigation and show the applied card caption in the lower-left corner of the image area.

## Scope

In scope: ui/index.html, ui/main.js, ui/styles.css. Out of scope: backend APIs, world content, generation pipeline.

## Plan

1) Add overlay UI nodes for applied-card caption and prev/next arrows in the scene container. 2) Implement prev/next navigation handlers bound to the currently selected history snapshot. 3) Render applied-card caption from selected snapshot and include initial-state label for genesis step. 4) Style overlay caption and arrows for readability and mobile constraints. 5) Run lint/tests and capture verification.

## Risks

Overlay controls may conflict with existing pan-tilt/overlay layers; mitigate with explicit z-index and pointer-events testing. Caption text can overflow on narrow screens; mitigate with clamp and max-width.

## Verify Steps

1) node scripts/lint.mjs exits with code 0. 2) node --test exits with code 0. 3) Manual UI check: applied card text appears at scene bottom-left for selected history step; left/right overlay arrows navigate steps and stop correctly at bounds.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T19:21:58.134Z — VERIFY — ok

By: CODER

Note: Verified: Added in-image applied-card caption and arrow step navigation; automated verification passed via node scripts/lint.mjs and node --test.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T19:21:51.656Z, excerpt_hash=sha256:05d9bf5231487f0c0adeeb27244288d40ab6d7bab063df5a583378d04ae0d38e

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert the implementation commit for this task to restore prior scene UI behavior and history interaction model.

## Notes

### Decisions\n- Reused existing History selection model and introduced scene-level previous/next navigation over the same entry source to avoid drift.\n\n### Implementation Notes\n- Added in-scene controls (left/right arrows) and applied-card overlay caption.\n- Synced caption, scene image, and protocol-carnival state with selected history step.\n\n### Evidence / Links\n- lint: node scripts/lint.mjs\n- tests: node --test
