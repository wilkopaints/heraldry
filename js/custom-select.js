// Custom dropdown that wraps the native <select>. The native select stays in the
// DOM (driven by Playwright and assistive tech) but is visually hidden; users see
// a fully styled DOM widget. Sidesteps Firefox/macOS native popup bugs (white-on-
// white contrast on Sonoma, "Wingdings" glyph rendering on Sonoma/Sequoia).

(function () {
  const valueDesc = Object.getOwnPropertyDescriptor(
    HTMLSelectElement.prototype,
    "value",
  );
  let openInstance = null;

  function enhance(select) {
    if (select.dataset.csEnhanced) return;
    select.dataset.csEnhanced = "1";

    const wrap = document.createElement("span");
    wrap.className = "cs";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "cs-trigger";
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");

    const labelEl = select.closest("label");
    if (labelEl) {
      const labelText = Array.from(labelEl.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent.trim())
        .filter(Boolean)
        .join(" ");
      if (labelText) button.setAttribute("aria-label", labelText);
    }

    const valueSpan = document.createElement("span");
    valueSpan.className = "cs-value";
    const caret = document.createElement("span");
    caret.className = "cs-caret";
    caret.setAttribute("aria-hidden", "true");
    caret.textContent = "▾";
    button.appendChild(valueSpan);
    button.appendChild(caret);

    const listbox = document.createElement("ul");
    listbox.className = "cs-listbox";
    listbox.setAttribute("role", "listbox");
    listbox.hidden = true;

    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(button);
    wrap.appendChild(select);
    wrap.appendChild(listbox);

    function rebuild() {
      listbox.innerHTML = "";
      Array.from(select.options).forEach((opt, i) => {
        const li = document.createElement("li");
        li.className = "cs-option";
        li.setAttribute("role", "option");
        li.dataset.value = opt.value;
        li.id = `cs-${select.id || "sel"}-opt-${i}`;
        li.textContent = opt.textContent;
        li.addEventListener("click", (e) => {
          // Stop the click from bubbling to the wrapping <label>, which would otherwise
          // fire a synthetic click on the first labelable descendant (our trigger button)
          // and immediately re-open the dropdown.
          e.preventDefault();
          e.stopPropagation();
          choose(opt.value);
          close();
          button.focus();
        });
        li.addEventListener("mouseenter", () => activate(li));
        listbox.appendChild(li);
      });
      sync();
    }

    function sync() {
      const selOpt = select.options[select.selectedIndex];
      valueSpan.textContent = selOpt ? selOpt.textContent : "";
      Array.from(listbox.children).forEach((li) => {
        li.setAttribute(
          "aria-selected",
          li.dataset.value === select.value ? "true" : "false",
        );
      });
    }

    function choose(value) {
      if (select.value === value) return;
      valueDesc.set.call(select, value);
      select.dispatchEvent(new Event("change", { bubbles: true }));
      sync();
    }

    function activate(li) {
      Array.from(listbox.children).forEach((el) =>
        el.classList.remove("cs-active"),
      );
      if (!li) return;
      li.classList.add("cs-active");
      button.setAttribute("aria-activedescendant", li.id);
      li.scrollIntoView({ block: "nearest" });
    }

    function open() {
      if (openInstance && openInstance !== api) openInstance.close();
      listbox.hidden = false;
      button.setAttribute("aria-expanded", "true");
      wrap.classList.add("cs-open");
      const cur =
        listbox.querySelector('[aria-selected="true"]') ||
        listbox.firstElementChild;
      activate(cur);
      openInstance = api;
    }

    function close() {
      listbox.hidden = true;
      button.setAttribute("aria-expanded", "false");
      button.removeAttribute("aria-activedescendant");
      wrap.classList.remove("cs-open");
      Array.from(listbox.children).forEach((el) =>
        el.classList.remove("cs-active"),
      );
      if (openInstance === api) openInstance = null;
    }

    function move(delta) {
      const items = Array.from(listbox.children);
      if (!items.length) return;
      const active = listbox.querySelector(".cs-active");
      let idx = active ? items.indexOf(active) : -1;
      idx = Math.max(0, Math.min(items.length - 1, idx + delta));
      activate(items[idx]);
    }

    button.addEventListener("click", () => (listbox.hidden ? open() : close()));

    button.addEventListener("keydown", (e) => {
      const visible = !listbox.hidden;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          visible ? move(1) : open();
          break;
        case "ArrowUp":
          e.preventDefault();
          visible ? move(-1) : open();
          break;
        case "Home":
          if (visible) {
            e.preventDefault();
            activate(listbox.firstElementChild);
          }
          break;
        case "End":
          if (visible) {
            e.preventDefault();
            activate(listbox.lastElementChild);
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (!visible) return open();
          {
            const a = listbox.querySelector(".cs-active");
            if (a) {
              choose(a.dataset.value);
              close();
            }
          }
          break;
        case "Escape":
          if (visible) {
            e.preventDefault();
            close();
          }
          break;
        case "Tab":
          close();
          break;
      }
    });

    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target) && !listbox.hidden) close();
    });

    // External code that does `select.value = X` (controls.js loadFromHash, randomise)
    // doesn't fire 'change'. Hook the setter so the custom display stays in sync.
    Object.defineProperty(select, "value", {
      configurable: true,
      get() {
        return valueDesc.get.call(this);
      },
      set(v) {
        valueDesc.set.call(this, v);
        sync();
      },
    });

    select.addEventListener("change", sync);

    new MutationObserver(rebuild).observe(select, { childList: true });

    const api = { open, close, sync };
    rebuild();
    return api;
  }

  function enhanceAll(root) {
    (root || document)
      .querySelectorAll("select:not([data-cs-enhanced])")
      .forEach(enhance);
  }

  function start() {
    enhanceAll();
    new MutationObserver(() => enhanceAll()).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
