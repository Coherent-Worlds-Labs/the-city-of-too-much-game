---
id: "202602281813-2H3RJA"
title: "Add true resume flow, explicit restart, and clickable timeline playback"
result_summary: "Refresh now resumes saved game; restart is explicit; history snapshots are playable from genesis to current."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T18:14:01.942Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved resume-first startup and interactive history playback."
verification:
  state: "ok"
  updated_at: "2026-02-28T18:19:43.887Z"
  updated_by: "CODER"
  note: "Executed lint and full test suite after implementing resume-first startup, explicit restart, clickable genesis-to-current history playback, and SQLite seed-scene compatibility updates."
commit:
  hash: "da95f6ba8182ecb2eba4096fb55c7a5dc1944b5f"
  message: "🚧 2H3RJA code: add resume-first startup restart and timeline playback"
comments:
  -
    author: "CODER"
    body: "Start: implementing resume-first startup, explicit restart control, and clickable timeline history from genesis to current scene."
  -
    author: "CODER"
    body: "Verified: implemented resume-first startup from persisted game state, explicit Restart for fresh run, clickable genesis-to-current history playback, and passed lint plus full tests."
events:
  -
    type: "status"
    at: "2026-02-28T18:14:02.926Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing resume-first startup, explicit restart control, and clickable timeline history from genesis to current scene."
  -
    type: "verify"
    at: "2026-02-28T18:19:43.887Z"
    author: "CODER"
    state: "ok"
    note: "Executed lint and full test suite after implementing resume-first startup, explicit restart, clickable genesis-to-current history playback, and SQLite seed-scene compatibility updates."
  -
    type: "status"
    at: "2026-02-28T18:21:03.123Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: implemented resume-first startup from persisted game state, explicit Restart for fresh run, clickable genesis-to-current history playback, and passed lint plus full tests."
doc_version: 2
doc_updated_at: "2026-02-28T18:21:03.123Z"
doc_updated_by: "CODER"
description: "Prevent refresh from auto-starting a new seed generation, restore existing game state by saved gameId, provide explicit restart action, and allow clicking left history entries (genesis->current) to preview corresponding scene image."
id_source: "generated"
---
## Summary

Implement resume-first game startup with explicit restart, and make left history list interactive so users can browse scene images from genesis to current turn.

## Scope

In scope: API state endpoint/resume payload, seed scene persistence, UI init/restart flow, clickable history-to-image linkage, tests and migration if needed for seed scene persistence.

## Plan

1) Persist seed scene metadata on game record and expose game state endpoint. 2) Add runtime API method to fetch full game state for resume. 3) Update UI init: try resume by saved gameId, create new game only when absent/invalid. 4) Add explicit Restart button in primary UI. 5) Render history from timeline (including genesis) and allow selecting any entry to preview its image. 6) Update tests + run lint/tests.

## Risks

Risk: migration compatibility on existing DB. Mitigation: add idempotent migration and fallback-safe API behavior when seed metadata absent.

## Verify Steps

1. node scripts/lint.mjs passes. 2. node --test passes. 3. Refresh with saved gameId resumes same game without new seed generation. 4. Restart creates new game and seed scene. 5. Left history entries are clickable and update displayed scene image including genesis frame.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T18:19:43.887Z — VERIFY — ok

By: CODER

Note: Executed lint and full test suite after implementing resume-first startup, explicit restart, clickable genesis-to-current history playback, and SQLite seed-scene compatibility updates.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T18:19:37.428Z, excerpt_hash=sha256:976433b4d0fda8a2f81e500895fd9bc84f62975167fc4042b42bd9546129f1d1

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert API/UI/migration changes and restore prior startup behavior if resume flow causes regressions.

## Context

Current refresh behavior always calls createGame and regenerates seed scene. User expects continuation from saved game unless Restart is explicitly chosen.

## Notes

### Approvals / Overrides
