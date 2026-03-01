---
id: "202603010003-KYDN19"
title: "Complete epstein-island world-pack structure and language separation"
result_summary: "Epstein Island EN/RU packs now fully match required schema and locale content."
status: "DONE"
priority: "high"
owner: "CODER"
depends_on: []
tags:
  - "data"
verify: []
plan_approval:
  state: "approved"
  updated_at: "2026-03-01T00:04:22.152Z"
  updated_by: "ORCHESTRATOR"
  note: "Approved: schema parity and locale separation updates for Epstein Island packs."
verification:
  state: "ok"
  updated_at: "2026-03-01T00:05:30.290Z"
  updated_by: "CODER"
  note: "Completed schema parity: added missing prompt in epstein-island.en.json and added ui.statusLabels/ui.actionLabels/ui.loadingStages in both en/ru files; localized ru prompt to Russian and kept en English. Verification passed: node scripts/lint.mjs, node --test (34/34), and direct load checks for both packs."
commit:
  hash: "0e37e86e50717bba6bd2e80ef4ba1d675f9d26fc"
  message: "✅ KYDN19 data: complete epstein-island en/ru schema and locale text separation"
comments:
  -
    author: "CODER"
    body: "Start: Updating both epstein-island locale files to complete schema fields and restore strict en/ru language separation, then running full validation."
  -
    author: "CODER"
    body: "Verified: Added missing prompt and UI subfields to align with world-pack structure, localized RU prompt content, and confirmed EN/RU language separation. All checks passed including lint, tests, and direct pack loading for both locale files."
events:
  -
    type: "status"
    at: "2026-03-01T00:04:28.805Z"
    author: "CODER"
    from: "TODO"
    to: "DOING"
    note: "Start: Updating both epstein-island locale files to complete schema fields and restore strict en/ru language separation, then running full validation."
  -
    type: "verify"
    at: "2026-03-01T00:05:30.290Z"
    author: "CODER"
    state: "ok"
    note: "Completed schema parity: added missing prompt in epstein-island.en.json and added ui.statusLabels/ui.actionLabels/ui.loadingStages in both en/ru files; localized ru prompt to Russian and kept en English. Verification passed: node scripts/lint.mjs, node --test (34/34), and direct load checks for both packs."
  -
    type: "status"
    at: "2026-03-01T00:05:54.809Z"
    author: "CODER"
    from: "DOING"
    to: "DONE"
    note: "Verified: Added missing prompt and UI subfields to align with world-pack structure, localized RU prompt content, and confirmed EN/RU language separation. All checks passed including lint, tests, and direct pack loading for both locale files."
doc_version: 2
doc_updated_at: "2026-03-01T00:05:54.809Z"
doc_updated_by: "CODER"
description: "Align epstein-island.en.json and epstein-island.ru.json with the-city-of-too-much schema: add missing prompt/ui subfields and keep en/ru content language-consistent."
id_source: "generated"
---
## Summary

Bring Epstein Island world packs (en/ru) to full schema parity with the existing world-pack contract and fix language separation between locale files.

## Scope

In scope: worlds/epstein-island.en.json and worlds/epstein-island.ru.json only. Out of scope: engine logic, validators, UI code, and other world packs.

## Plan

1) Compare epstein-island.* against the-city-of-too-much schema and enumerate missing fields. 2) Add missing top-level prompt in epstein-island.en.json and add missing ui labels/loading stages in both locale files. 3) Ensure en content stays English and ru content stays Russian (including prompt strings). 4) Run lint and tests plus a direct world-pack load check for both files. 5) Commit and finish task.

## Risks

Risk: introducing malformed JSON or inconsistent prompt/ui keys could break world-pack loading. Mitigation: mirror the established schema shape and validate by loading both packs after edits.

## Verify Steps

1) node scripts/lint.mjs passes. 2) node --test passes. 3) node one-off check loads both worlds/epstein-island.en.json and worlds/epstein-island.ru.json and confirms required fields prompt/ui.statusLabels/ui.actionLabels/ui.loadingStages are present.

## Verification

### Plan

### Results

<!-- BEGIN VERIFICATION RESULTS -->
#### 2026-03-01T00:05:30.290Z — VERIFY — ok

By: CODER

Note: Completed schema parity: added missing prompt in epstein-island.en.json and added ui.statusLabels/ui.actionLabels/ui.loadingStages in both en/ru files; localized ru prompt to Russian and kept en English. Verification passed: node scripts/lint.mjs, node --test (34/34), and direct load checks for both packs.

VerifyStepsRef: doc_version=2, doc_updated_at=2026-03-01T00:04:28.805Z, excerpt_hash=sha256:12e7ff50b879b245b78affd3e751f22beaca83b1d4fcd801ddf46b831e780976

<!-- END VERIFICATION RESULTS -->

## Rollback Plan

Revert the task commit to restore previous world-pack JSON files if schema or localization regression is detected.

## Context

Current epstein-island.en.json misses top-level prompt and both en/ru files miss ui.statusLabels, ui.actionLabels, ui.loadingStages. RU prompt currently contains English text, causing locale mixing.
