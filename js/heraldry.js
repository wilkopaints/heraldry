const form = document.querySelector("form");
const heraldry = document.querySelector("#heraldry");

// Seeded PRNG (mulberry32)
let seededRandom = null;
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function random() {
  return seededRandom ? seededRandom() : Math.random();
}

// Get all devices for indexing
function getAllDevices() {
  return [...geometricCharges, ...deviceList];
}

// Encode current control state to URL hash
// Format: shape-col1-col2-device-count-layout-chargeCols
// Example: chief-d4af34-790000-12-3-d-d4af34-790000
function encodeState() {
  const shape = document.getElementById("ctrl-shape").value;
  const col1 = document.getElementById("ctrl-col1").value.slice(1);
  const col2 = document.getElementById("ctrl-col2").value.slice(1);
  const device = document.getElementById("ctrl-device").value;
  const count = document.getElementById("ctrl-count").value;
  const layout =
    document.getElementById("ctrl-layout").value === "division" ? "d" : "s";

  // Get device index
  const devices = getAllDevices();
  const deviceIdx = devices.indexOf(device);

  // Get charge colours
  const chargeCols = [];
  for (let i = 0; i < parseInt(count); i++) {
    const sel = document.getElementById(`charge-col-${i}`);
    if (sel) chargeCols.push(sel.value.slice(1));
  }

  const parts = [shape, col1, col2, deviceIdx, count, layout];
  if (chargeCols.length > 0) parts.push(chargeCols.join("."));
  return parts.join("-");
}

// Decode state from URL hash
function decodeState(hash) {
  const parts = hash.split("-");
  if (parts.length < 6) return null;

  const [shape, col1, col2, deviceIdx, count, layout, ...rest] = parts;
  const devices = getAllDevices();
  const device = devices[parseInt(deviceIdx)] || devices[0];
  const chargeCols = rest.length > 0 ? rest.join("-").split(".") : [];

  return {
    shape,
    col1,
    col2,
    device,
    count,
    layout: layout === "d" ? "division" : "standard",
    chargeCols,
  };
}

// Update URL hash with current state
function updateHashFromControls() {
  const hash = encodeState();
  history.replaceState(null, "", "#" + hash);
}
// Better solution to this for static page?
const deviceList = [
  "img/devices/axe.png",
  "img/devices/balance.png",
  "img/devices/basilisk-sejant.png",
  "img/devices/battle-axe.png",
  "img/devices/boar.png",
  "img/devices/boar-rampant.png",
  "img/devices/boars-head-erased.png",
  "img/devices/bulls-head-cabossed.png",
  "img/devices/castle-1.png",
  "img/devices/castle-2.png",
  "img/devices/castle-3.png",
  "img/devices/castle-of-three-towers.png",
  "img/devices/cormorants-head-erased.png",
  "img/devices/cross-formy.png",
  "img/devices/cross-formy-fitchy-1.png",
  "img/devices/cross-formy-fitchy-2.png",
  "img/devices/crown.png",
  "img/devices/crown-flory.png",
  "img/devices/cup.png",
  "img/devices/dragon-rampant.png",
  "img/devices/dragon-rampant-inflamed.png",
  "img/devices/dragon-rampant-regardant.png",
  "img/devices/dragon-statant.png",
  "img/devices/eagle.png",
  "img/devices/estoile.png",
  "img/devices/fleur-de-lys-1.png",
  "img/devices/fleur-de-lys-2.png",
  "img/devices/fleur-de-lys-3.png",
  "img/devices/fleur-de-lys-4.png",
  "img/devices/fleur-de-lys-trident-1.png",
  "img/devices/fleur-de-lys-trident-2.png",
  "img/devices/goutte.png",
  "img/devices/green-man.png",
  "img/devices/griffins-leg-erased.png",
  "img/devices/griffins-leg-with-hand-erased.png",
  "img/devices/key.png",
  "img/devices/lion.png",
  "img/devices/lion-passant.png",
  "img/devices/lion-passant-guardant.png",
  "img/devices/lion-queue-nowed.png",
  "img/devices/lion-regardant.png",
  "img/devices/lions-head-cabossed.png",
  "img/devices/lions-head-jessant-de-lys.png",
  "img/devices/mace-spiked.png",
  "img/devices/mourning-drape.png",
  "img/devices/pegasus-courant.png",
  "img/devices/pegasus-segreant-1.png",
  "img/devices/pegasus-segreant-2.png",
  "img/devices/pegasus-segreant-displayed.png",
  "img/devices/pegasus-segreant-regardant.png",
  "img/devices/raven.png",
  "img/devices/rose-slipped-and-leaved.png",
  "img/devices/sea-lion-embowed.png",
  "img/devices/sea-lion-ii.png",
  "img/devices/sea-lion-iii.png",
  "img/devices/sea-lion-iv.png",
  "img/devices/serpent-erect.png",
  "img/devices/skull.png",
  "img/devices/stag-head.png",
  "img/devices/stag-rampant.png",
  "img/devices/stag-rampant-regardant.png",
  "img/devices/stags-head-couped.png",
  "img/devices/stag-trippant.png",
  "img/devices/sun.png",
  "img/devices/sun-2.png",
  "img/devices/sun-rays.png",
  "img/devices/sword.png",
  "img/devices/sword-2.png",
  "img/devices/toad.png",
  "img/devices/tower.png",
  "img/devices/trident.png",
  "img/devices/trident-2.png",
  "img/devices/unicorn.png",
  "img/devices/unicorn-passant.png",
  "img/devices/unicorn-passant-regardant.png",
  "img/devices/unicorn-rampant-regardant.png",
  "img/devices/wings-conjoined-in-lure.png",
  "img/devices/wyvern-erect-inflamed.png",
];

var colours = {
  0: "#d4af34", // or
  1: "#ffffff", // argent
  2: "#3953a4", // azure
  3: "#790000", // gules
  4: "#000000", // sable
  5: "#11671d", // vert
  6: "#dbdbdb", // cendree
  7: "#7b3f8c", // purpure
};

var shapes = {
  0: "barry",
  1: "base",
  2: "bend",
  3: "bendSinister",
  4: "bendy",
  5: "bordure",
  6: "canton",
  7: "chequy",
  8: "chevron",
  9: "chevronny",
  10: "chief",
  11: "cross",
  12: "fess",
  13: "flaunches",
  14: "fret",
  15: "gyronny6",
  16: "gyronny",
  17: "gyronny12",
  18: "label",
  19: "lozengy",
  20: "orle",
  21: "pale",
  22: "pall",
  23: "pally",
  24: "partyPerBendSinister",
  25: "partyPerFess",
  26: "partyPerPale",
  27: "pile",
  28: "quarter",
  29: "quarterly",
  30: "saltire",
  31: "tressure",
};

const colourNames = {
  "#d4af34": "Or",
  "#ffffff": "Argent",
  "#3953a4": "Azure",
  "#790000": "Gules",
  "#000000": "Sable",
  "#11671d": "Vert",
  "#dbdbdb": "Cendré",
  "#7b3f8c": "Purpure",
};

const shapeNames = {
  barry: "Barry",
  base: "Base",
  bend: "Bend",
  bendSinister: "Bend Sinister",
  bendy: "Bendy",
  bordure: "Bordure",
  canton: "Canton",
  chequy: "Chequy",
  chevron: "Chevron",
  chevronny: "Chevronny",
  chief: "Chief",
  cross: "Cross",
  fess: "Fess",
  flaunches: "Flaunches",
  fret: "Fret",
  gyronny6: "Gyronny of 6",
  gyronny: "Gyronny of 8",
  gyronny12: "Gyronny of 12",
  label: "Label",
  lozengy: "Lozengy",
  orle: "Orle",
  pale: "Pale",
  pall: "Pall",
  pally: "Pally",
  partyPerBendSinister: "Party per Bend Sinister",
  partyPerFess: "Party per Fess",
  partyPerPale: "Party per Pale",
  pile: "Pile",
  quarter: "Quarter",
  quarterly: "Quarterly",
  saltire: "Saltire",
  tressure: "Tressure",
};

