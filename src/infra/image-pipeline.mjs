import { saveImageBase64 } from "./image-storage.mjs";
import { logDebugDetails, logDebugHeadline } from "./debug-log.mjs";

const extractBase64FromDataUrl = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const marker = "base64,";
  const markerIndex = value.indexOf(marker);
  if (markerIndex < 0) {
    return null;
  }
  return value.slice(markerIndex + marker.length);
};

const extractImageBase64 = (payload) => {
  const messageImageUrl = payload?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  const fromDataUrl = extractBase64FromDataUrl(messageImageUrl);
  if (fromDataUrl) {
    return fromDataUrl;
  }
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
  aspectRatio = "16:9",
  outputSize = "768x432",
  quality = "low",
  assetsDir = "storage/images",
  publicAssetsBaseUrl = "/assets",
  fetchFn = fetch,
  debug = false
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
    const requestBody = {
      model,
      messages: [
        {
          role: "user",
          content: finalPrompt
        }
      ],
      modalities: ["image", "text"],
      size: outputSize,
      image_config: {
        aspect_ratio: aspectRatio,
        quality
      },
      seed: seed ?? undefined
    };

    if (debug) {
      logDebugHeadline("openrouter:image", `request model=${model}`);
      logDebugDetails("request payload", requestBody);
    }

    const response = await fetchFn(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const text = await response.text();
      if (debug) {
        logDebugHeadline("openrouter:image", `response status=${response.status}`);
        logDebugDetails("response body", text);
      }
      throw new Error(`Image generation failed (${response.status}): ${text}`);
    }

    const payload = await response.json();
    if (debug) {
      logDebugHeadline("openrouter:image", `response status=${response.status}`);
      logDebugDetails("response payload", payload);
    }
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
