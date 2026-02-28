# Gameplay Mechanics Reference

This document is the implementation-grounded mechanics specification for **The City of Too Much**.
It combines design intent from the SOW materials (`sow/*`) with the current runtime behavior in the codebase.

## 1. Core Design Model

The game models a city evolving between two semantic poles:

- `Protocol`: order, regulation, symmetry, institutional over-structure.
- `Carnival`: excess, absurdity, unpredictability, symbolic overload.

The central design principle is **Coherent-World-Continuation (CWC)**:

- A world should remain interpretable and evolving.
- Collapse happens when the city becomes too rigid, too chaotic, or internally incoherent.

## 2. No Fixed Card Weights

Cards do **not** carry hardcoded numeric effects.
Their effect is context-dependent and inferred from accumulated history each turn.

Implementation source:

- Turn proposal uses card text + full prior card history: `src/domain/game-engine.mjs` (`createTurnProposal`).
- Judge is explicitly instructed to evaluate from accumulated motifs only: `src/domain/judge-prompt.mjs`.

## 3. Canonical Turn State

Runtime session state tracks:

- `turnIndex`
- `status` (`active`, `collapsed`, `survived`)
- `outcome` (`protocol-collapse`, `carnival-collapse`, `incoherence-collapse`, `continuation-survived`)
- `history` (card + judge result per turn)
- `latestState` (latest `new_state` from judge)

Implementation source:

- Session and defaults: `src/domain/game-engine.mjs` (`createSession`, `defaultEngineSettings`)

Current engine thresholds:

- `epsilon = 0.12`
- `minCoherence = 0.35`
- `targetTurnsForSurvival = 12`

## 4. Judge Contract (Stateless Semantic Oracle)

Each turn sends:

- `HISTORY` as ordered card texts
- `NEW CARD` as current card text

Judge returns strict JSON with:

- `reconstructed_state_before`
- `evaluation`
- `new_state`:
  - `absurdity_index` in `[0,1]`
  - `coherence_level` in `[0,1]`
  - `dominant_direction` in `{protocol,carnival,balanced}`
  - `active_motifs` array
- `image_prompt` (single concise photorealistic prompt)

Implementation source:

- Prompt builder: `src/domain/judge-prompt.mjs`
- Result validation: `src/domain/game-engine.mjs` (`validateJudgeResult`)

## 5. Outcome Resolution Rules

After judge response, engine resolves the session:

- `coherence_level < 0.35` -> `incoherence-collapse`
- `absurdity_index <= 0.12` -> `protocol-collapse`
- `absurdity_index >= 0.88` -> `carnival-collapse`
- `turnIndex >= 12` while still valid -> `continuation-survived`
- Else remains `active`

Implementation source:

- `src/domain/game-engine.mjs` (`evaluateOutcome`, `applyTurnResult`)

## 6. Runtime Pipeline per Turn

The server-side turn flow:

1. Validate selected card from world pack.
2. Load full game history.
3. Build turn proposal (`history + newCard`).
4. Call judge model for semantic evaluation.
5. Build image request with continuity rules and history trail.
6. Persist turn (judge JSON, prompt, image URL, status).
7. Return updated game + hand + timeline.

Implementation source:

- Orchestration: `src/api/runtime-api.mjs` (`playTurn`)
- Persistence + status transitions: `src/api/game-service.mjs`

## 7. Image Generation Mechanics

### 7.1 Continuity Strategy

Generated prompt is not only the judge `image_prompt`.
It is expanded with continuity scaffolding:

- persistent anchors from world pack
- style anchors
- continuity constraints
- negative constraints
- axis directive (Protocol/Carnival intensity)
- previous-frame continuity hint
- recent multi-turn **Evolution trail** (compressed history context)

Implementation source:

- Prompt composer: `src/infra/image-pipeline.mjs` (`buildContinuityPrompt`)
- History trail builder: `src/api/runtime-api.mjs` (`buildHistoryContext`)

### 7.2 Protocol vs Carnival Escalation

Axis directive is strengthened at extremes:

- protocol-heavy states reinforce disciplined, restrained realism.
- carnival-heavy states exaggerate civic excess while staying photorealistic.

Implementation source:

- `src/infra/image-pipeline.mjs` (`buildAxisDirective`)

### 7.3 Image Request Profile

Current defaults favor lower cost:

- Model: `openai/gpt-5-image`
- Endpoint: `/chat/completions`
- Aspect ratio: `21:9`
- Size: `672x288`
- Quality: `low`
- Modalities: `["image"]` (with fallback `["image","text"]`)
- Optional image-to-image mode using previous local frame

Implementation source:

- `src/infra/image-pipeline.mjs` (`createImagePipeline`)

## 8. UI Mechanics and Player Feedback

### 8.1 Card Flow

- Hand size is 3 cards per turn.
- Hand rotates deterministically from world pack card order.
- `Enact` is disabled during processing and for closed worlds.

Implementation source:

- Hand provider: `src/api/runtime-api.mjs` (`createHandProvider`)
- UI state handling: `ui/main.js`

### 8.2 Processing Stages

Two-stage status messaging:

- `Interpreting the city...`
- `Rendering the new reality...`

Initial game bootstrap stage:

- `Preparing the first city snapshot...`

Implementation source:

- `ui/main.js`

### 8.3 History and Timeline Navigation

- Timeline includes `Genesis` plus every turn image.
- Left/right scene arrows move timeline selection.
- History list auto-scroll is container-local only.
- Selected historical frame updates visual indicators (axis/mood/stability) from that turn.

Implementation source:

- `ui/main.js` (`renderHistory`, `moveSelectedSceneEntry`, `applyVisualStateForSelectedTurn`)

### 8.4 Closed-World UX

- No blocking outcome modal in active UI flow.
- For closed worlds, `City Initiatives` panel shows an inline closure note.
- History remains navigable through all snapshots.

Implementation source:

- `ui/main.js` (`renderCards`, `renderOutcomeOverlay`)

## 9. Session Persistence and Resume Behavior

Client persistence:

- Active game ID in local storage
- Pending turn marker for generation recovery across refresh

Server resilience:

- If game listing endpoint fails, UI can still resume from known active game state.

Implementation source:

- Client logic: `ui/main.js`
- Listing fallback: `src/api/runtime-api.mjs` + UI fallback handling

## 10. World-Pack Driven Content

World-specific content is externalized and replaceable:

- world metadata
- card texts
- anchor/style/continuity/negative prompt constraints

This keeps core mechanics world-agnostic and aligns with the SOW requirement for replaceable worlds.

References:

- World pack contract: `worlds/README.md`
- Default pack: `worlds/the-city-of-too-much.en.json`

## 11. Practical Verification Checklist

Use this checklist to validate mechanics after changes:

1. New turn uses accumulated card history in judge input.
2. Judge output schema stays strict and validated.
3. Collapse/survival thresholds match engine constants.
4. Image prompt includes anchors + continuity + evolution trail.
5. Timeline contains Genesis and all turns.
6. Closed worlds remain viewable without blocking overlays.

