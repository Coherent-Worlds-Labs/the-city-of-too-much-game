const state = {
  gameId: null,
  worldTitle: "The City of Too Much",
  hand: [],
  history: [],
  timeline: [],
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
  restartBtn: document.getElementById("restart-btn")
};

const loadingStages = ["Interpreting the city...", "Rendering the new reality..."];
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
  const latest = state.history[0]?.judgeResult?.new_state?.active_motifs ?? [];
  const items = latest.slice(0, 3).map((item) => item.name?.replaceAll("_", " ") ?? "motif");
  elements.motifList.innerHTML = (items.length > 0 ? items : ["balance"])
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
  elements.historyList.innerHTML = state.history
    .slice(0, 10)
    .map(
      (entry) =>
        `<li><strong>Turn ${entry.turnIndex}</strong><br>${entry.card.text}</li>`
    )
    .join("");
};

const renderCards = () => {
  elements.cardGrid.innerHTML = "";
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

const createGame = async () => {
  const created = await api("/api/games", {
    method: "POST",
    body: JSON.stringify({})
  });
  state.gameId = created.game.game_id;
  state.worldTitle = created.world.title;
  state.turn = created.game.current_turn;
  state.hand = created.hand;
  state.history = [];
  state.timeline = created.timeline ?? [];
  state.sceneImageUrl = created.seedScene?.imageUrl ?? null;
  state.selectedCardId = null;
  state.axis = 0.5;
  state.direction = "balanced";
  state.mood = "Tense Balance";
  state.stability = "High";
  state.outcome = "active";
  state.isProcessing = false;
  elements.enactBtn.disabled = true;
  persistGameId();
  render();
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
  await createGame();
};

const init = async () => {
  await createGame();
};

elements.enactBtn.addEventListener("click", () => {
  void enactSelectedCard();
});
elements.restartBtn.addEventListener("click", () => {
  void restart();
});

void init();
