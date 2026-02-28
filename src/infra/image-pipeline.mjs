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

const hasImagePayload = (payload) => {
  const messageImageUrl = payload?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (extractBase64FromDataUrl(messageImageUrl)) {
    return true;
  }
  if (payload?.data?.[0]?.b64_json) {
    return true;
  }
  if (payload?.images?.[0]?.b64_json) {
    return true;
  }
  return false;
};

const normalizeCompactText = (value, maxLength) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

const joinLimited = (items, maxItems = 3, maxLength = 220) =>
  (Array.isArray(items) ? items : [])
    .map((item) => normalizeCompactText(item, 80))
    .filter((item) => item.length > 0)
    .slice(0, maxItems)
    .join(", ")
    .slice(0, maxLength);

export const buildContinuityPrompt = ({ basePrompt, worldPack, previousImageHint }) => {
  const anchors = joinLimited(worldPack.prompt.persistentAnchors, 3, 180);
  const style = joinLimited(worldPack.prompt.style, 2, 140);
  const continuity = joinLimited(worldPack.prompt.continuityRules, 2, 140);
  const negative = joinLimited(worldPack.prompt.negativeConstraints, 2, 140);

  const previousClause = previousImageHint
    ? `Match previous frame: ${normalizeCompactText(previousImageHint, 120)}.`
    : "Keep continuity with prior city state.";

  return [
    normalizeCompactText(basePrompt, 460),
    `Anchors: ${anchors}.`,
    `Style: ${style}.`,
    previousClause,
    `Continuity: ${continuity}.`,
    `Avoid: ${negative}.`
  ].join(" ");
};

export const createImagePipeline = ({
  apiKey,
  baseUrl = "https://openrouter.ai/api/v1",
  model = "openai/gpt-5-image",
  aspectRatio = "21:9",
  outputSize = "672x288",
  quality = "low",
  modalities = ["image"],
  maxCompletionTokens = null,
  reasoningEffort = "low",
  assetsDir = "storage/images",
  publicAssetsBaseUrl = "/assets",
  fetchFn = fetch,
  debug = false
}) => {
  const requestImage = async (requestBody) => {
    const response = await fetchFn(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    return response;
  };

  const buildPrimaryBody = ({ prompt, seed }) => {
    const body = {
      model,
      messages: [{ role: "user", content: prompt }],
      modalities,
      size: outputSize,
      image_config: {
        aspect_ratio: aspectRatio,
        quality
      },
      seed: seed ?? undefined
    };
    if (Number.isInteger(maxCompletionTokens) && maxCompletionTokens > 0) {
      body.max_tokens = maxCompletionTokens;
    }
    if (typeof reasoningEffort === "string" && reasoningEffort.trim().length > 0) {
      body.reasoning = { effort: reasoningEffort.trim() };
    }
    return body;
  };

  const buildRelaxedFallbackBody = (requestBody) => {
    const body = {
      ...requestBody,
      modalities: ["image", "text"]
    };
    delete body.max_tokens;
    delete body.reasoning;
    return body;
  };

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
    const requestBody = buildPrimaryBody({ prompt: finalPrompt, seed });

    if (debug) {
      logDebugHeadline("openrouter:image", `request model=${model}`);
      logDebugDetails("request payload", requestBody);
    }

    let response = await requestImage(requestBody);

    if (!response.ok && (response.status === 400 || response.status === 422)) {
      const fallbackBody = buildRelaxedFallbackBody(requestBody);
      response = await requestImage(fallbackBody);
      if (debug) {
        logDebugHeadline("openrouter:image", "fallback request applied due to provider validation error");
        logDebugDetails("fallback payload", fallbackBody);
      }
    }

    if (!response.ok) {
      const text = await response.text();
      if (debug) {
        logDebugHeadline("openrouter:image", `response status=${response.status}`);
        logDebugDetails("response body", text);
      }
      throw new Error(`Image generation failed (${response.status}): ${text}`);
    }

    let payload = await response.json();
    if (debug) {
      logDebugHeadline("openrouter:image", `response status=${response.status}`);
      logDebugDetails("response payload", payload);
    }
    if (!hasImagePayload(payload)) {
      const fallbackBody = buildRelaxedFallbackBody(requestBody);
      const fallbackResponse = await requestImage(fallbackBody);
      if (!fallbackResponse.ok) {
        const text = await fallbackResponse.text();
        throw new Error(`Image fallback failed (${fallbackResponse.status}): ${text}`);
      }
      payload = await fallbackResponse.json();
      if (debug) {
        logDebugHeadline("openrouter:image", "fallback request applied due to empty image payload");
        logDebugDetails("fallback payload", fallbackBody);
        logDebugDetails("fallback response payload", payload);
      }
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
