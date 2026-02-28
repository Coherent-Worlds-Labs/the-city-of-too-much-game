import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  createInMemoryRateLimiter,
  createTurnDedupeCache,
  enforceHistoryLimit
} from "../src/infra/reliability.mjs";
import { createSqliteStore } from "../src/infra/sqlite-store.mjs";
import { createGameService } from "../src/api/game-service.mjs";
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
    absurdity_index: 0.58,
    dominant_direction: "carnival",
    active_motifs: [{ name: "avian_governance", strength: 0.74, direction: "carnival" }],
    coherence_level: 0.79
  },
  image_prompt: "Photorealistic city square with test motif."
};

test("in-memory rate limiter blocks above max requests", () => {
  const limiter = createInMemoryRateLimiter({
    maxRequests: 2,
    windowMs: 10_000,
    nowFn: () => 1000
  });
  assert.equal(limiter.check("g1").allowed, true);
  assert.equal(limiter.check("g1").allowed, true);
  assert.equal(limiter.check("g1").allowed, false);
});

test("enforceHistoryLimit throws on oversized history", () => {
  assert.throws(
    () => enforceHistoryLimit(new Array(3), 2),
    /history limit exceeded/
  );
});

test("game service deduplicates repeated turn requests", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "city-too-much-reliability-"));
  const dbPath = join(tempDir, "game.db");
  const worldPack = loadDefaultWorldPack();
  const store = createSqliteStore({ dbPath });
  const dedupeCache = createTurnDedupeCache();
  const service = createGameService({
    store,
    worldPack,
    reliability: {
      rateLimiter: null,
      dedupeCache,
      maxHistoryEntries: 50
    }
  });

  try {
    const { game } = service.createGame();
    const payload = {
      gameId: game.game_id,
      card: worldPack.cards[0],
      judgeResult,
      imagePrompt: judgeResult.image_prompt,
      imageUrl: "/assets/turn-001.png",
      expectedTurn: 0
    };

    const first = service.playTurn(payload);
    const second = service.playTurn(payload);
    const turns = store.getTurns(game.game_id);

    assert.equal(first.turn.turn_index, 1);
    assert.equal(second.turn.turn_index, 1);
    assert.equal(turns.length, 1);
  } finally {
    store.close();
    rmSync(tempDir, { recursive: true, force: true });
  }
});
