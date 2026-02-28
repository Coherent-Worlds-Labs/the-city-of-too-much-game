# Verification Matrix

| Area | Command / Method | Expected Result | Status |
|---|---|---|---|
| Bootstrap integrity | `node scripts/check-bootstrap.mjs` | Required scaffold paths and scripts are present | Pass |
| Baseline lint | `node scripts/lint.mjs` | No baseline lint violations | Pass |
| Automated suite | `node --test` | All tests pass | Pass |
| Runtime smoke | start server + request `/`, `/styles.css`, `/main.js`, `/api/health`, `/api/games` | Runtime and API respond correctly | Pass |
| World text language | Tracked-file Cyrillic scan | No Cyrillic text in tracked repository files | Pass |
| UI flow smoke | Manual runbook checks | Main gameplay shell and timeline render and update | Pass |

## Residual Risks

- SQLite adapter uses experimental Node module.
- Live model-provider path depends on valid environment credentials.
