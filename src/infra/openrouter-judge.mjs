import { validateJudgeResult } from "../domain/game-engine.mjs";
import { buildJudgeMessages } from "../domain/judge-prompt.mjs";

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
  timeoutMs = 30_000
}) => {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("apiKey is required.");
  }

  const evaluateTurn = async (turnProposal, worldPack) => {
    const messages = buildJudgeMessages(worldPack, turnProposal);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let response;
    try {
      response = await fetchFn(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages
        }),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Judge request failed (${response.status}): ${text}`);
    }

    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    const judgeResult = parseJudgeJson(content);
    const validation = validateJudgeResult(judgeResult);
    if (!validation.ok) {
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
