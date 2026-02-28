---
id: "202602281855-GW9BE5"
title: "Sync protocol-carnival indicator with selected history snapshot"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T18:55:55.347Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved history indicator sync fix."
verification:
  state: "ok"
  updated_at: "2026-02-28T18:56:31.816Z"
  updated_by: "CODER"
  note: "Synchronized Protocol-Carnival indicator with selected history snapshots (including neutral baseline for Initial/Genesis); lint and tests pass."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: synchronizing Protocol-Carnival indicator and status labels with selected history snapshot."
events:
  -
    type: "status"
    at: "2026-02-28T18:55:56.297Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: synchronizing Protocol-Carnival indicator and status labels with selected history snapshot."
  -
    type: "verify"
    at: "2026-02-28T18:56:31.816Z"
    author: "CODER"
    state: "ok"
    note: "Synchronized Protocol-Carnival indicator with selected history snapshots (including neutral baseline for Initial/Genesis); lint and tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T18:56:31.822Z"
doc_updated_by: "CODER"
description: "When user navigates history snapshots, update the Protocol-Carnival indicator and derived status labels to the historical state of that selected snapshot."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Add state sync helper in ui/main.js to apply axis/direction/mood/stability from selected history turn. 2) On history click: for Initial/Genesis set neutral baseline; for turn snapshots hydrate from corresponding turn judge state. 3) Keep latest-state behavior unchanged on normal gameplay flow. 4) Run lint and tests, verify and finish.

## Risks


## Verify Steps

### Scope
- Primary tag: `code`

### Checks
- Add explicit checks/commands for this task before approval.

### Evidence / Commands
- Record executed commands and key outputs.

### Pass criteria
- Steps are reproducible and produce expected results.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T18:56:31.816Z — VERIFY — ok

By: CODER

Note: Synchronized Protocol-Carnival indicator with selected history snapshots (including neutral baseline for Initial/Genesis); lint and tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T18:55:56.297Z, excerpt_hash=sha256:682d5674a3bb4d925efca0f9cabc057c814315f01dc448e2879b94eecb1a7911

<!-- END VERIFICATION RESULTS -->

## Rollback Plan
