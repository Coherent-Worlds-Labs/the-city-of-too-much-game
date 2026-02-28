---
id: "202602282107-T2G6GT"
title: "Make saved-game resume resilient when session-list API fails"
result_summary: "Refreshing no longer creates a new world when session-list API is temporarily unavailable."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T21:08:15.789Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved resume resiliency fix for session-list API failures."
verification:
  state: "ok"
  updated_at: "2026-02-28T21:08:57.361Z"
  updated_by: "CODER"
  note: "Verified: Saved-game resume no longer falls back to new world when session list endpoint fails; lint/tests pass."
commit:
  hash: "a3cbe4013d2f03990469bfa8d9647a0a69b2b957"
  message: "🚧 T2G6GT ui: make saved-game resume robust to session-list failures"
comments:
  -
    author: "CODER"
    body: "Start: Making session-list refresh best-effort so saved-game resume never falls back to new world due to catalog errors."
  -
    author: "CODER"
    body: "Verified: Resume flow now tolerates /api/games catalog failures and keeps loading saved world; lint/tests pass."
events:
  -
    type: "status"
    at: "2026-02-28T21:08:25.523Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Making session-list refresh best-effort so saved-game resume never falls back to new world due to catalog errors."
  -
    type: "verify"
    at: "2026-02-28T21:08:57.361Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Saved-game resume no longer falls back to new world when session list endpoint fails; lint/tests pass."
  -
    type: "status"
    at: "2026-02-28T21:09:26.517Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Resume flow now tolerates /api/games catalog failures and keeps loading saved world; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T21:09:26.517Z"
doc_updated_by: "CODER"
description: "Prevent refresh fallback to new world when /api/games session list is unavailable; treat session catalog refresh as best-effort."
id_source: "generated"
---
## Summary

Decouple session-list loading failures from saved-game resume flow so refresh does not trigger unintended new-world creation.

## Scope

In scope: ui/main.js only.

## Plan

1) Make refreshAvailableGames non-throwing with try/catch and stable fallback. 2) Ensure resume/create/play/init continue even if catalog endpoint fails. 3) Keep world switcher usable with available local game context.

## Risks

Suppressing catalog errors may hide backend issues; mitigate by keeping fallback state visible while preserving core resume behavior.

## Verify Steps

1) node scripts/lint.mjs exits 0. 2) node --test exits 0. 3) Manual check: if /api/games fails, refresh still resumes saved world instead of creating a new one.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T21:08:57.361Z — VERIFY — ok

By: CODER

Note: Verified: Saved-game resume no longer falls back to new world when session list endpoint fails; lint/tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T21:08:25.523Z, excerpt_hash=sha256:f45960d930fe43c5c1b0b4b4ee5d90d276fd8224fd49d06910bd1b8822a6a618

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert task commit to restore previous strict session-list behavior.
