// Charge arrangement layouts for different divisions and counts

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
