import { saveImageBase64 } from "./image-storage.mjs";
import { logDebugDetails, logDebugHeadline } from "./debug-log.mjs";
import { readFileSync } from "node:fs";
import { basename, join } from "node:path";

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

const clamp01 = (value) => {
  if (!Number.isFinite(value)) {
    return null;
  }
  return Math.min(1, Math.max(0, value));
};

const normalizeDirection = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (normalized === "protocol" || normalized === "carnival" || normalized === "balanced") {
    return normalized;
  }
  return "balanced";
};

const buildAxisDirective = ({ absurdityIndex = null, dominantDirection = "balanced" }) => {
  const direction = normalizeDirection(dominantDirection);
  const absurdity = clamp01(absurdityIndex);
  const extremeProtocol = absurdity !== null && absurdity <= 0.28;
  const extremeCarnival = absurdity !== null && absurdity >= 0.72;

  if (direction === "protocol" || extremeProtocol) {
    const intensity = extremeProtocol
      ? "strongly reinforce strict civic order and realism"
      : "lean toward stronger civic order and realism";
    return `Axis directive: ${intensity}; emphasize clean geometry, disciplined spacing, orderly behavior, documentary plausibility, and restrained visual language. Avoid whimsical distortions or festive chaos.`;
  }

  if (direction === "carnival" || extremeCarnival) {
    const intensity = extremeCarnival
      ? "strongly exaggerate civic excess and chaotic spectacle"
      : "lean toward exaggerated civic excess and lively disorder";
    return `Axis directive: ${intensity}; emphasize dense crowds, theatrical contrasts, improbable juxtapositions, surreal civic rituals, and flamboyant visual overstatement while staying photorealistic and continuous. Avoid sterile symmetry and over-regulation.`;
  }

  return "Axis directive: keep tension between order and excess; maintain grounded realism with subtle contradictions and no abrupt stylization jumps.";
};

export const buildContinuityPrompt = ({
  basePrompt,
  worldPack,
  previousImageHint,
  historyContext = null,
  absurdityIndex = null,
  dominantDirection = "balanced"
}) => {
  const anchors = joinLimited(worldPack.prompt.persistentAnchors, 3, 180);
  const style = joinLimited(worldPack.prompt.style, 2, 140);
  const continuity = joinLimited(worldPack.prompt.continuityRules, 2, 140);
  const negative = joinLimited(worldPack.prompt.negativeConstraints, 2, 140);
  const axisDirective = buildAxisDirective({ absurdityIndex, dominantDirection });

  const previousClause = previousImageHint
    ? `Match previous frame: ${normalizeCompactText(previousImageHint, 120)}.`
    : "Keep continuity with prior city state.";
  const historyClause = historyContext
    ? `Evolution trail: ${normalizeCompactText(historyContext, 260)}. Treat this as cumulative context and preserve visible motif layering from earlier turns.`
    : "Evolution trail: no prior turns; establish stable baseline motifs only.";

  return [
    normalizeCompactText(basePrompt, 460),
    `Anchors: ${anchors}.`,
    `Style: ${style}.`,
    previousClause,
    historyClause,
    `Continuity: ${continuity}.`,
    axisDirective,
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
  imageToImageEnabled = false,
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

  const toLocalAssetDataUrl = (imageUrl) => {
    if (typeof imageUrl !== "string" || !imageUrl.trim()) {
      return null;
    }
    let fileName = null;
    if (imageUrl.startsWith("/assets/")) {
      fileName = basename(imageUrl);
    } else {
      try {
        const parsed = new URL(imageUrl);
        if (parsed.pathname.startsWith("/assets/")) {
          fileName = basename(parsed.pathname);
        }
      } catch {
        fileName = null;
      }
    }
    if (!fileName) {
      return null;
    }
    const absolutePath = join(assetsDir, fileName);
    try {
      const bytes = readFileSync(absolutePath);
      return `data:image/png;base64,${bytes.toString("base64")}`;
    } catch {
      return null;
    }
  };

  const buildUserContent = ({ prompt, previousImageDataUrl = null }) => {
    if (!previousImageDataUrl) {
      return prompt;
    }
    return [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: previousImageDataUrl } }
    ];
  };

  const buildPrimaryBody = ({ prompt, seed, previousImageDataUrl = null }) => {
    const body = {
      model,
      messages: [
        {
          role: "user",
          content: buildUserContent({ prompt, previousImageDataUrl })
        }
      ],
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

  const buildRelaxedFallbackBody = ({ requestBody, prompt, seed }) => {
    const body = {
      ...requestBody,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"]
    };
    delete body.max_tokens;
    delete body.reasoning;
    body.seed = seed ?? undefined;
    return body;
  };

  const renderTurnImage = async ({
    worldPack,
    gameId,
    turnIndex,
    imagePrompt,
    previousImageHint = null,
    historyContext = null,
    previousImageUrl = null,
    absurdityIndex = null,
    dominantDirection = "balanced",
    seed = null
  }) => {
    if (!apiKey || !apiKey.trim()) {
      throw new Error("OPENROUTER_API_KEY is required for image generation.");
    }
    const finalPrompt = buildContinuityPrompt({
      basePrompt: imagePrompt,
      worldPack,
      previousImageHint,
      historyContext,
      absurdityIndex,
      dominantDirection
    });
    const previousImageDataUrl =
      imageToImageEnabled && turnIndex > 0 ? toLocalAssetDataUrl(previousImageUrl) : null;
    const requestBody = buildPrimaryBody({
      prompt: finalPrompt,
      seed,
      previousImageDataUrl
    });

    if (debug) {
      logDebugHeadline("openrouter:image", `request model=${model}`);
      logDebugDetails("request payload", requestBody);
    }

    let response = await requestImage(requestBody);

    if (!response.ok && (response.status === 400 || response.status === 422)) {
      const fallbackBody = buildRelaxedFallbackBody({
        requestBody,
        prompt: finalPrompt,
        seed
      });
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
      const fallbackBody = buildRelaxedFallbackBody({
        requestBody,
        prompt: finalPrompt,
        seed
      });
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
