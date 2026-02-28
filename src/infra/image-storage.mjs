import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const normalizeBase = (baseDir) => resolve(baseDir ?? "storage/images");

export const saveImageBase64 = ({
  baseDir = "storage/images",
  gameId,
  turnIndex,
  extension = "png",
  b64Data
}) => {
  if (!b64Data || typeof b64Data !== "string") {
    throw new Error("b64Data is required.");
  }

  const root = normalizeBase(baseDir);
  const filename = `${gameId}-turn-${String(turnIndex).padStart(3, "0")}.${extension}`;
  mkdirSync(root, { recursive: true });
  const absolutePath = resolve(root, filename);
  const buffer = Buffer.from(b64Data, "base64");
  writeFileSync(absolutePath, buffer);

  return {
    absolutePath,
    filename
  };
};
