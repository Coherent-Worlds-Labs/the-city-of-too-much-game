---
id: "202602282325-N4363C"
title: "Restore motifs block position to bottom-right in scene"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T23:26:06.792Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved motifs position regression rollback."
verification:
  state: "ok"
  updated_at: "2026-02-28T23:26:50.608Z"
  updated_by: "CODER"
  note: "Verified: Active Motifs is back in bottom-right in scene; no regressions in lint/tests."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T23:26:50.608Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Active Motifs is back in bottom-right in scene; no regressions in lint/tests."
doc_version: 2
doc_updated_at: "2026-02-28T23:26:50.609Z"
doc_updated_by: "CODER"
description: "Fix regression where Active Motifs moved to the left after loading-stage centering; pin motifs block back to the bottom-right corner of the scene."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Reposition .motifs using absolute bottom-right anchoring inside scene overlay. 2) Keep current styling/visibility behavior. 3) Verify in normal and fullscreen scene. 4) Run lint and tests.

## Risks


## Verify Steps

1) Run node scripts/lint.mjs and expect pass. 2) Run node --test and expect pass. 3) Manual: Active Motifs appears in bottom-right of scene in normal mode. 4) Manual: Active Motifs remains bottom-right in fullscreen mode.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T23:26:50.608Z — VERIFY — ok

By: CODER

Note: Verified: Active Motifs is back in bottom-right in scene; no regressions in lint/tests.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T23:26:50.539Z, excerpt_hash=sha256:e745d82e1a5f81dab8cc5f46920bd326fdd282c0ef2cbe7cf6798824dfb3c6c9

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Decisions\n- Restored motifs placement via absolute bottom-right anchoring to decouple it from flex-flow side effects.\n\n### Implementation Notes\n- ui/styles.css: .motifs positioned at right:14px, bottom:14px with z-index retained.\n\n### Evidence / Links\n- node scripts/lint.mjs\n- node --test
