import crypto from "node:crypto";
import { createSession, applyTurnResult } from "../domain/game-engine.mjs";
import {
  computeTurnFingerprint,
  enforceHistoryLimit
} from "../infra/reliability.mjs";

const makeGameId = () => `game-${crypto.randomUUID()}`;

export const createGameService = ({
  store,
  worldPack,
  reliability = {
    rateLimiter: null,
    dedupeCache: null,
    maxHistoryEntries: 120
  }
}) => {
  if (!store) {
    throw new Error("store is required.");
  }
  if (!worldPack) {
    throw new Error("worldPack is required.");
  }

  const createGame = ({ seed = null } = {}) => {
    const gameId = makeGameId();
    const session = createSession(worldPack.worldId);
    const game = store.createGame({
      gameId,
      worldId: worldPack.worldId,
      seed,
      status: session.status
    });
    return {
      game,
      session
    };
  };

  const playTurn = ({
    gameId,
    card,
    judgeResult,
    imagePrompt,
    imageUrl,
    expectedTurn = null
  }) => {
    if (reliability.rateLimiter) {
      const rate = reliability.rateLimiter.check(gameId);
      if (!rate.allowed) {
        throw new Error("rate limit exceeded for playTurn");
      }
    }

    const game = store.getGame(gameId);
    if (!game) {
      throw new Error(`game not found: ${gameId}`);
    }
    if (game.status !== "active") {
      throw new Error(`game is not active: ${gameId}`);
    }

    const turns = store.getTurns(gameId);
    const expectedTurnIndex = expectedTurn ?? game.current_turn;
    const dedupeFingerprint = computeTurnFingerprint({
      gameId,
      historyTexts: [`turn:${expectedTurnIndex}`],
      cardText: card.text
    });

    if (reliability.dedupeCache) {
      const cached = reliability.dedupeCache.get(dedupeFingerprint);
      if (cached) {
        return cached;
      }
    }
    if (expectedTurnIndex !== game.current_turn) {
      throw new Error(`stale turn request: expected ${expectedTurnIndex}, current ${game.current_turn}`);
    }

    enforceHistoryLimit(turns, reliability.maxHistoryEntries ?? 120);

    const session = {
      worldId: game.world_id,
      turnIndex: game.current_turn,
      status: game.status,
      outcome: null,
      settings: {
        epsilon: 0.12,
        minCoherence: 0.35,
        targetTurnsForSurvival: 12
      },
      history: turns.map((turn) => ({
        turnIndex: turn.turn_index,
        card: {
          id: turn.card_id,
          group: turn.card_group,
          text: turn.card_text
        },
        judgeResult: turn.judge_json
      })),
      latestState: turns.length > 0 ? turns.at(-1).judge_json.new_state : null
    };

    const applied = applyTurnResult(session, card, judgeResult);
    const persisted = store.appendTurn({
      gameId,
      turnIndex: applied.turnRecord.turnIndex,
      card,
      judgeResult,
      imagePrompt,
      imageUrl,
      nextStatus: applied.session.status
    });

    const result = {
      game: persisted.game,
      turn: persisted.turn,
      session: applied.session
    };

    if (reliability.dedupeCache) {
      reliability.dedupeCache.set(dedupeFingerprint, result);
    }

    return result;
  };

  const getHistory = (gameId) => {
    const turns = store.getTurns(gameId);
    return turns.map((turn) => ({
      turnIndex: turn.turn_index,
      card: {
        id: turn.card_id,
        group: turn.card_group,
        text: turn.card_text
      },
      judgeResult: turn.judge_json
    }));
  };

  const getTimeline = (gameId) => {
    return store.getTurns(gameId).map((turn) => ({
      turnIndex: turn.turn_index,
      imageUrl: turn.image_url,
      imagePrompt: turn.image_prompt,
      cardText: turn.card_text
    }));
  };

  return {
    createGame,
    playTurn,
    getHistory,
    getTimeline
  };
};
