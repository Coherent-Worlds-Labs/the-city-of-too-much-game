---
id: "202602281521-E23WMY"
title: "Image generation and continuity pipeline"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on:
  - "202602281521-R04DFZ"
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T15:52:33.232Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved image pipeline adapter and storage scope."
verification:
  state: "ok"
  updated_at: "2026-02-28T15:54:11.620Z"
  updated_by: "CODER"
  note: "Image pipeline verified: continuity prompt enrichment, OpenRouter-compatible image adapter, local storage persistence, and passing mocked tests without live network usage."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: implementing image generation pipeline with continuity prompt controls, storage adapter, and mocked integration tests."
events:
  -
    type: "status"
    at: "2026-02-28T15:52:42.049Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing image generation pipeline with continuity prompt controls, storage adapter, and mocked integration tests."
  -
    type: "verify"
    at: "2026-02-28T15:54:11.620Z"
    author: "CODER"
    state: "ok"
    note: "Image pipeline verified: continuity prompt enrichment, OpenRouter-compatible image adapter, local storage persistence, and passing mocked tests without live network usage."
doc_version: 2
doc_updated_at: "2026-02-28T15:54:11.621Z"
doc_updated_by: "CODER"
description: "Implement image generation pipeline from judge image_prompt with continuity controls (anchors/seed/reference where available), asset storage, URL delivery, and fallback behavior."
id_source: "generated"
---
## Summary

Implement image generation pipeline that consumes judge image prompts, applies continuity controls, stores generated assets locally, and returns stable image URLs for later API use.

## Scope

In scope: image prompt enrichment, OpenRouter-compatible image request adapter, local file storage, and pipeline tests with mocked responses. Out of scope: HTTP route wiring and CDN deployment.

## Plan

1. Implement image prompt enrichment with continuity anchors and previous-turn context hints.

## Risks


## Verify Steps

1. Run `node --test` and confirm image pipeline tests pass.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T15:54:11.620Z — VERIFY — ok

By: CODER

Note: Image pipeline verified: continuity prompt enrichment, OpenRouter-compatible image adapter, local storage persistence, and passing mocked tests without live network usage.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T15:54:01.988Z, excerpt_hash=sha256:12021f53ced679b4db65310167519d5df59a1889606c3ccfc62101a2f1aff5bb

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Approvals / Overrides
