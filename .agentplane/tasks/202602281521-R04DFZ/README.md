---
id: "202602281521-R04DFZ"
title: "Stateless judge integration with strict schema"
result_summary: "Stateless judge adapter is implemented with strict contract validation for engine consumption."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on:
  - "202602281521-8HA15J"
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T15:48:59.472Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved stateless judge adapter implementation scope."
verification:
  state: "ok"
  updated_at: "2026-02-28T15:50:52.625Z"
  updated_by: "CODER"
  note: "Stateless judge adapter verified with strict JSON parse and schema validation, deterministic prompt builder, and passing mocked integration tests without live network dependency."
commit:
  hash: "82849f4bb4e47702f5da79c83b74d3a1be6dc549"
  message: "🚧 R04DFZ judge: add stateless adapter and validation"
comments:
  -
    author: "CODER"
    body: "Start: implementing OpenRouter-compatible stateless judge adapter with strict JSON validation and mocked test coverage."
  -
    author: "CODER"
    body: "Verified: Added deterministic judge prompt builder, OpenRouter-compatible adapter with strict JSON parsing and validation, and passing mocked integration tests without live network usage."
events:
  -
    type: "status"
    at: "2026-02-28T15:49:09.368Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing OpenRouter-compatible stateless judge adapter with strict JSON validation and mocked test coverage."
  -
    type: "verify"
    at: "2026-02-28T15:50:52.625Z"
    author: "CODER"
    state: "ok"
    note: "Stateless judge adapter verified with strict JSON parse and schema validation, deterministic prompt builder, and passing mocked integration tests without live network dependency."
  -
    type: "status"
    at: "2026-02-28T15:51:21.108Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Added deterministic judge prompt builder, OpenRouter-compatible adapter with strict JSON parsing and validation, and passing mocked integration tests without live network usage."
doc_version: 2
doc_updated_at: "2026-02-28T15:51:21.108Z"
doc_updated_by: "CODER"
description: "Integrate OpenRouter text judge with strict JSON schema validation, retry/error strategy, and mapping from history+new card to reconstructed state/evaluation/new state/image prompt."
id_source: "generated"
---
## Summary

Integrate stateless judge client boundaries for OpenRouter-compatible chat completion calls with strict JSON parsing and validation before engine consumption.

## Scope

In scope: prompt construction, OpenRouter request payload builder, response parser/validator, retry-safe error handling contract, and tests with mocked fetch. Out of scope: image generation and API routes.

## Plan

1. Add prompt builder utilities that convert world-pack context plus turn proposal into deterministic judge messages.

## Risks

- Risk: model output may include non-JSON wrappers or schema drift.

## Verify Steps

1. Run `node --test` and confirm judge adapter tests pass.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T15:50:52.625Z — VERIFY — ok

By: CODER

Note: Stateless judge adapter verified with strict JSON parse and schema validation, deterministic prompt builder, and passing mocked integration tests without live network dependency.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T15:50:43.843Z, excerpt_hash=sha256:20e66853c179385c364226a62fd45e2e18a846938485c67752fabfef68345692

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

1. Revert judge adapter commit(s).

## Notes

### Approvals / Overrides
