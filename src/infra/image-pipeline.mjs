import { saveImageBase64 } from "./image-storage.mjs";

const extractImageBase64 = (payload) => {
  if (payload?.data?.[0]?.b64_json) {
    return payload.data[0].b64_json;
  }
  if (payload?.images?.[0]?.b64_json) {
    return payload.images[0].b64_json;
  }
  throw new Error("Image provider response does not contain base64 image data.");
};

export const buildContinuityPrompt = ({ basePrompt, worldPack, previousImageHint }) => {
  const anchors = worldPack.prompt.persistentAnchors.join(", ");
  const style = worldPack.prompt.style.join(", ");
  const continuity = worldPack.prompt.continuityRules.join(", ");
  const negative = worldPack.prompt.negativeConstraints.join(", ");

  const previousClause = previousImageHint
    ? `Preserve continuity with previous frame reference: ${previousImageHint}.`
    : "Preserve continuity with prior city state and avoid abrupt scene changes.";

  return [
    basePrompt,
    `Persistent anchors: ${anchors}.`,
    `Style anchors: ${style}.`,
    `${previousClause}`,
    `Continuity constraints: ${continuity}.`,
    `Negative constraints: ${negative}.`
  ].join(" ");
};

export const createImagePipeline = ({
  apiKey,
  baseUrl = "https://openrouter.ai/api/v1",
  model = "openai/gpt-5-image",
  assetsDir = "storage/images",
  publicAssetsBaseUrl = "/assets",
  fetchFn = fetch
}) => {
  const renderTurnImage = async ({
    worldPack,
    gameId,
    turnIndex,
    imagePrompt,
    previousImageHint = null,
    seed = null
  }) => {
    if (!apiKey || !apiKey.trim()) {
      throw new Error("OPENROUTER_API_KEY is required for image generation.");
    }
    const finalPrompt = buildContinuityPrompt({
      basePrompt: imagePrompt,
      worldPack,
      previousImageHint
    });

    const response = await fetchFn(`${baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        prompt: finalPrompt,
        size: "1024x1024",
        seed: seed ?? undefined
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Image generation failed (${response.status}): ${text}`);
    }

    const payload = await response.json();
    const b64 = extractImageBase64(payload);
    const saved = saveImageBase64({
      baseDir: assetsDir,
      gameId,
      turnIndex,
      extension: "png",
      b64Data: b64
    });

    const imageUrl = `${publicAssetsBaseUrl.replace(/\/$/, "")}/${saved.filename}`;

    return {
      imagePrompt: finalPrompt,
      imageUrl,
      imagePath: saved.absolutePath,
      raw: payload
    };
  };

  return {
    renderTurnImage
  };
};
