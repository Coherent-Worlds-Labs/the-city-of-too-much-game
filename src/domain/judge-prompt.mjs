const quote = (value) => `"${value.replaceAll("\"", "\\\"")}"`;

export const buildJudgeSystemPrompt = (worldPack) => {
  const anchors = worldPack.prompt.persistentAnchors.map((item) => `- ${item}`).join("\n");
  const style = worldPack.prompt.style.map((item) => `- ${item}`).join("\n");
  const continuity = worldPack.prompt.continuityRules.map((item) => `- ${item}`).join("\n");
  const negative = worldPack.prompt.negativeConstraints.map((item) => `- ${item}`).join("\n");

  return [
    `You are the semantic judge of the game ${quote(worldPack.metadata.title)}.`,
    "Return only valid JSON with fields: reconstructed_state_before, evaluation, new_state, image_prompt.",
    "Cards have no fixed numeric weights. Evaluate only from accumulated history motifs.",
    "Infer absurdity_index and coherence_level in [0,1], and dominant direction.",
    "Create an image_prompt that keeps location continuity while reflecting motif drift.",
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
