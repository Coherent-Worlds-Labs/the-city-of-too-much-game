import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createRuntimeApi } from "../src/api/runtime-api.mjs";
import { createSqliteStore } from "../src/infra/sqlite-store.mjs";
import { createTurnDedupeCache, createInMemoryRateLimiter } from "../src/infra/reliability.mjs";
import { loadDefaultWorldPack } from "../src/infra/world-pack-loader.mjs";

const judgeResult = {
  reconstructed_state_before: {
    absurdity_index: 0.5,
    dominant_direction: "balanced",
    active_motifs: [],
    coherence_level: 0.82
  },
  evaluation: {
    direction_shift: 1,
    intensity: 2,
    coherence_delta: 0,
    explanation: "Deterministic test evaluation."
  },
  new_state: {
    absurdity_index: 0.57,
    dominant_direction: "carnival",
    active_motifs: [{ name: "avian_governance", strength: 0.7, direction: "carnival" }],
    coherence_level: 0.8
  },
  image_prompt: "Photorealistic square."
};

test("runtime api orchestrates createGame and playTurn", async () => {
  const tempDir = mkdtempSync(join(tmpdir(), "city-runtime-api-"));
  const store = createSqliteStore({ dbPath: join(tempDir, "runtime.db") });
  const worldPack = loadDefaultWorldPack();

  try {
    const runtime = createRuntimeApi({
      store,
      worldPack,
      judge: {
        evaluateTurn: async () => ({ judgeResult })
      },
      imagePipeline: {
        renderTurnImage: async () => ({
          imagePrompt: "rendered prompt",
          imageUrl: "/assets/test-turn.png",
          imagePath: "/tmp/fake.png",
          raw: {}
        })
      },
      reliability: {
        rateLimiter: createInMemoryRateLimiter({ maxRequests: 5, windowMs: 10_000 }),
        dedupeCache: createTurnDedupeCache(),
        maxHistoryEntries: 120
      }
    });

    const created = runtime.createGame();
    assert.equal(created.hand.length, 3);
    const firstCard = created.hand[0];

    const played = await runtime.playTurn({
      gameId: created.game.game_id,
      cardId: firstCard.id,
      expectedTurn: 0
    });

    assert.equal(played.game.current_turn, 1);
    assert.equal(played.turn.card_id, firstCard.id);
    assert.equal(played.timeline.length, 1);
  } finally {
    store.close();
    rmSync(tempDir, { recursive: true, force: true });
  }
});