function isBretonnian() {
  return document.getElementById("rule-brettonia")?.checked;
}
function isNormalRules() {
  return document.getElementById("rule-normal")?.checked ?? true;
}

const bretonnianExcluded = ["#11671d", "#7b3f8c"]; // vert, purpure

const bretonnianFavouredDevices = [
  "img/devices/fleur-de-lys-1.png",
  "img/devices/fleur-de-lys-2.png",
  "img/devices/fleur-de-lys-3.png",
  "img/devices/fleur-de-lys-4.png",
  "img/devices/fleur-de-lys-trident-1.png",
  "img/devices/fleur-de-lys-trident-2.png",
  "img/devices/cup.png",
];

function randomColour() {
  const excludes = isBretonnian() ? bretonnianExcluded : [];
  const pool = Object.values(colours).filter((c) => !excludes.includes(c));
  return pool[Math.floor(random() * pool.length)];
}

const geometricCharges = [
  "annulet",
  "billet",
  "cross-botonny",
  "cross-crosslet",
  "cross-flory",
  "cross-maltese",
  "cross-moline",
  "cross-patonce",
  "cross-pattee",
  "cross-potent",
  "escutcheon",
  "fountain",
  "fusil",
  "lozenge",
  "mascle",
  "roundel",
  "rustre",
];
const geometricDisplayNames = {
  annulet: "Annulet",
  billet: "Billet",
  "cross-botonny": "Cross Botonny",
  "cross-crosslet": "Cross Crosslet",
  "cross-flory": "Cross Flory",
  "cross-maltese": "Maltese Cross",
  "cross-moline": "Cross Moline",
  "cross-patonce": "Cross Patonce",
  "cross-pattee": "Cross Pattée",
  "cross-potent": "Cross Potent",
  escutcheon: "Escutcheon",
  fountain: "Fountain",
  fusil: "Fusil",
  lozenge: "Lozenge",
  mascle: "Mascle",
  rustre: "Rustre",
  roundel: "Roundel",
};
function isGeometric(device) {
  return geometricCharges.includes(device);
}

function randomDevice() {
  if (isBretonnian()) {
    // Give favoured devices 4× the weight of others
    const pool = [
      ...deviceList,
      ...bretonnianFavouredDevices.flatMap((d) => Array(3).fill(d)),
    ];
    return pool[Math.floor(random() * pool.length)];
  }
  const allDevices = [...geometricCharges, ...deviceList];
  return allDevices[Math.floor(random() * allDevices.length)];
}

function deviceDisplayName(path) {
  if (isGeometric(path)) return geometricDisplayNames[path];
  return path
    .replace("img/devices/", "")
    .replace(".png", "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Rule of tincture: metals (Or, Argent, Cendré) go on colours and vice-versa.
const metals = new Set(["#d4af34", "#ffffff", "#dbdbdb"]);

function contrastingTincture(fieldColour, col1, col2) {
  const excludes = isBretonnian() ? bretonnianExcluded : [];
  const fieldIsMetal = metals.has(fieldColour);
  const pool = Object.values(colours).filter((c) => {
    if (c === col1 || c === col2 || excludes.includes(c)) return false;
    if (isNormalRules()) return fieldIsMetal ? !metals.has(c) : metals.has(c);
    return true;
  });
  if (pool.length > 0) return pool[Math.floor(random() * pool.length)];
  const fallback = Object.values(colours).filter(
    (c) => c !== col1 && c !== col2 && !excludes.includes(c),
  );
  return fallback.length > 0
    ? fallback[Math.floor(random() * fallback.length)]
    : "#d4af34";
}

// Division-specific charge arrangements. Returns null if no specific layout exists.
function getDivisionSpecificArrangement(count, shape) {
  switch (shape) {
    case "quarterly":
      if (count === 2)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 150, cy: 165 },
          ],
          size: 75,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 150, cy: 55 },
            { cx: 100, cy: 165 },
          ],
          size: 70,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 150, cy: 55 },
            { cx: 50, cy: 165 },
            { cx: 150, cy: 165 },
          ],
          size: 62,
        };
      break;
    case "partyPerFess":
      if (count === 2)
        return {
          positions: [
            { cx: 100, cy: 55 },
            { cx: 100, cy: 165 },
          ],
          size: 75,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 60, cy: 55 },
            { cx: 140, cy: 55 },
            { cx: 100, cy: 165 },
          ],
          size: 70,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 65, cy: 58 },
            { cx: 135, cy: 58 },
            { cx: 65, cy: 165 },
            { cx: 135, cy: 165 },
          ],
          size: 62,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 40, cy: 58 },
            { cx: 100, cy: 58 },
            { cx: 160, cy: 58 },
            { cx: 40, cy: 165 },
            { cx: 100, cy: 165 },
            { cx: 160, cy: 165 },
          ],
          size: 52,
        };
      break;
    case "partyPerPale":
      if (count === 2)
        return {
          positions: [
            { cx: 50, cy: 115 },
            { cx: 150, cy: 115 },
          ],
          size: 75,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 50, cy: 115 },
            { cx: 150, cy: 72 },
            { cx: 150, cy: 158 },
          ],
          size: 68,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 50, cy: 75 },
            { cx: 150, cy: 75 },
            { cx: 50, cy: 160 },
            { cx: 150, cy: 160 },
          ],
          size: 62,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 150, cy: 55 },
            { cx: 50, cy: 115 },
            { cx: 150, cy: 115 },
            { cx: 50, cy: 175 },
            { cx: 150, cy: 175 },
          ],
          size: 52,
        };
      break;
    case "chief":
      if (count === 1) return { positions: [{ cx: 100, cy: 30 }], size: 55 };
      if (count === 2)
        return {
          positions: [
            { cx: 60, cy: 30 },
            { cx: 140, cy: 30 },
          ],
          size: 45,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 40, cy: 30 },
            { cx: 100, cy: 30 },
            { cx: 160, cy: 30 },
          ],
          size: 40,
        };
      break;
    case "pale":
      if (count === 2)
        return {
          positions: [
            { cx: 100, cy: 72 },
            { cx: 100, cy: 158 },
          ],
          size: 55,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 100, cy: 50 },
            { cx: 100, cy: 115 },
            { cx: 100, cy: 180 },
          ],
          size: 50,
        };
      break;
    case "fess":
      if (count === 2)
        return {
          positions: [
            { cx: 65, cy: 108 },
            { cx: 135, cy: 108 },
          ],
          size: 55,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 40, cy: 108 },
            { cx: 100, cy: 108 },
            { cx: 160, cy: 108 },
          ],
          size: 50,
        };
      break;
    case "chevron":
      // Charges placed in the chief flanks (above the arms) and base — not on the chevron band itself
      if (count === 2)
        return {
          positions: [
            { cx: 45, cy: 42 },
            { cx: 155, cy: 42 },
          ],
          size: 68,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 45, cy: 42 },
            { cx: 155, cy: 42 },
            { cx: 100, cy: 185 },
          ],
          size: 65,
        };
      break;
    case "cross":
      if (count === 4)
        return {
          positions: [
            { cx: 100, cy: 45 },
            { cx: 40, cy: 108 },
            { cx: 160, cy: 108 },
            { cx: 100, cy: 175 },
          ],
          size: 45,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 100, cy: 108 },
            { cx: 100, cy: 45 },
            { cx: 100, cy: 175 },
            { cx: 40, cy: 108 },
            { cx: 160, cy: 108 },
          ],
          size: 45,
        };
      break;
    case "saltire":
      if (count === 4)
        return {
          positions: [
            { cx: 100, cy: 45 },
            { cx: 35, cy: 115 },
            { cx: 165, cy: 115 },
            { cx: 100, cy: 185 },
          ],
          size: 42,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 100, cy: 108 },
            { cx: 50, cy: 48 },
            { cx: 150, cy: 48 },
            { cx: 50, cy: 168 },
            { cx: 150, cy: 168 },
          ],
          size: 38,
        };
      break;
    case "bend":
      // Centerline: y = 1.25x - 17
      if (count === 2)
        return {
          positions: [
            { cx: 60, cy: 58 },
            { cx: 140, cy: 158 },
          ],
          size: 60,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 45, cy: 39 },
            { cx: 100, cy: 108 },
            { cx: 150, cy: 171 },
          ],
          size: 55,
        };
      break;
    case "bendSinister":
      // Centerline: y = 233 - 1.25x
      if (count === 2)
        return {
          positions: [
            { cx: 145, cy: 52 },
            { cx: 55, cy: 164 },
          ],
          size: 60,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 150, cy: 46 },
            { cx: 100, cy: 108 },
            { cx: 45, cy: 177 },
          ],
          size: 55,
        };
      break;
    case "pall":
      if (count === 3)
        return {
          positions: [
            { cx: 38, cy: 38 },
            { cx: 162, cy: 38 },
            { cx: 100, cy: 195 },
          ],
          size: 45,
        };
      break;
    case "quarter":
      if (count === 1) return { positions: [{ cx: 50, cy: 55 }], size: 70 };
      if (count === 2)
        return {
          positions: [
            { cx: 35, cy: 55 },
            { cx: 75, cy: 55 },
          ],
          size: 45,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 35, cy: 38 },
            { cx: 75, cy: 38 },
            { cx: 35, cy: 78 },
            { cx: 75, cy: 78 },
          ],
          size: 35,
        };
      break;
    case "canton":
      if (count === 1) return { positions: [{ cx: 30, cy: 30 }], size: 45 };
      break;
    case "base":
      if (count === 1) return { positions: [{ cx: 100, cy: 205 }], size: 50 };
      if (count === 2)
        return {
          positions: [
            { cx: 65, cy: 205 },
            { cx: 135, cy: 205 },
          ],
          size: 40,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 45, cy: 205 },
            { cx: 100, cy: 205 },
            { cx: 155, cy: 205 },
          ],
          size: 35,
        };
      break;
    case "label":
      // Charges typically placed below the label (which ends at y=78)
      if (count === 1) return { positions: [{ cx: 100, cy: 155 }], size: 100 };
      if (count === 3)
        return {
          positions: [
            { cx: 50, cy: 155 },
            { cx: 100, cy: 155 },
            { cx: 150, cy: 155 },
          ],
          size: 55,
        };
      break;
  }
  return null;
}

