import crypto from "node:crypto";

export const enforceHistoryLimit = (history, maxEntries = 120) => {
  if (history.length > maxEntries) {
    throw new Error(`history limit exceeded: ${history.length} > ${maxEntries}`);
  }
};

export const computeTurnFingerprint = ({ gameId, historyTexts, cardText }) => {
  const payload = JSON.stringify({
    gameId,
    historyTexts,
    cardText
  });
  return crypto.createHash("sha256").update(payload).digest("hex");
};

export const createTurnDedupeCache = () => {
  const map = new Map();
  return {
    get: (fingerprint) => map.get(fingerprint) ?? null,
    set: (fingerprint, value) => {
      map.set(fingerprint, value);
    },
    clear: () => map.clear()
  };
};

export const createInMemoryRateLimiter = ({
  windowMs = 60_000,
  maxRequests = 30,
  nowFn = () => Date.now()
} = {}) => {
  const buckets = new Map();

  const check = (key) => {
    const now = nowFn();
    const bucket = buckets.get(key) ?? { startedAt: now, count: 0 };

    if (now - bucket.startedAt >= windowMs) {
      bucket.startedAt = now;
      bucket.count = 0;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    return {
      allowed: bucket.count <= maxRequests,
      remaining: Math.max(0, maxRequests - bucket.count),
      resetAt: bucket.startedAt + windowMs
    };
  };

  return {
    check
  };
};

export const withRetry = async (
  operation,
  { attempts = 3, delayMs = 120, shouldRetry = () => true } = {}
) => {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt >= attempts || !shouldRetry(error, attempt)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw lastError;
};
