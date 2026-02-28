---
id: "202602282128-YDDSHK"
title: "Restore manual page scrollbar while keeping history auto-scroll local"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T21:29:00.226Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved restoring manual full-page scrollbar while keeping page auto-scroll disabled in navigation logic."
verification:
  state: "ok"
  updated_at: "2026-02-28T21:29:41.066Z"
  updated_by: "TESTER"
  note: "Manual page scrollbar restored; no automatic page scrolling in history navigation."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T21:29:41.066Z"
    author: "TESTER"
    state: "ok"
    note: "Manual page scrollbar restored; no automatic page scrolling in history navigation."
doc_version: 2
doc_updated_at: "2026-02-28T21:29:41.067Z"
doc_updated_by: "TESTER"
description: "Bring back full-page vertical scrollbar for manual use. Keep step navigation auto-focus restricted to History list container only."
id_source: "generated"
---
## Summary

Restore full-page manual vertical scrolling while preserving panel-local History auto-scroll behavior.

## Scope

In scope: ui/styles.css page overflow and app sizing rules. Out of scope: History auto-focus algorithm in JS unless regression requires it.

## Plan

1. Revert global page overflow lock and viewport-fixed app height in CSS.\n2. Keep existing History container-only auto-focus logic unchanged.\n3. Run lint/tests and record verification.

## Risks

Risk: restoring page overflow can reintroduce unexpected viewport jumps if JS uses scrollIntoView. Mitigation: keep container-local scrollTop logic in History renderer.

## Verify Steps

1. node scripts/lint.mjs\nExpected: pass.\n2. node --test\nExpected: pass.\n3. Manual UI check: page has vertical scrollbar for manual scroll; arrow navigation changes History visibility without auto-scrolling whole page.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T21:29:41.066Z — VERIFY — ok

By: TESTER

Note: Manual page scrollbar restored; no automatic page scrolling in history navigation.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T21:29:33.004Z, excerpt_hash=sha256:1b73027d814f6163ebdb156abc39680c54c0ff11d7615ee0dbc69bd2fa02ec3f

Details:

Passed: node scripts/lint.mjs; node --test. Manual expectation: vertical page scroll is available for user input only, while step arrows keep auto-focus local to History panel.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Context

Recent change disabled page scrolling globally. Requirement: page scrollbar must exist for manual navigation, but scene step arrows must not auto-scroll the page.

## Notes

### Approvals / Overrides\nNo overrides requested.\n\n### Decisions\nRestored page-level manual scrolling by removing overflow lock and fixed viewport app height; retained panel-local History scrolling behavior in JS.\n\n### Implementation Notes\nUpdated ui/styles.css: removed html/body overflow hidden rule and removed app height:100vh.\n\n### Evidence / Links\nVerification commands executed: node scripts/lint.mjs; node --test.
