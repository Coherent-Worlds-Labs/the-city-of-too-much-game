const state = {
  gameId: null,
  worldTitle: "The City of Too Much",
  hand: [],
  history: [],
  timeline: [],
  availableGames: [],
  initialImageUrl: null,
  selectedViewType: "timeline",
  selectedTimelineIndex: -1,
  selectedCardId: null,
  axis: 0.5,
  direction: "balanced",
  mood: "Tense Balance",
  stability: "High",
  turn: 0,
  outcome: "active",
  isProcessing: false,
  sceneImageUrl: null,
  scenePanImageKey: null
};

const elements = {
  title: document.getElementById("title"),
  axisDot: document.getElementById("axis-dot"),
  scene: document.getElementById("scene"),
  sceneStepCard: document.getElementById("scene-step-card"),
  scenePrevBtn: document.getElementById("scene-prev-btn"),
  sceneNextBtn: document.getElementById("scene-next-btn"),
  loadingStage: document.getElementById("loading-stage"),
  motifList: document.getElementById("motif-list"),
  historyList: document.getElementById("history-list"),
  cardGrid: document.getElementById("card-grid"),
  enactBtn: document.getElementById("enact-btn"),
  mood: document.getElementById("mood"),
  stability: document.getElementById("stability"),
  turn: document.getElementById("turn"),
  worldSelect: document.getElementById("world-select"),
  openWorldBtn: document.getElementById("open-world-btn"),
  overlay: document.getElementById("outcome-overlay"),
  outcomeTitle: document.getElementById("outcome-title"),
  outcomeText: document.getElementById("outcome-text"),
  restartBtn: document.getElementById("restart-btn"),
  headerRestartBtn: document.getElementById("header-restart-btn")
};

const loadingStages = ["Interpreting the city...", "Rendering the new reality..."];
const bootstrapStage = "Preparing the first city snapshot...";
const activeGameStorageKey = "city-too-much.active-game";
const pendingTurnStorageKey = "city-too-much.pending-turn";
const pendingStageLabel = "Rendering the new reality...";
const pendingTurnMaxAgeMs = 120_000;
const pendingPollIntervalMs = 1_800;
const pendingPollAttempts = 40;

let pendingRecoveryActive = false;

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

const persistPendingTurn = ({ gameId, expectedTurn, cardId }) => {
  try {
    localStorage.setItem(
      pendingTurnStorageKey,
      JSON.stringify({
        gameId,
        expectedTurn,
        cardId,
        startedAt: Date.now()
      })
    );
  } catch {
    // ignore local storage errors
  }
};

const clearPendingTurn = () => {
  try {
    localStorage.removeItem(pendingTurnStorageKey);
  } catch {
    // ignore local storage errors
  }
};

