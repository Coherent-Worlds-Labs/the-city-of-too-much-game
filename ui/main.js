const state = {
  gameId: null,
  worldTitle: "The City of Too Much",
  hand: [],
  history: [],
  timeline: [],
  timelineCursor: -1,
  selectedCardId: null,
  axis: 0.5,
  direction: "balanced",
  mood: "Tense Balance",
  stability: "High",
  turn: 0,
  outcome: "active",
  isProcessing: false,
  sceneImageUrl: null
};

const elements = {
  title: document.getElementById("title"),
  subtitle: document.getElementById("subtitle"),
  axisDot: document.getElementById("axis-dot"),
  scene: document.getElementById("scene"),
  loadingStage: document.getElementById("loading-stage"),
  motifList: document.getElementById("motif-list"),
  historyList: document.getElementById("history-list"),
  cardGrid: document.getElementById("card-grid"),
  enactBtn: document.getElementById("enact-btn"),
  mood: document.getElementById("mood"),
  stability: document.getElementById("stability"),
  turn: document.getElementById("turn"),
  overlay: document.getElementById("outcome-overlay"),
  outcomeTitle: document.getElementById("outcome-title"),
  outcomeText: document.getElementById("outcome-text"),
  restartBtn: document.getElementById("restart-btn"),
  headerRestartBtn: document.getElementById("header-restart-btn")
};

const loadingStages = ["Interpreting the city...", "Rendering the new reality..."];
const bootstrapStage = "Preparing the first city snapshot...";
const activeGameStorageKey = "city-too-much.active-game";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const api = async (path, init = {}) => {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }
  return payload;
};

const toDirection = (value) => {
  if (value <= 0.4) {
    return "protocol";
  }
  if (value >= 0.6) {
    return "carnival";
  }
  return "balanced";
};

const detectOutcome = (absurdity, coherence, turn) => {
  const epsilon = 0.12;
  if (coherence < 0.35) {
    return "incoherence-collapse";
  }
  if (absurdity <= epsilon) {
    return "protocol-collapse";
  }
  if (absurdity >= 1 - epsilon) {
    return "carnival-collapse";
  }
  if (turn >= 12) {
    return "survived";
  }
  return "active";
};

const persistGameId = () => {
  try {
    localStorage.setItem(activeGameStorageKey, state.gameId ?? "");
  } catch {
    // ignore local storage errors
  }
};

const clearPersistedGameId = () => {
  try {
    localStorage.removeItem(activeGameStorageKey);
  } catch {
    // ignore local storage errors
  }
};

const readPersistedGameId = () => {
  try {
    const saved = localStorage.getItem(activeGameStorageKey);
    return saved && saved.trim() ? saved.trim() : null;
  } catch {
    return null;
  }
};

const normalizeOutcome = (status) => {
  if (!status || status === "active") {
    return "active";
  }
  if (status === "survived") {
    return "survived";
  }
  if (status === "protocol-collapse" || status === "carnival-collapse" || status === "incoherence-collapse") {
    return status;
  }
  return "active";
};

const renderIndicator = () => {
  elements.axisDot.style.left = `calc(${state.axis * 100}% - 9px)`;
};

const renderScene = () => {
  const cool = Math.round(52 + (1 - state.axis) * 50);
  const warm = Math.round(85 + state.axis * 90);
  if (state.sceneImageUrl) {
    elements.scene.style.background = `
      linear-gradient(170deg, rgba(21, 50, 57, 0.44), rgba(182, 81, 46, 0.22)),
      url("${state.sceneImageUrl}"),
      linear-gradient(120deg, rgb(${cool}, 94, 112) 0%, rgb(105, 133, 129) 52%, rgb(${warm}, 122, 82) 100%)
    `;
    elements.scene.style.backgroundSize = "cover, cover, cover";
    elements.scene.style.backgroundPosition = "center, center, center";
  } else {
    elements.scene.style.background = `
      linear-gradient(170deg, rgba(21, 50, 57, 0.44), rgba(182, 81, 46, 0.22)),
      linear-gradient(120deg, rgb(${cool}, 94, 112) 0%, rgb(105, 133, 129) 52%, rgb(${warm}, 122, 82) 100%)
    `;
    elements.scene.style.backgroundSize = "cover, cover";
    elements.scene.style.backgroundPosition = "center, center";
  }
};

