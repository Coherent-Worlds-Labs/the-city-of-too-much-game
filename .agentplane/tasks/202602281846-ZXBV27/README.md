---
id: "202602281846-ZXBV27"
title: "Remove redundant standalone timeline page and links"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T18:46:20.604Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved removal of redundant standalone timeline UI."
verification:
  state: "ok"
  updated_at: "2026-02-28T18:47:41.430Z"
  updated_by: "CODER"
  note: "Removed standalone timeline page and navigation links; verified no remaining timeline page references and all lint/tests pass."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: removing redundant standalone timeline page and links now that History panel supports timeline navigation and image playback."
events:
  -
    type: "status"
    at: "2026-02-28T18:46:20.702Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: removing redundant standalone timeline page and links now that History panel supports timeline navigation and image playback."
  -
    type: "verify"
    at: "2026-02-28T18:47:41.430Z"
    author: "CODER"
    state: "ok"
    note: "Removed standalone timeline page and navigation links; verified no remaining timeline page references and all lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T18:47:41.432Z"
doc_updated_by: "CODER"
description: "Remove the separate timeline page and all navigation links to it because the main screen History panel now provides timeline navigation and image preview functionality."
id_source: "generated"
---
## Summary


## Scope


## Plan

1) Remove timeline links from ui/index.html (header and outcome overlay). 2) Remove standalone ui/timeline.html and ui/timeline.js files. 3) Remove static route handling for timeline page/script in src/server.mjs while keeping API timeline endpoint intact. 4) Update README and runbook references to timeline page. 5) Run lint/tests, verify, commit, finish.

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
#### 2026-02-28T18:47:41.430Z — VERIFY — ok

By: CODER

Note: Removed standalone timeline page and navigation links; verified no remaining timeline page references and all lint/tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T18:46:20.702Z, excerpt_hash=sha256:682d5674a3bb4d925efca0f9cabc057c814315f01dc448e2879b94eecb1a7911

<!-- END VERIFICATION RESULTS -->

## Rollback Plan