// Standard heraldic arrangements by charge count.
function getArrangement(count, shape, useSpecific = true) {
  const arr = {
    0: { positions: [], size: 0 },
    1: { positions: [{ cx: 100, cy: 115 }], size: 145 },
    2: {
      positions: [
        { cx: 60, cy: 95 },
        { cx: 140, cy: 95 },
      ],
      size: 75,
    },
    3: {
      positions: [
        { cx: 60, cy: 65 },
        { cx: 140, cy: 65 },
        { cx: 100, cy: 155 },
      ],
      size: 70,
    },
    4: {
      positions: [
        { cx: 60, cy: 55 },
        { cx: 140, cy: 55 },
        { cx: 60, cy: 135 },
        { cx: 140, cy: 135 },
      ],
      size: 62,
    },
    5: {
      positions: [
        { cx: 60, cy: 55 },
        { cx: 140, cy: 55 },
        { cx: 60, cy: 120 },
        { cx: 140, cy: 120 },
        { cx: 100, cy: 180 },
      ],
      size: 57,
    },
    6: {
      positions: [
        { cx: 60, cy: 40 },
        { cx: 140, cy: 40 },
        { cx: 60, cy: 95 },
        { cx: 140, cy: 95 },
        { cx: 60, cy: 150 },
        { cx: 140, cy: 150 },
      ],
      size: 52,
    },
  };

  if (useSpecific) {
    const specific = getDivisionSpecificArrangement(count, shape);
    if (specific) return specific;
  }

  return arr[count] ?? arr[0];
}

function updateLayoutDropdown() {
  const shape = document.getElementById("ctrl-shape").value;
  const count = parseInt(document.getElementById("ctrl-count").value);
  const label = document.getElementById("layout-label");
  const hasSpecific = getDivisionSpecificArrangement(count, shape) !== null;
  label.style.display = hasSpecific ? "" : "none";
  if (!hasSpecific) document.getElementById("ctrl-layout").value = "division";
}

