# Stage-Ready Package

This document captures the current stage-ready status of **The City of Too Much**.

## Included Deliverables

- World-pack contract and default English pack (`worlds/`).
- Domain engine for history-based turn progression (`src/domain/game-engine.mjs`).
- Stateless judge adapter (`src/infra/openrouter-judge.mjs`).
- Image pipeline with local asset persistence (`src/infra/image-pipeline.mjs`).
- SQLite persistence with migrations (`db/migrations/`, `src/infra/sqlite-store.mjs`).
- Game lifecycle service layer (`src/api/game-service.mjs`).
- Gameplay UI shell and timeline views (`ui/`).
- Reliability safeguards (`src/infra/reliability.mjs`).
- Node HTTP runtime server with game lifecycle endpoints (`src/server.mjs`).

## Readiness Status

- `code`: implemented and covered by automated tests.
- `verification`: full suite executed and passing.
- `documentation`: setup/runbook/verification matrix available.
- `runtime`: local start and API smoke checks validated.

## Known Limitations

- `node:sqlite` is currently experimental in Node and emits runtime warnings.
- Runtime server is Node HTTP based; framework migration remains optional.
- Live model-provider integration requires valid OpenRouter credentials in environment.

## Next Deployment-Oriented Steps

1. Wire HTTP runtime endpoints to the existing game service and adapters.
2. Enable network-approved integration tests against live model providers.
3. Add CI workflow for test/lint/bootstrap checks on pull requests.
4. Harden asset storage and retention strategy for production volume.
