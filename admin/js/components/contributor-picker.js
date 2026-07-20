window.ContributorPicker = (() => {
  let contributors = [];
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

  function getEls() {
    return {
      picker: document.getElementById("coAuthorPicker"),
      tags: document.getElementById("coAuthorTags"),
      input: document.getElementById("coAuthorInput")
    };
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

  function render() {
    const { tags } = getEls();
    if (!tags) return;

    tags.innerHTML = contributors.map((author, index) => `
      <span class="author-tag ${author.matched ? "" : "unmatched"}">
        ${author.matched ? "✓ " : ""}${escapeHtml(author.name)}
        <button type="button" data-remove-contributor="${index}">×</button>
      </span>
    `).join("");

    tags.querySelectorAll("[data-remove-contributor]").forEach(button => {
      button.addEventListener("click", () => {
        contributors.splice(Number(button.dataset.removeContributor), 1);
        render();
      });
    });
  }

  function add(author) {
    const name = clean(author.name || author.AUTHOR_NAME);
    if (!name) return;

    const duplicate = contributors.some(item =>
      clean(item.name).toLowerCase() === name.toLowerCase()
    );

    if (duplicate) return;

    contributors.push({
      name,
      author_id: author.author_id || author.AUTHOR_ID || null,
      matched: Boolean(author.author_id || author.AUTHOR_ID)
    });

    const { input } = getEls();
    if (input) input.value = "";

    hideSuggestions();
    render();
  }

  async function search(query) {
    if (!activeInput || !query || query.length < 2) {
      hideSuggestions();
      return;
    }

    const { data, error } = await supabaseClient
      .from("authors")
      .select("AUTHOR_ID, AUTHOR_NAME, GENRES")
      .ilike("AUTHOR_NAME", `%${query}%`)
      .in("APPROVAL", ["Approved", "approved", "Yes", "YES"])
      .limit(8);

    if (error) {
      console.error("Contributor search failed:", error);
      hideSuggestions();
      return;
    }

    if (!data?.length) {
      hideSuggestions();
      return;
    }

    const dropdown = getDropdown();

    dropdown.innerHTML = data.map(author => `
      <button
        class="suggestion-item"
        type="button"
        data-author-id="${escapeHtml(author.AUTHOR_ID)}"
        data-author-name="${escapeHtml(author.AUTHOR_NAME)}"
      >
        ${escapeHtml(author.AUTHOR_NAME)}
        <span class="suggestion-meta">${escapeHtml(author.GENRES || "Approved BLK Shelf author")}</span>
      </button>
    `).join("");

    dropdown.querySelectorAll(".suggestion-item").forEach(button => {
      button.addEventListener("click", () => {
        add({
          name: button.dataset.authorName,
          author_id: button.dataset.authorId
        });
      });
    });

    positionDropdown(activeInput);
    dropdown.classList.remove("hidden");
  }

  function setup() {
    const { picker, input } = getEls();
    if (!picker || !input) return;

    activeInput = input;

    input.addEventListener("input", () => {
      clearTimeout(searchTimer);
      const query = clean(input.value);

      searchTimer = setTimeout(() => {
        search(query);
      }, 250);
    });

    input.addEventListener("focus", () => {
      activeInput = input;
      if (clean(input.value).length >= 2) search(clean(input.value));
    });

    input.addEventListener("keydown", event => {
      const value = clean(input.value);

      if ((event.key === "Enter" || event.key === ",") && value) {
        event.preventDefault();
        add({ name: value.replace(/,$/, ""), author_id: null });
      }

      if (event.key === "Escape") {
        hideSuggestions();
      }
    });

    window.addEventListener("scroll", () => {
      if (activeInput && !getDropdown().classList.contains("hidden")) {
        positionDropdown(activeInput);
      }
    }, true);

    window.addEventListener("resize", () => {
      if (activeInput && !getDropdown().classList.contains("hidden")) {
        positionDropdown(activeInput);
      }
    });

    document.addEventListener("click", event => {
      const dropdown = getDropdown();

      if (
        !picker.contains(event.target) &&
        !dropdown.contains(event.target)
      ) {
        hideSuggestions();
      }
    });

    render();
  }

  return {
    setup,
    render,
    add,
    getValues() {
      return contributors;
    },
    setValues(values = []) {
      contributors = Array.isArray(values) ? [...values] : [];
      render();
    }
  };
})();