// Returns the field colour (col1 or col2) dominant at point (x,y) for the given division.
function getFieldColourAt(x, y, shape, col1, col2) {
  const W = 200,
    H = 240;
  switch (shape) {
    case "partyPerFess":
      return y < 110 ? col1 : col2;
    case "partyPerPale":
      return x < W / 2 ? col1 : col2;
    case "partyPerBendSinister":
      return x / W + y / H < 1 ? col1 : col2;
    case "quarterly":
      return x < W / 2 === y < 110 ? col1 : col2;
    case "chief":
      return y < 60 ? col2 : col1;
    case "pale":
      return x >= 70 && x <= 130 ? col2 : col1;
    case "fess":
      return y >= 73 && y <= 143 ? col2 : col1;
    case "bend": {
      // parallelogram band; center line y = 1.25x - 17, half-width ≈ 45 pixels
      return Math.abs(1.25 * x - y - 17) < 45 ? col2 : col1;
    }
    case "bendSinister": {
      return Math.abs(1.25 * x + y - 233) < 45 ? col2 : col1;
    }
    case "chevron": {
      if (x < 100) {
        const s = x + y;
        return s >= 120 && s <= 160 ? col2 : col1;
      } else {
        const d = x - y;
        return d >= 40 && d <= 80 ? col2 : col1;
      }
    }
    case "cross":
      return (x >= 75 && x <= 125) || (y >= 83 && y <= 133) ? col2 : col1;
    case "saltire":
      return Math.abs(y - 1.2 * x + 12) < 30 || Math.abs(y + 1.2 * x - 228) < 30
        ? col2
        : col1;
    case "pall": {
      const inStem = x >= 80 && x <= 120 && y >= 70;
      const inLeft = Math.abs(y - 0.7 * x) < 28 && x < 100 && y < 70;
      const inRight = Math.abs(y + 0.7 * x - 140) < 28 && x > 100 && y < 70;
      return inStem || inLeft || inRight ? col2 : col1;
    }
    case "flaunches": {
      const inLeft = (x + 10) ** 2 / 6400 + (y - 120) ** 2 / 19600 <= 1;
      const inRight = (x - 210) ** 2 / 6400 + (y - 120) ** 2 / 19600 <= 1;
      return inLeft || inRight ? col2 : col1;
    }
    case "pile":
      return x >= y / 2.4 && x <= (480 - y) / 2.4 ? col2 : col1;
    case "bordure": {
      if (x < 18 || x > 182 || y < 18) return col2;
      if (y >= 110 && (x - 100) ** 2 / 6400 + (y - 160) ** 2 / 4000 > 1)
        return col2;
      return col1;
    }
    case "barry":
      return Math.floor(y / 40) % 2 === 0 ? col1 : col2;
    case "pally":
      return Math.floor(x / 40) % 2 === 0 ? col1 : col2;
    case "bendy": {
      const dx = x - 100,
        dy = y - 120;
      const ru = (Math.SQRT2 / 2) * dx + (Math.SQRT2 / 2) * dy;
      return Math.floor((ru + 1000) / 28) % 2 === 0 ? col1 : col2;
    }
    case "chevronny": {
      const v = (((y + 20 + Math.abs(x - 100)) % 55) + 55) % 55;
      return v < 30 ? col2 : col1;
    }
    case "chequy":
      return (Math.floor(x / 20) + Math.floor(y / 20)) % 2 === 0 ? col1 : col2;
    case "lozengy": {
      const u = (((x + y) % 40) + 40) % 40,
        v = (((x - y) % 40) + 40) % 40;
      return Math.abs(u - 20) + Math.abs(v - 20) <= 20 ? col2 : col1;
    }
    case "gyronny":
      return gyronnyColour(x, y, 8, col1, col2);
    case "gyronny6":
      return gyronnyColour(x, y, 6, col1, col2);
    case "gyronny12":
      return gyronnyColour(x, y, 12, col1, col2);
    case "quarter":
      return x <= 100 && y <= 110 ? col2 : col1;
    case "canton":
      return x <= 60 && y <= 60 ? col2 : col1;
    case "orle": {
      // Check if point is within the orle band (follows shield curve)
      const inShieldOuter = (px, py, inset) => {
        if (px < inset || px > 200 - inset || py < inset) return false;
        if (py <= 110) return true;
        // Check curved bottom using ellipse approximation
        const cx = 100,
          cy = 160;
        const rx = 75 - inset * 0.75,
          ry = 55 - inset * 0.45;
        return (px - cx) ** 2 / rx ** 2 + (py - cy) ** 2 / ry ** 2 <= 1;
      };
      const inOuter = inShieldOuter(x, y, 25);
      const inInner = inShieldOuter(x, y, 37);
      return inOuter && !inInner ? col2 : col1;
    }
    case "tressure": {
      const inShieldOuter = (px, py, inset) => {
        if (px < inset || px > 200 - inset || py < inset) return false;
        if (py <= 110) return true;
        const cx = 100,
          cy = 160;
        const rx = 75 - inset * 0.75,
          ry = 55 - inset * 0.45;
        return (px - cx) ** 2 / rx ** 2 + (py - cy) ** 2 / ry ** 2 <= 1;
      };
      const inOuter = inShieldOuter(x, y, 22);
      const inInner = inShieldOuter(x, y, 30);
      return inOuter && !inInner ? col2 : col1;
    }
    case "base":
      return y >= 180 ? col2 : col1;
    case "fret": {
      // Mascle with interlaced bendlets
      const cx = 100,
        cy = 108;
      const outerR = 50,
        innerR = 30;
      const bw = 25;
      // Check mascle (voided diamond)
      const dx = Math.abs(x - cx),
        dy = Math.abs(y - cy);
      const inOuter = dx + dy <= outerR;
      const inInner = dx + dy <= innerR;
      const onMascle = inOuter && !inInner;
      // Check bendlets
      const onBand1 = Math.abs(x - cx - (y - cy)) < bw;
      const onBand2 = Math.abs(x - cx + (y - cy)) < bw;
      return onMascle || onBand1 || onBand2 ? col2 : col1;
    }
    case "label": {
      // Horizontal bar at top with 5 pendants
      const barTop = 25,
        barH = 18,
        pendH = 35,
        pendW = 16;
      if (y >= barTop && y <= barTop + barH) return col2;
      const pendants = [28, 60, 100, 140, 172];
      for (const px of pendants) {
        if (
          x >= px - pendW / 2 &&
          x <= px + pendW / 2 &&
          y > barTop + barH &&
          y <= barTop + barH + pendH
        )
          return col2;
      }
      return col1;
    }
    default:
      return col1;
  }
}

// Find where a ray from (cx,cy) at angle hits the bounding rectangle 0..W x 0..H
function rayHitsBounds(cx, cy, angle) {
  const W = 200,
    H = 240;
  const dx = Math.cos(angle),
    dy = Math.sin(angle);
  let t = Infinity;
  if (dx > 0) t = Math.min(t, (W - cx) / dx);
  if (dx < 0) t = Math.min(t, (0 - cx) / dx);
  if (dy > 0) t = Math.min(t, (H - cy) / dy);
  if (dy < 0) t = Math.min(t, (0 - cy) / dy);
  return { x: cx + t * dx, y: cy + t * dy };
}

// Which edge of the 200×240 bounding box is point p on? (0=top,1=right,2=bottom,3=left)
function edgeOf(p) {
  const eps = 0.5;
  if (p.y < eps) return 0;
  if (p.x > 200 - eps) return 1;
  if (p.y > 240 - eps) return 2;
  return 3;
}
const gyronnyCorners = [
  { x: 200, y: 0 },
  { x: 200, y: 240 },
  { x: 0, y: 240 },
  { x: 0, y: 0 },
];

function buildGyronny(n, col1, col2) {
  const cx = 100,
    cy = 120;
  const pts = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2; // start at top, clockwise
    return rayHitsBounds(cx, cy, angle);
  });
  let content = "";
  for (let i = 0; i < n; i++) {
    const p1 = pts[i],
      p2 = pts[(i + 1) % n];
    const col = i % 2 === 0 ? col1 : col2;
    // Walk clockwise along bounding-box edges from p1 to p2, inserting corners
    let border = [`${p1.x.toFixed(1)},${p1.y.toFixed(1)}`];
    let e = edgeOf(p1);
    const e2 = edgeOf(p2);
    while (e !== e2) {
      const c = gyronnyCorners[e];
      border.push(`${c.x},${c.y}`);
      e = (e + 1) % 4;
    }
    border.push(`${p2.x.toFixed(1)},${p2.y.toFixed(1)}`);
    content += `<polygon points="${cx},${cy} ${border.join(" ")}" fill="${col}"/>`;
  }
  return { defs: "", content };
}

function gyronnyColour(x, y, n, col1, col2) {
  const cx = 100,
    cy = 120;
  let angle = Math.atan2(y - cy, x - cx) + Math.PI / 2; // 0 at top, clockwise
  angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const sector = Math.floor(angle / ((2 * Math.PI) / n));
  return sector % 2 === 0 ? col1 : col2;
}

