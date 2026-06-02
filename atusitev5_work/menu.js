// Menu page: (1) tab switcher with deep-link hash, (2) "Componi il tuo piatto" builder.
(function () {
  "use strict";

  // ---------- Tab switcher ----------
  const tabs = document.querySelectorAll(".menu-tab");
  const panels = document.querySelectorAll(".menu-panel");
  if (tabs.length && panels.length) {
    const select = (id, { scroll = false } = {}) => {
      let found = false;
      tabs.forEach((t) => {
        const match = t.dataset.tab === id;
        t.setAttribute("aria-selected", match ? "true" : "false");
        if (match) found = true;
      });
      if (!found) return;
      panels.forEach((p) => { p.hidden = p.dataset.panel !== id; });
      history.replaceState(null, "", `#${id}`);
      if (scroll) {
        const target = document.getElementById("menu-section");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    tabs.forEach((t) => t.addEventListener("click", () => select(t.dataset.tab, { scroll: true })));
    const initial = window.location.hash.replace("#", "");
    const valid = Array.from(tabs).some((t) => t.dataset.tab === initial);
    select(valid ? initial : tabs[0].dataset.tab);
  }

  // ---------- "Componi il tuo piatto" builder ----------
  const builder = document.getElementById("plate-builder");
  const output = document.getElementById("builder-output");
  if (builder && output) {
    const chosen = { pasta: null, condimento: null };

    const render = () => {
      if (chosen.pasta && chosen.condimento) {
        output.innerHTML = `${chosen.pasta} ${chosen.condimento}`;
      } else if (chosen.pasta) {
        output.innerHTML = `${chosen.pasta} <span class="empty-hint">…e ora il condimento</span>`;
      } else if (chosen.condimento) {
        output.innerHTML = `<span class="empty-hint">Scegli la pasta da abbinare</span>`;
      } else {
        output.innerHTML = `<span class="empty-hint">Scegli pasta e condimento qui sopra…</span>`;
      }
    };

    builder.querySelectorAll(".builder__chips").forEach((group) => {
      const key = group.dataset.group;
      group.addEventListener("click", (e) => {
        const chip = e.target.closest(".builder__chip");
        if (!chip) return;
        const isActive = chip.getAttribute("aria-pressed") === "true";
        // Single-select within the group
        group.querySelectorAll(".builder__chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        if (isActive) {
          chosen[key] = null;          // toggle off
        } else {
          chip.setAttribute("aria-pressed", "true");
          chosen[key] = chip.dataset.value;
        }
        render();
      });
    });
  }
})();
