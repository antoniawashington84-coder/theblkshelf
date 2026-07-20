window.SeriesPicker = (() => {
  let searchTimer = null;
  let activeInput = null;

  function clean(value) {
    return String(value || "").trim();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getDropdown() {
    let dropdown = document.getElementById("globalAutocompleteDropdown");

    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.id = "globalAutocompleteDropdown";
      dropdown.className = "global-autocomplete hidden";
      document.body.appendChild(dropdown);
    }

    return dropdown;
  }

  function positionDropdown(input) {
    const dropdown = getDropdown();
    const rect = input.getBoundingClientRect();

    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.top = `${rect.bottom + window.scrollY + 6}px`;
    dropdown.style.width = `${rect.width}px`;
  }

  function hideSuggestions() {
    const dropdown = getDropdown();
    dropdown.classList.add("hidden");
    dropdown.innerHTML = "";
  }

  async function search(query) {
    if (!activeInput || query.length < 2) {
      hideSuggestions();
      return;
    }

    const { data, error } = await supabaseClient
      .from("books")
      .select("Series_Name")
      .ilike("Series_Name", `%${query}%`)
      .not("Series_Name", "is", null)
      .limit(50);

    if (error) {
      console.error("Series search failed:", error);
      hideSuggestions();
      return;
    }

    const seriesNames = [...new Set(
      (data || [])
        .map(item => clean(item.Series_Name))
        .filter(Boolean)
    )].slice(0, 8);

    if (!seriesNames.length) {
      hideSuggestions();
      return;
    }

    const dropdown = getDropdown();

    dropdown.innerHTML = seriesNames.map(name => `
      <button
        class="suggestion-item"
        type="button"
        data-series-name="${escapeHtml(name)}"
      >
        ${escapeHtml(name)}
        <span class="suggestion-meta">Existing series</span>
      </button>
    `).join("");

    dropdown.querySelectorAll(".suggestion-item").forEach(button => {
      button.addEventListener("click", () => {
        activeInput.value = button.dataset.seriesName || "";
        hideSuggestions();
      });
    });

    positionDropdown(activeInput);
    dropdown.classList.remove("hidden");
  }

  function setup(inputId = "seriesNameInput") {
    const input = document.getElementById(inputId);
    if (!input) return;

    activeInput = input;

    input.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => search(clean(input.value)), 250);
    });

    input.addEventListener("focus", () => {
      activeInput = input;
      if (clean(input.value).length >= 2) search(clean(input.value));
    });

    input.addEventListener("keydown", event => {
      if (event.key === "Escape") hideSuggestions();
    });

    document.addEventListener("click", event => {
      const dropdown = getDropdown();

      if (!input.contains(event.target) && !dropdown.contains(event.target)) {
        hideSuggestions();
      }
    });
  }

  return { setup };
})();