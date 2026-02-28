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

export const createRuntimeApi = ({
  store,
  worldPack,
  judge,
  imagePipeline,
  reliability
}) => {
  const gameService = createGameService({
    store,
    worldPack,
    reliability
  });
  const handForTurn = createHandProvider(worldPack);

  const createGame = async ({ seed = null } = {}) => {
    const created = gameService.createGame({ seed });
    const seedScene = await imagePipeline.renderTurnImage({
      worldPack,
      gameId: created.game.game_id,
      turnIndex: 0,
      imagePrompt: buildSeedScenePrompt(worldPack),
      previousImageHint: null,
      seed: created.game.seed ?? seed ?? null
    });

    return {
      game: created.game,
      hand: handForTurn(created.game.current_turn),
      seedScene: {
        imageUrl: seedScene.imageUrl,
        imagePrompt: seedScene.imagePrompt
      },
      timeline: [
        {
          turnIndex: 0,
          imageUrl: seedScene.imageUrl,
          imagePrompt: seedScene.imagePrompt,
          cardText: "Seed scene"
        }
      ],
      world: {
        worldId: worldPack.worldId,
        title: worldPack.metadata.title
      }
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
    const previousHint =
      previousTimeline.length > 0
        ? `previous image url ${previousTimeline.at(-1).imageUrl}`
        : null;

    const image = await imagePipeline.renderTurnImage({
      worldPack,
      gameId,
      turnIndex: history.length + 1,
      imagePrompt: judgeEval.judgeResult.image_prompt,
      previousImageHint: previousHint
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

  return {
    createGame,
    playTurn,
    getHistory,
    getTimeline
  };
};
