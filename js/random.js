// Seeded PRNG and random selection functions

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

function isBretonnian() {
  return document.getElementById("rule-brettonia")?.checked;
}

function isNormalRules() {
  return document.getElementById("rule-normal")?.checked ?? true;
}

function randomColour() {
  const excludes = isBretonnian() ? bretonnianExcluded : [];
  const pool = Object.values(colours).filter((c) => !excludes.includes(c));
  return pool[Math.floor(random() * pool.length)];
}

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

// Get all devices for indexing
function getAllDevices() {
  return [...geometricCharges, ...deviceList];
}
