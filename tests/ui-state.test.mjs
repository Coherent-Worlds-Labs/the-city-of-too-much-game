import test from "node:test";
import assert from "node:assert/strict";
import { createUiState, drawHand, applyCardToUiState } from "../src/app/ui-state.mjs";
import { loadDefaultWorldPack } from "../src/infra/world-pack-loader.mjs";

test("drawHand returns deterministic card slices", () => {
  const worldPack = loadDefaultWorldPack();
  let state = createUiState(worldPack);
  state = drawHand(state, worldPack, 3);
  assert.equal(state.activeHand.length, 3);
  assert.equal(state.activeHand[0].id, "c01");

  state = drawHand(state, worldPack, 3);
  assert.equal(state.activeHand[0].id, "c04");
});

test("applyCardToUiState updates turn and direction", () => {
  const worldPack = loadDefaultWorldPack();
  let state = createUiState(worldPack);

  state = applyCardToUiState(state, {
    id: "c47",
    group: "fracture",
    text: "Citizens begin reporting identical dreams across districts."
  });

  assert.equal(state.turn, 1);
  assert.equal(state.axis > 0.5, true);
  assert.equal(state.direction, "carnival");
  assert.equal(state.history.length, 1);
});
