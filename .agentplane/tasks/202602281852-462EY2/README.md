---
id: "202602281852-462EY2"
title: "Move restart control into protocol-carnival row as red action button"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T18:52:45.341Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved restart button header layout adjustment."
verification:
  state: "ok"
  updated_at: "2026-02-28T18:53:43.180Z"
  updated_by: "CODER"
  note: "Adjusted header layout so Restart is a red right-aligned button in the Protocol-Carnival row; lint and full tests pass."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: moving Restart into the Protocol-Carnival indicator row and styling it as a red action button."
events:
  -
    type: "status"
    at: "2026-02-28T18:52:54.856Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: moving Restart into the Protocol-Carnival indicator row and styling it as a red action button."
  -
    type: "verify"
    at: "2026-02-28T18:53:43.180Z"
    author: "CODER"
    state: "ok"
    note: "Adjusted header layout so Restart is a red right-aligned button in the Protocol-Carnival row; lint and full tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T18:53:43.182Z"
doc_updated_by: "CODER"
description: "Update header layout so Restart is shown as a red button on the right side of the same row as the Protocol-Carnival axis indicator."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Update ui/index.html header axis markup to a single row containing Protocol label, track, Carnival label, and Restart button at right. 2) Update ui/styles.css to style Restart as red primary danger action while preserving responsive behavior. 3) Run lint and tests. 4) Verify and finish task.

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
#### 2026-02-28T18:53:43.180Z — VERIFY — ok

By: CODER

Note: Adjusted header layout so Restart is a red right-aligned button in the Protocol-Carnival row; lint and full tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T18:53:43.111Z, excerpt_hash=sha256:682d5674a3bb4d925efca0f9cabc057c814315f01dc448e2879b94eecb1a7911

<!-- END VERIFICATION RESULTS -->

## Rollback Plan


## Notes

### Approvals / Overrides
