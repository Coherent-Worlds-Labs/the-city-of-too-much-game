---
id: "202602282031-ZX1S76"
title: "Add direction-aware image prompt escalation for Protocol vs Carnival"
result_summary: "Image prompt now intentionally diverges toward Protocol realism vs Carnival chaos based on game state."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "code"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-02-28T20:32:15.000Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved direction-aware prompt escalation implementation."
verification:
  state: "ok"
  updated_at: "2026-02-28T20:33:19.157Z"
  updated_by: "CODER"
  note: "Verified: Prompt now explicitly escalates toward strict realism on Protocol and chaotic exaggeration on Carnival, using new_state axis values; lint/tests pass."
commit:
  hash: "c360fe0074b2fbae6d839b2b7c18f8d7337df147"
  message: "🚧 ZX1S76 prompt: escalate protocol realism and carnival exaggeration"
comments:
  -
    author: "CODER"
    body: "Start: Implementing protocol-vs-carnival prompt escalation using absurdity and direction state with test coverage."
  -
    author: "CODER"
    body: "Verified: Direction-aware axis directive now amplifies strict realism for Protocol and chaotic exaggeration for Carnival using absurdity signal; lint/tests pass."
events:
  -
    type: "status"
    at: "2026-02-28T20:32:24.329Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Implementing protocol-vs-carnival prompt escalation using absurdity and direction state with test coverage."
  -
    type: "verify"
    at: "2026-02-28T20:33:19.157Z"
    author: "CODER"
    state: "ok"
    note: "Verified: Prompt now explicitly escalates toward strict realism on Protocol and chaotic exaggeration on Carnival, using new_state axis values; lint/tests pass."
  -
    type: "status"
    at: "2026-02-28T20:33:46.302Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Direction-aware axis directive now amplifies strict realism for Protocol and chaotic exaggeration for Carnival using absurdity signal; lint/tests pass."
doc_version: 2
doc_updated_at: "2026-02-28T20:33:46.302Z"
doc_updated_by: "CODER"
description: "Tune image continuity prompt so high Protocol emphasizes strict realism/order, while high Carnival emphasizes chaotic exaggeration, scaled by absurdity index."
id_source: "generated"
---
## Summary

Make image prompt generation explicitly react to Protocol/Carnival direction and absurdity level so visuals become stricter or more exaggerated accordingly.

## Scope


## Plan

1) Extend prompt builder input with new_state signal (absurdity + direction). 2) Add deterministic axis directive text for protocol/carnival with stronger language on extremes. 3) Pass signal from runtime playTurn to image pipeline. 4) Add tests for protocol and carnival prompt clauses. 5) Run lint/tests and record verification.

## Risks

Overly strong prompt can break continuity; mitigate by keeping continuity anchors and photorealism constraints while only adjusting stylistic intensity.

## Verify Steps

1) node scripts/lint.mjs exits 0. 2) node --test exits 0. 3) tests/image-pipeline.test.mjs asserts protocol and carnival directives are present for opposite axis signals.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-02-28T20:33:19.157Z — VERIFY — ok

By: CODER

Note: Verified: Prompt now explicitly escalates toward strict realism on Protocol and chaotic exaggeration on Carnival, using new_state axis values; lint/tests pass.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-02-28T20:32:24.329Z, excerpt_hash=sha256:b0445db39972202237a57377f0d87f35c93dbf7a152a9182f8d53d6ddfd13974

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert this task commits to restore prior neutral continuity prompt behavior.
