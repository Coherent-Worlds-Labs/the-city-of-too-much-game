---
id: "202602281849-5043QN"
title: "Add automatic pan-tilt playback for scene images"
result_summary: "Scene images now auto-pan and tilt to reveal oversized frames without user interaction."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T18:49:29.633Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved automatic scene pan-tilt enhancement."
verification:
  state: "ok"
  updated_at: "2026-02-28T18:50:39.758Z"
  updated_by: "CODER"
  note: "Implemented automatic scene pan-tilt playback for oversized images with random motion path per frame; lint and tests pass."
commit:
  hash: "bbaedd4ccab29cfaf548989037004c17fc95ffcb"
  message: "🚧 5043QN frontend: add automatic scene pan tilt playback"
comments:
  -
    author: "CODER"
    body: "Start: implementing automatic pan-tilt playback for scene images so oversized generated frames are explored without user interaction."
  -
    author: "CODER"
    body: "Verified: added automatic pan-tilt playback for scene images using animated image layer and per-frame randomized motion path; lint/tests pass."
events:
  -
    type: "status"
    at: "2026-02-28T18:49:29.701Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing automatic pan-tilt playback for scene images so oversized generated frames are explored without user interaction."
  -
    type: "verify"
    at: "2026-02-28T18:50:39.758Z"
    author: "CODER"
    state: "ok"
    note: "Implemented automatic scene pan-tilt playback for oversized images with random motion path per frame; lint and tests pass."
  -
    type: "status"
    at: "2026-02-28T18:51:13.554Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: added automatic pan-tilt playback for scene images using animated image layer and per-frame randomized motion path; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T18:51:13.554Z"
doc_updated_by: "CODER"
description: "Implement automatic cinematic pan-tilt motion on the main scene image so oversized generated images are explored over time without user interaction."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Add automatic pan-tilt image motion layer for scene background in ui/styles.css. 2) Update ui/main.js scene rendering to drive CSS variables for motion path, duration, and zoom whenever scene image changes. 3) Preserve existing overlays/loading/motifs readability. 4) Run lint and test suite. 5) Verify and finish task.

## Risks


## Verify Steps

<!-- TODO: FILL VERIFY STEPS -->

### Scope

### Checks

### Evidence / Commands

### Pass criteria

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T18:50:39.758Z — VERIFY — ok

By: CODER

Note: Implemented automatic scene pan-tilt playback for oversized images with random motion path per frame; lint and tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T18:50:39.684Z, excerpt_hash=sha256:2efb66c1b9c8307de67b5b4db3a8c5a993803b2b5e90338efe45457a7124187e

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Approvals / Overrides
