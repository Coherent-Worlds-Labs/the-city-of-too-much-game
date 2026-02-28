import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateWorldPack } from "../domain/world-pack.mjs";

export const DEFAULT_WORLD_PACK_PATH = "worlds/the-city-of-too-much.en.json";

export const loadWorldPackFromPath = (pathToPack) => {
  const absolutePath = resolve(pathToPack);
  const raw = readFileSync(absolutePath, "utf8");
  const parsed = JSON.parse(raw);
  const validation = validateWorldPack(parsed);

  if (!validation.ok) {
    const error = new Error(`Invalid world pack at ${pathToPack}`);
    error.details = validation.errors;
    throw error;
  }

  return parsed;
};

export const loadDefaultWorldPack = () => loadWorldPackFromPath(DEFAULT_WORLD_PACK_PATH);
