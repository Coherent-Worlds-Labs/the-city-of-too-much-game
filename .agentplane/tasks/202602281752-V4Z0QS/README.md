---
id: "202602281752-V4Z0QS"
title: "Set image generation aspect ratio to landscape"
status: "DOING"
priority: "med"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T17:53:21.182Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved landscape aspect ratio update."
verification:
  state: "ok"
  updated_at: "2026-02-28T17:53:53.478Z"
  updated_by: "TESTER"
  note: "Landscape aspect ratio applied"
commit: null
comments:
  -
    author: "CODER"
    body: "Start: updating image generation aspect ratio from square to landscape for scene alignment."
events:
  -
    type: "status"
    at: "2026-02-28T17:53:22.152Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: updating image generation aspect ratio from square to landscape for scene alignment."
  -
    type: "verify"
    at: "2026-02-28T17:53:53.478Z"
    author: "TESTER"
    state: "ok"
    note: "Landscape aspect ratio applied"
doc_version: 2
doc_updated_at: "2026-02-28T17:53:53.479Z"
doc_updated_by: "TESTER"
description: "Change OpenRouter image_config aspect ratio from square to landscape to match wide scene UI."
id_source: "generated"
---
## Summary

Switch generated scene images to landscape ratio for better fit with wide gameplay scene container.

## Scope

In scope: image pipeline request payload and image pipeline test assertions. Out of scope: UI layout changes.

## Plan

1) Update image_config.aspect_ratio to 16:9. 2) Update tests to assert 16:9 request payload. 3) Run lint and tests.

## Risks

Risk: provider may interpret unsupported aspect ratio differently. Mitigation: keep debug payload logging to verify final request and provider response.

## Verify Steps

1. node scripts/lint.mjs passes. 2. node --test passes. 3. image pipeline test asserts aspect_ratio is 16:9.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T17:53:53.478Z — VERIFY — ok

By: TESTER

Note: Landscape aspect ratio applied

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T17:53:52.582Z, excerpt_hash=sha256:d23bce4d2844483d2ec19666307bea9f4bfe3a88300b06e44869f7c4fa0274dd

Details:

Image pipeline now requests image_config.aspect_ratio=16:9; tests assert the new value and pass.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert aspect_ratio to 1:1 if model/provider compatibility issues appear.

## Context

Current image_config requests 1:1, which does not match horizontal scene composition and can reduce visual quality by cropping.

## Notes

### Approvals / Overrides
