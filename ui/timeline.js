const timelineList = document.getElementById("timeline-list");
const activeGameStorageKey = "city-too-much.active-game";

const renderEntries = (entries) => {
  if (entries.length === 0) {
    timelineList.innerHTML = "<p>No turns recorded yet.</p>";
    return;
  }

  timelineList.innerHTML = entries
    .map(
      (entry) => `
      <article class="timeline-item">
        <p><strong>Turn ${entry.turnIndex}</strong></p>
        <p>${entry.cardText}</p>
        <p>Image: <code>${entry.imageUrl}</code></p>
      </article>
    `
    )
    .join("");
};

const init = async () => {
  const gameId = localStorage.getItem(activeGameStorageKey);
  if (!gameId) {
    renderEntries([]);
    return;
  }

  const response = await fetch(`/api/games/${gameId}/timeline`);
  if (!response.ok) {
    renderEntries([]);
    return;
  }
  const payload = await response.json();
  renderEntries(payload.timeline ?? []);
};

void init();
