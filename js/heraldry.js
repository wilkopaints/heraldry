const form = document.querySelector("form");
const heraldry = document.querySelector("#heraldry");
// Better solution to this for static page?
const deviceList = [
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
  "img/devices/axe.png",
  "img/devices/balance.png",
  "img/devices/basilisk-sejant.png",
  "img/devices/battle-axe.png",
  "img/devices/boar.png",
];

var colours = {
  0: "#d4af34", // or
  1: "#ffffff", // argent
  2: "#3953a4", // azure
  3: "#790000", //gules
  4: "#000000", //sable
  5: "#11671d", // vert
  6: "#dbdbdb", // cendree
  7: "#7b3f8c", // purpure
};

var shapes = {
  0: "partyPerFess",
  1: "partyPerPale",
  2: "partyPerBendSinister",
  3: "quarterly",
  4: "chief",
  6: "pale",
  7: "fess",
  8: "bend",
  9: "bendSinister",
  10: "chevron",
  11: "cross",
  12: "saltire",
  13: "pall",
  14: "flaunches",
  15: "pile",
  16: "bordure",
  17: "barry",
  18: "pally",
  19: "bendy",
  20: "chevronny",
  21: "chequy",
  22: "lozengy",
  23: "gyronny",
  24: "gyronny6",
  25: "gyronny12",
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
  partyPerFess: "Party per Fess",
  partyPerPale: "Party per Pale",
  partyPerBendSinister: "Party per Bend Sinister",
  quarterly: "Quarterly",
  chief: "Chief",
  pale: "Pale",
  fess: "Fess",
  bend: "Bend",
  bendSinister: "Bend Sinister",
  chevron: "Chevron",
  cross: "Cross",
  saltire: "Saltire",
  pall: "Pall",
  flaunches: "Flaunches",
  pile: "Pile",
  bordure: "Bordure",
  barry: "Barry",
  pally: "Pally",
  bendy: "Bendy",
  chevronny: "Chevronny",
  chequy: "Chequy",
  lozengy: "Lozengy",
  gyronny: "Gyronny of 8",
  gyronny6: "Gyronny of 6",
  gyronny12: "Gyronny of 12",
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
  return pool[Math.floor(Math.random() * pool.length)];
}

const geometricCharges = [
  "escutcheon",
  "lozenge",
  "fusil",
  "mascle",
  "rustre",
  "billet",
  "roundel",
  "annulet",
  "fountain",
  "cross-botonny",
  "cross-crosslet",
  "cross-flory",
  "cross-maltese",
  "cross-moline",
  "cross-patonce",
  "cross-pattee",
  "cross-potent",
];
const geometricDisplayNames = {
  escutcheon: "Escutcheon",
  lozenge: "Lozenge",
  fusil: "Fusil",
  mascle: "Mascle",
  rustre: "Rustre",
  billet: "Billet",
  roundel: "Roundel",
  annulet: "Annulet",
  fountain: "Fountain",
  "cross-botonny": "Cross Botonny",
  "cross-crosslet": "Cross Crosslet",
  "cross-flory": "Cross Flory",
  "cross-maltese": "Maltese Cross",
  "cross-moline": "Cross Moline",
  "cross-patonce": "Cross Patonce",
  "cross-pattee": "Cross Pattée",
  "cross-potent": "Cross Potent",
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
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const allDevices = [...geometricCharges, ...deviceList];
  return allDevices[Math.floor(Math.random() * allDevices.length)];
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
  if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
  const fallback = Object.values(colours).filter(
    (c) => c !== col1 && c !== col2 && !excludes.includes(c),
  );
  return fallback.length > 0
    ? fallback[Math.floor(Math.random() * fallback.length)]
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

const updateHeraldry = () => {
  const device = randomDevice();
  const col1 = randomColour();
  const col2 = randomColour();
  const shape = shapes[Math.floor(Math.random() * Object.keys(shapes).length)];
  const count = Math.floor(Math.random() * 7);
  const { positions } = getArrangement(count, shape);
  const tinctures = positions.map(({ cx, cy }) =>
    contrastingTincture(
      getFieldColourAt(cx, cy, shape, col1, col2),
      col1,
      col2,
    ),
  );
  setControls(device, col1, col2, shape, count, tinctures);
  document.getElementById("ctrl-layout").value = "division";
  updateLayoutDropdown();
  renderFromControls();
};

function recomputeChargeColours() {
  const count = parseInt(document.getElementById("ctrl-count").value);
  const col1 = document.getElementById("ctrl-col1").value;
  const col2 = document.getElementById("ctrl-col2").value;
  const shape = document.getElementById("ctrl-shape").value;
  const useSpecific =
    document.getElementById("ctrl-layout").value !== "standard";
  const { positions } = getArrangement(count, shape, useSpecific);
  const tinctures = positions.map(({ cx, cy }) =>
    contrastingTincture(
      getFieldColourAt(cx, cy, shape, col1, col2),
      col1,
      col2,
    ),
  );
  buildChargeColourControls(count, tinctures);
}

populateControls();
updateHeraldry();
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
});
["ctrl-col1", "ctrl-col2", "ctrl-device"].forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    updateSwatches();
    renderFromControls();
  });
});
document.getElementById("ctrl-count").addEventListener("change", () => {
  document.getElementById("ctrl-layout").value = "division";
  updateLayoutDropdown();
  recomputeChargeColours();
  renderFromControls();
});
document.getElementById("ctrl-layout").addEventListener("change", () => {
  recomputeChargeColours();
  renderFromControls();
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
          sel.value = pool[Math.floor(Math.random() * pool.length)];
        }
      });
      updateSwatches();
    }
    recomputeChargeColours();
    renderFromControls();
  });
});
