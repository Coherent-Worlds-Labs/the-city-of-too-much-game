---
id: "202602281831-9C4BX1"
title: "Apply full image-cost optimization profile without turn-skipping"
result_summary: "Image generation now uses a full low-cost request profile without changing turn-by-turn rendering cadence."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T18:31:56.256Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved full low-cost profile rollout without reducing generation frequency."
verification:
  state: "ok"
  updated_at: "2026-02-28T18:33:53.912Z"
  updated_by: "CODER"
  note: "Implemented all requested cost reductions except turn-skipping: image-only mode, reduced completion/reasoning budget, compact continuity prompt, and capped image_prompt length; lint and tests pass."
commit:
  hash: "dc95a2037e93b5877353234da1d6e2b0e3b67252"
  message: "🚧 9C4BX1 code: apply full image cost optimization profile"
comments:
  -
    author: "CODER"
    body: "Start: applying complete image cost optimization profile (except cadence changes): image-only modality, reasoning/output budget limits, compact continuity prompt, and capped image_prompt length."
  -
    author: "CODER"
    body: "Verified: implemented image-only low-cost mode, constrained completion/reasoning budget, compact continuity prompts, and capped image_prompt length without reducing generation cadence; lint and tests pass."
events:
  -
    type: "status"
    at: "2026-02-28T18:32:04.464Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: applying complete image cost optimization profile (except cadence changes): image-only modality, reasoning/output budget limits, compact continuity prompt, and capped image_prompt length."
  -
    type: "verify"
    at: "2026-02-28T18:33:53.912Z"
    author: "CODER"
    state: "ok"
    note: "Implemented all requested cost reductions except turn-skipping: image-only mode, reduced completion/reasoning budget, compact continuity prompt, and capped image_prompt length; lint and tests pass."
  -
    type: "status"
    at: "2026-02-28T18:34:28.228Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: implemented image-only low-cost mode, constrained completion/reasoning budget, compact continuity prompts, and capped image_prompt length without reducing generation cadence; lint and tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T18:34:28.228Z"
doc_updated_by: "CODER"
description: "Implement all approved cost cuts except reduced image frequency: image-only modality, lower completion/reasoning budget, compact continuity prompt, and image_prompt length cap for model-facing requests."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Add runtime-config knobs for image request token/reasoning budget and prompt max length. 2) Update image pipeline request body to image-only low-cost defaults and compact continuity prompt text. 3) Add guarded compatibility fallback if provider rejects strict low-cost fields. 4) Cap model-facing image prompt length before image generation calls. 5) Update env example and tests for new defaults. 6) Run lint and full tests, record verification, commit and finish.

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
#### 2026-02-28T18:33:53.912Z — VERIFY — ok

By: CODER

Note: Implemented all requested cost reductions except turn-skipping: image-only mode, reduced completion/reasoning budget, compact continuity prompt, and capped image_prompt length; lint and tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T18:33:45.080Z, excerpt_hash=sha256:682d5674a3bb4d925efca0f9cabc057c814315f01dc448e2879b94eecb1a7911

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Approvals / Overrides
