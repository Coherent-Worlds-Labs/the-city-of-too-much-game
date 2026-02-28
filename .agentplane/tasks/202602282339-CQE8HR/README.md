---
id: "202602282339-CQE8HR"
title: "Move axis labels to world-pack configuration"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T23:40:16.657Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved world-configured axis labels implementation."
verification:
  state: "ok"
  updated_at: "2026-02-28T23:42:34.988Z"
  updated_by: "CODER"
  note: "Verified: axis labels are loaded from world pack via runtime world payload and rendered in header and scene overlay with fallback defaults; lint and tests pass."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T23:42:34.988Z"
    author: "CODER"
    state: "ok"
    note: "Verified: axis labels are loaded from world pack via runtime world payload and rendered in header and scene overlay with fallback defaults; lint and tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T23:42:34.989Z"
doc_updated_by: "CODER"
description: "Add axis label fields to world packs and wire UI labels (header and scene overlay) to world-provided values via runtime API state payload."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Extend world-pack schema usage with ui.axisLabels.left/right in EN and RU packs. 2) Expose axis labels from runtime API world payload. 3) Update UI to render header and scene-overlay axis labels from payload with safe defaults. 4) Add/adjust tests and docs. 5) Run lint and tests.

## Risks


## Verify Steps

1) Run node scripts/lint.mjs and expect pass. 2) Run node --test and expect pass. 3) Confirm world packs include ui.axisLabels.left/right. 4) Confirm runtime createGame/getGameState responses include world.axisLabels. 5) Confirm UI uses payload-provided axis labels with fallback defaults.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T23:42:34.988Z — VERIFY — ok

By: CODER

Note: Verified: axis labels are loaded from world pack via runtime world payload and rendered in header and scene overlay with fallback defaults; lint and tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T23:42:24.786Z, excerpt_hash=sha256:886f8c4258b6cb6a5675ac4cd1d59f3d2dcd59800856ef45081840cce8cff9bf

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Decisions\n- Axis labels are now world-configured via ui.axisLabels.left/right, with frontend fallback to Protocol/Carnival for backward compatibility.\n- Runtime API includes axis labels in world payload for createGame/getGameState so UI can switch labels when switching worlds.\n\n### Implementation Notes\n- worlds/the-city-of-too-much.en.json and worlds/the-city-of-too-much.ru.json: added ui.axisLabels.\n- src/api/runtime-api.mjs: world descriptor now includes axisLabels.\n- ui/index.html + ui/main.js: header and scene overlay axis label nodes now render values from payload.\n- src/domain/world-pack.mjs + tests updated for axis-label contract coverage.\n\n### Evidence / Links\n- node scripts/lint.mjs\n- node --test
