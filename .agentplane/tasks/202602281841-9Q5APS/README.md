---
id: "202602281841-9Q5APS"
title: "Fix image generation regression from aggressive output cap"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T18:42:30.493Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved regression fix plan."
verification:
  state: "ok"
  updated_at: "2026-02-28T18:44:10.548Z"
  updated_by: "CODER"
  note: "Fixed regression where image requests ended with max_output_tokens and produced no image; added no-image fallback retry and safe defaults; lint/tests pass."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: fixing image generation regression by removing unsafe max-output default and adding fallback retry when response has no generated image."
events:
  -
    type: "status"
    at: "2026-02-28T18:42:38.342Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: fixing image generation regression by removing unsafe max-output default and adding fallback retry when response has no generated image."
  -
    type: "verify"
    at: "2026-02-28T18:44:10.548Z"
    author: "CODER"
    state: "ok"
    note: "Fixed regression where image requests ended with max_output_tokens and produced no image; added no-image fallback retry and safe defaults; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T18:44:10.554Z"
doc_updated_by: "CODER"
description: "Restore stable image generation after low-cost tuning by removing unsafe low max output default and adding automatic fallback retry when provider returns 200 without image payload."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Make IMAGE_MAX_COMPLETION_TOKENS optional by default and send max_tokens only when configured > 0. 2) Retry image request when response is 200 but contains no image payload, using relaxed compatibility body. 3) Keep compact continuity prompt and low reasoning defaults. 4) Update env defaults and tests.

## Risks


## Verify Steps

1) Run node scripts/lint.mjs and expect success. 2) Run node --test and expect all tests passing. 3) Ensure image-pipeline tests cover request defaults and fallback behavior for missing image payload.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T18:44:10.548Z — VERIFY — ok

By: CODER

Note: Fixed regression where image requests ended with max_output_tokens and produced no image; added no-image fallback retry and safe defaults; lint/tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T18:42:38.342Z, excerpt_hash=sha256:7a5810f51191e2c3a398b5dc9067f61d5bfcb08e918c3b401bcfd9aacbcbfb97

<!-- END VERIFICATION RESULTS -->

## Rollback Plan
