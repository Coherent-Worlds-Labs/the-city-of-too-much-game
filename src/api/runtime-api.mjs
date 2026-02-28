import { createGameService } from "./game-service.mjs";
import { createTurnProposal } from "../domain/game-engine.mjs";

const handSize = 3;

const createHandProvider = (worldPack) => {
  const cards = worldPack.cards;
  return (turnIndex) => {
    const start = (turnIndex * handSize) % cards.length;
    const hand = [];
    for (let i = 0; i < handSize; i += 1) {
      hand.push(cards[(start + i) % cards.length]);
    }
    return hand;
  };
};

const buildSeedScenePrompt = (worldPack) =>
  [
    `Initial seed scene for ${worldPack.metadata.title}.`,
    "Show the city before any player-enacted card, in tense balance.",
    "Photorealistic civic documentary composition with natural light.",
    `Use setting anchors: ${worldPack.prompt.persistentAnchors.join(", ")}.`,
    "Avoid extreme protocol or carnival drift in this initial frame."
  ].join(" ");

const normalizePromptText = (value, maxChars) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxChars);

const buildHistoryContext = (history, maxTurns = 6) => {
  const turns = Array.isArray(history) ? history.slice(-maxTurns) : [];
  if (turns.length === 0) {
    return null;
  }
  return turns
    .map((turn) => {
      const turnLabel = Number.isInteger(turn?.turnIndex) ? `T${turn.turnIndex}` : "T?";
      const cardText = normalizePromptText(turn?.card?.text ?? "unknown card", 64);
      const newState = turn?.judgeResult?.new_state ?? {};
      const direction = normalizePromptText(newState?.dominant_direction ?? "balanced", 24);
      const absurdity =
        Number.isFinite(newState?.absurdity_index) ? Number(newState.absurdity_index).toFixed(2) : "n/a";
      const coherence =
        Number.isFinite(newState?.coherence_level) ? Number(newState.coherence_level).toFixed(2) : "n/a";
      return `${turnLabel}:${cardText} -> ${direction} (a=${absurdity}, c=${coherence})`;
    })
    .join(" | ");
};

export const createRuntimeApi = ({
  store,
  worldPack,
  judge,
  imagePipeline,
  reliability,
  imagePromptMaxChars = 460
}) => {
  const axisLabels = {
    left: worldPack?.ui?.axisLabels?.left ?? "Protocol",
    right: worldPack?.ui?.axisLabels?.right ?? "Carnival"
  };

  const worldDescriptor = {
    worldId: worldPack.worldId,
    title: worldPack.metadata.title,
    axisLabels
  };

  const gameService = createGameService({
    store,
    worldPack,
    reliability
  });
  const handForTurn = createHandProvider(worldPack);

  const compactImagePrompt = (value) =>
    normalizePromptText(value, imagePromptMaxChars);

  const createGame = async ({ seed = null } = {}) => {
    const created = gameService.createGame({ seed });
    const seedScene = await imagePipeline.renderTurnImage({
      worldPack,
      gameId: created.game.game_id,
      turnIndex: 0,
      imagePrompt: compactImagePrompt(buildSeedScenePrompt(worldPack)),
      previousImageHint: null,
      seed: created.game.seed ?? seed ?? null
    });
    const updatedGame = gameService.setSeedScene({
      gameId: created.game.game_id,
      imageUrl: seedScene.imageUrl,
      imagePrompt: seedScene.imagePrompt
    });

    return {
      game: updatedGame,
      hand: handForTurn(updatedGame.current_turn),
      seedScene: {
        imageUrl: seedScene.imageUrl,
        imagePrompt: seedScene.imagePrompt
      },
      timeline: gameService.getTimeline(updatedGame.game_id),
      world: worldDescriptor
    };
  };

  const getGameState = (gameId) => {
    const game = gameService.getGame(gameId);
    if (!game) {
      throw new Error(`game not found: ${gameId}`);
    }
    const timeline = gameService.getTimeline(gameId);
    return {
      game,
      hand: handForTurn(game.current_turn),
      history: gameService.getHistory(gameId),
      timeline,
      seedScene:
        timeline.length > 0 && timeline[0].turnIndex === 0
          ? {
              imageUrl: timeline[0].imageUrl,
              imagePrompt: timeline[0].imagePrompt
            }
          : null,
      world: worldDescriptor
    };
  };

  const playTurn = async ({ gameId, cardId, expectedTurn = null }) => {
    const card = worldPack.cards.find((item) => item.id === cardId);
    if (!card) {
      throw new Error(`card not found: ${cardId}`);
    }

    const history = gameService.getHistory(gameId);
    const turnProposal = createTurnProposal(
      {
        worldId: worldPack.worldId,
        history,
        turnIndex: history.length,
        status: "active"
      },
      card
    );

    const judgeEval = await judge.evaluateTurn(turnProposal, worldPack);
    const previousTimeline = gameService.getTimeline(gameId);
    const previousHint = previousTimeline.length > 0 ? "same framing and camera family as previous frame" : null;
    const previousImageUrl = previousTimeline.length > 0 ? previousTimeline.at(-1).imageUrl : null;
    const historyContext = buildHistoryContext(history);

    const image = await imagePipeline.renderTurnImage({
      worldPack,
      gameId,
      turnIndex: history.length + 1,
      imagePrompt: compactImagePrompt(judgeEval.judgeResult.image_prompt),
      previousImageHint: previousHint,
      historyContext,
      previousImageUrl,
      absurdityIndex: judgeEval.judgeResult?.new_state?.absurdity_index ?? null,
      dominantDirection: judgeEval.judgeResult?.new_state?.dominant_direction ?? "balanced"
    });

    const played = gameService.playTurn({
      gameId,
      card,
      expectedTurn,
      judgeResult: judgeEval.judgeResult,
      imagePrompt: image.imagePrompt,
      imageUrl: image.imageUrl
    });

    return {
      game: played.game,
      turn: played.turn,
      hand: handForTurn(played.game.current_turn),
      timeline: gameService.getTimeline(gameId)
    };
  };

  const getHistory = (gameId) => gameService.getHistory(gameId);
  const getTimeline = (gameId) => gameService.getTimeline(gameId);
  const listGames = () =>
    gameService.listGames().map((game) => ({
      gameId: game.game_id,
      worldId: game.world_id,
      status: game.status,
      currentTurn: game.current_turn,
      seedImageUrl: game.seed_image_url ?? null,
      updatedAt: game.updated_at,
      createdAt: game.created_at
    }));

  return {
    createGame,
    getGameState,
    playTurn,
    listGames,
    getHistory,
    getTimeline
  };
};
