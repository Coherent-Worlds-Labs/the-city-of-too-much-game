import {
  applyCardToUiState,
  createTimelineEntry,
  createUiState,
  drawHand,
  evaluateUiOutcome
} from "../src/app/ui-state.mjs";

const worldPackPath = "../worlds/the-city-of-too-much.en.json";
const state = {
  worldPack: null,
  ui: null,
  selectedCard: null,
  outcome: "active"
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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const timelineStorageKey = "city-too-much.timeline";

const persistTimeline = (entry) => {
  try {
    const current = JSON.parse(localStorage.getItem(timelineStorageKey) ?? "[]");
    current.push(entry);
    localStorage.setItem(timelineStorageKey, JSON.stringify(current));
  } catch {
    // Keep gameplay responsive even when storage is unavailable.
  }
};

const clearTimeline = () => {
  try {
    localStorage.removeItem(timelineStorageKey);
  } catch {
    // no-op
  }
};

const renderIndicator = () => {
  const axisPercent = state.ui.axis * 100;
  elements.axisDot.style.left = `calc(${axisPercent}% - 9px)`;
};

const renderScene = () => {
  const axis = state.ui.axis;
  const cool = Math.round(52 + (1 - axis) * 50);
  const warm = Math.round(85 + axis * 90);
  elements.scene.style.background = `
    linear-gradient(170deg, rgba(21, 50, 57, 0.44), rgba(182, 81, 46, 0.22)),
    linear-gradient(120deg, rgb(${cool}, 94, 112) 0%, rgb(105, 133, 129) 52%, rgb(${warm}, 122, 82) 100%)
  `;
};

const renderMotifs = () => {
  const motifs = state.ui.emergingThemes.length > 0 ? state.ui.emergingThemes : ["balance"];
  elements.motifList.innerHTML = motifs
    .map((item) => `<li>${item.replaceAll("-", " ")}</li>`)
    .join("");
};

const renderStatus = () => {
  elements.subtitle.textContent =
    state.ui.direction === "protocol"
      ? "Leaning toward Protocol"
      : state.ui.direction === "carnival"
        ? "Growing Carnival"
        : "Tense Balance";
  elements.mood.textContent = state.ui.mood;
  elements.stability.textContent = state.ui.stability;
  elements.turn.textContent = String(state.ui.turn);
};

const renderHistory = () => {
  elements.historyList.innerHTML = state.ui.history
    .slice(0, 10)
    .map(
      (entry) =>
        `<li><strong>Turn ${entry.turn}</strong><br>${entry.card.text}</li>`
    )
    .join("");
};

const cardElement = (card) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "card";
  if (state.selectedCard?.id === card.id) {
    button.classList.add("selected");
  }

  button.innerHTML = `<small>${card.group}</small>${card.text}`;
  button.addEventListener("click", () => {
    state.selectedCard = card;
    elements.enactBtn.disabled = false;
    renderCards();
  });
  return button;
};

const renderCards = () => {
  elements.cardGrid.innerHTML = "";
  state.ui.activeHand.forEach((card) => {
    elements.cardGrid.append(cardElement(card));
  });
};

const render = () => {
  elements.title.textContent = state.ui.title;
  renderIndicator();
  renderScene();
  renderMotifs();
  renderStatus();
  renderHistory();
  renderCards();
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

const enactSelectedCard = async () => {
  if (!state.selectedCard) {
    return;
  }
  elements.enactBtn.disabled = true;
  elements.loadingStage.classList.remove("hidden");
  elements.loadingStage.textContent = state.worldPack.ui.loadingStages[0];
  await wait(700);
  elements.loadingStage.textContent = state.worldPack.ui.loadingStages[1];
  await wait(850);

  state.ui = applyCardToUiState(state.ui, state.selectedCard);
  state.outcome = evaluateUiOutcome(state.ui);
  persistTimeline(createTimelineEntry(state.ui, state.selectedCard));
  state.ui = drawHand(state.ui, state.worldPack, 3);
  state.selectedCard = null;

  elements.scene.classList.add("shift");
  render();
  renderOutcomeOverlay();
  await wait(380);
  elements.scene.classList.remove("shift");
  elements.loadingStage.classList.add("hidden");
  if (state.outcome !== "active") {
    elements.enactBtn.disabled = true;
  }
};

const restart = () => {
  clearTimeline();
  state.ui = drawHand(createUiState(state.worldPack), state.worldPack, 3);
  state.selectedCard = null;
  state.outcome = "active";
  elements.enactBtn.disabled = true;
  render();
  renderOutcomeOverlay();
};

const init = async () => {
  const response = await fetch(worldPackPath);
  const worldPack = await response.json();
  state.worldPack = worldPack;
  clearTimeline();
  state.ui = drawHand(createUiState(worldPack), worldPack, 3);
  render();
  renderOutcomeOverlay();
};

elements.enactBtn.addEventListener("click", () => {
  void enactSelectedCard();
});
elements.restartBtn.addEventListener("click", restart);

void init();
