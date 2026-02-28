---
id: "202602281521-8HA15J"
title: "Core game domain and turn engine"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on:
  - "202602281520-P28BNG"
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T15:45:24.290Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved core domain engine implementation scope."
verification:
  state: "ok"
  updated_at: "2026-02-28T15:47:08.182Z"
  updated_by: "CODER"
  note: "Core domain engine verified: deterministic history-based turn proposal and result application implemented with threshold-based collapse/survival evaluator and passing automated tests."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: implementing deterministic history-based turn engine contracts and collapse or survival evaluation logic."
events:
  -
    type: "status"
    at: "2026-02-28T15:45:32.990Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing deterministic history-based turn engine contracts and collapse or survival evaluation logic."
  -
    type: "verify"
    at: "2026-02-28T15:47:08.182Z"
    author: "CODER"
    state: "ok"
    note: "Core domain engine verified: deterministic history-based turn proposal and result application implemented with threshold-based collapse/survival evaluator and passing automated tests."
doc_version: 2
doc_updated_at: "2026-02-28T15:47:08.183Z"
doc_updated_by: "CODER"
description: "Implement history-only world state model, turn protocol, semantic transition contracts, collapse/survival evaluation, and deterministic server-side orchestration boundaries for judge/image calls."
id_source: "generated"
---
## Summary

Implement core domain turn engine based on history-only state, deterministic turn application, and collapse/survival evaluation contracts for downstream judge and API integrations.

## Scope

In scope: domain contracts, judge input/output validation boundaries, history-based turn application, and outcome evaluator. Out of scope: remote LLM calls, image generation, and HTTP endpoints.

## Plan

1. Define core engine contracts for session state, turn records, and judge payload boundaries.

## Risks

- Risk: weak contract validation could allow malformed judge output and corrupt game state.

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
#### 2026-02-28T15:47:08.182Z — VERIFY — ok

By: CODER

Note: Core domain engine verified: deterministic history-based turn proposal and result application implemented with threshold-based collapse/survival evaluator and passing automated tests.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T15:47:00.171Z, excerpt_hash=sha256:682d5674a3bb4d925efca0f9cabc057c814315f01dc448e2879b94eecb1a7911

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

1. Revert commit(s) from this task.

## Context

World-pack externalization is complete, so core gameplay logic can now consume world data without hardcoded narrative strings. This task establishes the turn protocol and failure/survival evaluation before external model integrations.

## Notes

### Approvals / Overrides
