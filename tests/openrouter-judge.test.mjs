import test from "node:test";
import assert from "node:assert/strict";
import { createOpenRouterJudge, JudgeValidationError } from "../src/infra/openrouter-judge.mjs";
import { buildJudgeMessages } from "../src/domain/judge-prompt.mjs";
import { loadDefaultWorldPack } from "../src/infra/world-pack-loader.mjs";

const proposal = {
  worldId: "the-city-of-too-much",
  history: ["A regulation of public behavior in the central square is introduced."],
  newCard: "Pigeons receive the right to attend council meetings."
};

const validJudgeJson = {
  reconstructed_state_before: {
    absurdity_index: 0.5,
    dominant_direction: "balanced",
    active_motifs: [],
    coherence_level: 0.8
  },
  evaluation: {
    direction_shift: 1,
    intensity: 2,
    coherence_delta: 0,
    explanation: "Reinforces avian governance while maintaining coherence."
  },
  new_state: {
    absurdity_index: 0.62,
    dominant_direction: "carnival",
    active_motifs: [{ name: "avian_governance", strength: 0.72, direction: "carnival" }],
    coherence_level: 0.76
  },
  image_prompt: "Photorealistic city square with emerging avian governance motif."
};

test("buildJudgeMessages produces deterministic two-message payload", () => {
  const worldPack = loadDefaultWorldPack();
  const messages = buildJudgeMessages(worldPack, proposal);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].role, "system");
  assert.equal(messages[1].role, "user");
  assert.equal(messages[1].content.includes("HISTORY:"), true);
  assert.equal(messages[1].content.includes("NEW CARD:"), true);
});

test("createOpenRouterJudge parses valid JSON response", async () => {
  const worldPack = loadDefaultWorldPack();
  const fetchFn = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [
        {
          message: {
            content: JSON.stringify(validJudgeJson)
          }
        }
      ]
    })
  });

  const judge = createOpenRouterJudge({
    apiKey: "test-key",
    fetchFn
  });

  const result = await judge.evaluateTurn(proposal, worldPack);
  assert.equal(result.judgeResult.new_state.dominant_direction, "carnival");
});

test("createOpenRouterJudge rejects malformed schema", async () => {
  const worldPack = loadDefaultWorldPack();
  const fetchFn = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [
        {
          message: {
            content: JSON.stringify({
              new_state: {
                absurdity_index: 2,
                dominant_direction: "",
                coherence_level: -1
              },
              image_prompt: ""
            })
          }
        }
      ]
    })
  });

  const judge = createOpenRouterJudge({
    apiKey: "test-key",
    fetchFn
  });

  await assert.rejects(
    () => judge.evaluateTurn(proposal, worldPack),
    (error) => error instanceof JudgeValidationError
  );
});

test("createOpenRouterJudge normalizes common gpt-5-mini shape drift", async () => {
  const worldPack = loadDefaultWorldPack();
  const fetchFn = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [
        {
          message: {
            content: JSON.stringify({
              reconstructed_state_before: "text snapshot",
              evaluation: {
                absurdity_index: 0.45,
                coherence_level: 0.85,
                dominant_direction: "bureaucratization"
              },
              new_state: "prose that should not be here",
              image_prompt: "Photorealistic city square with subtle bureaucratic drift."
            })
          }
        }
      ]
    })
  });

  const judge = createOpenRouterJudge({
    apiKey: "test-key",
    fetchFn
  });

  const result = await judge.evaluateTurn(proposal, worldPack);
  assert.equal(result.judgeResult.new_state.absurdity_index, 0.45);
  assert.equal(result.judgeResult.new_state.coherence_level, 0.85);
  assert.equal(result.judgeResult.new_state.dominant_direction, "protocol");
});
