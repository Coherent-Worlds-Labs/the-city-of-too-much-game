# Runbook

## Environment

- Node.js 22+
- UTF-8 text files

## Setup

1. Configure environment values from `.env.example`.
2. Ensure writable local paths for DB and assets:
   - `DATABASE_URL`
   - `ASSETS_DIR`
3. Cost-control image defaults:
   - `IMAGE_OUTPUT_SIZE=672x288`
   - `IMAGE_QUALITY=low`
   - `IMAGE_ASPECT_RATIO=21:9`

## Verification Commands

Run from repository root:

```bash
node scripts/check-bootstrap.mjs
node scripts/lint.mjs
node --test
```

## Runtime Start

```bash
npm run start
```

This starts the Node HTTP runtime and API on `APP_PORT` (default `3000`).

To trace outbound OpenRouter requests in server logs, set:

```bash
OPENROUTER_DEBUG=true
```

### Core API Endpoints

- `POST /api/games`
- `POST /api/turn`
- `GET /api/games/:id/history`
- `GET /api/games/:id/timeline`
- `GET /api/health`

## Manual UI Smoke

1. Start runtime with `npm run start`.
2. Open `http://localhost:3000/`.
2. Confirm:
   - bootstrap state is visible while seed scene is generating (spinner + loading text + placeholder cards)
   - initial seed scene is generated at game start (before first card enact)
   - header and axis indicator render
   - card hand displays world-pack cards
   - enact flow shows two loading stages
   - history and status fields update
3. Trigger multiple turns until an outcome overlay appears.

## Troubleshooting

- No activity in OpenRouter dashboard:
  - confirm `OPENROUTER_API_KEY` is set in `.env` and restart runtime;
  - set `OPENROUTER_DEBUG=true` and verify server logs include
    `[openrouter:judge] request ...` and `[openrouter:image] request ...`;
  - image generation is routed via OpenRouter `chat/completions` multimodal API.
  - ensure requests target the correct local port (avoid stale process on `3000`).
- `rate limit exceeded for playTurn`:
  - increase limiter settings or back off rapid retries.
- `stale turn request`:
  - client sent an outdated expected turn index; refresh state before retry.
- SQLite warnings:
  - expected while `node:sqlite` remains experimental.
