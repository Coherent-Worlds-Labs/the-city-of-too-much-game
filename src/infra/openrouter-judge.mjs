import { validateJudgeResult } from "../domain/game-engine.mjs";
import { buildJudgeMessages } from "../domain/judge-prompt.mjs";
import { logDebugDetails, logDebugHeadline } from "./debug-log.mjs";

export class JudgeResponseParseError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = "JudgeResponseParseError";
    this.details = details;
  }
}

export class JudgeValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "JudgeValidationError";
    this.details = details;
  }
}

const contentToText = (content) => {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (part && typeof part === "object" && typeof part.text === "string") {
          return part.text;
        }
        return "";
      })
      .join("");
  }
  return "";
};

const unwrapJsonFence = (text) => {
  const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/i);
  if (fenceMatch && fenceMatch[1]) {
    return fenceMatch[1].trim();
  }
  return text.trim();
};

const toNumberOrNull = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const clamp01 = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
};

const normalizeDirection = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  if (["protocol", "bureaucratization", "order", "regulation"].includes(normalized)) {
    return "protocol";
  }
  if (["carnival", "chaos", "absurdity", "excess"].includes(normalized)) {
    return "carnival";
  }
  if (["balanced", "balance", "neutral"].includes(normalized)) {
    return "balanced";
  }
  return normalized;
};

const firstNonNull = (...values) => values.find((value) => value !== null && value !== undefined);

export const normalizeJudgeResultShape = (input) => {
  if (!input || typeof input !== "object") {
    return input;
  }

  const evaluation = input.evaluation && typeof input.evaluation === "object" ? input.evaluation : {};
  const originalNewState =
    input.new_state && typeof input.new_state === "object" && !Array.isArray(input.new_state)
      ? input.new_state
      : {};

  const absurdity = clamp01(
    firstNonNull(
      toNumberOrNull(originalNewState.absurdity_index),
      toNumberOrNull(evaluation.absurdity_index),
      toNumberOrNull(evaluation.absurdity)
    )
  );
  const coherence = clamp01(
    firstNonNull(
      toNumberOrNull(originalNewState.coherence_level),
      toNumberOrNull(evaluation.coherence_level),
      toNumberOrNull(evaluation.coherence)
    )
  );
  const direction = firstNonNull(
    normalizeDirection(originalNewState.dominant_direction),
    normalizeDirection(evaluation.dominant_direction),
    normalizeDirection(evaluation.direction)
  );

  const activeMotifs = Array.isArray(originalNewState.active_motifs)
    ? originalNewState.active_motifs
    : [];

  return {
    ...input,
    new_state: {
      ...originalNewState,
      ...(absurdity !== null ? { absurdity_index: absurdity } : {}),
      ...(coherence !== null ? { coherence_level: coherence } : {}),
      ...(direction ? { dominant_direction: direction } : {}),
      active_motifs: activeMotifs
    }
  };
};

export const parseJudgeJson = (rawContent) => {
  const text = unwrapJsonFence(contentToText(rawContent));
  if (!text) {
    throw new JudgeResponseParseError("Judge response content is empty.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new JudgeResponseParseError("Judge response is not valid JSON.", error.message);
  }
};

export const createOpenRouterJudge = ({
  apiKey,
  baseUrl = "https://openrouter.ai/api/v1",
  model = "openai/gpt-5-mini",
  fetchFn = fetch,
  timeoutMs = 30_000,
  debug = false
}) => {
  const evaluateTurn = async (turnProposal, worldPack) => {
    if (!apiKey || !apiKey.trim()) {
      throw new Error("OPENROUTER_API_KEY is required for judge evaluation.");
    }
    const messages = buildJudgeMessages(worldPack, turnProposal);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let response;
    const requestBody = {
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages
    };
    try {
      if (debug) {
        logDebugHeadline("openrouter:judge", `request model=${model}`);
        logDebugDetails("request payload", requestBody);
      }
      response = await fetchFn(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const text = await response.text();
      if (debug) {
        logDebugHeadline("openrouter:judge", `response status=${response.status}`);
        logDebugDetails("response body", text);
      }
      throw new Error(`Judge request failed (${response.status}): ${text}`);
    }

    const payload = await response.json();
    if (debug) {
      logDebugHeadline("openrouter:judge", `response status=${response.status}`);
      logDebugDetails("response payload", payload);
    }
    const content = payload?.choices?.[0]?.message?.content;
    const parsedJudgeResult = parseJudgeJson(content);
    const judgeResult = normalizeJudgeResultShape(parsedJudgeResult);
    const validation = validateJudgeResult(judgeResult);
    if (!validation.ok) {
      if (debug) {
        logDebugHeadline(
          "openrouter:judge",
          `validation_failed errors=${validation.errors.join(" | ")}`
        );
        logDebugDetails("parsed judge result", parsedJudgeResult);
        logDebugDetails("normalized judge result", judgeResult);
      }
      throw new JudgeValidationError("Judge response failed contract validation.", validation.errors);
    }

    return {
      judgeResult,
      raw: payload
    };
  };

  return {
    evaluateTurn
  };
};
