# Mathematical Model

This article defines the formal game model for **The City of Too Much** and maps each formal element to the current implementation.

## 1. State Space

At turn $t$, the game state is:

$$
G_t = (H_t, J_t, \sigma_t)
$$

Where:

- $H_t$: ordered card history up to turn $t$
- $J_t$: latest judge-derived semantic snapshot (`new_state`)
- $\sigma_t$: session status (`active`, `collapsed`, `survived`)

### 1.1 History

$$
H_t = [c_1, c_2, \dots, c_t]
$$

Each $c_i$ is a textual card event.  
Cards have no fixed scalar weights.

Implementation:

- `createTurnProposal` uses full textual history: `src/domain/game-engine.mjs`

### 1.2 Judge Snapshot

$$
J_t = (a_t, k_t, d_t, M_t)
$$

Where:

- $a_t \in [0,1]$: `absurdity_index`
- $k_t \in [0,1]$: `coherence_level`
- $d_t \in \{\text{protocol},\text{carnival},\text{balanced}\}$: `dominant_direction`
- $M_t$: set/list of active motifs

Implementation:

- Judge output contract + validation:
  - `src/domain/judge-prompt.mjs`
  - `src/domain/game-engine.mjs` (`validateJudgeResult`)

## 2. Stateless Transition Function

Game progression is a stateless semantic transition:

$$
T(H_t, c_{t+1}) \rightarrow J_{t+1}
$$

Judge input:

- full $H_t$
- new card $c_{t+1}$

Judge output:

- `new_state` (formalized as $J_{t+1}$)
- `image_prompt`

Then persisted game state becomes:

$$
G_{t+1} = (H_t \cup [c_{t+1}], J_{t+1}, \sigma_{t+1})
$$

Implementation:

- Runtime orchestration: `src/api/runtime-api.mjs` (`playTurn`)
- State apply + persistence: `src/domain/game-engine.mjs`, `src/api/game-service.mjs`

## 3. Outcome Function

Outcome status is computed from $J_t$ and turn index $t$:

Constants (current engine defaults):

- $\epsilon = 0.12$
- $k_{\min} = 0.35$
- $T_{\text{survival}} = 12$

Rules:

1. Incoherence collapse:

$$
k_t < k_{\min}
\Rightarrow \sigma_t = \text{collapsed},\ \omega_t = \text{incoherence-collapse}
$$

2. Protocol collapse:

$$
a_t \le \epsilon
\Rightarrow \sigma_t = \text{collapsed},\ \omega_t = \text{protocol-collapse}
$$

3. Carnival collapse:

$$
a_t \ge 1-\epsilon
\Rightarrow \sigma_t = \text{collapsed},\ \omega_t = \text{carnival-collapse}
$$

4. Survival:

$$
t \ge T_{\text{survival}}
\Rightarrow \sigma_t = \text{survived},\ \omega_t = \text{continuation-survived}
$$

5. Otherwise:

$$
\sigma_t = \text{active}
$$

Implementation:

- `evaluateOutcome`: `src/domain/game-engine.mjs`

## 4. Axis Interpretation

UI direction is a piecewise interpretation of absurdity:

$$
d^{ui}_t=
\begin{cases}
\text{protocol}, & a_t \le 0.4 \\
\text{carnival}, & a_t \ge 0.6 \\
\text{balanced}, & \text{otherwise}
\end{cases}
$$

Implementation:

- `toDirection`: `ui/main.js`

Note:

- UI thresholds (`0.4`, `0.6`) are presentation thresholds.
- Collapse thresholds (`0.12`, `0.88`) are game-outcome thresholds.

## 5. Image Continuity Function

Rendered scene prompt is an augmented continuity function:

$$
P_t = F(p^{judge}_t, A, S, C, N, E_t, d_t, a_t)
$$

Where:

- $p^{judge}_t$: judge-produced `image_prompt`
- $A$: persistent world anchors
- $S$: style anchors
- $C$: continuity constraints
- $N$: negative constraints
- $E_t$: compressed evolution trail from recent turns
- $d_t, a_t$: direction and absurdity axis controls

Implementation:

- Continuity prompt builder: `src/infra/image-pipeline.mjs` (`buildContinuityPrompt`)
- Evolution trail extractor: `src/api/runtime-api.mjs` (`buildHistoryContext`)

## 6. Deterministic and Non-Deterministic Components

Deterministic:

- hand rotation schedule (3 cards/turn)
- status thresholds and outcome resolution
- persistence and timeline ordering

Non-deterministic / model-dependent:

- semantic interpretation by judge model
- image synthesis output for a given prompt

Implementation:

- deterministic hand provider: `src/api/runtime-api.mjs` (`createHandProvider`)

## 7. Invariants

Core invariants preserved by implementation:

1. Turn cannot be applied to non-active sessions.
2. Judge response must satisfy strict schema before acceptance.
3. History is append-only per accepted turn.
4. Outcome is recomputed from judge `new_state` and engine constants.
5. World-specific semantics come from world-pack data, not hardcoded runtime text.

Implementation:

- `src/domain/game-engine.mjs`
- `src/api/game-service.mjs`
- `worlds/the-city-of-too-much.en.json`