const readPendingTurn = () => {
  try {
    const raw = localStorage.getItem(pendingTurnStorageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.gameId !== "string" ||
      !Number.isInteger(parsed.expectedTurn) ||
      !Number.isInteger(parsed.startedAt)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const isPendingMarkerFresh = (marker) => Date.now() - marker.startedAt <= pendingTurnMaxAgeMs;

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

const outcomeContentMap = {
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

const getOutcomeContent = (outcome) =>
  outcomeContentMap[outcome] ?? {
    title: "World Closed",
    text: "This city session is complete."
  };

const showProcessingStage = (text) => {
  state.isProcessing = true;
  elements.loadingStage.classList.remove("hidden");
  elements.loadingStage.textContent = text;
};

const hideProcessingStage = () => {
  state.isProcessing = false;
  elements.loadingStage.classList.add("hidden");
};

const formatSessionLabel = (game) => {
  const statusLabel =
    game.status === "active"
      ? "Active"
      : game.status === "survived"
        ? "Survived"
        : game.status === "protocol-collapse"
          ? "Protocol Collapse"
          : game.status === "carnival-collapse"
            ? "Carnival Collapse"
            : game.status === "incoherence-collapse"
              ? "Incoherence Collapse"
              : game.status ?? "Unknown";
  return `${statusLabel} · Turn ${game.currentTurn}`;
};

const renderWorldSwitcher = () => {
  const select = elements.worldSelect;
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }
  const games = Array.isArray(state.availableGames) ? state.availableGames : [];
  if (games.length === 0) {
    select.innerHTML = "<option value=\"\">No sessions</option>";
    select.disabled = true;
    if (elements.openWorldBtn) {
      elements.openWorldBtn.disabled = true;
    }
    return;
  }

  const activeOptions = games.filter((game) => game.status === "active");
  const completedOptions = games.filter((game) => game.status !== "active");
  const groups = [];
  if (activeOptions.length > 0) {
    groups.push({
      title: "Active",
      games: activeOptions
    });
  }
  if (completedOptions.length > 0) {
    groups.push({
      title: "Completed",
      games: completedOptions
    });
  }

  select.innerHTML = groups
    .map(
      (group) =>
        `<optgroup label="${group.title}">${group.games
          .map(
            (game) =>
              `<option value="${game.gameId}" ${game.gameId === state.gameId ? "selected" : ""}>${formatSessionLabel(game)}</option>`
          )
          .join("")}</optgroup>`
    )
    .join("");
  select.disabled = false;
  if (elements.openWorldBtn) {
    elements.openWorldBtn.disabled = !select.value || select.value === state.gameId;
  }
};

const renderIndicator = () => {
  elements.axisDot.style.left = `calc(${state.axis * 100}% - 9px)`;
};

const randomRange = (min, max) => min + Math.random() * (max - min);

const pickPanPoint = (exclude = null) => {
  for (let i = 0; i < 8; i += 1) {
    const point = {
      x: randomRange(18, 82),
      y: randomRange(18, 82)
    };
    if (!exclude) {
      return point;
    }
    const delta = Math.hypot(point.x - exclude.x, point.y - exclude.y);
    if (delta >= 16) {
      return point;
    }
  }
  return {
    x: exclude ? Math.max(12, Math.min(88, exclude.x + 18)) : 50,
    y: exclude ? Math.max(12, Math.min(88, exclude.y - 14)) : 50
  };
};

const configureScenePanMotion = (imageUrl) => {
  const start = pickPanPoint();
  const end = pickPanPoint(start);
  const durationMs = Math.round(randomRange(18_000, 30_000));
  const scaleStart = randomRange(1.08, 1.14);
  const scaleEnd = scaleStart + randomRange(0.02, 0.06);

  elements.scene.style.setProperty("--scene-image-url", `url(${JSON.stringify(imageUrl)})`);
  elements.scene.style.setProperty("--pan-x-start", `${start.x.toFixed(2)}%`);
  elements.scene.style.setProperty("--pan-y-start", `${start.y.toFixed(2)}%`);
  elements.scene.style.setProperty("--pan-x-end", `${end.x.toFixed(2)}%`);
  elements.scene.style.setProperty("--pan-y-end", `${end.y.toFixed(2)}%`);
  elements.scene.style.setProperty("--pan-scale-start", scaleStart.toFixed(3));
  elements.scene.style.setProperty("--pan-scale-end", scaleEnd.toFixed(3));
  elements.scene.style.setProperty("--pan-duration", `${durationMs}ms`);
};

const renderScene = () => {
  const cool = Math.round(52 + (1 - state.axis) * 50);
  const warm = Math.round(85 + state.axis * 90);
  elements.scene.style.background = `
    linear-gradient(170deg, rgba(21, 50, 57, 0.44), rgba(182, 81, 46, 0.22)),
    linear-gradient(120deg, rgb(${cool}, 94, 112) 0%, rgb(105, 133, 129) 52%, rgb(${warm}, 122, 82) 100%)
  `;
  elements.scene.style.backgroundSize = "cover, cover";
  elements.scene.style.backgroundPosition = "center, center";

  if (!state.sceneImageUrl) {
    elements.scene.classList.remove("has-image");
    elements.scene.style.setProperty("--scene-image-url", "none");
    document.body.classList.remove("has-scene-background");
    document.body.style.setProperty("--app-bg-image", "none");
    state.scenePanImageKey = null;
    return;
  }

  document.body.classList.add("has-scene-background");
  document.body.style.setProperty("--app-bg-image", `url(${JSON.stringify(state.sceneImageUrl)})`);
  elements.scene.classList.add("has-image");
  if (state.scenePanImageKey !== state.sceneImageUrl) {
    configureScenePanMotion(state.sceneImageUrl);
    state.scenePanImageKey = state.sceneImageUrl;
  }
};

const renderMotifs = () => {
  const selectedTurnIndex =
    state.selectedViewType === "timeline"
      ? state.timeline[state.selectedTimelineIndex]?.turnIndex ?? null
      : null;
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
  elements.mood.textContent = state.mood;
  elements.stability.textContent = state.stability;
  elements.turn.textContent = String(state.turn);
  renderWorldSwitcher();
};

const setNeutralVisualState = () => {
  state.axis = 0.5;
  state.direction = "balanced";
  state.mood = "Tense Balance";
  state.stability = "High";
};

const getSceneEntries = () => {
  const entries = [];
  state.timeline.forEach((entry, index) => {
    entries.push({
      key: `timeline-${index}`,
      type: "timeline",
      timelineIndex: index,
      title: entry.turnIndex === 0 ? "Genesis" : `Turn ${entry.turnIndex}`,
      text: entry.cardText ?? (entry.turnIndex === 0 ? "Seed scene" : "Scene update"),
      cardText: entry.cardText ?? (entry.turnIndex === 0 ? "Seed scene" : "Scene update"),
      imageUrl: entry.imageUrl ?? null,
      turnIndex: entry.turnIndex ?? null
    });
  });
  return entries;
};

const getSelectedSceneEntry = (entries = getSceneEntries()) => {
  if (entries.length === 0) {
    return null;
  }
  if (state.selectedViewType === "timeline" && state.selectedTimelineIndex >= 0) {
    return entries.find((entry) => entry.key === `timeline-${state.selectedTimelineIndex}`) ?? entries.at(-1);
  }
  return entries.at(-1);
};

const applySelectedSceneEntry = (entry) => {
  if (!entry) {
    return;
  }
  state.selectedViewType = "timeline";
  state.selectedTimelineIndex = entry.timelineIndex ?? -1;
  applyVisualStateForSelectedTurn(entry.turnIndex ?? null);
  state.sceneImageUrl = entry.imageUrl ?? null;
};

const ensureActiveHistoryEntryVisible = () => {
  const active = elements.historyList.querySelector(".history-entry.is-active");
  if (!(active instanceof HTMLElement)) {
    return;
  }
  const panel = elements.historyList.closest(".panel.history");
  const container =
    elements.historyList.scrollHeight > elements.historyList.clientHeight
      ? elements.historyList
      : panel instanceof HTMLElement && panel.scrollHeight > panel.clientHeight
      ? panel
      : elements.historyList;
  const listTop = container.scrollTop;
  const listBottom = listTop + container.clientHeight;
  const entryTop = active.offsetTop - (container === elements.historyList ? 0 : elements.historyList.offsetTop);
  const entryBottom = entryTop + active.offsetHeight;
  const viewportPadding = 8;
  if (entryTop - viewportPadding < listTop) {
    container.scrollTop = Math.max(entryTop - viewportPadding, 0);
    return;
  }
  if (entryBottom + viewportPadding > listBottom) {
    container.scrollTop = entryBottom + viewportPadding - container.clientHeight;
  }
};

const moveSelectedSceneEntry = (delta) => {
  const entries = getSceneEntries();
  if (entries.length === 0) {
    return;
  }
  const selected = getSelectedSceneEntry(entries);
  const selectedIndex = selected ? entries.findIndex((entry) => entry.key === selected.key) : entries.length - 1;
  const nextIndex = Math.max(0, Math.min(entries.length - 1, selectedIndex + delta));
  if (nextIndex === selectedIndex) {
    return;
  }
  applySelectedSceneEntry(entries[nextIndex]);
  render();
  requestAnimationFrame(() => {
    ensureActiveHistoryEntryVisible();
  });
};

const renderSceneStepOverlay = () => {
  const entries = getSceneEntries();
  const selected = getSelectedSceneEntry(entries);
  const selectedIndex = selected ? entries.findIndex((entry) => entry.key === selected.key) : -1;

  if (!selected) {
    elements.sceneStepCard.textContent = "Turn 0: n/a";
    elements.scenePrevBtn.disabled = true;
    elements.sceneNextBtn.disabled = true;
    return;
  }

  const turnIndex = Number.isInteger(selected.turnIndex) ? selected.turnIndex : 0;
  elements.sceneStepCard.textContent = `Turn ${turnIndex}: ${selected.cardText}`;
  elements.scenePrevBtn.disabled = selectedIndex <= 0;
  elements.sceneNextBtn.disabled = selectedIndex < 0 || selectedIndex >= entries.length - 1;
};

const applyVisualStateForSelectedTurn = (turnIndex) => {
  if (!Number.isInteger(turnIndex) || turnIndex <= 0) {
    setNeutralVisualState();
    return;
  }
  const historicalTurn = state.history.find((entry) => entry.turnIndex === turnIndex);
  if (!historicalTurn) {
    setNeutralVisualState();
    return;
  }
  hydrateFromTurn(historicalTurn);
};

const renderHistory = () => {
  const entries = getSceneEntries().map((entry) => ({
    ...entry,
    active: state.selectedViewType === "timeline" && state.selectedTimelineIndex === entry.timelineIndex
  }));

  if (entries.length === 0) {
    elements.historyList.innerHTML = "<li class=\"history-empty\">No snapshots yet.</li>";
    return;
  }
  elements.historyList.innerHTML = entries
    .map((entry) => {
      const active = entry.active ? "is-active" : "";
      return `<li><button type="button" class="history-entry ${active}" data-key="${entry.key}"><strong>${entry.title}</strong><span>${entry.text}</span></button></li>`;
    })
    .join("");
  elements.historyList.querySelectorAll("button[data-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.key;
      if (!key) {
        return;
      }
      const entry = entries.find((item) => item.key === key);
      if (!entry) {
        return;
      }
      applySelectedSceneEntry(entry);
      render();
    });
  });
  ensureActiveHistoryEntryVisible();
};

