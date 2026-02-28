const quote = (value) => `"${value.replaceAll("\"", "\\\"")}"`;

export const buildJudgeSystemPrompt = (worldPack) => {
  const anchors = worldPack.prompt.persistentAnchors.map((item) => `- ${item}`).join("\n");
  const style = worldPack.prompt.style.map((item) => `- ${item}`).join("\n");
  const continuity = worldPack.prompt.continuityRules.map((item) => `- ${item}`).join("\n");
  const negative = worldPack.prompt.negativeConstraints.map((item) => `- ${item}`).join("\n");

  return [
    `You are the semantic judge of the game ${quote(worldPack.metadata.title)}.`,
    "Target model profile: openai/gpt-5-mini (strict JSON compliance required).",
    "Return ONLY one JSON object (no markdown, no code fences, no prose outside JSON).",
    "Cards have no fixed numeric weights. Evaluate only from accumulated history motifs.",
    "",
    "Required top-level keys:",
    "- reconstructed_state_before: object",
    "- evaluation: object",
    "- new_state: object",
    "- image_prompt: string",
    "",
    "Required new_state keys and types:",
    "- absurdity_index: number in [0,1]",
    "- coherence_level: number in [0,1]",
    "- dominant_direction: one of \"protocol\", \"carnival\", \"balanced\"",
    "- active_motifs: array (can be empty)",
    "",
    "Hard rules:",
    "- DO NOT put prose in new_state (new_state must be an object, never a string).",
    "- DO NOT move absurdity_index/coherence_level/dominant_direction into evaluation.",
    "- Keep image_prompt photorealistic and continuity-preserving.",
    "- Keep image_prompt concise (max 460 characters, one compact paragraph).",
    "",
    "Output template (types only):",
    "{\"reconstructed_state_before\":{},\"evaluation\":{},\"new_state\":{\"absurdity_index\":0.5,\"coherence_level\":0.7,\"dominant_direction\":\"balanced\",\"active_motifs\":[]},\"image_prompt\":\"...\"}",
    "",
    "Persistent anchors:",
    anchors,
    "",
    "Style anchors:",
    style,
    "",
    "Continuity rules:",
    continuity,
    "",
    "Negative constraints:",
    negative
  ].join("\n");
};

export const buildJudgeUserPrompt = (turnProposal) => {
  const historyLines =
    turnProposal.history.length === 0
      ? "none"
      : turnProposal.history.map((item, index) => `${index + 1}. ${item}`).join("\n");

  return [
    "HISTORY:",
    historyLines,
    "",
    "NEW CARD:",
    turnProposal.newCard
  ].join("\n");
};

export const buildJudgeMessages = (worldPack, turnProposal) => [
  { role: "system", content: buildJudgeSystemPrompt(worldPack) },
  { role: "user", content: buildJudgeUserPrompt(turnProposal) }
];
