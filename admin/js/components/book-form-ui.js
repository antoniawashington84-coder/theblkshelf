window.BookFormUI = {
  escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  toArray(value) {
    if (Array.isArray(value)) return value;

    if (typeof value === "string" && value.trim()) {
      return value
        .split(/[,;|]/)
        .map(item => item.trim())
        .filter(Boolean);
    }

    return [];
  },

  select({ label, name, value, options }) {
    const escape = this.escape;

    return `
      <div class="detail-field">
        <span class="detail-label">${escape(label)}</span>
        <select class="detail-select" name="${escape(name)}">
          <option value="">Select ${escape(label.toLowerCase())}</option>
          ${options.map(option => `
            <option value="${escape(option)}" ${String(value || "") === option ? "selected" : ""}>
              ${escape(option)}
            </option>
          `).join("")}
        </select>
      </div>
    `;
  },

  checkboxPanel({ label, name, values, options, max = null }) {
    const escape = this.escape;
    const selected = this.toArray(values);

    return `
      <h3>${escape(label)}</h3>
      <details class="option-panel" open>
        <summary>${max ? `Select up to ${max}` : `Select ${escape(label.toLowerCase())}`}</summary>
        <div class="option-panel-body">
          ${max ? `<p class="option-help">Choose up to ${max}.</p>` : ""}
          <div class="checkbox-grid">
            ${options.map(option => `
              <label class="check-card">
                <input
                  type="checkbox"
                  name="${escape(name)}"
                  value="${escape(option)}"
                  ${selected.includes(option) ? "checked" : ""}
                  data-max="${max || ""}"
                >
                <span>${escape(option)}</span>
              </label>
            `).join("")}
          </div>
        </div>
      </details>
    `;
  }
};