const renderCards = () => {
  elements.cardGrid.innerHTML = "";
  if (state.outcome !== "active") {
    const content = getOutcomeContent(state.outcome);
    const note = document.createElement("article");
    note.className = "closed-world-note";
    note.innerHTML = `<strong>${content.title}</strong><p>${content.text}</p><p>This session is complete. Use History to inspect every step from Genesis to the final state.</p>`;
    elements.cardGrid.append(note);
    elements.enactBtn.disabled = true;
    return;
  }
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
  elements.overlay.classList.add("hidden");
  elements.outcomeTitle.textContent = "";
  elements.outcomeText.textContent = "";
};

const render = () => {
  elements.title.textContent = state.worldTitle;
  renderIndicator();
  renderScene();
  renderSceneStepOverlay();
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
  state.initialImageUrl =
    payload?.seedScene?.imageUrl ??
    state.timeline.find((entry) => entry.turnIndex === 0)?.imageUrl ??
    null;

  if (state.history.length > 0) {
    hydrateFromTurn(state.history.at(-1));
  } else {
    setNeutralVisualState();
  }

  if (state.timeline.length > 0) {
    state.selectedViewType = "timeline";
    state.selectedTimelineIndex = state.timeline.length - 1;
    state.sceneImageUrl = state.timeline[state.selectedTimelineIndex].imageUrl ?? null;
  } else {
    state.selectedViewType = "timeline";
    state.selectedTimelineIndex = -1;
    state.sceneImageUrl = state.initialImageUrl;
  }

  elements.enactBtn.disabled = true;
  persistGameId();
};

