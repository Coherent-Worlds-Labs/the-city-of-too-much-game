const ANSI = {
  reset: "\x1b[0m",
  brightWhite: "\x1b[97m",
  gray: "\x1b[90m"
};

const paint = (color, text) => `${color}${text}${ANSI.reset}`;

const truncateValue = (value, limit) => {
  if (value.length <= limit) {
    return value;
  }
  return `${value.slice(0, limit)}...`;
};

const sanitizeDebugValue = (value) => {
  if (typeof value === "string") {
    const looksLikeBase64Blob =
      value.length > 120 && /^[A-Za-z0-9+/=]+$/.test(value);
    if (value.startsWith("data:image/") || value.includes("base64,")) {
      return truncateValue(value, 100);
    }
    if (looksLikeBase64Blob) {
      return truncateValue(value, 100);
    }
    if (value.length > 300) {
      return truncateValue(value, 200);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeDebugValue(item));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeDebugValue(entry)])
    );
  }
  return value;
};

const toPrettyText = (value) => {
  const sanitized = sanitizeDebugValue(value);
  if (typeof sanitized === "string") {
    return sanitized;
  }
  try {
    return JSON.stringify(sanitized, null, 2);
  } catch {
    return String(sanitized);
  }
};

export const logDebugHeadline = (scope, message) => {
  console.log(paint(ANSI.brightWhite, `[${scope}] ${message}`));
};

export const logDebugDetails = (label, value) => {
  const pretty = toPrettyText(value);
  console.log(paint(ANSI.gray, `${label}\n${pretty}`));
};