// Returns { defs, content } — SVG fragments for the heraldic field division
function generateDivision(shape, col1, col2) {
  const W = 200,
    H = 240;
  const field = (c) =>
    `<rect x="0" y="0" width="${W}" height="${H}" fill="${c}"/>`;

  switch (shape) {
    case "partyPerFess":
      return {
        defs: "",
        content: `
                <rect x="0" y="0" width="${W}" height="110" fill="${col1}"/>
                <rect x="0" y="110" width="${W}" height="132" fill="${col2}"/>`,
      };

    case "partyPerPale":
      return {
        defs: "",
        content: `
                <rect x="0" y="0" width="${W / 2}" height="${H}" fill="${col1}"/>
                <rect x="${W / 2}" y="0" width="${W / 2}" height="${H}" fill="${col2}"/>`,
      };

    case "partyPerBendSinister":
      return {
        defs: "",
        content: `
                <polygon points="0,0 ${W},0 0,${H}" fill="${col1}"/>
                <polygon points="${W},0 ${W},${H} 0,${H}" fill="${col2}"/>`,
      };

    case "quarterly":
      return {
        defs: "",
        content: `
                <rect x="0" y="0" width="${W / 2}" height="110" fill="${col1}"/>
                <rect x="${W / 2}" y="0" width="${W / 2}" height="110" fill="${col2}"/>
                <rect x="0" y="110" width="${W / 2}" height="132" fill="${col2}"/>
                <rect x="${W / 2}" y="110" width="${W / 2}" height="132" fill="${col1}"/>`,
      };

    case "chief":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <rect x="0" y="0" width="${W}" height="60" fill="${col2}"/>`,
      };

    case "pale":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <rect x="70" y="0" width="60" height="${H}" fill="${col2}"/>`,
      };

    case "fess":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <rect x="0" y="73" width="${W}" height="70" fill="${col2}"/>`,
      };

    case "bend":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <polygon points="-100,-97 300,403 300,313 -100,-187" fill="${col2}"/>`,
      };

    case "bendSinister":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <polygon points="-100,403 300,-97 300,-187 -100,313" fill="${col2}"/>`,
      };

    case "chevron":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <polygon points="0,160 100,60 200,160 200,120 100,20 0,120" fill="${col2}"/>`,
      };

    case "cross":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <rect x="75" y="0" width="50" height="${H}" fill="${col2}"/>
                <rect x="0" y="83" width="${W}" height="50" fill="${col2}"/>`,
      };

    case "saltire":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <polygon points="-50,-102 -50,-42 250,318 250,258" fill="${col2}"/>
                <polygon points="-50,258 -50,318 250,-42 250,-102" fill="${col2}"/>`,
      };

    case "pall":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <polygon points="0,0 50,0 100,70 150,0 200,0 200,50 120,120 120,${H} 80,${H} 80,120 0,50" fill="${col2}"/>`,
      };

    case "flaunches":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <ellipse cx="-10" cy="${H / 2}" rx="80" ry="${H / 2 + 20}" fill="${col2}"/>
                <ellipse cx="${W + 10}" cy="${H / 2}" rx="80" ry="${H / 2 + 20}" fill="${col2}"/>`,
      };

    case "pile":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <polygon points="0,0 ${W},0 ${W / 2},${H}" fill="${col2}"/>`,
      };

    case "bordure":
      return {
        defs: "",
        content: `
                ${field(col2)}
                <path d="M 18,18 L 182,18 L 182,110 C 182,170 146,218 100,222 C 54,218 18,170 18,110 Z" fill="${col1}"/>`,
      };

    case "barry": {
      let content = "";
      for (let i = 0; i < 6; i++) {
        content += `<rect x="0" y="${i * 40}" width="${W}" height="40" fill="${i % 2 === 0 ? col1 : col2}"/>`;
      }
      return { defs: "", content };
    }

    case "pally": {
      let content = "";
      for (let i = 0; i < 5; i++) {
        content += `<rect x="${i * 40}" y="0" width="40" height="${H}" fill="${i % 2 === 0 ? col1 : col2}"/>`;
      }
      return { defs: "", content };
    }

    case "bendy": {
      const defs = `<pattern id="bendy-pat" x="0" y="0" width="56" height="56"
                    patternUnits="userSpaceOnUse" patternTransform="rotate(45 100 120)">
                <rect x="0" y="0" width="28" height="56" fill="${col1}"/>
                <rect x="28" y="0" width="28" height="56" fill="${col2}"/>
            </pattern>`;
      return {
        defs,
        content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#bendy-pat)"/>`,
      };
    }

    case "chevronny": {
      let content = field(col1);
      for (let i = 0; i < 6; i++) {
        if (i % 2 === 0) {
          const y = i * 55 - 100;
          content += `<polygon points="0,${y + 100} 100,${y} 200,${y + 100} 200,${y + 70} 100,${y - 30} 0,${y + 70}" fill="${col2}"/>`;
        }
      }
      return { defs: "", content };
    }

    case "chequy": {
      const defs = `<pattern id="chequy-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="20" height="20" fill="${col1}"/>
                <rect x="20" y="0" width="20" height="20" fill="${col2}"/>
                <rect x="0" y="20" width="20" height="20" fill="${col2}"/>
                <rect x="20" y="20" width="20" height="20" fill="${col1}"/>
            </pattern>`;
      return {
        defs,
        content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#chequy-pat)"/>`,
      };
    }

    case "lozengy": {
      const defs = `<pattern id="lozengy-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="40" height="40" fill="${col1}"/>
                <polygon points="20,0 40,20 20,40 0,20" fill="${col2}"/>
            </pattern>`;
      return {
        defs,
        content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#lozengy-pat)"/>`,
      };
    }

    case "gyronny":
      return buildGyronny(8, col1, col2);
    case "gyronny6":
      return buildGyronny(6, col1, col2);
    case "gyronny12":
      return buildGyronny(12, col1, col2);

    case "quarter":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <rect x="0" y="0" width="100" height="110" fill="${col2}"/>`,
      };

    case "canton":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <rect x="0" y="0" width="60" height="60" fill="${col2}"/>`,
      };

    case "orle": {
      // Orle follows the shield shape, inset from edges
      const outer =
        "M 25,25 L 175,25 L 175,110 C 175,165 145,205 100,215 C 55,205 25,165 25,110 Z";
      const inner =
        "M 37,37 L 163,37 L 163,110 C 163,155 138,190 100,198 C 62,190 37,155 37,110 Z";
      return {
        defs: "",
        content: `
                ${field(col1)}
                <path d="${outer} ${inner}" fill="${col2}" fill-rule="evenodd"/>`,
      };
    }

    case "tressure": {
      // Tressure is a thinner version of orle
      const outer =
        "M 22,22 L 178,22 L 178,110 C 178,168 148,212 100,220 C 52,212 22,168 22,110 Z";
      const inner =
        "M 30,30 L 170,30 L 170,110 C 170,162 142,202 100,210 C 58,202 30,162 30,110 Z";
      return {
        defs: "",
        content: `
                ${field(col1)}
                <path d="${outer} ${inner}" fill="${col2}" fill-rule="evenodd"/>`,
      };
    }

    case "base":
      return {
        defs: "",
        content: `
                ${field(col1)}
                <rect x="0" y="180" width="${W}" height="60" fill="${col2}"/>`,
      };

    case "fret": {
      const sw = 6; // stroke width for outline
      return {
        defs: "",
        content: `
                ${field(col1)}
                <svg x="0" y="0" width="${W}" height="${H}" viewBox="0 0 600 600" preserveAspectRatio="none">
                  <g transform="matrix(2.7951,0,0,2.7951,-11.42941,-15.093552)">
                    <path d="M112,18.6l-92.8,92.7l92.8,92.8l92.8-92.8L112,18.6z M112,56l55.3,55.3L112,166.6l-55.3-55.3L112,56z" fill="${col2}" stroke="${col1}" stroke-width="${sw}" fill-rule="evenodd"/>
                  </g>
                  <path d="M543.4,2.2l-270,270.2L69,477c14.6,21.1,30.6,40.2,47.3,57.4l209.5-209.6L598.5,51.9c0-0.4,0-49.8,0-49.8L543.4,2.2z" fill="${col2}" stroke="${col1}" stroke-width="${sw}"/>
                  <path d="M1.5,2.2v46.4L145.8,193l52.3-52.3L59.7,2.2H1.5z" fill="${col2}" stroke="${col1}" stroke-width="${sw}"/>
                  <path d="M250.4,193.1l-52.3,52.3L352.6,400l52.3-52.3L250.4,193.1z" fill="${col2}" stroke="${col1}" stroke-width="${sw}"/>
                  <path d="M457.3,400l-52.4,52.4l80.3,80.3c16.6-17.3,32.6-36.5,47.1-57.7L457.3,400z" fill="${col2}" stroke="${col1}" stroke-width="${sw}"/>
                </svg>`,
      };
    }

    case "label": {
      // Label: horizontal bar at top with 5 rectangular pendants
      const barTop = 25,
        barH = 18,
        pendH = 35,
        pendW = 16;
      const pendants = [28, 60, 100, 140, 172]; // x positions centered
      let pendantsSvg = pendants
        .map(
          (px) =>
            `<rect x="${px - pendW / 2}" y="${barTop + barH}" width="${pendW}" height="${pendH}" fill="${col2}"/>`,
        )
        .join("\n                ");
      return {
        defs: "",
        content: `
                ${field(col1)}
                <rect x="0" y="${barTop}" width="${W}" height="${barH}" fill="${col2}"/>
                ${pendantsSvg}`,
      };
    }

    default:
      return { defs: "", content: field(col1) };
  }
}

