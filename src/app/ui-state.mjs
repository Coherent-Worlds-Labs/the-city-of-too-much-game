const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const groupDelta = {
  institutional: -0.08,
  fauna: 0.08,
  culture: 0.02,
  infrastructure: -0.03,
  economy: 0.01,
  fracture: 0.12
};

const groupMood = {
  institutional: "Formalizing",
  fauna: "Avian Influence Rising",
  culture: "Symbolic Reframing",
  infrastructure: "Structural Adjustment",
  economy: "Civic Repricing",
  fracture: "Semantic Fracture"
};

const toDirection = (axis) => {
  if (axis <= 0.4) {
    return "protocol";
  }
  if (axis >= 0.6) {
    return "carnival";
  }
  return "balanced";
};

export const createUiState = (worldPack) => ({
  worldId: worldPack.worldId,
  title: worldPack.metadata.title,
  axis: 0.5,
  turn: 0,
  mood: "Tense Balance",
  stability: "High",
  emergingThemes: [],
  handCursor: 0,
  history: [],
  activeHand: [],
  direction: "balanced"
});

export const drawHand = (state, worldPack, handSize = 3) => {
  const cards = worldPack.cards;
  const hand = [];
  for (let i = 0; i < handSize; i += 1) {
    const idx = (state.handCursor + i) % cards.length;
    hand.push(cards[idx]);
  }

  return {
    ...state,
    activeHand: hand,
    handCursor: (state.handCursor + handSize) % cards.length
  };
};

export const applyCardToUiState = (state, card) => {
  const delta = groupDelta[card.group] ?? 0;
  const nextAxis = clamp(state.axis + delta, 0, 1);
  const direction = toDirection(nextAxis);
  const mood = groupMood[card.group] ?? "Tense Balance";

  const emergingThemes = [card.group, ...state.emergingThemes]
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 3);

  const stability =
    nextAxis <= 0.2 || nextAxis >= 0.8 || card.group === "fracture" ? "Low" : "High";

  return {
    ...state,
    axis: nextAxis,
    direction,
    mood,
    stability,
    turn: state.turn + 1,
    emergingThemes,
    history: [{ turn: state.turn + 1, card }, ...state.history]
  };
};

export const evaluateUiOutcome = (
  state,
  { epsilon = 0.12, targetTurnsForSurvival = 12, lowStabilityCutoff = 0.2 } = {}
) => {
  if (state.axis <= epsilon) {
    return "protocol-collapse";
  }
  if (state.axis >= 1 - epsilon) {
    return "carnival-collapse";
  }
  if (state.stability === "Low" && Math.abs(state.axis - 0.5) >= lowStabilityCutoff) {
    return "incoherence-collapse";
  }
  if (state.turn >= targetTurnsForSurvival) {
    return "survived";
  }
  return "active";
};

export const createTimelineEntry = (state, card) => ({
  turn: state.turn,
  axis: state.axis,
  direction: state.direction,
  mood: state.mood,
  stability: state.stability,
  cardText: card.text
});
