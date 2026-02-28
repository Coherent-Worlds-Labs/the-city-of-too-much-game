---
id: "202602281937-G9TNP2"
title: "Increase scene panel height and add faded monochrome page background from current image"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T19:37:43.114Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved scene height increase and faded monochrome page background sync."
verification:
  state: "ok"
  updated_at: "2026-02-28T19:38:40.086Z"
  updated_by: "CODER"
  note: "Verified: Scene panel height increased and page background now mirrors selected scene image in pale monochrome style; lint and tests passed."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: Increasing scene panel height and adding body-level grayscale background synced to selected scene image."
events:
  -
    type: "status"
    at: "2026-02-28T19:37:50.884Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Increasing scene panel height and adding body-level grayscale background synced to selected scene image."
  -
    type: "verify"
    at: "2026-02-28T19:38:40.086Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Scene panel height increased and page background now mirrors selected scene image in pale monochrome style; lint and tests passed."
doc_version: 2
doc_updated_at: "2026-02-28T19:38:40.088Z"
doc_updated_by: "CODER"
description: "Raise scene panel height by 15% and mirror the currently selected scene image as a pale grayscale site background."
id_source: "generated"
---
## Summary

Increase scene section height and render the selected scene image as a subtle grayscale background for the whole page.

## Scope


## Plan

1) Increase scene panel min-height by 15%. 2) Add body-level background layer driven by current scene image with grayscale + low opacity. 3) Update render logic to sync and clear page background image by selected scene state. 4) Run lint/tests and record verification.

## Risks


## Verify Steps

1) node scripts/lint.mjs exits with code 0. 2) node --test exits with code 0. 3) Manual UI check: scene panel is ~15% taller and page background mirrors current scene image in pale grayscale.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T19:38:40.086Z — VERIFY — ok

By: CODER

Note: Verified: Scene panel height increased and page background now mirrors selected scene image in pale monochrome style; lint and tests passed.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T19:38:30.482Z, excerpt_hash=sha256:25f7fa9a19b517f4eb68ba5258f1ced5ddead24c54f32804cfee011e217faccf

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert this task commits to restore previous scene height and static page background.

## Notes

### Implementation Notes\n- Increased scene panel min-height from 330px to 380px (~15%).\n- Added body background layer sourced from current selected scene image with grayscale and low opacity.\n- Synced body background image/class in renderScene for both present and absent image states.\n\n### Evidence / Links\n- lint: node scripts/lint.mjs\n- tests: node --test
