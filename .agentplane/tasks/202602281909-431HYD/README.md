---
id: "202602281909-431HYD"
title: "Add optional image-to-image mode for image generation pipeline"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T19:09:47.798Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved optional image-to-image mode rollout with fallback safety."
verification:
  state: "ok"
  updated_at: "2026-02-28T19:11:36.193Z"
  updated_by: "CODER"
  note: "Implemented optional image-to-image mode via env toggle with safe fallback to text-only generation; lint and full tests pass."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: implementing optional image-to-image generation mode via environment flag with graceful fallback to text-only mode."
events:
  -
    type: "status"
    at: "2026-02-28T19:09:47.859Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing optional image-to-image generation mode via environment flag with graceful fallback to text-only mode."
  -
    type: "verify"
    at: "2026-02-28T19:11:36.193Z"
    author: "CODER"
    state: "ok"
    note: "Implemented optional image-to-image mode via env toggle with safe fallback to text-only generation; lint and full tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T19:11:36.195Z"
doc_updated_by: "CODER"
description: "Introduce a toggleable image-to-image mode via environment config so each turn can use previous frame as an input image when enabled, with graceful fallback to text-only mode."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Add IMAGE_TO_IMAGE_ENABLED config flag (default false). 2) Extend image pipeline to optionally attach previous frame image as model input when enabled and resolvable from local assets. 3) Keep robust fallback path: if image-to-image fails or is unavailable, use current text-only generation body. 4) Wire flag through server runtime config to pipeline. 5) Update .env.example and add/adjust tests for enabled mode and fallback behavior. 6) Run lint and tests, verify and finish task.

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
#### 2026-02-28T19:11:36.193Z — VERIFY — ok

By: CODER

Note: Implemented optional image-to-image mode via env toggle with safe fallback to text-only generation; lint and full tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T19:11:36.167Z, excerpt_hash=sha256:682d5674a3bb4d925efca0f9cabc057c814315f01dc448e2879b94eecb1a7911

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Approvals / Overrides
