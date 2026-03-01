---
id: "202602282357-GBW5WT"
title: "Fix missing prompt in epstein-island.ru world pack"
result_summary: "RU Epstein Island world pack now passes schema requirements."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "data"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T23:58:13.213Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved: minimal schema fix for missing prompt in RU world pack."
verification:
  state: "ok"
  updated_at: "2026-02-28T23:58:54.892Z"
  updated_by: "CODER"
  note: "Validated fix: prompt block added to worlds/epstein-island.ru.json; node scripts/lint.mjs passed; node --test passed (34/34); direct loader check confirms worldId=epstein-island locale=ru prompt=true."
commit:
  hash: "8496781f1457ce0a5c12505929fd0e386fd6e3fb"
  message: "✅ GBW5WT data: add required prompt block to epstein-island.ru world pack"
comments:
  -
    author: "CODER"
    body: "Start: Implementing a minimal, schema-safe fix by adding the required prompt object to worlds/epstein-island.ru.json and then running verification."
  -
    author: "CODER"
    body: "Verified: Added missing top-level prompt to worlds/epstein-island.ru.json; lint and test suite pass; direct world-pack load check confirms prompt is present and validation no longer fails."
events:
  -
    type: "status"
    at: "2026-02-28T23:58:19.504Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Implementing a minimal, schema-safe fix by adding the required prompt object to worlds/epstein-island.ru.json and then running verification."
  -
    type: "verify"
    at: "2026-02-28T23:58:54.892Z"
    author: "CODER"
    state: "ok"
    note: "Validated fix: prompt block added to worlds/epstein-island.ru.json; node scripts/lint.mjs passed; node --test passed (34/34); direct loader check confirms worldId=epstein-island locale=ru prompt=true."
  -
    type: "status"
    at: "2026-02-28T23:59:56.800Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Added missing top-level prompt to worlds/epstein-island.ru.json; lint and test suite pass; direct world-pack load check confirms prompt is present and validation no longer fails."
doc_version: 2
doc_updated_at: "2026-02-28T23:59:56.800Z"
doc_updated_by: "CODER"
description: "Runtime fails because worlds/epstein-island.ru.json misses required top-level prompt field. Add schema-compatible prompt block and verify validation/tests pass."
id_source: "generated"
---
## Summary

Fix startup failure for Russian Epstein Island world pack by adding the required top-level prompt object expected by world-pack validation.

## Scope

In scope: worlds/epstein-island.ru.json. Out of scope: gameplay logic, other world packs, UI behavior.

## Plan

1) Add missing top-level prompt block to worlds/epstein-island.ru.json using the same schema keys as existing packs (persistentAnchors, style, continuityRules, negativeConstraints). 2) Run lint and test suite. 3) Record verification and finish task with commit.

## Risks

Risk: malformed prompt shape could still fail runtime assumptions. Mitigation: mirror existing prompt schema used by other packs and run lint/tests.

## Verify Steps

1) node scripts/lint.mjs should complete with no errors. 2) node --test should pass. 3) Starting server with WORLD_PACK_FILE=worlds/epstein-island.ru.json must no longer fail validation for missing prompt.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T23:58:54.892Z — VERIFY — ok

By: CODER

Note: Validated fix: prompt block added to worlds/epstein-island.ru.json; node scripts/lint.mjs passed; node --test passed (34/34); direct loader check confirms worldId=epstein-island locale=ru prompt=true.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T23:58:19.504Z, excerpt_hash=sha256:220d728a3749d03c1c28e0dbc2b618e5c9d162ae56ec2bcb9f9a4f687e738a70

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert the commit for this task, or restore worlds/epstein-island.ru.json from previous revision if prompt insertion causes regressions.

## Context

A runtime error is raised by loadWorldPackFromPath because validateWorldPack requires prompt at top level. Existing RU pack contains metadata/ui/motifs/cards but omitted prompt.
