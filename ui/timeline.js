const timelineStorageKey = "city-too-much.timeline";
const timelineList = document.getElementById("timeline-list");

const readTimeline = () => {
  try {
    return JSON.parse(localStorage.getItem(timelineStorageKey) ?? "[]");
  } catch {
    return [];
  }
};

const render = () => {
  const entries = readTimeline();
  if (entries.length === 0) {
    timelineList.innerHTML = "<p>No turns recorded yet. Play the game to build a timeline.</p>";
    return;
  }

  timelineList.innerHTML = entries
    .map(
      (entry) => `
      <article class="timeline-item">
        <p><strong>Turn ${entry.turn}</strong></p>
        <p>${entry.cardText}</p>
        <p>Mood: ${entry.mood} | Stability: ${entry.stability}</p>
      </article>
    `
    )
    .join("");
};

render();
