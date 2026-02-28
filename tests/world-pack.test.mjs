import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadDefaultWorldPack } from "../src/infra/world-pack-loader.mjs";
import { validateWorldPack } from "../src/domain/world-pack.mjs";

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

test("default world pack defines axis labels", () => {
  const worldPack = loadDefaultWorldPack();
  assert.equal(typeof worldPack.ui?.axisLabels?.left, "string");
  assert.equal(worldPack.ui.axisLabels.left.length > 0, true);
  assert.equal(typeof worldPack.ui?.axisLabels?.right, "string");
  assert.equal(worldPack.ui.axisLabels.right.length > 0, true);
});

test("default world pack contains no cyrillic card text", () => {
  const raw = readFileSync("worlds/the-city-of-too-much.en.json", "utf8");
  const parsed = JSON.parse(raw);
  const cyrillicRe = /[\u0400-\u04FF]/u;
  for (const card of parsed.cards) {
    assert.equal(cyrillicRe.test(card.text), false, `card ${card.id} contains cyrillic text`);
  }
});

test("validator rejects cyrillic card text for english locale", () => {
  const raw = readFileSync("worlds/the-city-of-too-much.en.json", "utf8");
  const parsed = JSON.parse(raw);
  parsed.cards[0].text = "Тест";
  const result = validateWorldPack(parsed);
  assert.equal(result.ok, false);
  assert.match(result.errors.join(" | "), /contains non-English \(Cyrillic\) text/);
});

test("validator allows cyrillic card text for russian locale", () => {
  const raw = readFileSync("worlds/the-city-of-too-much.ru.json", "utf8");
  const parsed = JSON.parse(raw);
  const result = validateWorldPack(parsed);
  assert.equal(result.ok, true, result.errors?.join(" | "));
});
