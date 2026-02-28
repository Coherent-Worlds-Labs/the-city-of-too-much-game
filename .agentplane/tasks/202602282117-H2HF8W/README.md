---
id: "202602282117-H2HF8W"
title: "Replace blocking outcome modal with inline closed-world state"
status: "TODO"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T21:18:32.863Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved implementation to remove blocking outcome modal and move closed-session message into City Initiatives panel."
verification:
  state: "ok"
  updated_at: "2026-02-28T21:20:39.083Z"
  updated_by: "TESTER"
  note: "Automated checks pass after removing blocking outcome modal and adding inline closed-world panel."
commit: null
comments: []
events:
  -
    type: "verify"
    at: "2026-02-28T21:20:39.083Z"
    author: "TESTER"
    state: "ok"
    note: "Automated checks pass after removing blocking outcome modal and adding inline closed-world panel."
doc_version: 2
doc_updated_at: "2026-02-28T21:20:39.085Z"
doc_updated_by: "TESTER"
description: "Remove blocking completion modal so closed sessions remain navigable; show closure info inside City Initiatives panel instead of disabled cards."
id_source: "generated"
---
## Summary

Replace the blocking outcome modal with an inline closed-world state in the City Initiatives panel. Closed sessions must remain fully navigable through history without overlay interruption.

## Scope

In scope: ui/main.js rendering logic for outcome overlay and initiatives panel, plus ui/styles.css if inline closed-world styles are required. Out of scope: backend session model, image pipeline, and world rules.

## Plan

1. Inspect current outcome rendering path in ui/main.js.\n2. Remove blocking overlay behavior for closed outcomes.\n3. Render closure information block in City Initiatives panel for closed sessions.\n4. Run lint/tests and complete verification.

## Risks

Risk: removing overlay could hide world-closure context unless replacement messaging is clear. Mitigation: show explicit closed-world status and outcome copy in City Initiatives panel.

## Verify Steps

1. node scripts/lint.mjs\nExpected: no lint errors.\n2. node --test\nExpected: tests pass.\n3. Manual UI check: open a completed world after refresh, confirm no blocking modal appears and City Initiatives shows closure message while History navigation remains usable.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T21:20:39.083Z — VERIFY — ok

By: TESTER

Note: Automated checks pass after removing blocking outcome modal and adding inline closed-world panel.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T21:20:30.036Z, excerpt_hash=sha256:42122dbcab65e6d1f714511b5f7e4d6cc614b3e182370d177facd26a33e915ed

Details:

Passed: node scripts/lint.mjs; node --test. Manual expected behavior: completed world shows closure info in City Initiatives without blocking modal, History remains navigable.

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert the UI rendering changes in ui/main.js and ui/styles.css by rolling back the task commit if regression is detected.

## Context

Users can switch to completed worlds and inspect their timeline. A modal overlay still appears for completed outcomes and blocks the main scene. Requirement: no blocking modal; closure messaging should appear in the City Initiatives panel where actionable cards are no longer relevant.

## Notes

### Approvals / Overrides\nNo overrides requested.\n\n### Decisions\nRemoved blocking outcome modal for completed sessions and moved closure messaging to City Initiatives to keep timeline navigation uninterrupted.\n\n### Implementation Notes\nUpdated ui/main.js to centralize outcome copy in outcomeContentMap/getOutcomeContent, render an inline closed-world note in renderCards when outcome is not active, and force-hide outcome overlay in renderOutcomeOverlay. Added closed-world note styles in ui/styles.css.\n\n### Evidence / Links\nVerification commands executed: node scripts/lint.mjs; node --test.
