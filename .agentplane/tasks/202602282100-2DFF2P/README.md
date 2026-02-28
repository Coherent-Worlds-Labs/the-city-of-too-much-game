---
id: "202602282100-2DFF2P"
title: "Keep Genesis only and add completed-world session switching"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T21:00:55.285Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved Genesis-only history and completed-world switching implementation."
verification:
  state: "ok"
  updated_at: "2026-02-28T21:04:46.314Z"
  updated_by: "CODER"
  note: "Verified: History now starts with Genesis only (no Initial state duplicate), and World Sessions picker allows reopening completed worlds; lint/tests pass."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: Implementing Genesis-only History and session picker for switching to completed worlds."
events:
  -
    type: "status"
    at: "2026-02-28T21:01:04.684Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Implementing Genesis-only History and session picker for switching to completed worlds."
  -
    type: "verify"
    at: "2026-02-28T21:04:46.314Z"
    author: "CODER"
    state: "ok"
    note: "Verified: History now starts with Genesis only (no Initial state duplicate), and World Sessions picker allows reopening completed worlds; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T21:04:46.316Z"
doc_updated_by: "CODER"
description: "Remove duplicate Initial state entry from History and add UI/API support to open previously finished worlds from a session list."
id_source: "generated"
---
## Summary

Unify initial timeline representation to Genesis-only and provide a world-session picker to reopen completed games.

## Scope

In scope: src/infra/sqlite-store.mjs, src/api/game-service.mjs, src/api/runtime-api.mjs, src/server.mjs, ui/index.html, ui/main.js, ui/styles.css, related tests.

## Plan

1) Remove Initial state entry construction from UI History and keep Genesis from timeline only. 2) Add backend list-games API and runtime/service/store plumbing. 3) Add UI session picker to open finished worlds and active sessions. 4) Refresh picker after create/restart/play actions. 5) Add/adjust tests and run lint/test.

## Risks

Session switching while pending generation could desync UI; mitigate by clearing pending marker on manual session switch and re-rendering from selected game state.

## Verify Steps

1) node scripts/lint.mjs exits 0. 2) node --test exits 0. 3) Manual UI check: History starts with Genesis only (no Initial state duplicate). 4) Session picker lists finished worlds and allows switching into them.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T21:04:46.314Z — VERIFY — ok

By: CODER

Note: Verified: History now starts with Genesis only (no Initial state duplicate), and World Sessions picker allows reopening completed worlds; lint/tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T21:04:46.271Z, excerpt_hash=sha256:d44f8b2578a761cbaef04351ff4e63aa409b510418751fec76100eaf6984c099

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert task commits to restore prior History duplication and no-session-picker behavior.

## Notes

### Decisions\n- Removed standalone Initial state entry and kept Genesis as the canonical turn-0 snapshot.\n- Added session-list API and UI picker to reopen finished worlds without creating new ones.\n\n### Implementation Notes\n- Store/API: added listGames plumbing and GET /api/games endpoint.\n- UI: added World Sessions selector in Status panel and open action; refreshing catalog after create/resume/play.\n- History rendering now uses timeline-only entries (Genesis + turns).\n\n### Evidence / Links\n- lint: node scripts/lint.mjs\n- tests: node --test