const refreshAvailableGames = async () => {
  try {
    const listing = await api("/api/games");
    state.availableGames = listing?.games ?? [];
  } catch {
    // Session catalog is optional for core gameplay resume.
    // Keep UI functional even if listing endpoint is temporarily unavailable.
    if (state.gameId) {
      const fallbackStatus = state.outcome === "active" ? "active" : state.outcome;
      state.availableGames = [
        {
          gameId: state.gameId,
          worldId: "the-city-of-too-much",
          status: fallbackStatus,
          currentTurn: state.turn,
          seedImageUrl: state.initialImageUrl ?? null,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ];
    } else {
      state.availableGames = [];
    }
  }
};

const startPendingRecoveryLoop = (marker) => {
  if (pendingRecoveryActive) {
    return;
  }
  pendingRecoveryActive = true;
  void (async () => {
    try {
      for (let attempt = 0; attempt < pendingPollAttempts; attempt += 1) {
        await wait(pendingPollIntervalMs);
        const latestMarker = readPendingTurn();
        if (!latestMarker || latestMarker.gameId !== state.gameId) {
          break;
        }
        if (!isPendingMarkerFresh(latestMarker)) {
          clearPendingTurn();
          break;
        }

        try {
          const loaded = await api(`/api/games/${state.gameId}/state`);
          applyLoadedGameState(loaded);
          if (state.turn > latestMarker.expectedTurn || state.outcome !== "active") {
            clearPendingTurn();
            hideProcessingStage();
            render();
            return;
          }
          showProcessingStage(pendingStageLabel);
          render();
        } catch {
          // tolerate transient polling failures and retry
        }
      }
    } finally {
      pendingRecoveryActive = false;
      clearPendingTurn();
      hideProcessingStage();
      render();
    }
  })();
};

const recoverPendingGenerationState = () => {
  const marker = readPendingTurn();
  if (!marker) {
    return false;
  }
  if (!state.gameId || marker.gameId !== state.gameId || !isPendingMarkerFresh(marker)) {
    clearPendingTurn();
    return false;
  }
  if (state.turn > marker.expectedTurn || state.outcome !== "active") {
    clearPendingTurn();
    return false;
  }

  showProcessingStage(pendingStageLabel);
  startPendingRecoveryLoop(marker);
  return true;
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
  await refreshAvailableGames();
  state.isProcessing = false;
};

const resumeGame = async (gameId) => {
  const loaded = await api(`/api/games/${gameId}/state`);
  applyLoadedGameState(loaded);
  await refreshAvailableGames();
};

const enactSelectedCard = async () => {
  if (!state.selectedCardId || !state.gameId || state.outcome !== "active") {
    return;
  }
  persistPendingTurn({
    gameId: state.gameId,
    expectedTurn: state.turn,
    cardId: state.selectedCardId
  });
  showProcessingStage(loadingStages[0]);
  elements.enactBtn.disabled = true;
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
    state.initialImageUrl =
      state.initialImageUrl ??
      state.timeline.find((entry) => entry.turnIndex === 0)?.imageUrl ??
      null;
    state.selectedViewType = "timeline";
    state.selectedTimelineIndex = state.timeline.length - 1;
    state.sceneImageUrl = played.timeline.at(-1)?.imageUrl ?? state.sceneImageUrl;
    state.history = await api(`/api/games/${state.gameId}/history`).then((payload) => payload.history);
    await refreshAvailableGames();
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
    clearPendingTurn();
    hideProcessingStage();
    if (state.outcome === "active") {
      elements.enactBtn.disabled = !state.selectedCardId;
    }
    render();
  }
};

