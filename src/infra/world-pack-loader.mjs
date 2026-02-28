import { readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { validateWorldPack } from "../domain/world-pack.mjs";

export const WORLD_PACKS_DIR = "worlds";
export const DEFAULT_WORLD_PACK_FILE = "the-city-of-too-much.en.json";

const normalizeWorldPackFile = (candidate) => {
  if (typeof candidate !== "string" || candidate.trim().length === 0) {
    return DEFAULT_WORLD_PACK_FILE;
  }
  return basename(candidate.trim());
};

export const resolveDefaultWorldPackPath = (worldPackFile = process.env.WORLD_PACK_FILE) =>
  join(WORLD_PACKS_DIR, normalizeWorldPackFile(worldPackFile));

export const DEFAULT_WORLD_PACK_PATH = resolveDefaultWorldPackPath();

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

export const loadDefaultWorldPack = () => loadWorldPackFromPath(resolveDefaultWorldPackPath());
