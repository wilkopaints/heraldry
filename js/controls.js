// UI controls, event handlers, and render logic

const form = document.querySelector("form");
const heraldry = document.querySelector("#heraldry");

function populateControls() {
  const shapeSelect = document.getElementById("ctrl-shape");
  Object.values(shapes).forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = shapeNames[v] || v;
    shapeSelect.appendChild(opt);
  });

  ["ctrl-col1", "ctrl-col2"].forEach((id) => {
    const sel = document.getElementById(id);
    Object.values(colours).forEach((hex) => {
      const opt = document.createElement("option");
      opt.value = hex;
      opt.textContent = colourNames[hex];
      sel.appendChild(opt);
    });
  });

  const countSelect = document.getElementById("ctrl-count");
  for (let i = 0; i <= 6; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    countSelect.appendChild(opt);
  }

  const deviceSelect = document.getElementById("ctrl-device");
  const geoGroup = document.createElement("optgroup");
  geoGroup.label = "Geometric";
  geometricCharges.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = geometricDisplayNames[name];
    geoGroup.appendChild(opt);
  });
  deviceSelect.appendChild(geoGroup);
  const figGroup = document.createElement("optgroup");
  figGroup.label = "Figures";
  deviceList.forEach((path) => {
    const opt = document.createElement("option");
    opt.value = path;
    opt.textContent = deviceDisplayName(path);
    figGroup.appendChild(opt);
  });
  deviceSelect.appendChild(figGroup);
}

function updateSwatches() {
  document.getElementById("swatch-col1").style.background =
    document.getElementById("ctrl-col1").value;
  document.getElementById("swatch-col2").style.background =
    document.getElementById("ctrl-col2").value;
}

function buildChargeColourControls(count, tinctures = []) {
  const container = document.getElementById("charge-colours");
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const label = document.createElement("label");
    label.className = "ctrl-label";
    label.appendChild(
      document.createTextNode(count === 1 ? "Charge" : `Charge ${i + 1}`),
    );
    const row = document.createElement("span");
    row.className = "ctrl-row";
    const swatch = document.createElement("span");
    swatch.className = "ctrl-swatch";
    swatch.id = `charge-swatch-${i}`;
    const sel = document.createElement("select");
    sel.id = `charge-col-${i}`;
    Object.values(colours).forEach((hex) => {
      const opt = document.createElement("option");
      opt.value = hex;
      opt.textContent = colourNames[hex];
      sel.appendChild(opt);
    });
    row.appendChild(swatch);
    row.appendChild(sel);
    label.appendChild(row);
    container.appendChild(label);
    if (tinctures[i]) {
      sel.value = tinctures[i];
      swatch.style.background = tinctures[i];
    }
    sel.addEventListener("change", () => {
      swatch.style.background = sel.value;
      renderFromControls();
      updateHashFromControls();
    });
  }
}

function setControls(device, col1, col2, shape, count, tinctures = []) {
  document.getElementById("ctrl-device").value = device;
  document.getElementById("ctrl-col1").value = col1;
  document.getElementById("ctrl-col2").value = col2;
  document.getElementById("ctrl-shape").value = shape;
  document.getElementById("ctrl-count").value = count;
  updateSwatches();
  buildChargeColourControls(count, tinctures);
}

function renderFromControls() {
  const device = document.getElementById("ctrl-device").value;
  const col1 = document.getElementById("ctrl-col1").value;
  const col2 = document.getElementById("ctrl-col2").value;
  const shape = document.getElementById("ctrl-shape").value;
  const count = parseInt(document.getElementById("ctrl-count").value);
  const useSpecific =
    document.getElementById("ctrl-layout").value !== "standard";
  const { positions, size } = getArrangement(count, shape, useSpecific);
  const symbols = positions.map(({ cx, cy }, i) => {
    const sel = document.getElementById(`charge-col-${i}`);
    const tincture = sel
      ? sel.value
      : contrastingTincture(
          getFieldColourAt(cx, cy, shape, col1, col2),
          col1,
          col2,
        );
    return { cx, cy, size, tincture };
  });
  heraldry.innerHTML =
    generateShieldSVG(device, col1, col2, shape, symbols) +
    generateCaption(device, col1, col2, shape, symbols);
}

let currentSeed = null;

