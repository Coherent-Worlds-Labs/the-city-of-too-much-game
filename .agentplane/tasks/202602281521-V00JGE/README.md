---
id: "202602281521-V00JGE"
title: "Game API and persistence"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on:
  - "202602281521-E23WMY"
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T15:57:50.756Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved persistence and API service implementation scope."
verification:
  state: "ok"
  updated_at: "2026-02-28T16:00:30.674Z"
  updated_by: "CODER"
  note: "Game API and persistence verified: SQLite migrations, transactional turn writes, and read flows for history/timeline pass integration tests."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: implementing SQLite migrations, store adapter, and game lifecycle service methods with transactional turn persistence."
events:
  -
    type: "status"
    at: "2026-02-28T15:58:05.975Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing SQLite migrations, store adapter, and game lifecycle service methods with transactional turn persistence."
  -
    type: "verify"
    at: "2026-02-28T16:00:30.674Z"
    author: "CODER"
    state: "ok"
    note: "Game API and persistence verified: SQLite migrations, transactional turn writes, and read flows for history/timeline pass integration tests."
doc_version: 2
doc_updated_at: "2026-02-28T16:00:30.676Z"
doc_updated_by: "CODER"
description: "Build game lifecycle APIs (new game, play turn, read history, timeline), persistence schema/migrations for games and turns, and transaction-safe turn writes with judge/image artifacts."
id_source: "generated"
---
## Summary

Implement persistence-backed game API services for create game, play turn, read history, and timeline retrieval with transaction-safe turn writes.

## Scope

In scope: database migration schema, SQLite store module, game service API methods, and transaction-safe turn persistence including judge/image artifacts. Out of scope: HTTP framework wiring and auth.

## Plan

1. Add SQLite migration files for `games` and `turns` tables with index coverage.

## Risks

- Risk: SQLite API changes due experimental node module behavior.

## Verify Steps

1. Run `node --test` and confirm persistence/API tests pass.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T16:00:30.674Z — VERIFY — ok

By: CODER

Note: Game API and persistence verified: SQLite migrations, transactional turn writes, and read flows for history/timeline pass integration tests.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T16:00:18.707Z, excerpt_hash=sha256:c36701f8d50d272f74f9536ce4d5fbbd667685c410e12925c4b145c45eb346e0

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

1. Revert persistence/API commit(s) from this task.

## Context

Core engine, judge adapter, and image pipeline are available. This task introduces persistent storage and API-level service orchestration needed before UI integration.

## Notes

### Approvals / Overrides
