# Stage-Ready Package

This document captures the current stage-ready status of **The City of Too Much**.

## Included Deliverables

- World-pack contract and default English pack (`worlds/`).
- Domain engine for history-based turn progression (`src/domain/game-engine.mjs`).
- Stateless judge adapter (`src/infra/openrouter-judge.mjs`).
- Image pipeline with local asset persistence (`src/infra/image-pipeline.mjs`).
- SQLite persistence with migrations (`db/migrations/`, `src/infra/sqlite-store.mjs`).
- Game lifecycle service layer (`src/api/game-service.mjs`).
- Gameplay UI shell and timeline prototype (`ui/`).
- Reliability safeguards (`src/infra/reliability.mjs`).

## Readiness Status

- `code`: implemented and covered by automated tests.
- `verification`: full suite executed and passing.
- `documentation`: setup/runbook/verification matrix available.

## Known Limitations

- `node:sqlite` is currently experimental in Node and emits runtime warnings.
- UI is delivered as a static prototype; production web framework integration is a next phase.
- External model calls are adapter-ready but were verified with mocked responses in this run.

## Next Deployment-Oriented Steps

1. Wire HTTP runtime endpoints to the existing game service and adapters.
2. Enable network-approved integration tests against live model providers.
3. Add CI workflow for test/lint/bootstrap checks on pull requests.
4. Harden asset storage and retention strategy for production volume.
