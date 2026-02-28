const CYRILLIC_RE = /[\u0400-\u04FF]/u;

const requiredTopLevelFields = [
  "schemaVersion",
  "worldId",
  "locale",
  "metadata",
  "ui",
  "prompt",
  "motifs",
  "cards"
];

const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const isEnglishLocale = (locale) => hasText(locale) && locale.trim().toLowerCase().startsWith("en");

export const validateWorldPack = (candidate) => {
  const errors = [];

  if (!candidate || typeof candidate !== "object") {
    return { ok: false, errors: ["World pack must be an object."] };
  }

  for (const field of requiredTopLevelFields) {
    if (!(field in candidate)) {
      errors.push(`Missing required top-level field: ${field}`);
    }
  }

  if (candidate.schemaVersion !== 1) {
    errors.push("schemaVersion must be exactly 1.");
  }

  if (!hasText(candidate.worldId)) {
    errors.push("worldId must be a non-empty string.");
  }

  if (!hasText(candidate.locale)) {
    errors.push("locale must be a non-empty string.");
  }

  const enforceEnglishCards = isEnglishLocale(candidate.locale);

  if (!Array.isArray(candidate.cards)) {
    errors.push("cards must be an array.");
  } else {
    if (candidate.cards.length !== 50) {
      errors.push(`cards must contain exactly 50 entries (got ${candidate.cards.length}).`);
    }

    const ids = new Set();
    for (const card of candidate.cards) {
      if (!card || typeof card !== "object") {
        errors.push("each card must be an object.");
        continue;
      }
      if (!hasText(card.id)) {
        errors.push("card.id must be a non-empty string.");
      } else if (ids.has(card.id)) {
        errors.push(`duplicate card id: ${card.id}`);
      } else {
        ids.add(card.id);
      }
      if (!hasText(card.text)) {
        errors.push(`card ${card.id ?? "<unknown>"} has empty text.`);
      } else if (enforceEnglishCards && CYRILLIC_RE.test(card.text)) {
        errors.push(`card ${card.id ?? "<unknown>"} contains non-English (Cyrillic) text.`);
      }
      if (!hasText(card.group)) {
        errors.push(`card ${card.id ?? "<unknown>"} has empty group.`);
      }
    }
  }

  const metadata = candidate.metadata;
  if (!metadata || typeof metadata !== "object") {
    errors.push("metadata must be an object.");
  } else {
    for (const field of ["title", "subtitle", "summary", "victoryCondition"]) {
      if (!hasText(metadata[field])) {
        errors.push(`metadata.${field} must be a non-empty string.`);
      }
    }
  }

  const ui = candidate.ui;
  if (!ui || typeof ui !== "object") {
    errors.push("ui must be an object.");
  } else if ("axisLabels" in ui) {
    if (!ui.axisLabels || typeof ui.axisLabels !== "object") {
      errors.push("ui.axisLabels must be an object.");
    } else {
      if (!hasText(ui.axisLabels.left)) {
        errors.push("ui.axisLabels.left must be a non-empty string.");
      }
      if (!hasText(ui.axisLabels.right)) {
        errors.push("ui.axisLabels.right must be a non-empty string.");
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors
  };
};
