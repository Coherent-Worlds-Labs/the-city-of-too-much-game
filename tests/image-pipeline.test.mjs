import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createImagePipeline, buildContinuityPrompt } from "../src/infra/image-pipeline.mjs";
import { loadDefaultWorldPack } from "../src/infra/world-pack-loader.mjs";

test("buildContinuityPrompt injects compact anchors and constraints", () => {
  const worldPack = loadDefaultWorldPack();
  const prompt = buildContinuityPrompt({
    basePrompt: "Photorealistic city square with avian officials.",
    worldPack,
    previousImageHint: "town hall clock tower unchanged"
  });

  assert.equal(prompt.includes("Anchors:"), true);
  assert.equal(prompt.includes("Avoid:"), true);
  assert.equal(prompt.includes("town hall clock tower unchanged"), true);
});

test("buildContinuityPrompt emphasizes strict realism for protocol direction", () => {
  const worldPack = loadDefaultWorldPack();
  const prompt = buildContinuityPrompt({
    basePrompt: "Photorealistic city square.",
    worldPack,
    previousImageHint: null,
    absurdityIndex: 0.12,
    dominantDirection: "protocol"
  });

  assert.equal(prompt.includes("strict civic order and realism"), true);
  assert.equal(prompt.includes("Avoid whimsical distortions or festive chaos"), true);
});

test("buildContinuityPrompt emphasizes exaggerated chaos for carnival direction", () => {
  const worldPack = loadDefaultWorldPack();
  const prompt = buildContinuityPrompt({
    basePrompt: "Photorealistic city square.",
    worldPack,
    previousImageHint: null,
    absurdityIndex: 0.86,
    dominantDirection: "carnival"
  });

  assert.equal(prompt.includes("exaggerate civic excess and chaotic spectacle"), true);
  assert.equal(prompt.includes("surreal civic rituals"), true);
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
    assert.equal(body.image_config.aspect_ratio, "21:9");
    assert.equal(body.size, "672x288");
    assert.equal(body.image_config.quality, "low");
    assert.deepEqual(body.modalities, ["image"]);
    assert.equal(body.max_tokens, undefined);
    assert.equal(body.reasoning.effort, "low");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("createImagePipeline retries with relaxed payload when first 200 has no image", async () => {
  const worldPack = loadDefaultWorldPack();
  const tempDir = mkdtempSync(join(tmpdir(), "city-too-much-img-fallback-"));
  const fakePngBase64 = Buffer.from("fake-png-bytes").toString("base64");
  const calls = [];

  const fetchFn = async (_url, init) => {
    calls.push(JSON.parse(init.body));
    if (calls.length === 1) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          choices: [
            {
              finish_reason: "length",
              message: {
                role: "assistant",
                content: ""
              }
            }
          ]
        })
      };
    }
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
      publicAssetsBaseUrl: "/assets",
      maxCompletionTokens: 64
    });

    const result = await pipeline.renderTurnImage({
      worldPack,
      gameId: "game-02",
      turnIndex: 1,
      imagePrompt: "Photorealistic city square."
    });

    assert.equal(result.imageUrl.endsWith("game-02-turn-001.png"), true);
    assert.equal(calls.length, 2);
    assert.deepEqual(calls[0].modalities, ["image"]);
    assert.equal(calls[0].max_tokens, 64);
    assert.deepEqual(calls[1].modalities, ["image", "text"]);
    assert.equal(calls[1].max_tokens, undefined);
    assert.equal(calls[1].reasoning, undefined);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("createImagePipeline sends previous frame as image input when image-to-image is enabled", async () => {
  const worldPack = loadDefaultWorldPack();
  const tempDir = mkdtempSync(join(tmpdir(), "city-too-much-img-i2i-"));
  const previousImageBytes = Buffer.from("previous-image-bytes");
  const fakePngBase64 = Buffer.from("new-image-bytes").toString("base64");
  writeFileSync(join(tempDir, "game-03-turn-000.png"), previousImageBytes);

  const calls = [];
  const fetchFn = async (_url, init) => {
    calls.push(JSON.parse(init.body));
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
      publicAssetsBaseUrl: "/assets",
      imageToImageEnabled: true
    });

    await pipeline.renderTurnImage({
      worldPack,
      gameId: "game-03",
      turnIndex: 1,
      imagePrompt: "Photorealistic city square.",
      previousImageUrl: "/assets/game-03-turn-000.png"
    });

    assert.equal(calls.length, 1);
    const userContent = calls[0].messages[0].content;
    assert.equal(Array.isArray(userContent), true);
    assert.equal(userContent[0].type, "text");
    assert.equal(userContent[1].type, "image_url");
    assert.equal(String(userContent[1].image_url.url).startsWith("data:image/png;base64,"), true);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});
