import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
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
    explanation: "The card introduces controlled absurdity."
  },
  new_state: {
    absurdity_index: 0.58,
    dominant_direction: "carnival",
    active_motifs: [{ name: "avian_governance", strength: 0.74, direction: "carnival" }],
    coherence_level: 0.79
  },
  image_prompt: "Photorealistic city square with subtle avian governance signs."
};

test("game service persists turn and returns timeline", () => {
  const tempDir = mkdtempSync(join(tmpdir(), "city-too-much-db-"));
  const dbPath = join(tempDir, "game.db");
  const worldPack = loadDefaultWorldPack();
  const store = createSqliteStore({ dbPath });
  const service = createGameService({ store, worldPack });

  try {
    const { game } = service.createGame({ seed: "seed-01" });
    assert.equal(game.world_id, "the-city-of-too-much");
    assert.equal(game.current_turn, 0);

    const played = service.playTurn({
      gameId: game.game_id,
      card: worldPack.cards[0],
      judgeResult,
      imagePrompt: judgeResult.image_prompt,
      imageUrl: "/assets/game-01-turn-001.png"
    });

    assert.equal(played.game.current_turn, 1);
    assert.equal(played.turn.turn_index, 1);

    const history = service.getHistory(game.game_id);
    assert.equal(history.length, 1);
    assert.equal(history[0].card.id, worldPack.cards[0].id);

    const timeline = service.getTimeline(game.game_id);
    assert.equal(timeline.length, 1);
    assert.equal(timeline[0].imageUrl, "/assets/game-01-turn-001.png");
  } finally {
    store.close();
    rmSync(tempDir, { recursive: true, force: true });
  }
});
