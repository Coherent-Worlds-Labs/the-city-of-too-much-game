---
id: "202602281636-HFBQY0"
title: "Remove placeholders and implement full runtime pipeline"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T16:38:42.414Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved no-stub runtime implementation scope."
verification:
  state: "ok"
  updated_at: "2026-02-28T16:49:11.722Z"
  updated_by: "TESTER"
  note: "Runtime pipeline validated"
commit: null
comments:
  -
    author: "CODER"
    body: "Start: replacing prototype behavior with full runtime API or orchestration pipeline and removing placeholder build semantics."
events:
  -
    type: "status"
    at: "2026-02-28T16:38:42.491Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: replacing prototype behavior with full runtime API or orchestration pipeline and removing placeholder build semantics."
  -
    type: "verify"
    at: "2026-02-28T16:49:11.722Z"
    author: "TESTER"
    state: "ok"
    note: "Runtime pipeline validated"
doc_version: 2
doc_updated_at: "2026-02-28T16:49:11.724Z"
doc_updated_by: "TESTER"
description: "Eliminate prototype/placeholder behavior by implementing real runtime flow: HTTP API endpoints, game turn orchestration (judge + image + persistence), UI-to-API integration, and production-ready build/start scripts."
id_source: "generated"
---
## Summary

Replace prototype behavior with full runtime pipeline: real HTTP API, server-side turn orchestration (judge and image adapters + persistence), UI integration through API, and non-placeholder build/start flow.

## Scope

In scope: HTTP server and endpoints, runtime orchestration for create game/play turn/history/timeline, UI-to-API integration, and removal of placeholder/prototype markers and build placeholder artifacts. Out of scope: deployment infrastructure automation.

## Plan

1. Implement runtime server entrypoint with HTTP routes for game lifecycle and static asset serving.

## Risks

- Risk: live model-provider calls can fail due API/network/runtime constraints.

## Verify Steps

1. Run `node scripts/check-bootstrap.mjs`.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T16:49:11.722Z — VERIFY — ok

By: TESTER

Note: Runtime pipeline validated

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T16:47:38.798Z, excerpt_hash=sha256:da20813de2872e5f70b131edb88ec969df9756ec300e2e0cfde090dc86f46f9e

Details:

Executed: node scripts/check-bootstrap.mjs; node scripts/lint.mjs; node --test; node scripts/build.mjs; runtime smoke (/, /styles.css, /main.js, /api/health, POST /api/games) all passed.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Approvals / Overrides
