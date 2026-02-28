# Runbook

## Environment

- Node.js 22+
- UTF-8 text files

## Setup

1. Configure environment values from `.env.example`.
2. Ensure writable local paths for DB and assets:
   - `DATABASE_URL`
   - `ASSETS_DIR`

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
   - header and axis indicator render
   - card hand displays world-pack cards
   - enact flow shows two loading stages
   - history and status fields update
3. Trigger multiple turns until an outcome overlay appears.
4. Open `ui/timeline.html` and confirm timeline entries are rendered.

## Troubleshooting

- `rate limit exceeded for playTurn`:
  - increase limiter settings or back off rapid retries.
- `stale turn request`:
  - client sent an outdated expected turn index; refresh state before retry.
- SQLite warnings:
  - expected while `node:sqlite` remains experimental.
