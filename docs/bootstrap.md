# Bootstrap Architecture

This document defines the initial project layout created in task `202602281520-REWVY0`.

## Goals

- Provide deterministic directories for frontend, API, domain, and infrastructure code.
- Keep bootstrap steps offline-safe and reproducible.
- Prepare scripts used by later tasks and CI.

## Topology

- `src/app`: frontend application shell and UI composition.
- `src/api`: server endpoints and request handling.
- `src/domain`: game rules and semantic state logic.
- `src/infra`: storage/model provider adapters and runtime config.
- `scripts`: repository-level quality/build helper scripts.
- `tests`: bootstrap and regression tests.
- `worlds`: replaceable world-pack files containing world-specific content.
- `db/migrations`: SQL migrations for persistence schema.
- `ui`: static gameplay shell prototype.

## Toolchain Scripts

- `npm run check:bootstrap`: verifies required paths and scripts.
- `npm run lint`: runs baseline lint checks.
- `npm run typecheck`: TypeScript strict check (requires dependencies installed).
- `npm run test`: node native test runner.
- `npm run build`: creates a placeholder build artifact in `dist/`.

## Environment

Environment variables are declared in `.env.example`. Downstream tasks may extend this list when integrations are implemented.
