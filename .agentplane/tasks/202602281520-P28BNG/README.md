---
id: "202602281520-P28BNG"
title: "World-pack externalization for replaceable worlds"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on:
  - "202602281520-REWVY0"
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T15:39:32.810Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved world-pack externalization scope including English content normalization."
verification:
  state: "ok"
  updated_at: "2026-02-28T15:43:01.177Z"
  updated_by: "CODER"
  note: "World-pack externalization verified: default English pack created with 50 cards, validator and loader modules added, and automated checks/tests passed."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: externalizing all world-specific content into a versioned world-pack with loader validation and English-only tracked world text."
events:
  -
    type: "status"
    at: "2026-02-28T15:39:45.016Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: externalizing all world-specific content into a versioned world-pack with loader validation and English-only tracked world text."
  -
    type: "verify"
    at: "2026-02-28T15:43:01.177Z"
    author: "CODER"
    state: "ok"
    note: "World-pack externalization verified: default English pack created with 50 cards, validator and loader modules added, and automated checks/tests passed."
doc_version: 2
doc_updated_at: "2026-02-28T15:43:01.179Z"
doc_updated_by: "CODER"
description: "Design and implement a dedicated external world-pack file contract containing all world-specific content (setting metadata, card texts, motifs, prompt anchors, UX labels). Engine and UI must load world data from this file so a new world can be swapped quickly without code edits."
id_source: "generated"
---
## Summary

Externalize all world-specific game content into a replaceable world-pack artifact and introduce code-level loading/validation utilities so downstream engine and UI consume data instead of hardcoded strings.

## Scope

In scope: world-pack schema, default world-pack file with card deck text in English, loader/validator module, and tests. Out of scope: full game turn logic and UI rendering integration (handled by downstream tasks).

## Plan

1. Define a versioned world-pack schema for metadata, card deck, motifs, prompt anchors, and UX labels.

## Risks

- Risk: translation/normalization may alter narrative nuance from source material.

## Verify Steps

1. Run `node scripts/check-bootstrap.mjs` to ensure baseline scaffold remains intact.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T15:43:01.177Z — VERIFY — ok

By: CODER

Note: World-pack externalization verified: default English pack created with 50 cards, validator and loader modules added, and automated checks/tests passed.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T15:42:52.294Z, excerpt_hash=sha256:99ab1273baec867dc91de56cfb9f8a187af8e576200e3f8e443534f81fd1c3d3

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Approvals / Overrides
