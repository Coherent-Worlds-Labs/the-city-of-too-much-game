---
id: "202602282256-E9VGMG"
title: "Make default world pack file configurable via environment"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T22:57:00.037Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved env-driven default world pack file configuration update."
verification:
  state: "ok"
  updated_at: "2026-02-28T22:58:22.653Z"
  updated_by: "CODER"
  note: "Verified: WORLD_PACK_FILE added to env template; loader now resolves worlds/<WORLD_PACK_FILE> with safe fallback; lint and tests pass."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T22:58:22.653Z"
    author: "CODER"
    state: "ok"
    note: "Verified: WORLD_PACK_FILE added to env template; loader now resolves worlds/<WORLD_PACK_FILE> with safe fallback; lint and tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T22:58:22.655Z"
doc_updated_by: "CODER"
description: "Move default world-pack file name to environment configuration and expose it in .env.example. Runtime must load worlds/<WORLD_PACK_FILE> with safe fallback to current default file."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Add environment variable for default world-pack filename in .env.example. 2) Update world-pack loader to resolve default path from WORLD_PACK_FILE with fallback to the current default file. 3) Document the new variable in runbook and README bootstrap references. 4) Run lint and tests; verify runtime still loads default world pack without env override.

## Risks


## Verify Steps

1) Run node scripts/lint.mjs and expect pass. 2) Run node --test and expect pass. 3) Confirm .env.example includes WORLD_PACK_FILE. 4) Confirm src/infra/world-pack-loader.mjs uses WORLD_PACK_FILE with fallback to the-city-of-too-much.en.json.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T22:58:22.653Z — VERIFY — ok

By: CODER

Note: Verified: WORLD_PACK_FILE added to env template; loader now resolves worlds/<WORLD_PACK_FILE> with safe fallback; lint and tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T22:58:12.137Z, excerpt_hash=sha256:0b0b35849d2025d96eed5d16eb83edc2e8c4e5be030da8a9046fd9950787bec7

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Decisions\n- Added WORLD_PACK_FILE as file-name level setting (not absolute path) to keep world resolution predictable under worlds/.\n- Sanitized env value via basename() to prevent path traversal out of worlds/.\n\n### Implementation Notes\n- .env.example: added WORLD_PACK_FILE=the-city-of-too-much.en.json.\n- src/infra/world-pack-loader.mjs: default world pack now resolves from WORLD_PACK_FILE with fallback to the existing default file.\n- docs/runbook.md and README.md: documented WORLD_PACK_FILE usage.\n\n### Evidence / Links\n- node scripts/lint.mjs\n- node --test
