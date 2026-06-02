// Digital menu: tab switching + detail sheet (open/close, ESC, click-outside)
(function () {
  "use strict";

  // --- Tabs ---
  const tabs = document.querySelectorAll(".dm-tab");
  const panels = document.querySelectorAll(".dm-panel");
  if (tabs.length && panels.length) {
    const select = (id) => {
      tabs.forEach((t) => t.setAttribute("aria-selected", t.dataset.tab === id ? "true" : "false"));
      panels.forEach((p) => { p.hidden = p.dataset.panel !== id; });
      // Reset scroll to top when switching
      const scroll = document.querySelector(".dm-scroll");
      if (scroll) scroll.scrollTop = 0;
    };
    tabs.forEach((t) => t.addEventListener("click", () => select(t.dataset.tab)));
    // Initial: respect aria-selected from HTML, else first tab
    const initial = document.querySelector('.dm-tab[aria-selected="true"]') || tabs[0];
    select(initial.dataset.tab);
  }

  // --- Sheet ---
  const sheet = document.querySelector(".dm-sheet");
  const veil = document.querySelector(".dm-veil");
  const closeBtn = sheet?.querySelector(".dm-sheet__close");

  const fields = {
    title: sheet?.querySelector(".dm-sheet__title"),
    price: sheet?.querySelector(".dm-sheet__price"),
    desc: sheet?.querySelector(".dm-sheet__desc"),
    eyebrow: sheet?.querySelector(".dm-sheet__eyebrow"),
    provenance: sheet?.querySelector(".dm-sheet__provenance"),
    provenanceText: sheet?.querySelector(".dm-sheet__provenance-text"),
    pair: sheet?.querySelector(".dm-sheet__pair"),
    pairText: sheet?.querySelector(".dm-sheet__pair-text"),
  };

  const open = (data) => {
    if (!sheet) return;
    fields.title.textContent = data.name || "";
    fields.price.textContent = data.price || "";
    fields.price.hidden = !data.price;
    fields.desc.textContent = data.desc || "";
    fields.eyebrow.textContent = data.note || "dal menu";
    if (data.provenance) {
      fields.provenance.hidden = false;
      fields.provenanceText.textContent = data.provenance;
    } else {
      fields.provenance.hidden = true;
    }
    if (data.pair) {
      fields.pair.hidden = false;
      fields.pairText.textContent = data.pair;
    } else {
      fields.pair.hidden = true;
    }
    sheet.classList.add("open");
    veil.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    if (!sheet) return;
    sheet.classList.remove("open");
    veil.classList.remove("open");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".dm-row").forEach((row) => {
    row.addEventListener("click", () => {
      open({
        name: row.dataset.name,
        price: row.dataset.price,
        desc: row.dataset.desc,
        note: row.dataset.note,
        provenance: row.dataset.provenance,
        pair: row.dataset.pair,
      });
    });
  });

  veil?.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();
