---
id: "202602281520-HCXVXY"
title: "Repo baseline and English-only setup"
result_summary: "Baseline repository hygiene completed for implementation kickoff."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T15:27:17.718Z"
  updated_by: "ORCHESTRATOR"
  note: "Plan re-approved after documentation updates."
verification:
  state: "ok"
  updated_at: "2026-02-28T15:27:24.898Z"
  updated_by: "CODER"
  note: "Validated baseline changes: .gitignore now ignores sow/, README has implementation constraints including English-only artifacts and external world-pack policy, and tracked diff is limited to intended files."
commit:
  hash: "82fa82c14d62a8c29d085b538ebb944415e26032"
  message: "🚧 HCXVXY repo: set baseline ignore and english constraints"
comments:
  -
    author: "CODER"
    body: "Start: applying repo baseline updates to ignore sow assets and enforce English-first implementation artifacts before coding begins."
  -
    author: "CODER"
    body: "Verified: Added sow/ ignore rule, documented English-only implementation constraints, and confirmed tracked changes were limited to intended baseline repository files."
events:
  -
    type: "status"
    at: "2026-02-28T15:25:51.177Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: applying repo baseline updates to ignore sow assets and enforce English-first implementation artifacts before coding begins."
  -
    type: "verify"
    at: "2026-02-28T15:27:24.898Z"
    author: "CODER"
    state: "ok"
    note: "Validated baseline changes: .gitignore now ignores sow/, README has implementation constraints including English-only artifacts and external world-pack policy, and tracked diff is limited to intended files."
  -
    type: "status"
    at: "2026-02-28T15:28:31.815Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Added sow/ ignore rule, documented English-only implementation constraints, and confirmed tracked changes were limited to intended baseline repository files."
doc_version: 2
doc_updated_at: "2026-02-28T15:28:31.815Z"
doc_updated_by: "CODER"
description: "Set repository baseline for implementation: add sow/ to .gitignore, define English-only runtime/content policy in tracked artifacts, and prepare migration notes for replacing non-English gameplay-facing text."
id_source: "generated"
---
## Summary

Establish baseline repository hygiene for implementation kickoff by applying ignore rules for source SOW artifacts and documenting English-only implementation constraints.

## Scope

In scope: .gitignore and README repository policy note for implementation constraints. Out of scope: gameplay logic, API, UI, and full world-pack implementation (planned in downstream tasks).

## Plan

1. Add sow/ to .gitignore.

## Risks

- Risk: ignoring sow/ may hide accidentally created required assets for future tasks.

## Verify Steps

1. Run git diff -- .gitignore README.md and verify only intended baseline updates are present.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T15:27:24.898Z — VERIFY — ok

By: CODER

Note: Validated baseline changes: .gitignore now ignores sow/, README has implementation constraints including English-only artifacts and external world-pack policy, and tracked diff is limited to intended files.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T15:27:01.279Z, excerpt_hash=sha256:243d68658190282847254e9422332260e08d87cadee285f652e221b4547ed72e

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

1. Revert .gitignore and README changes from the task commit.

## Context

The implementation run requires strict traceability and English-first repository artifacts. Source requirement files in sow/ must remain out of tracked implementation output, and world-specific content must be externalized in follow-up tasks.
