---
id: "202602282306-88ZCC9"
title: "Allow non-English card text for non-en locales in world-pack validation"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T23:07:23.383Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved locale-aware world-pack validation fix."
verification:
  state: "ok"
  updated_at: "2026-02-28T23:08:26.411Z"
  updated_by: "CODER"
  note: "Verified: validator now rejects Cyrillic only for en locales and accepts ru world-pack text; lint and tests pass; ru pack loads via WORLD_PACK_FILE."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T23:08:26.411Z"
    author: "CODER"
    state: "ok"
    note: "Verified: validator now rejects Cyrillic only for en locales and accepts ru world-pack text; lint and tests pass; ru pack loads via WORLD_PACK_FILE."
doc_version: 2
doc_updated_at: "2026-02-28T23:08:26.413Z"
doc_updated_by: "CODER"
description: "Fix world-pack validator so Cyrillic card text is allowed for locale=ru while keeping English-only guard for locale=en packs."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Update world-pack validator: enforce non-Cyrillic card text only for locale=en. 2) Add/adjust tests to cover locale=en rejection and locale=ru acceptance for Cyrillic card text. 3) Run lint and tests. 4) Keep existing schema/field checks unchanged.

## Risks


## Verify Steps

1) Run node scripts/lint.mjs and expect pass. 2) Run node --test and expect pass. 3) Ensure validator rejects Cyrillic card text when locale=en. 4) Ensure validator allows Cyrillic card text when locale=ru.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T23:08:26.411Z — VERIFY — ok

By: CODER

Note: Verified: validator now rejects Cyrillic only for en locales and accepts ru world-pack text; lint and tests pass; ru pack loads via WORLD_PACK_FILE.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T23:08:26.371Z, excerpt_hash=sha256:3966fa90313688fdb20ac72aa5284d56d2be523093cc8108d9e013bbe364ebb5

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Decisions\n- Kept English-only Cyrillic guard for locale family en* only.\n- Allowed non-English scripts for non-en locales to support localized world packs (ru).\n\n### Implementation Notes\n- Updated src/domain/world-pack.mjs: Cyrillic rejection is now locale-aware.\n- Updated tests/world-pack.test.mjs with explicit locale-sensitive validation tests.\n\n### Evidence / Links\n- node scripts/lint.mjs\n- node --test\n- WORLD_PACK_FILE=the-city-of-too-much.ru.json loader check: outputs the-city-of-too-much ru 50
