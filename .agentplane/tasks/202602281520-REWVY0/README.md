---
id: "202602281520-REWVY0"
title: "Project bootstrap and developer toolchain"
status: "DOING"
priority: "high"
owner: "CODER"
depends_on:
  - "202602281520-HCXVXY"
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T15:36:54.616Z"
  updated_by: "ORCHESTRATOR"
  note: "Re-approved after finalized plan formatting and verify steps."
verification:
  state: "ok"
  updated_at: "2026-02-28T15:37:03.176Z"
  updated_by: "CODER"
  note: "Offline bootstrap verification passed: check-bootstrap, lint baseline, node tests, and build placeholder succeeded. TypeScript compile is declared but dependency installation is intentionally deferred under network gate policy."
commit: null
comments:
  -
    author: "CODER"
    body: "Start: creating baseline project scaffold and developer toolchain manifests for frontend, backend, domain, and infrastructure layers."
events:
  -
    type: "status"
    at: "2026-02-28T15:33:35.278Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: creating baseline project scaffold and developer toolchain manifests for frontend, backend, domain, and infrastructure layers."
  -
    type: "verify"
    at: "2026-02-28T15:37:03.176Z"
    author: "CODER"
    state: "ok"
    note: "Offline bootstrap verification passed: check-bootstrap, lint baseline, node tests, and build placeholder succeeded. TypeScript compile is declared but dependency installation is intentionally deferred under network gate policy."
doc_version: 2
doc_updated_at: "2026-02-28T15:37:03.177Z"
doc_updated_by: "CODER"
description: "Bootstrap the game application stack (frontend, backend, storage wiring placeholders), plus lint/typecheck/test/build scripts and environment schema for local and stage deployments."
id_source: "generated"
---
## Summary

Bootstrap a deterministic project skeleton for The City of Too Much with frontend/backend boundaries, shared domain folders, and developer scripts for lint, typecheck, test, and build.

## Scope

In scope: workspace scaffold, package scripts, TypeScript config, environment templates, and baseline source directories for app/api/domain/adapters. Out of scope: game logic, LLM/image integration, and final UI flows.

## Plan

1. Create baseline project manifests and scripts (`package.json`, `tsconfig.json`, lint/test/build command stubs).

## Risks

- Risk: Without dependency installation, script execution remains partially unverified.

## Verify Steps

1. Run git status --short --untracked-files=no and confirm only bootstrap files changed.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T15:37:03.176Z — VERIFY — ok

By: CODER

Note: Offline bootstrap verification passed: check-bootstrap, lint baseline, node tests, and build placeholder succeeded. TypeScript compile is declared but dependency installation is intentionally deferred under network gate policy.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T15:36:46.394Z, excerpt_hash=sha256:21cd687596ad8ce0e9f93eb5076206b76becd303dda100b8aff565de209261c5

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

1. Revert the task commit introducing bootstrap artifacts.

## Context

The repository currently contains only policy and requirement documents. This task creates the initial implementation structure so downstream tasks can add domain logic, integrations, and UI without redesigning project layout.

## Notes

### Approvals / Overrides
