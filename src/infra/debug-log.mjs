const ANSI = {
  reset: "\x1b[0m",
  brightWhite: "\x1b[97m",
  gray: "\x1b[90m"
};

const paint = (color, text) => `${color}${text}${ANSI.reset}`;

const toPrettyText = (value) => {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export const logDebugHeadline = (scope, message) => {
  console.log(paint(ANSI.brightWhite, `[${scope}] ${message}`));
};

export const logDebugDetails = (label, value) => {
  const pretty = toPrettyText(value);
  console.log(paint(ANSI.gray, `${label}\n${pretty}`));
};

