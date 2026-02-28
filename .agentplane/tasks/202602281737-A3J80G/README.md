---
id: "202602281737-A3J80G"
title: "Refine judge JSON contract for gpt-5-mini and add robust shape normalization"
result_summary: "Judge contract clarity and schema-drift normalization implemented and verified."
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
  updated_at: "2026-02-28T17:37:52.782Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved contract rewrite + normalization for gpt-5-mini judge outputs."
verification:
  state: "ok"
  updated_at: "2026-02-28T17:39:32.361Z"
  updated_by: "TESTER"
  note: "Judge contract rewrite and normalization verified"
commit:
  hash: "ce258edf595fc56e4c5d65c7f06379ab36dd0755"
  message: "✅ A3J80G judge: tighten gpt-5-mini contract and normalize schema drift"
comments:
  -
    author: "CODER"
    body: "Start: rewriting judge schema instructions for gpt-5-mini and adding safe normalization for common malformed response shapes."
  -
    author: "INTEGRATOR"
    body: "Verified: judge contract is now explicit for gpt-5-mini JSON output, and runtime normalizes common malformed shapes before strict validation to prevent avoidable turn failures."
events:
  -
    type: "status"
    at: "2026-02-28T17:37:53.893Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: rewriting judge schema instructions for gpt-5-mini and adding safe normalization for common malformed response shapes."
  -
    type: "verify"
    at: "2026-02-28T17:39:32.361Z"
    author: "TESTER"
    state: "ok"
    note: "Judge contract rewrite and normalization verified"
  -
    type: "status"
    at: "2026-02-28T17:39:58.222Z"
    author: "INTEGRATOR"
    from: "DOING"
    to: "DONE"
    note: "Verified: judge contract is now explicit for gpt-5-mini JSON output, and runtime normalizes common malformed shapes before strict validation to prevent avoidable turn failures."
doc_version: 2
doc_updated_at: "2026-02-28T17:39:58.222Z"
doc_updated_by: "INTEGRATOR"
description: "Rewrite judge prompt contract to reduce schema drift on gpt-5-mini and normalize common malformed outputs (e.g., metrics under evaluation) into valid runtime shape."
id_source: "generated"
---
## Summary

Improve judge contract clarity for gpt-5-mini and harden response handling so common schema drift does not break turn execution.

## Scope

In scope: src/domain/judge-prompt.mjs, src/infra/openrouter-judge.mjs, and related tests. Out of scope: world content changes and image model prompts.

## Plan

1) Rewrite system prompt with explicit key-level contract and strict anti-pattern rules tailored to gpt-5-mini. 2) Add normalization layer to salvage common misplaced fields into runtime schema before validation. 3) Improve validation error text for clarity. 4) Add/adjust tests and run lint/test.

## Risks

Risk: over-normalization may hide severe model drift. Mitigation: normalize only known-safe mappings and keep validation strict for required fields.

## Verify Steps

1. node scripts/lint.mjs passes. 2. node --test passes. 3. Judge parser test covers case where metrics are under evaluation and new_state is string; normalized output validates.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T17:39:32.361Z — VERIFY — ok

By: TESTER

Note: Judge contract rewrite and normalization verified

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T17:39:24.860Z, excerpt_hash=sha256:24a3ddb625cc1fa7dbb74222d54bd573707a084def11f1621f27eaa42d952c32

Details:

Prompt contract rewritten for strict JSON object typing and anti-pattern exclusions. Added normalization for metrics misplaced under evaluation with new_state prose. Lint and tests pass.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert judge prompt and parser normalization files; restore prior strict behavior if regressions occur.

## Context

Observed failure: model returned 'new_state' as prose and placed metrics under 'evaluation'. Existing validator expects metrics inside object new_state.

## Notes

### Approvals / Overrides
