function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function hideSuggestions(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.classList.add("hidden");
  target.innerHTML = "";
}

function renderSuggestions(targetId, items, renderItem) {
  const target = document.getElementById(targetId);
  if (!target) return;

  if (!items || !items.length) {
    hideSuggestions(targetId);
    return;
  }

  target.innerHTML = items.map(renderItem).join("");
  target.classList.remove("hidden");
}

function setupClickAway(containerId, suggestionsId) {
  document.addEventListener("click", event => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!container.contains(event.target)) {
      hideSuggestions(suggestionsId);
    }
  });
}