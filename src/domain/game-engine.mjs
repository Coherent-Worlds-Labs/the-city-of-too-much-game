const hasText = (value) => typeof value === "string" && value.trim().length > 0;

export const defaultEngineSettings = Object.freeze({
  epsilon: 0.12,
  minCoherence: 0.35,
  targetTurnsForSurvival: 12
});

export const createSession = (worldId, settings = defaultEngineSettings) => {
  if (!hasText(worldId)) {
    throw new Error("worldId must be a non-empty string.");
  }

  return {
    worldId,
    turnIndex: 0,
    status: "active",
    outcome: null,
    settings: {
      epsilon: settings.epsilon ?? defaultEngineSettings.epsilon,
      minCoherence: settings.minCoherence ?? defaultEngineSettings.minCoherence,
      targetTurnsForSurvival:
        settings.targetTurnsForSurvival ?? defaultEngineSettings.targetTurnsForSurvival
    },
    history: [],
    latestState: null
  };
};

export const createTurnProposal = (session, card) => {
  if (!session || typeof session !== "object") {
    throw new Error("session is required.");
  }
  if (!card || typeof card !== "object") {
    throw new Error("card is required.");
  }
  if (!hasText(card.id) || !hasText(card.text)) {
    throw new Error("card.id and card.text are required.");
  }

  return {
    worldId: session.worldId,
    history: session.history.map((turn) => turn.card.text),
    newCard: card.text
  };
};

export const validateJudgeResult = (judgeResult) => {
  const errors = [];

  if (!judgeResult || typeof judgeResult !== "object") {
    return { ok: false, errors: ["judgeResult must be an object."] };
  }

  if (!judgeResult.new_state || typeof judgeResult.new_state !== "object") {
    errors.push("new_state must be present.");
  } else {
    const absurdity = judgeResult.new_state.absurdity_index;
    const coherence = judgeResult.new_state.coherence_level;
    if (typeof absurdity !== "number" || absurdity < 0 || absurdity > 1) {
      errors.push("new_state.absurdity_index must be a number in [0,1].");
    }
    if (typeof coherence !== "number" || coherence < 0 || coherence > 1) {
      errors.push("new_state.coherence_level must be a number in [0,1].");
    }
    if (!hasText(judgeResult.new_state.dominant_direction)) {
      errors.push("new_state.dominant_direction must be a non-empty string.");
    }
  }

  if (!hasText(judgeResult.image_prompt)) {
    errors.push("image_prompt must be a non-empty string.");
  }

  return {
    ok: errors.length === 0,
    errors
  };
};

const evaluateOutcome = (newState, turnIndex, settings) => {
  const { absurdity_index: absurdity, coherence_level: coherence } = newState;
  const { epsilon, minCoherence, targetTurnsForSurvival } = settings;

  if (coherence < minCoherence) {
    return {
      status: "collapsed",
      outcome: "incoherence-collapse"
    };
  }

  if (absurdity <= epsilon) {
    return {
      status: "collapsed",
      outcome: "protocol-collapse"
    };
  }

  if (absurdity >= 1 - epsilon) {
    return {
      status: "collapsed",
      outcome: "carnival-collapse"
    };
  }

  if (turnIndex >= targetTurnsForSurvival) {
    return {
      status: "survived",
      outcome: "continuation-survived"
    };
  }

  return {
    status: "active",
    outcome: null
  };
};

export const applyTurnResult = (session, card, judgeResult) => {
  if (session.status !== "active") {
    throw new Error(`cannot apply turn to non-active session (${session.status}).`);
  }

  const validation = validateJudgeResult(judgeResult);
  if (!validation.ok) {
    const error = new Error("invalid judge result");
    error.details = validation.errors;
    throw error;
  }

  const turnIndex = session.turnIndex + 1;
  const turnRecord = {
    turnIndex,
    card: { id: card.id, text: card.text, group: card.group ?? "unknown" },
    judgeResult
  };

  const resolution = evaluateOutcome(judgeResult.new_state, turnIndex, session.settings);

  const nextSession = {
    ...session,
    turnIndex,
    status: resolution.status,
    outcome: resolution.outcome,
    latestState: judgeResult.new_state,
    history: [...session.history, turnRecord]
  };

  return {
    session: nextSession,
    turnRecord
  };
};
