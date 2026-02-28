import { applyCardToUiState, createUiState, drawHand } from "../src/app/ui-state.mjs";

const worldPackPath = "../worlds/the-city-of-too-much.en.json";
const state = {
  worldPack: null,
  ui: null,
  selectedCard: null
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
  turn: document.getElementById("turn")
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  state.ui = drawHand(state.ui, state.worldPack, 3);
  state.selectedCard = null;

  elements.scene.classList.add("shift");
  render();
  await wait(380);
  elements.scene.classList.remove("shift");
  elements.loadingStage.classList.add("hidden");
};

const init = async () => {
  const response = await fetch(worldPackPath);
  const worldPack = await response.json();
  state.worldPack = worldPack;
  state.ui = drawHand(createUiState(worldPack), worldPack, 3);
  render();
};

elements.enactBtn.addEventListener("click", () => {
  void enactSelectedCard();
});

void init();