// Build one SVG recolouring filter per unique tincture used by the symbols.
// Each filter also adds a thin dark outline by dilating the charge mask before
// compositing the charge colour on top.
function deviceFilterDefs(tinctures) {
  return [...new Set(tinctures)]
    .map((t) => {
      const id = `dev-${t.replace("#", "")}`;
      if (t === "#000000") {
        // Black tincture: invert the image so outlines become white and fill becomes black
        return `<filter id="${id}" color-interpolation-filters="sRGB">
      <feComponentTransfer>
        <feFuncR type="linear" slope="-1" intercept="1"/>
        <feFuncG type="linear" slope="-1" intercept="1"/>
        <feFuncB type="linear" slope="-1" intercept="1"/>
      </feComponentTransfer>
    </filter>`;
      }
      // multiply blend: black pixels stay black (outline), white pixels become tincture colour
      return `<filter id="${id}" color-interpolation-filters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
      <feFlood flood-color="${t}" result="colour"/>
      <feBlend in="colour" in2="SourceGraphic" mode="multiply" result="blended"/>
      <feComposite in="blended" in2="SourceGraphic" operator="in"/>
    </filter>`;
    })
    .join("\n");
}

// Returns { defs, content } SVG strings for a single geometric charge.
// index is used to generate unique pattern/clip IDs.
function generateGeometricCharge(type, cx, cy, size, tincture, index) {
  const t = tincture;
  const outline = "#1a1a1a";
  const sw = Math.max(1.5, size * 0.04);

  switch (type) {
    case "roundel":
      return {
        defs: "",
        content: `<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>`,
      };

    case "annulet": {
      const rw = size * 0.18;
      const r = size / 2 - rw / 2;
      // Outline around the ring using a wider dark stroke underneath
      return {
        defs: "",
        content:
          `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${outline}" stroke-width="${rw + sw * 2}"/>` +
          `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${t}" stroke-width="${rw}"/>`,
      };
    }

    case "lozenge": {
      const hw = size * 0.375,
        hh = size * 0.5;
      const pts = `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`;
      return {
        defs: "",
        content: `<polygon points="${pts}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>`,
      };
    }

    case "fusil": {
      const hw = size * 0.22,
        hh = size * 0.5;
      const pts = `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`;
      return {
        defs: "",
        content: `<polygon points="${pts}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>`,
      };
    }

    case "mascle": {
      // Voided lozenge — outer and inner diamonds, even/odd fill
      const hw = size * 0.375,
        hh = size * 0.5;
      const ihw = hw * 0.54,
        ihh = hh * 0.54;
      const outer = `M ${cx},${cy - hh} L ${cx + hw},${cy} L ${cx},${cy + hh} L ${cx - hw},${cy} Z`;
      const inner = `M ${cx},${cy - ihh} L ${cx + ihw},${cy} L ${cx},${cy + ihh} L ${cx - ihw},${cy} Z`;
      return {
        defs: "",
        content: `<path fill-rule="evenodd" d="${outer} ${inner}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>`,
      };
    }

    case "rustre": {
      // Lozenge with circular pierce
      const hw = size * 0.375,
        hh = size * 0.5;
      const ir = size * 0.145;
      const outer = `M ${cx},${cy - hh} L ${cx + hw},${cy} L ${cx},${cy + hh} L ${cx - hw},${cy} Z`;
      const hole = `M ${cx + ir},${cy} A ${ir},${ir} 0 1,1 ${cx - ir},${cy} A ${ir},${ir} 0 1,1 ${cx + ir},${cy} Z`;
      return {
        defs: "",
        content: `<path fill-rule="evenodd" d="${outer} ${hole}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>`,
      };
    }

    case "billet": {
      const bw = size * 0.5,
        bh = size * 0.85;
      return {
        defs: "",
        content: `<rect x="${cx - bw / 2}" y="${cy - bh / 2}" width="${bw}" height="${bh}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>`,
      };
    }

    case "escutcheon": {
      // Scale the main shield path to fit within size×size, centred at cx,cy
      const scale = size / 240;
      const tx = cx - 100 * scale,
        ty = cy - 120 * scale;
      const isw = sw / scale;
      return {
        defs: "",
        content:
          `<g transform="translate(${tx},${ty}) scale(${scale})">` +
          `<path d="M 0,0 L 200,0 L 200,110 C 200,180 160,230 100,240 C 40,230 0,180 0,110 Z" fill="${t}" stroke="${outline}" stroke-width="${isw}"/>` +
          `</g>`,
      };
    }

    case "fountain": {
      // Barry wavy azure and argent — tincture ignored, fixed heraldic colours
      const r = size / 2;
      const n = 6;
      const bh = (r * 2) / n;
      const amp = bh * 0.38;
      const pw = r * 2;
      const pid = `fp${index}`;
      const azure = "#3953a4",
        argent = "#ffffff";
      const wavePath =
        `M 0,0 C ${pw / 4},${-amp} ${(pw * 3) / 4},${amp} ${pw},0 ` +
        `L ${pw},${bh} C ${(pw * 3) / 4},${bh + amp} ${pw / 4},${bh - amp} 0,${bh} Z`;
      const defs =
        `<pattern id="${pid}" x="0" y="${cy - r}" width="${pw}" height="${bh * 2}" patternUnits="userSpaceOnUse">` +
        `<rect width="${pw}" height="${bh * 2}" fill="${argent}"/>` +
        `<path d="${wavePath}" fill="${azure}"/>` +
        `</pattern>`;
      return {
        defs,
        content: `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${pid})" stroke="${outline}" stroke-width="${sw}"/>`,
      };
    }

    // Heraldic cross variants — paths defined in 100×100 box centered at (0,0), scaled & translated
    case "cross-potent": {
      // T-shaped ends (crutch cross)
      const d =
        "M 15,-50 L 15,-40 L 6,-40 L 6,-6 L 40,-6 L 40,-15 L 50,-15 L 50,15 L 40,15 L 40,6 L 6,6 L 6,40 L 15,40 L 15,50 L -15,50 L -15,40 L -6,40 L -6,6 L -40,6 L -40,15 L -50,15 L -50,-15 L -40,-15 L -40,-6 L -6,-6 L -6,-40 L -15,-40 L -15,-50 Z";
      const scale = size / 100;
      return {
        defs: "",
        content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/></g>`,
      };
    }

    case "cross-crosslet": {
      // Each arm ends in a small cross
      const d =
        "M 6,-6 L 6,-32 L 16,-32 L 16,-38 L 6,-38 L 6,-50 L -6,-50 L -6,-38 L -16,-38 L -16,-32 L -6,-32 L -6,-6 L -32,-6 L -32,-16 L -38,-16 L -38,-6 L -50,-6 L -50,6 L -38,6 L -38,16 L -32,16 L -32,6 L -6,6 L -6,32 L -16,32 L -16,38 L -6,38 L -6,50 L 6,50 L 6,38 L 16,38 L 16,32 L 6,32 L 6,6 L 32,6 L 32,16 L 38,16 L 38,6 L 50,6 L 50,-6 L 38,-6 L 38,-16 L 32,-16 L 32,-6 Z";
      const scale = size / 100;
      return {
        defs: "",
        content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/></g>`,
      };
    }

    case "cross-maltese": {
      // 8-pointed with V-notches — from Maltese_cross.svg, normalized to ±50
      const d =
        "M -46.7,20 L -1.7,1.7 L -20,46.7 L 0,33.3 L 20,46.7 L 1.7,1.7 L 46.7,20 L 33.3,0 L 46.7,-20 L 1.7,-1.7 L 20,-46.7 L 0,-33.3 L -20,-46.7 L -1.7,-1.7 L -46.7,-20 L -33.3,0 Z";
      const scale = size / 100;
      return {
        defs: "",
        content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/></g>`,
      };
    }

    case "cross-moline": {
      // Split ends curving outward — from Cross-Moline-Heraldry.svg
      const d =
        "M -5.5,30 A 5.5,5.5 0 0,1 -11,35.5 A 6.4,6.4 0 0,0 0,35.5 A 6.4,6.4 0 0,0 11,35.5 A 5.5,5.5 0 0,1 5.5,30 V 5.5 H 30 A 5.5,5.5 0 0,1 35.5,11 A 6.4,6.4 0 0,0 35.5,0 A 6.4,6.4 0 0,0 35.5,-11 A 5.5,5.5 0 0,1 30,-5.5 H 5.5 V -30 A 5.5,5.5 0 0,1 11,-35.5 A 6.4,6.4 0 0,0 0,-35.5 A 6.4,6.4 0 0,0 -11,-35.5 A 5.5,5.5 0 0,1 -5.5,-30 V -5.5 H -30 A 5.5,5.5 0 0,1 -35.5,-11 A 6.4,6.4 0 0,0 -35.5,0 A 6.4,6.4 0 0,0 -35.5,11 A 5.5,5.5 0 0,1 -30,5.5 H -5.5 Z";
      const scale = size / 100;
      return {
        defs: "",
        content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/></g>`,
      };
    }

    case "cross-flory": {
      // Fleur-de-lys ends — from Cross-Flory-Heraldry.svg
      const d =
        "M -5.5,30 A 3,3 0 0,1 -8.6,33 A 3,3 0 0,1 -11.6,30 A 5.5,5.5 0 0,0 -13.6,34.3 A 5.5,5.5 0 0,0 -8.1,39.8 A 5.5,5.5 0 0,0 -4.5,38.6 A 9.1,9.1 0 0,0 0,46.4 A 9.1,9.1 0 0,0 4.5,38.6 A 5.5,5.5 0 0,0 8.1,39.8 A 5.5,5.5 0 0,0 13.6,34.3 A 5.5,5.5 0 0,0 11.6,30 A 3,3 0 0,1 8.6,33 A 3,3 0 0,1 5.5,30 V 5.5 H 30 A 3,3 0 0,1 33,8.6 A 3,3 0 0,1 30,11.6 A 5.5,5.5 0 0,0 34.3,13.6 A 5.5,5.5 0 0,0 39.8,8.1 A 5.5,5.5 0 0,0 38.6,4.5 A 9.1,9.1 0 0,0 46.4,0 A 9.1,9.1 0 0,0 38.6,-4.5 A 5.5,5.5 0 0,0 39.8,-8.1 A 5.5,5.5 0 0,0 34.3,-13.6 A 5.5,5.5 0 0,0 30,-11.6 A 3,3 0 0,1 33,-8.6 A 3,3 0 0,1 30,-5.5 H 5.5 V -30 A 3,3 0 0,1 8.6,-33 A 3,3 0 0,1 11.6,-30 A 5.5,5.5 0 0,0 13.6,-34.3 A 5.5,5.5 0 0,0 8.1,-39.8 A 5.5,5.5 0 0,0 4.5,-38.6 A 9.1,9.1 0 0,0 0,-46.4 A 9.1,9.1 0 0,0 -4.5,-38.6 A 5.5,5.5 0 0,0 -8.1,-39.8 A 5.5,5.5 0 0,0 -13.6,-34.3 A 5.5,5.5 0 0,0 -11.6,-30 A 3,3 0 0,1 -8.6,-33 A 3,3 0 0,1 -5.5,-30 V -5.5 H -30 A 3,3 0 0,1 -33,-8.6 A 3,3 0 0,1 -30,-11.6 A 5.5,5.5 0 0,0 -34.3,-13.6 A 5.5,5.5 0 0,0 -39.8,-8.1 A 5.5,5.5 0 0,0 -38.6,-4.5 A 9.1,9.1 0 0,0 -46.4,0 A 9.1,9.1 0 0,0 -38.6,4.5 A 5.5,5.5 0 0,0 -39.8,8.1 A 5.5,5.5 0 0,0 -34.3,13.6 A 5.5,5.5 0 0,0 -30,11.6 A 3,3 0 0,1 -33,8.6 A 3,3 0 0,1 -30,5.5 H -5.5 Z";
      const scale = size / 100;
      return {
        defs: "",
        content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/></g>`,
      };
    }

    case "cross-patonce": {
      // Pointed fleur-de-lys ends — from Cross-Patonce-Heraldry.svg (two overlapping paths)
      const d1 =
        "M -37.5,-15.2 A 75,75 0 0,0 37.5,-15.2 A 5.9,5.9 0 0,1 37.5,-5.1 A 10.1,10.1 0 0,1 46.3,0 A 10.1,10.1 0 0,1 37.5,5.1 A 5.9,5.9 0 0,1 37.5,15.2 A 75,75 0 0,0 -37.5,15.2 A 5.9,5.9 0 0,1 -37.5,5.1 A 10.1,10.1 0 0,1 -46.3,0 A 10.1,10.1 0 0,1 -37.5,-5.1 A 5.9,5.9 0 0,1 -37.5,-15.2 Z";
      const d2 =
        "M 15.2,-37.5 A 75,75 0 0,0 15.2,37.5 A 5.9,5.9 0 0,1 5.1,37.5 A 10.1,10.1 0 0,1 0,46.3 A 10.1,10.1 0 0,1 -5.1,37.5 A 5.9,5.9 0 0,1 -15.2,37.5 A 75,75 0 0,0 -15.2,-37.5 A 5.9,5.9 0 0,1 -5.1,-37.5 A 10.1,10.1 0 0,1 0,-46.3 A 10.1,10.1 0 0,1 5.1,-37.5 A 5.9,5.9 0 0,1 15.2,-37.5 Z";
      const scale = size / 100;
      return {
        defs: "",
        content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d1}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/><path d="${d2}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/></g>`,
      };
    }

    case "cross-botonny": {
      // Trefoil ends (three circular lobes) — from Cross-Bottony-Heraldry.svg
      const d =
        "M -26,-5 A 6.7,6.7 0 1,0 -38,-5.7 A 6.7,6.7 0 1,0 -38,5.7 A 6.7,6.7 0 1,0 -26,5 H -5 V 26 A 6.7,6.7 0 1,0 -5.7,38 A 6.7,6.7 0 1,0 5.7,38 A 6.7,6.7 0 1,0 5,26 V 5 H 26 A 6.7,6.7 0 1,0 38,5.7 A 6.7,6.7 0 1,0 38,-5.7 A 6.7,6.7 0 1,0 26,-5 H 5 V -26 A 6.7,6.7 0 1,0 5.7,-38 A 6.7,6.7 0 1,0 -5.7,-38 A 6.7,6.7 0 1,0 -5,-26 V -5 Z";
      const scale = size / 100;
      return {
        defs: "",
        content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/></g>`,
      };
    }

    case "cross-pattee": {
      // Flared arms (wider at tips) — from Cross-Pattee-Heraldry.svg
      const d =
        "M -50,-28.9 C -37.6,-14.1 -19.3,-5.6 0,-5.6 C 19.3,-5.6 37.6,-14.1 50,-28.9 V 28.9 C 37.6,14.1 19.3,5.6 0,5.6 C -19.3,5.6 -37.6,14.1 -50,28.9 Z M 28.9,-50 C 14.1,-37.6 5.6,-19.3 5.6,0 C 5.6,19.3 14.1,37.6 28.9,50 H -28.9 C -14.1,37.6 -5.6,19.3 -5.6,0 C -5.6,-19.3 -14.1,-37.6 -28.9,-50 Z";
      const scale = size / 100;
      return {
        defs: "",
        content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw / scale}"/></g>`,
      };
    }

    default:
      return { defs: "", content: "" };
  }
}

