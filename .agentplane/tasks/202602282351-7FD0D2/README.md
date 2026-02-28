---
id: "202602282351-7FD0D2"
title: "Add Russian variant for epstein-island world pack"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "data"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T23:52:17.159Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved RU world-pack variant for epstein-island."
verification:
  state: "ok"
  updated_at: "2026-02-28T23:53:35.592Z"
  updated_by: "CODER"
  note: "Verified: Russian variant for epstein-island added as schema-compatible world pack; lint and tests pass."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T23:53:35.592Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Russian variant for epstein-island added as schema-compatible world pack; lint and tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T23:53:35.594Z"
doc_updated_by: "CODER"
description: "Create worlds/epstein-island.ru.json as a Russian localized variant of worlds/epstein-island.en.json while preserving schema, worldId, card IDs, and group keys."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Create worlds/epstein-island.ru.json as localized variant of the EN pack. 2) Preserve schema keys, worldId, ids, group keys, and card count. 3) Translate metadata/ui/motifs/cards text to Russian. 4) Run lint and tests to ensure validation compatibility.

## Risks


## Verify Steps

1) Run node scripts/lint.mjs and expect pass. 2) Run node --test and expect pass. 3) Confirm worlds/epstein-island.ru.json is valid JSON with locale=ru. 4) Confirm IDs/groups/worldId match EN pack structure.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T23:53:35.592Z — VERIFY — ok

By: CODER

Note: Verified: Russian variant for epstein-island added as schema-compatible world pack; lint and tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T23:53:35.541Z, excerpt_hash=sha256:14671021c010ec5048c35980fca38e3bdfae766db9a365ab365e4856e6453f43

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Decisions\n- Added a dedicated RU world-pack file without changing the EN source pack.\n- Preserved schema structure, worldId, card ids, and group keys for runtime compatibility.\n\n### Implementation Notes\n- Added worlds/epstein-island.ru.json with locale=ru and translated text fields.\n- Updated worlds/README.md to list Epstein Island EN/RU packs.\n\n### Evidence / Links\n- node scripts/lint.mjs\n- node --test
