---
id: "202602281521-W6TW3D"
title: "End states, timeline, and UX polish"
result_summary: "End-state overlays, timeline replay, and gameplay UX polish are implemented and verified."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on:
  - "202602281521-P29H9S"
tags:
  - "frontend"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T16:07:48.492Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved end-state, timeline, and UX polish scope."
verification:
  state: "ok"
  updated_at: "2026-02-28T16:10:46.907Z"
  updated_by: "CODER"
  note: "End-state and timeline UX polish verified: collapse or survival overlays, restart flow, timeline view, and expanded UI state tests all pass."
commit:
  hash: "4a1e39cdca6fbb57d22bef0c0ab7b3b03052f996"
  message: "🚧 W6TW3D ui: add end states and timeline replay"
comments:
  -
    author: "CODER"
    body: "Start: implementing collapse and survival overlays, timeline replay view, restart controls, and final UI motion polish."
  -
    author: "CODER"
    body: "Verified: Added protocol/carnival/survival outcomes, restart controls, timeline persistence and view, and expanded UI state tests with all checks passing."
events:
  -
    type: "status"
    at: "2026-02-28T16:07:59.689Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: implementing collapse and survival overlays, timeline replay view, restart controls, and final UI motion polish."
  -
    type: "verify"
    at: "2026-02-28T16:10:46.907Z"
    author: "CODER"
    state: "ok"
    note: "End-state and timeline UX polish verified: collapse or survival overlays, restart flow, timeline view, and expanded UI state tests all pass."
  -
    type: "status"
    at: "2026-02-28T16:11:29.874Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Added protocol/carnival/survival outcomes, restart controls, timeline persistence and view, and expanded UI state tests with all checks passing."
doc_version: 2
doc_updated_at: "2026-02-28T16:11:29.874Z"
doc_updated_by: "CODER"
description: "Implement protocol/carnival collapse screens, survival state, restart flow, timeline replay page, responsive behavior, and final UX polish aligned with product requirements."
id_source: "generated"
---
## Summary

Implement collapse/survival end states, timeline view, and final responsive UX polish for the gameplay shell.

## Scope

In scope: protocol/carnival collapse overlays, survival state, restart controls, timeline page/view, and final responsive polish. Out of scope: full visual asset generation by backend runtime.

## Plan

1. Extend UI state model with end-state evaluation for protocol collapse, carnival collapse, and survival.

## Risks

- Risk: outcome thresholds in UI shell may diverge from backend engine thresholds.

## Verify Steps

1. Run `node --test` and confirm end-state/timeline tests pass.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T16:10:46.907Z — VERIFY — ok

By: CODER

Note: End-state and timeline UX polish verified: collapse or survival overlays, restart flow, timeline view, and expanded UI state tests all pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T16:10:37.051Z, excerpt_hash=sha256:3bfdd630b5c96a128601d1d56827c7150ae70ec04f56b44a59896aafab11a3fd

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

1. Revert end-state/timeline commit(s).

## Context

Core gameplay UI flow is complete. This task finalizes user-facing outcomes, replay/timeline visibility, and transition polish required before reliability hardening and QA handoff.

## Notes

### Approvals / Overrides