const restart = async () => {
  clearPendingTurn();
  showProcessingStage(bootstrapStage);
  render();
  try {
    clearPersistedGameId();
    await createGame();
  } finally {
    hideProcessingStage();
    render();
  }
};

const init = async () => {
  showProcessingStage(bootstrapStage);
  render();
  let recoveredPending = false;
  try {
    const persistedGameId = readPersistedGameId();
    if (persistedGameId) {
      await resumeGame(persistedGameId);
    } else {
      await createGame();
    }
    await refreshAvailableGames();
    recoveredPending = recoverPendingGenerationState();
  } catch (error) {
    if (readPersistedGameId()) {
      clearPersistedGameId();
      elements.loadingStage.textContent = "Saved game is unavailable. Starting a new city...";
      await wait(700);
      await createGame();
      await refreshAvailableGames();
      recoveredPending = recoverPendingGenerationState();
    } else {
      elements.loadingStage.textContent = `Startup failed: ${error.message}`;
      await wait(1500);
    }
  } finally {
    if (!recoveredPending) {
      hideProcessingStage();
    }
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
elements.worldSelect.addEventListener("change", () => {
  if (elements.openWorldBtn) {
    elements.openWorldBtn.disabled = !elements.worldSelect.value || elements.worldSelect.value === state.gameId;
  }
});
elements.openWorldBtn.addEventListener("click", async () => {
  const targetGameId = elements.worldSelect.value;
  if (!targetGameId || targetGameId === state.gameId) {
    return;
  }
  clearPendingTurn();
  hideProcessingStage();
  await resumeGame(targetGameId);
  render();
});
elements.scenePrevBtn.addEventListener("click", () => {
  moveSelectedSceneEntry(-1);
});
elements.sceneNextBtn.addEventListener("click", () => {
  moveSelectedSceneEntry(1);
});

void init();
