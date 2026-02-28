import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadDefaultWorldPack } from "../src/infra/world-pack-loader.mjs";

test("default world pack loads successfully", () => {
  const worldPack = loadDefaultWorldPack();
  assert.equal(worldPack.worldId, "the-city-of-too-much");
  assert.equal(worldPack.locale, "en");
  assert.equal(worldPack.cards.length, 50);
});

test("default world pack has unique card ids", () => {
  const worldPack = loadDefaultWorldPack();
  const ids = worldPack.cards.map((card) => card.id);
  const uniqueIds = new Set(ids);
  assert.equal(uniqueIds.size, 50);
});

test("default world pack contains no cyrillic card text", () => {
  const raw = readFileSync("worlds/the-city-of-too-much.en.json", "utf8");
  const parsed = JSON.parse(raw);
  const cyrillicRe = /[\u0400-\u04FF]/u;
  for (const card of parsed.cards) {
    assert.equal(cyrillicRe.test(card.text), false, `card ${card.id} contains cyrillic text`);
  }
});
