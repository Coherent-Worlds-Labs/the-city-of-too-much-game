---
id: "202602282301-TB92AP"
title: "Add Russian world-pack variant"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "data"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T23:01:39.637Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved creation of Russian world-pack variant with preserved schema and IDs."
verification:
  state: "ok"
  updated_at: "2026-02-28T23:03:16.270Z"
  updated_by: "CODER"
  note: "Verified: RU world-pack variant file added with locale=ru and preserved schema/IDs; lint and test suites pass."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T23:03:16.270Z"
    author: "CODER"
    state: "ok"
    note: "Verified: RU world-pack variant file added with locale=ru and preserved schema/IDs; lint and test suites pass."
doc_version: 2
doc_updated_at: "2026-02-28T23:03:16.272Z"
doc_updated_by: "CODER"
description: "Create worlds/the-city-of-too-much.ru.json as a Russian-language variant of the default world pack, preserving schema and card IDs while translating textual content."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Create worlds/the-city-of-too-much.ru.json by cloning EN schema and preserving structural keys/IDs. 2) Translate all human-facing text fields to Russian: metadata, UI labels, prompt anchors/rules, motifs, and card texts. 3) Set locale to ru and keep worldId stable for compatibility. 4) Run lint and tests to ensure no regression and task artifacts remain valid.

## Risks


## Verify Steps

1) Run node scripts/lint.mjs and expect pass. 2) Run node --test and expect pass. 3) Validate worlds/the-city-of-too-much.ru.json is valid JSON and preserves schema fields/IDs from EN pack. 4) Confirm locale in RU pack is set to ru.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T23:03:16.270Z — VERIFY — ok

By: CODER

Note: Verified: RU world-pack variant file added with locale=ru and preserved schema/IDs; lint and test suites pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T23:03:16.168Z, excerpt_hash=sha256:fa9e9a9ceba7adb875c66ce4482878f0fcfe732bc7ab225838f0e45a21d38723

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Decisions\n- Added a dedicated RU world-pack file instead of mutating the EN default pack.\n- Preserved schema keys, IDs, groups, and worldId for compatibility with existing runtime logic.\n\n### Implementation Notes\n- Added worlds/the-city-of-too-much.ru.json with locale=ru and translated textual fields.\n- Updated worlds/README.md to list the RU variant.\n\n### Evidence / Links\n- node scripts/lint.mjs\n- node --test
