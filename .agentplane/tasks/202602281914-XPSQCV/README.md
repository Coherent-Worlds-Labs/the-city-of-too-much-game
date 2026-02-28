---
id: "202602281914-XPSQCV"
title: "Slim header and move observatory label onto scene overlay"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T19:14:41.580Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved header slimming and observatory label relocation."
verification:
  state: "ok"
  updated_at: "2026-02-28T19:15:52.594Z"
  updated_by: "CODER"
  note: "Slimmed top header, removed Growing Carnival subtitle, relocated Live City Observatory to scene top-right overlay, and kept title font style unchanged; lint/tests pass."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: slimming top header, removing Growing Carnival subtitle, and moving Live City Observatory onto scene top-right overlay."
events:
  -
    type: "status"
    at: "2026-02-28T19:14:41.747Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: slimming top header, removing Growing Carnival subtitle, and moving Live City Observatory onto scene top-right overlay."
  -
    type: "verify"
    at: "2026-02-28T19:15:52.594Z"
    author: "CODER"
    state: "ok"
    note: "Slimmed top header, removed Growing Carnival subtitle, relocated Live City Observatory to scene top-right overlay, and kept title font style unchanged; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T19:15:52.596Z"
doc_updated_by: "CODER"
description: "Make top header shorter, remove subtitle status text from header, keep only title on the left, and place Live City Observatory at the top-right over the scene image."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Remove subtitle and eyebrow from header, keep only title at left. 2) Add Live City Observatory label on scene overlay top-right. 3) Reduce header vertical padding for a slimmer top panel. 4) Update JS bindings to remove subtitle dependency. 5) Run lint/tests and finish task.

## Risks


## Verify Steps

### Scope
- Primary tag: `code`

### Checks
- Add explicit checks/commands for this task before approval.

### Evidence / Commands
- Record executed commands and key outputs.

### Pass criteria
- Steps are reproducible and produce expected results.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T19:15:52.594Z — VERIFY — ok

By: CODER

Note: Slimmed top header, removed Growing Carnival subtitle, relocated Live City Observatory to scene top-right overlay, and kept title font style unchanged; lint/tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T19:15:52.566Z, excerpt_hash=sha256:682d5674a3bb4d925efca0f9cabc057c814315f01dc448e2879b94eecb1a7911

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Approvals / Overrides
