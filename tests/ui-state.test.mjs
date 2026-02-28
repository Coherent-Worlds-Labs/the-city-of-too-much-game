import test from "node:test";
import assert from "node:assert/strict";
import {
  createUiState,
  drawHand,
  applyCardToUiState,
  evaluateUiOutcome,
  createTimelineEntry
} from "../src/app/ui-state.mjs";
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

test("evaluateUiOutcome detects collapse and survival", () => {
  const collapsed = evaluateUiOutcome({
    axis: 0.04,
    stability: "Low",
    turn: 2
  });
  assert.equal(collapsed, "protocol-collapse");

  const survived = evaluateUiOutcome({
    axis: 0.52,
    stability: "High",
    turn: 12
  });
  assert.equal(survived, "survived");
});

test("createTimelineEntry captures card context", () => {
  const entry = createTimelineEntry(
    {
      turn: 3,
      axis: 0.63,
      direction: "carnival",
      mood: "Avian Influence Rising",
      stability: "High"
    },
    { text: "Pigeons are issued official identification tokens." }
  );
  assert.equal(entry.turn, 3);
  assert.equal(entry.cardText.includes("Pigeons"), true);
});
