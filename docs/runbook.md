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

## Manual UI Smoke

1. Open `ui/index.html` in a local static server context.
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
