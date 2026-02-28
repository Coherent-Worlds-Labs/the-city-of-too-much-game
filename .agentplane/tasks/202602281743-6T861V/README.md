---
id: "202602281743-6T861V"
title: "Generate and display seed scene on game creation"
result_summary: "Seed-scene startup flow implemented and verified."
risk_level: "low"
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T17:44:08.342Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved seed scene generation on createGame."
verification:
  state: "ok"
  updated_at: "2026-02-28T17:45:48.527Z"
  updated_by: "TESTER"
  note: "Seed scene on createGame verified"
commit:
  hash: "7b0567e94300916c1e77ce92b29b144a4fa207c8"
  message: "✅ 6T861V runtime: generate seed scene before first turn"
comments:
  -
    author: "CODER"
    body: "Start: implementing seed image generation during game creation and immediate scene rendering in UI."
  -
    author: "INTEGRATOR"
    body: "Verified: game initialization now generates and displays a seed scene before the first card action, with updated API/UI flow and passing regression checks."
events:
  -
    type: "status"
    at: "2026-02-28T17:44:09.215Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing seed image generation during game creation and immediate scene rendering in UI."
  -
    type: "verify"
    at: "2026-02-28T17:45:48.527Z"
    author: "TESTER"
    state: "ok"
    note: "Seed scene on createGame verified"
  -
    type: "status"
    at: "2026-02-28T17:46:08.051Z"
    author: "INTEGRATOR"
    from: "DOING"
    to: "DONE"
    note: "Verified: game initialization now generates and displays a seed scene before the first card action, with updated API/UI flow and passing regression checks."
doc_version: 2
doc_updated_at: "2026-02-28T17:46:08.051Z"
doc_updated_by: "INTEGRATOR"
description: "Create a seed image during /api/games flow and render it immediately in UI before the first card is enacted."
id_source: "generated"
---
## Summary

Generate seed scene at game start so players immediately see model-produced city state before choosing first card.

## Scope

In scope: runtime createGame orchestration, server /api/games handler, UI scene rendering on create game, runtime API tests. Out of scope: DB schema migrations.

## Plan

1) Extend runtime createGame to call image pipeline and return seed scene data. 2) Update /api/games route to await async createGame. 3) Update UI to render returned seed image as scene background. 4) Update tests and run lint/tests.

## Risks

Risk: startup latency increases due image generation call. Mitigation: keep existing loading indicator and allow clear error propagation.

## Verify Steps

1. node scripts/lint.mjs passes. 2. node --test passes. 3. /api/games response includes seedScene.imageUrl and UI applies it to scene background.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T17:45:48.527Z — VERIFY — ok

By: TESTER

Note: Seed scene on createGame verified

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T17:45:41.203Z, excerpt_hash=sha256:1a022d8777c1ba58ab12fe25853a43ce50b6e02c9cb756c44a152e06e1d1663f

Details:

Runtime createGame now generates seed scene via image pipeline before first turn, /api/games returns seedScene payload, UI applies seed image as scene background, lint/tests pass.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert runtime createGame/UI/server changes to return previous gradient-only startup behavior.

## Context

Current flow generates first image only after first turn. User requires seed scene at initialization.

## Notes

### Approvals / Overrides