const renderMotifs = () => {
  const selectedTurnIndex = state.timeline[state.timelineCursor]?.turnIndex ?? null;
  const sourceTurn =
    selectedTurnIndex && selectedTurnIndex > 0
      ? state.history.find((entry) => entry.turnIndex === selectedTurnIndex) ?? null
      : state.history.at(-1) ?? null;
  const motifs = sourceTurn?.judgeResult?.new_state?.active_motifs ?? [];
  const items = motifs
    .slice(0, 6)
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }
      if (item && typeof item === "object") {
        return (
          item.name ??
          item.label ??
          item.title ??
          item.motif ??
          ""
        ).trim();
      }
      return "";
    })
    .map((item) => item.replaceAll("_", " "))
    .filter((item) => item.length > 0)
    .slice(0, 3);
  elements.motifList.innerHTML = (items.length > 0 ? items : ["No motifs detected yet"])
    .map((item) => `<li>${item}</li>`)
    .join("");
};

const renderStatus = () => {
  elements.subtitle.textContent =
    state.direction === "protocol"
      ? "Leaning toward Protocol"
      : state.direction === "carnival"
        ? "Growing Carnival"
        : "Tense Balance";
  elements.mood.textContent = state.mood;
  elements.stability.textContent = state.stability;
  elements.turn.textContent = String(state.turn);
};

const renderHistory = () => {
  if (state.timeline.length === 0) {
    elements.historyList.innerHTML = "<li class=\"history-empty\">No snapshots yet.</li>";
    return;
  }
  elements.historyList.innerHTML = state.timeline
    .map((entry, index) => {
      const title = entry.turnIndex === 0 ? "Genesis" : `Turn ${entry.turnIndex}`;
      const text = entry.cardText ?? (entry.turnIndex === 0 ? "Seed scene" : "Scene update");
      const active = state.timelineCursor === index ? "is-active" : "";
      return `<li><button type="button" class="history-entry ${active}" data-index="${index}"><strong>${title}</strong><span>${text}</span></button></li>`;
    })
    .join("");
  elements.historyList.querySelectorAll("button[data-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      if (!Number.isInteger(index)) {
        return;
      }
      const entry = state.timeline[index];
      if (!entry) {
        return;
      }
      state.timelineCursor = index;
      state.sceneImageUrl = entry.imageUrl ?? null;
      render();
    });
  });
};

const renderCards = () => {
  elements.cardGrid.innerHTML = "";
  if (state.hand.length === 0) {
    if (state.isProcessing) {
      for (let i = 0; i < 3; i += 1) {
        const placeholder = document.createElement("button");
        placeholder.type = "button";
        placeholder.className = "card placeholder";
        placeholder.disabled = true;
        placeholder.innerHTML = "<small>loading</small>Preparing initiative...";
        elements.cardGrid.append(placeholder);
      }
    } else {
      const note = document.createElement("p");
      note.textContent = "No initiatives are available yet.";
      elements.cardGrid.append(note);
    }
    elements.enactBtn.disabled = true;
    return;
  }
  state.hand.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    if (state.selectedCardId === card.id) {
      button.classList.add("selected");
    }
    if (state.isProcessing || state.outcome !== "active") {
      button.disabled = true;
    }
    button.innerHTML = `<small>${card.group}</small>${card.text}`;
    button.addEventListener("click", () => {
      state.selectedCardId = card.id;
      elements.enactBtn.disabled = false;
      renderCards();
    });
    elements.cardGrid.append(button);
  });
};

const renderOutcomeOverlay = () => {
  if (state.outcome === "active") {
    elements.overlay.classList.add("hidden");
    return;
  }
  const map = {
    "protocol-collapse": {
      title: "Protocol Collapse",
      text: "The city became too rigid. Nothing unpredictable remains."
    },
    "carnival-collapse": {
      title: "Carnival Collapse",
      text: "Meaning dissolved into excess. The city can no longer continue."
    },
    "incoherence-collapse": {
      title: "Incoherence Collapse",
      text: "Contradictions overwhelmed coherence and the city fragmented."
    },
    survived: {
      title: "The City Survives",
      text: "Not perfect and not broken. The city remains alive."
    }
  };
  const content = map[state.outcome];
  elements.outcomeTitle.textContent = content.title;
  elements.outcomeText.textContent = content.text;
  elements.overlay.classList.remove("hidden");
};

const render = () => {
  elements.title.textContent = state.worldTitle;
  renderIndicator();
  renderScene();
  renderMotifs();
  renderStatus();
  renderHistory();
  renderCards();
  renderOutcomeOverlay();
};

const hydrateFromTurn = (turn) => {
  const newState = turn?.judge_json?.new_state ?? turn?.judgeResult?.new_state;
  if (!newState) {
    return;
  }
  state.axis = newState.absurdity_index;
  state.direction = toDirection(state.axis);
  state.mood = state.direction === "protocol" ? "Formalizing" : state.direction === "carnival" ? "Escalating Excess" : "Tense Balance";
  state.stability = newState.coherence_level >= 0.5 ? "High" : "Low";
};