// symbols: array of { cx, cy, size, tincture }
function generateShieldSVG(device, col1, col2, shape, symbols) {
  const shieldPath =
    "M 0,0 L 200,0 L 200,110 C 200,180 160,230 100,240 C 40,230 0,180 0,110 Z";
  const { defs, content } = generateDivision(shape, col1, col2);

  let extraDefs = "",
    charges = "";
  if (isGeometric(device)) {
    symbols.forEach(({ cx, cy, size, tincture }, i) => {
      const { defs: gd, content: gc } = generateGeometricCharge(
        device,
        cx,
        cy,
        size,
        tincture,
        i,
      );
      extraDefs += gd;
      charges += gc + "\n";
    });
    charges = `<g clip-path="url(#shield-clip)">${charges}</g>`;
  } else {
    const filterDefs = deviceFilterDefs(symbols.map((s) => s.tincture));
    extraDefs = filterDefs;
    const dd = DEVICE_DIMS[device];
    charges = symbols
      .map(({ cx, cy, size, tincture }) => {
        let iw = size,
          ih = size;
        if (dd) {
          const aspect = dd[0] / dd[1];
          if (aspect > 1) {
            ih = size / aspect;
          } else if (aspect < 1) {
            iw = size * aspect;
          }
        }
        return `<image href="${device}" x="${cx - iw / 2}" y="${cy - ih / 2}" width="${iw}" height="${ih}"
      clip-path="url(#shield-clip)" filter="url(#dev-${tincture.replace("#", "")})"/>`;
      })
      .join("\n  ");
  }

  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-label="Heraldic shield">
  <defs>
    <clipPath id="shield-clip">
      <path d="${shieldPath}"/>
    </clipPath>
    ${extraDefs}
    ${defs}
  </defs>
  <g clip-path="url(#shield-clip)">
    ${content}
  </g>
  ${charges}
  <path d="${shieldPath}" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
</svg>`;
}

function generateCaption(device, col1, col2, shape, symbols) {
  const parts = [
    `<span class="swatch" style="background:${col1}"></span>${colourNames[col1]} &amp; <span class="swatch" style="background:${col2}"></span>${colourNames[col2]}`,
    shapeNames[shape] || shape,
  ];
  if (symbols.length > 0)
    parts.push(`${symbols.length}\u00d7 ${deviceDisplayName(device)}`);
  return `<p class="shield-caption">${parts.join(" &ndash; ")}</p>`;
}

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
async function loadImage(src) {
  // For data URLs, load directly
  if (src.startsWith("data:")) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load data URL"));
      img.src = src;
    });
  }
  // For file URLs, fetch as blob to avoid tainted canvas
  const response = await fetch(src);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load: " + src));
    };
    img.src = url;
  });
}

function svgToDataUrl(svgEl) {
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("width", 200);
  clone.setAttribute("height", 240);
  const data = new XMLSerializer().serializeToString(clone);
  return (
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)))
  );
}

document.getElementById("save-png").addEventListener("click", async () => {
  try {
    const svg = heraldry.querySelector("svg");
    if (!svg) return;

    const scale = 4;
    const width = 200;
    const height = 240;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);

    // Get image elements and their attributes before removing
    const imageEls = svg.querySelectorAll("image");
    const imageData = Array.from(imageEls).map((img) => ({
      href: img.getAttribute("href"),
      x: parseFloat(img.getAttribute("x")),
      y: parseFloat(img.getAttribute("y")),
      width: parseFloat(img.getAttribute("width")),
      height: parseFloat(img.getAttribute("height")),
      filter: img.getAttribute("filter"),
    }));

    // Create SVG without images for base rendering
    const svgClone = svg.cloneNode(true);
    svgClone.querySelectorAll("image").forEach((img) => img.remove());

    // Draw base shield
    const baseImg = await loadImage(svgToDataUrl(svgClone));
    ctx.drawImage(baseImg, 0, 0, width, height);

    // Create clipping path matching the shield
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 0);
    ctx.lineTo(200, 110);
    ctx.bezierCurveTo(200, 180, 160, 230, 100, 240);
    ctx.bezierCurveTo(40, 230, 0, 180, 0, 110);
    ctx.closePath();
    ctx.clip();

    // Draw each device image
    for (const data of imageData) {
      if (!data.href) continue;
      try {
        const deviceImg = await loadImage(data.href);

        // Apply color filter by drawing to temp canvas
        if (data.filter) {
          const match = data.filter.match(/url\(#dev-([a-fA-F0-9]+)\)/);
          if (match) {
            const color = "#" + match[1];
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = data.width * scale;
            tempCanvas.height = data.height * scale;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.scale(scale, scale);

            if (color === "#000000") {
              // Black tincture: invert the image (black outline becomes white, white fill becomes black)
              tempCtx.drawImage(deviceImg, 0, 0, data.width, data.height);
              const imageData = tempCtx.getImageData(
                0,
                0,
                tempCanvas.width,
                tempCanvas.height,
              );
              const pixels = imageData.data;
              for (let i = 0; i < pixels.length; i += 4) {
                pixels[i] = 255 - pixels[i]; // R
                pixels[i + 1] = 255 - pixels[i + 1]; // G
                pixels[i + 2] = 255 - pixels[i + 2]; // B
                // Alpha stays the same
              }
              tempCtx.putImageData(imageData, 0, 0);
            } else {
              // Fill with tincture color first
              tempCtx.fillStyle = color;
              tempCtx.fillRect(0, 0, data.width, data.height);

              // Multiply blend: white becomes color, black stays black
              tempCtx.globalCompositeOperation = "multiply";
              tempCtx.drawImage(deviceImg, 0, 0, data.width, data.height);

              // Use original image alpha to mask out background
              tempCtx.globalCompositeOperation = "destination-in";
              tempCtx.drawImage(deviceImg, 0, 0, data.width, data.height);
            }

            ctx.drawImage(tempCanvas, data.x, data.y, data.width, data.height);
            continue;
          }
        }
        ctx.drawImage(deviceImg, data.x, data.y, data.width, data.height);
      } catch (e) {
        console.warn("Failed to load device image:", data.href, e);
      }
    }

    ctx.restore();

    // Redraw shield border on top
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 0);
    ctx.lineTo(200, 110);
    ctx.bezierCurveTo(200, 180, 160, 230, 100, 240);
    ctx.bezierCurveTo(40, 230, 0, 180, 0, 110);
    ctx.closePath();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.stroke();

    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.download = "heraldry.png";
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  } catch (e) {
    console.error("Save PNG failed:", e);
    alert("Failed to save PNG: " + e.message);
  }
});
