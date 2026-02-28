import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createImagePipeline, buildContinuityPrompt } from "../src/infra/image-pipeline.mjs";
import { loadDefaultWorldPack } from "../src/infra/world-pack-loader.mjs";

test("buildContinuityPrompt injects anchors and constraints", () => {
  const worldPack = loadDefaultWorldPack();
  const prompt = buildContinuityPrompt({
    basePrompt: "Photorealistic city square with avian officials.",
    worldPack,
    previousImageHint: "town hall clock tower unchanged"
  });

  assert.equal(prompt.includes("Persistent anchors:"), true);
  assert.equal(prompt.includes("Negative constraints:"), true);
  assert.equal(prompt.includes("town hall clock tower unchanged"), true);
});

test("createImagePipeline stores rendered image and returns URL", async () => {
  const worldPack = loadDefaultWorldPack();
  const tempDir = mkdtempSync(join(tmpdir(), "city-too-much-img-"));
  const fakePngBase64 = Buffer.from("fake-png-bytes").toString("base64");

  const calls = [];
  const fetchFn = async (url, init) => {
    calls.push({ url, init });
    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [
          {
            message: {
              images: [
                {
                  image_url: {
                    url: `data:image/png;base64,${fakePngBase64}`
                  }
                }
              ]
            }
          }
        ]
      })
    };
  };

  try {
    const pipeline = createImagePipeline({
      apiKey: "test-key",
      fetchFn,
      assetsDir: tempDir,
      publicAssetsBaseUrl: "/assets"
    });

    const result = await pipeline.renderTurnImage({
      worldPack,
      gameId: "game-01",
      turnIndex: 3,
      imagePrompt: "Photorealistic city square.",
      previousImageHint: "keep same central fountain"
    });

    assert.equal(result.imageUrl.endsWith("game-01-turn-003.png"), true);
    const bytes = readFileSync(result.imagePath);
    assert.equal(bytes.length > 0, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url.endsWith("/chat/completions"), true);
    const body = JSON.parse(calls[0].init.body);
    assert.equal(body.image_config.aspect_ratio, "16:9");
    assert.equal(body.size, "768x432");
    assert.equal(body.image_config.quality, "low");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
