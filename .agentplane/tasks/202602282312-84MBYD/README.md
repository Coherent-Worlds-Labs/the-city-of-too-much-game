---
id: "202602282312-84MBYD"
title: "Add fullscreen scene mode with in-scene navigation and protocol-carnival overlay"
result_summary: "Scene can be expanded/collapsed fullscreen with full navigation and axis overlay."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T23:13:30.849Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved fullscreen scene mode with overlay axis and reversible toggle."
verification:
  state: "ok"
  updated_at: "2026-02-28T23:15:02.865Z"
  updated_by: "CODER"
  note: "Verified: scene can be expanded to fullscreen with navigation intact, fullscreen overlay includes Protocol-Carnival axis, and scene can be collapsed back via toggle or Esc; lint/tests pass."
commit:
  hash: "b94dd603af93182cac46d21942bc4d37a9c025e1"
  message: "🚧 84MBYD ui: add fullscreen scene mode with overlay axis"
comments:
  -
    author: "CODER"
    body: "Verified: fullscreen scene mode works with in-scene navigation controls, fullscreen Protocol-Carnival axis overlay, and reversible exit flow; lint/tests pass."
events:
  -
    type: "verify"
    at: "2026-02-28T23:15:02.865Z"
    author: "CODER"
    state: "ok"
    note: "Verified: scene can be expanded to fullscreen with navigation intact, fullscreen overlay includes Protocol-Carnival axis, and scene can be collapsed back via toggle or Esc; lint/tests pass."
  -
    type: "status"
    at: "2026-02-28T23:15:36.414Z"
    author: "CODER"
    from: "TODO"
    to: "DONE"
    note: "Verified: fullscreen scene mode works with in-scene navigation controls, fullscreen Protocol-Carnival axis overlay, and reversible exit flow; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T23:15:36.414Z"
doc_updated_by: "CODER"
description: "Implement a fullscreen toggle for the scene block. In fullscreen mode keep scene navigation controls available and render the Protocol-Carnival axis overlay on top of the image, with ability to exit fullscreen."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Add fullscreen toggle control inside scene overlay and add in-scene Protocol-Carnival axis overlay markup. 2) Implement fullscreen state handling in ui/main.js using Fullscreen API with toggle + fullscreenchange sync. 3) Mirror indicator position to both header axis and in-scene axis. 4) Style fullscreen scene and overlay controls for desktop/mobile, with explicit exit affordance. 5) Run lint and tests.

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
#### 2026-02-28T23:15:02.865Z — VERIFY — ok

By: CODER

Note: Verified: scene can be expanded to fullscreen with navigation intact, fullscreen overlay includes Protocol-Carnival axis, and scene can be collapsed back via toggle or Esc; lint/tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T23:13:21.788Z, excerpt_hash=sha256:2efb66c1b9c8307de67b5b4db3a8c5a993803b2b5e90338efe45457a7124187e

<!-- END VERIFICATION RESULTS -->

## Rollback Plan
