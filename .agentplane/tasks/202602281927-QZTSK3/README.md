---
id: "202602281927-QZTSK3"
title: "Change scene overlay prefix to Turn X format"
result_summary: "Scene overlay now labels selected step as Turn X."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T19:27:48.835Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved caption prefix update to Turn X format."
verification:
  state: "ok"
  updated_at: "2026-02-28T19:28:28.337Z"
  updated_by: "CODER"
  note: "Verified: Scene caption prefix now uses Turn X format for initial and selected timeline steps; lint and tests passed."
commit:
  hash: "aa10824b3664d12444ece9921139552e9bfdf23f"
  message: "🚧 QZTSK3 ui: switch scene caption prefix to turn index"
comments:
  -
    author: "CODER"
    body: "Start: Applying Turn X prefix format for in-scene step caption in default and runtime-rendered states."
  -
    author: "CODER"
    body: "Verified: Replaced Applied card prefix with Turn X format in scene overlay text and renderer; lint and tests pass."
events:
  -
    type: "status"
    at: "2026-02-28T19:27:55.572Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Applying Turn X prefix format for in-scene step caption in default and runtime-rendered states."
  -
    type: "verify"
    at: "2026-02-28T19:28:28.337Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Scene caption prefix now uses Turn X format for initial and selected timeline steps; lint and tests passed."
  -
    type: "status"
    at: "2026-02-28T19:28:49.683Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Replaced Applied card prefix with Turn X format in scene overlay text and renderer; lint and tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T19:28:49.683Z"
doc_updated_by: "CODER"
description: "Replace the scene overlay prefix 'Applied card:' with 'Turn X:' where X is the selected step turn number."
id_source: "generated"
---
## Summary


## Scope

In scope: ui/index.html and ui/main.js. Out of scope: styles and backend behavior.

## Plan

1) Update default overlay text in markup to Turn 0. 2) Update render logic to compose caption as Turn <turnIndex>: <card text>. 3) Run lint/tests and record verification.

## Risks

Low risk textual change; ensure initial state still renders meaningful turn label.

## Verify Steps

1) node scripts/lint.mjs exits with code 0. 2) node --test exits with code 0. 3) Manual UI check: scene overlay caption begins with Turn <number>: for initial and timeline entries.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T19:28:28.337Z — VERIFY — ok

By: CODER

Note: Verified: Scene caption prefix now uses Turn X format for initial and selected timeline steps; lint and tests passed.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T19:28:21.939Z, excerpt_hash=sha256:2b40aac7afa9a4f2a33d34824b0244bf5c15df42c175fe62c18ef68e61af395d

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert task commit to restore previous Applied card caption format.

## Notes

### Implementation Notes\n- Changed overlay default text to Turn 0 format.\n- Updated runtime renderer to output Turn <turnIndex>: <card text>.\n\n### Evidence / Links\n- lint: node scripts/lint.mjs\n- tests: node --test