const applyLoadedGameState = (payload) => {
  const game = payload?.game ?? null;
  if (!game) {
    throw new Error("invalid game payload: missing game");
  }

  state.gameId = game.game_id;
  state.worldTitle = payload?.world?.title ?? state.worldTitle;
  state.turn = game.current_turn;
  state.hand = payload?.hand ?? [];
  state.history = payload?.history ?? [];
  state.timeline = payload?.timeline ?? [];
  state.selectedCardId = null;
  state.outcome = normalizeOutcome(game.status);

  if (state.history.length > 0) {
    hydrateFromTurn(state.history.at(-1));
  } else {
    state.axis = 0.5;
    state.direction = "balanced";
    state.mood = "Tense Balance";
    state.stability = "High";
  }

  if (state.timeline.length > 0) {
    state.timelineCursor = state.timeline.length - 1;
    state.sceneImageUrl = state.timeline[state.timelineCursor].imageUrl ?? null;
  } else {
    state.timelineCursor = -1;
    state.sceneImageUrl = payload?.seedScene?.imageUrl ?? null;
  }

  elements.enactBtn.disabled = true;
  persistGameId();
};

const createGame = async () => {
  const created = await api("/api/games", {
    method: "POST",
    body: JSON.stringify({})
  });
  applyLoadedGameState({
    ...created,
    history: []
  });
  state.isProcessing = false;
};

const resumeGame = async (gameId) => {
  const loaded = await api(`/api/games/${gameId}/state`);
  applyLoadedGameState(loaded);
};

const enactSelectedCard = async () => {
  if (!state.selectedCardId || !state.gameId || state.outcome !== "active") {
    return;
  }
  state.isProcessing = true;
  elements.enactBtn.disabled = true;
  elements.loadingStage.classList.remove("hidden");
  elements.loadingStage.textContent = loadingStages[0];
  render();

  try {
    await wait(500);
    elements.loadingStage.textContent = loadingStages[1];

    const played = await api("/api/turn", {
      method: "POST",
      body: JSON.stringify({
        gameId: state.gameId,
        cardId: state.selectedCardId,
        expectedTurn: state.turn
      })
    });

    state.turn = played.game.current_turn;
    state.hand = played.hand;
    state.timeline = played.timeline;
    state.timelineCursor = state.timeline.length - 1;
    state.sceneImageUrl = played.timeline.at(-1)?.imageUrl ?? state.sceneImageUrl;
    state.history = await api(`/api/games/${state.gameId}/history`).then((payload) => payload.history);
    hydrateFromTurn(played.turn);
    state.outcome = detectOutcome(
      played.turn.judge_json.new_state.absurdity_index,
      played.turn.judge_json.new_state.coherence_level,
      state.turn
    );
    state.selectedCardId = null;

    elements.scene.classList.add("shift");
    render();
    await wait(350);
    elements.scene.classList.remove("shift");
  } catch (error) {
    elements.loadingStage.textContent = `Request failed: ${error.message}`;
    await wait(1300);
  } finally {
    state.isProcessing = false;
    elements.loadingStage.classList.add("hidden");
    if (state.outcome === "active") {
      elements.enactBtn.disabled = !state.selectedCardId;
    }
    render();
  }
};

const restart = async () => {
  state.isProcessing = true;
  elements.loadingStage.classList.remove("hidden");
  elements.loadingStage.textContent = bootstrapStage;
  render();
  try {
    clearPersistedGameId();
    await createGame();
  } finally {
    state.isProcessing = false;
    elements.loadingStage.classList.add("hidden");
    render();
  }
};

const init = async () => {
  state.isProcessing = true;
  elements.loadingStage.classList.remove("hidden");
  elements.loadingStage.textContent = bootstrapStage;
  render();
  try {
    const persistedGameId = readPersistedGameId();
    if (persistedGameId) {
      await resumeGame(persistedGameId);
    } else {
      await createGame();
    }
  } catch (error) {
    if (readPersistedGameId()) {
      clearPersistedGameId();
      elements.loadingStage.textContent = "Saved game is unavailable. Starting a new city...";
      await wait(700);
      await createGame();
    } else {
      elements.loadingStage.textContent = `Startup failed: ${error.message}`;
      await wait(1500);
    }
  } finally {
    state.isProcessing = false;
    elements.loadingStage.classList.add("hidden");
    render();
  }
};

elements.enactBtn.addEventListener("click", () => {
  void enactSelectedCard();
});
elements.restartBtn.addEventListener("click", () => {
  void restart();
});
elements.headerRestartBtn.addEventListener("click", () => {
  void restart();
});

void init();
