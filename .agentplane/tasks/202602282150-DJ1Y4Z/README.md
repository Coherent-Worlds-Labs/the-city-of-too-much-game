---
id: "202602282150-DJ1Y4Z"
title: "Log full image-generation prompt without truncation"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T21:51:31.628Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved full prompt logging for image requests."
verification:
  state: "ok"
  updated_at: "2026-02-28T21:52:43.663Z"
  updated_by: "TESTER"
  note: "Image request debug logs now include the full prompt text."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T21:52:43.663Z"
    author: "TESTER"
    state: "ok"
    note: "Image request debug logs now include the full prompt text."
doc_version: 2
doc_updated_at: "2026-02-28T21:52:43.666Z"
doc_updated_by: "TESTER"
description: "When image generation request is made in debug mode, print the full final prompt in logs while preserving base64 truncation for payload blobs."
id_source: "generated"
---
## Summary

Add explicit full-prompt logging for image generation requests in debug mode.

## Scope

In scope: src/infra/debug-log.mjs and src/infra/image-pipeline.mjs logging path; tests for debug logging behavior. Out of scope: generation semantics and API payload structure.

## Plan

1. Add a debug-log helper that prints full textual details without truncation.\n2. Use it in image-pipeline request logging to print the full final prompt.\n3. Add/update tests and run lint/tests.

## Risks


## Verify Steps

1. node scripts/lint.mjs\nExpected: pass.\n2. node --test\nExpected: pass.\n3. Manual debug check: image request log includes full prompt text block (not truncated).

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T21:52:43.663Z — VERIFY — ok

By: TESTER

Note: Image request debug logs now include the full prompt text.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T21:52:43.627Z, excerpt_hash=sha256:000e16dbf0e12618ef603ee346ec127a6a59b90358274c2d1bd3e79224e2886c

Details:

Passed: node scripts/lint.mjs; node --test. Debug output now prints request prompt (full) as untruncated raw text while payload remains sanitized.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert the task commit to restore prior debug logging behavior.

## Context

Current debug sanitization truncates long strings, so image prompts are not fully visible in logs. Need full prompt visibility for diagnostics while retaining base64 truncation safeguards.

## Notes

### Approvals / Overrides\nNo overrides requested.\n\n### Decisions\nAdded a dedicated raw-text debug logger for full prompt visibility instead of weakening generic payload sanitization.\n\n### Implementation Notes\nUpdated src/infra/debug-log.mjs with logDebugRawText; wired full prompt logging into src/infra/image-pipeline.mjs request debug path; added coverage in tests/debug-log.test.mjs.\n\n### Evidence / Links\nVerification commands executed: node scripts/lint.mjs; node --test.
