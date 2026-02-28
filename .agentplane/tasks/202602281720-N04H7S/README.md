---
id: "202602281720-N04H7S"
title: "UX processing spinner and OpenRouter runtime request visibility"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T17:20:40.987Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved spinner + OpenRouter runtime visibility fix."
verification:
  state: "ok"
  updated_at: "2026-02-28T17:23:22.355Z"
  updated_by: "TESTER"
  note: "Spinner + OpenRouter visibility checks passed"
commit: null
comments:
  -
    author: "CODER"
    body: "Start: implementing process spinner feedback and fixing runtime env loading to ensure real OpenRouter request flow visibility."
events:
  -
    type: "status"
    at: "2026-02-28T17:20:41.854Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing process spinner feedback and fixing runtime env loading to ensure real OpenRouter request flow visibility."
  -
    type: "verify"
    at: "2026-02-28T17:23:22.355Z"
    author: "TESTER"
    state: "ok"
    note: "Spinner + OpenRouter visibility checks passed"
doc_version: 2
doc_updated_at: "2026-02-28T17:23:22.356Z"
doc_updated_by: "TESTER"
description: "Add visible processing spinner during turn execution and ensure real OpenRouter calls are made in local runtime by loading .env and adding optional request debug logs."
id_source: "generated"
---
## Summary

Implement a visible spinner while the turn pipeline is running and fix local runtime OpenRouter execution by loading .env in server startup. Add optional debug logs to confirm outbound judge/image requests.

## Scope

In scope: ui/main.js, ui/styles.css, src/server.mjs, src/infra/runtime-config.mjs, src/infra/openrouter-judge.mjs, src/infra/image-pipeline.mjs, .env.example. Out of scope: model/provider changes and API redesign.

## Plan

1) Add spinner visuals to loading indicator and safe processing state handling in UI. 2) Load .env automatically on server startup. 3) Add OPENROUTER_DEBUG runtime flag and request/response status logs for judge and image adapters. 4) Update .env.example and run lint/tests.

## Risks

Risk: exposing secrets in logs. Mitigation: log only model name and HTTP status, never API key or full payload.

## Verify Steps

1. Run `node scripts/lint.mjs` (pass).

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T17:23:22.355Z — VERIFY — ok

By: TESTER

Note: Spinner + OpenRouter visibility checks passed

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T17:23:15.130Z, excerpt_hash=sha256:accc01ddb5b9c541faf7373ede42a094b49b169e8530b167a9db120c57551486

Details:

Passed lint/tests. UI loading indicator now includes spinner and safe processing lock. Runtime debug with OPENROUTER_DEBUG=true confirmed outbound OpenRouter judge request marker in server logs.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert changes in modified files and restore previous runtime startup behavior if regressions appear.

## Context

User reported no visible processing feedback and no OpenRouter stats activity. Root cause suspected: runtime started without environment loading.

## Notes

### Approvals / Overrides
