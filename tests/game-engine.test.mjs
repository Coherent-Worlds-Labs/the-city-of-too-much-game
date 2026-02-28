import test from "node:test";
import assert from "node:assert/strict";
import {
  applyTurnResult,
  createSession,
  createTurnProposal,
  validateJudgeResult
} from "../src/domain/game-engine.mjs";

const card = {
  id: "c11",
  group: "fauna",
  text: "Pigeons receive the right to attend council meetings."
};

const judgeResult = {
  reconstructed_state_before: {
    absurdity_index: 0.45,
    dominant_direction: "balanced",
    active_motifs: [],
    coherence_level: 0.82
  },
  evaluation: {
    direction_shift: 1,
    intensity: 2,
    coherence_delta: 0,
    explanation: "Card reinforces avian governance motif."
  },
  new_state: {
    absurdity_index: 0.58,
    dominant_direction: "carnival",
    active_motifs: [{ name: "avian_governance", strength: 0.7, direction: "carnival" }],
    coherence_level: 0.78
  },
  image_prompt: "Photorealistic city square with subtle civic absurdity."
};

test("createTurnProposal uses history and current card text only", () => {
  const session = createSession("the-city-of-too-much");
  const proposal = createTurnProposal(session, card);
  assert.deepEqual(proposal, {
    worldId: "the-city-of-too-much",
    history: [],
    newCard: "Pigeons receive the right to attend council meetings."
  });
});

test("applyTurnResult appends turn and keeps session active when thresholds are safe", () => {
  const session = createSession("the-city-of-too-much");
  const applied = applyTurnResult(session, card, judgeResult);
  assert.equal(applied.session.turnIndex, 1);
  assert.equal(applied.session.status, "active");
  assert.equal(applied.session.history.length, 1);
  assert.equal(applied.turnRecord.turnIndex, 1);
});

test("applyTurnResult collapses on protocol edge", () => {
  const session = createSession("the-city-of-too-much");
  const protocolJudge = {
    ...judgeResult,
    new_state: {
      ...judgeResult.new_state,
      absurdity_index: 0.05
    }
  };
  const applied = applyTurnResult(session, card, protocolJudge);
  assert.equal(applied.session.status, "collapsed");
  assert.equal(applied.session.outcome, "protocol-collapse");
});

test("applyTurnResult resolves survival when target turn count is reached", () => {
  const session = createSession("the-city-of-too-much", {
    epsilon: 0.1,
    minCoherence: 0.3,
    targetTurnsForSurvival: 1
  });
  const applied = applyTurnResult(session, card, judgeResult);
  assert.equal(applied.session.status, "survived");
  assert.equal(applied.session.outcome, "continuation-survived");
});

test("validateJudgeResult rejects malformed payload", () => {
  const result = validateJudgeResult({
    new_state: {
      absurdity_index: 4,
      coherence_level: -1,
      dominant_direction: ""
    },
    image_prompt: ""
  });
  assert.equal(result.ok, false);
  assert.equal(result.errors.length > 0, true);
});