const updateHeraldry = (seed) => {
  // Generate or use provided seed
  if (seed === undefined) {
    seed = Math.floor(Math.random() * 2147483647);
  }
  currentSeed = seed;
  seededRandom = mulberry32(seed);

  const device = randomDevice();
  const col1 = randomColour();
  const col2 = randomColour();
  const shapeValues = Object.values(shapes);
  const shape = shapeValues[Math.floor(random() * shapeValues.length)];
  const count = Math.floor(random() * 7);
  const { positions } = getArrangement(count, shape);
  // Pick a single charge colour based on the center of the shield
  const chargeTincture = contrastingTincture(
    getFieldColourAt(50, 50, shape, col1, col2),
    col1,
    col2,
  );
  const tinctures = positions.map(() => chargeTincture);
  setControls(device, col1, col2, shape, count, tinctures);
  document.getElementById("ctrl-layout").value = "division";
  updateLayoutDropdown();
  renderFromControls();

  // Update URL hash with config-based format
  updateHashFromControls();
  seededRandom = null; // Reset to use Math.random for manual tweaks
};

function recomputeChargeColours() {
  const count = parseInt(document.getElementById("ctrl-count").value);
  const col1 = document.getElementById("ctrl-col1").value;
  const col2 = document.getElementById("ctrl-col2").value;
  const shape = document.getElementById("ctrl-shape").value;
  const useSpecific =
    document.getElementById("ctrl-layout").value !== "standard";
  const { positions } = getArrangement(count, shape, useSpecific);
  // Pick a single charge colour based on the center of the shield
  const chargeTincture = contrastingTincture(
    getFieldColourAt(50, 50, shape, col1, col2),
    col1,
    col2,
  );
  const tinctures = positions.map(() => chargeTincture);
  buildChargeColourControls(count, tinctures);
}

// Initialize controls
populateControls();

// Load from URL hash or generate random
function loadFromHash() {
  const hash = location.hash.slice(1);
  if (hash) {
    const state = decodeState(hash);
    if (state) {
      document.getElementById("ctrl-shape").value = state.shape;
      document.getElementById("ctrl-col1").value = "#" + state.col1;
      document.getElementById("ctrl-col2").value = "#" + state.col2;
      document.getElementById("ctrl-device").value = state.device;
      document.getElementById("ctrl-count").value = state.count;
      document.getElementById("ctrl-layout").value = state.layout;
      updateSwatches();
      updateLayoutDropdown();
      buildChargeColourControls(
        parseInt(state.count),
        state.chargeCols.map((c) => "#" + c),
      );
      renderFromControls();
      return;
    }
  }
  updateHeraldry();
}
loadFromHash();

window.addEventListener("hashchange", loadFromHash);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateHeraldry();
});

document.getElementById("ctrl-shape").addEventListener("change", () => {
  document.getElementById("ctrl-layout").value = "division";
  updateSwatches();
  updateLayoutDropdown();
  recomputeChargeColours();
  renderFromControls();
  updateHashFromControls();
});

["ctrl-col1", "ctrl-col2", "ctrl-device"].forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    updateSwatches();
    renderFromControls();
    updateHashFromControls();
  });
});

document.getElementById("ctrl-count").addEventListener("change", () => {
  document.getElementById("ctrl-layout").value = "division";
  updateLayoutDropdown();
  recomputeChargeColours();
  renderFromControls();
  updateHashFromControls();
});

document.getElementById("ctrl-layout").addEventListener("change", () => {
  recomputeChargeColours();
  renderFromControls();
  updateHashFromControls();
});

const ruleBoxes = ["rule-normal", "rule-brettonia"].map((id) =>
  document.getElementById(id),
);
ruleBoxes.forEach((box) => {
  box.addEventListener("change", () => {
    if (box.checked)
      ruleBoxes.forEach((other) => {
        if (other !== box) other.checked = false;
      });
    if (isBretonnian()) {
      // Replace any field colours excluded under Bretonnian rules
      const validColours = Object.values(colours).filter(
        (c) => !bretonnianExcluded.includes(c),
      );
      ["ctrl-col1", "ctrl-col2"].forEach((id) => {
        const sel = document.getElementById(id);
        if (bretonnianExcluded.includes(sel.value)) {
          const otherId = id === "ctrl-col1" ? "ctrl-col2" : "ctrl-col1";
          const other = document.getElementById(otherId).value;
          const pool = validColours.filter((c) => c !== other);
          sel.value = pool[Math.floor(random() * pool.length)];
        }
      });
      updateSwatches();
    }
    recomputeChargeColours();
    renderFromControls();
  });
});

// Save as PNG functionality
document.getElementById("save-png").addEventListener("click", savePNG);
