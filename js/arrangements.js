// Charge arrangement layouts for different divisions and counts
//
// Shield canvas is 200×240 with path:
//   M 0,0 L 200,0 L 200,110 C 200,180 160,230 100,240 C 40,230 0,180 0,110 Z
// Visual centroid lies around (100, 110). The shield narrows rapidly below y≈110,
// so charge placement below the fess line must shrink size and pull inward.
// Target breathing room between charges: ≥15px (≈7% of shield width).

// Division-specific charge arrangements. Returns null if no specific layout exists.
function getDivisionSpecificArrangement(count, shape) {
  switch (shape) {
    case "barry":
      if (count === 1)
        return {
          positions: [{ cx: 100, cy: 100 }],
          size: 120,
        };
      if (count === 2)
        return {
          positions: [
            { cx: 100, cy: 60 },
            { cx: 100, cy: 140 },
          ],
          size: 60,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 40, cy: 60 },
            { cx: 160, cy: 60 },
            { cx: 100, cy: 140 },
          ],
          size: 40,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 40, cy: 60 },
            { cx: 160, cy: 60 },
            { cx: 40, cy: 140 },
            { cx: 160, cy: 140 },
          ],
          size: 40,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 40, cy: 20 },
            { cx: 160, cy: 20 },
            { cx: 40, cy: 100 },
            { cx: 160, cy: 100 },
            { cx: 100, cy: 180 },
          ],
          size: 38,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 40, cy: 60 },
            { cx: 100, cy: 60 },
            { cx: 160, cy: 60 },
            { cx: 40, cy: 140 },
            { cx: 100, cy: 140 },
            { cx: 160, cy: 140 },
          ],
          size: 40,
        };
      break;
    case "base":
      if (count === 3)
        return {
          positions: [
            { cx: 55, cy: 60 },
            { cx: 100, cy: 140 },
            { cx: 145, cy: 60 },
          ],
          size: 60,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 55, cy: 45 },
            { cx: 55, cy: 110 },
            { cx: 145, cy: 45 },
            { cx: 145, cy: 110 },
            { cx: 100, cy: 155 },
          ],
          size: 45,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 55, cy: 30 },
            { cx: 55, cy: 90 },
            { cx: 145, cy: 30 },
            { cx: 145, cy: 90 },
            { cx: 55, cy: 150 },
            { cx: 145, cy: 150 },
          ],
          size: 45,
        };
      break;
    case "bend":
      // Centerline: y = 1.25x - 17
      if (count === 2)
        return {
          positions: [
            { cx: 50, cy: 47 },
            { cx: 140, cy: 157 },
          ],
          size: 52,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 48, cy: 43 },
            { cx: 100, cy: 108 },
            { cx: 152, cy: 173 },
          ],
          size: 46,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 40, cy: 32 },
            { cx: 69, cy: 69 },
            { cx: 98, cy: 106 },
            { cx: 127, cy: 143 },
            { cx: 156, cy: 180 },
          ],
          size: 50,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 36, cy: 28 },
            { cx: 60, cy: 58 },
            { cx: 83, cy: 89 },
            { cx: 107, cy: 120 },
            { cx: 132, cy: 151 },
            { cx: 156, cy: 180 },
          ],
          size: 40,
        };
      break;
    case "bendSinister":
      // Centerline: y = 233 - 1.25x
      if (count === 2)
        return {
          positions: [
            { cx: 150, cy: 47 },
            { cx: 60, cy: 157 },
          ],
          size: 52,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 156, cy: 39 },
            { cx: 104, cy: 104 },
            { cx: 52, cy: 169 },
          ],
          size: 46,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 46, cy: 178 },
            { cx: 75, cy: 141 },
            { cx: 104, cy: 104 },
            { cx: 133, cy: 67 },
            { cx: 162, cy: 30 },
          ],
          size: 50,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 46, cy: 176 },
            { cx: 70, cy: 147 },
            { cx: 93, cy: 116 },
            { cx: 117, cy: 85 },
            { cx: 142, cy: 54 },
            { cx: 166, cy: 24 },
          ],
          size: 40,
        };
      break;
    case "canton":
      if (count === 1) return { positions: [{ cx: 30, cy: 30 }], size: 38 };
      if (count === 3)
        return {
          positions: [
            { cx: 58, cy: 85 },
            { cx: 142, cy: 85 },
            { cx: 100, cy: 167 },
          ],
          size: 50,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 60, cy: 60 },
            { cx: 140, cy: 60 },
            { cx: 60, cy: 110 },
            { cx: 140, cy: 110 },
            { cx: 60, cy: 160 },
            { cx: 140, cy: 160 },
          ],
          size: 46,
        };
      break;
    case "chequy":
      if (count === 2)
        return {
          positions: [
            { cx: 58, cy: 100 },
            { cx: 142, cy: 100 },
          ],
          size: 68,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 58, cy: 80 },
            { cx: 142, cy: 80 },
            { cx: 100, cy: 160 },
          ],
          size: 60,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 58, cy: 80 },
            { cx: 142, cy: 80 },
            { cx: 58, cy: 160 },
            { cx: 142, cy: 160 },
          ],
          size: 60,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 60, cy: 60 },
            { cx: 140, cy: 60 },
            { cx: 60, cy: 120 },
            { cx: 140, cy: 120 },
            { cx: 100, cy: 180 },
          ],
          size: 50,
        };
      break;
    case "chevron":
      // Charges placed in the chief flanks (above the arms) and base — not on the chevron band itself
      if (count === 1)
        return {
          positions: [{ cx: 100, cy: 120 }],
          size: 60,
        };
      if (count === 2)
        return {
          positions: [
            { cx: 35, cy: 32 },
            { cx: 165, cy: 32 },
          ],
          size: 55,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 35, cy: 32 },
            { cx: 165, cy: 32 },
            { cx: 100, cy: 160 },
          ],
          size: 52,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 35, cy: 32 },
            { cx: 165, cy: 32 },
            { cx: 55, cy: 170 },
            { cx: 145, cy: 170 },
            { cx: 100, cy: 110 },
          ],
          size: 52,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 35, cy: 32 },
            { cx: 165, cy: 32 },
            { cx: 65, cy: 185 },
            { cx: 135, cy: 185 },
            { cx: 135, cy: 130 },
            { cx: 65, cy: 130 },
          ],
          size: 40,
        };
      break;
    case "chevronny":
      if (count === 1) return { positions: [{ cx: 100, cy: 105 }], size: 130 };
      if (count === 2)
        return {
          positions: [
            { cx: 60, cy: 90 },
            { cx: 140, cy: 90 },
          ],
          size: 40,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 60, cy: 90 },
            { cx: 140, cy: 90 },
            { cx: 100, cy: 160 },
          ],
          size: 40,
        };
      break;
    case "chief":
      if (count === 1) return { positions: [{ cx: 100, cy: 32 }], size: 42 };
      if (count === 2)
        return {
          positions: [
            { cx: 60, cy: 32 },
            { cx: 140, cy: 32 },
          ],
          size: 38,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 40, cy: 32 },
            { cx: 100, cy: 32 },
            { cx: 160, cy: 32 },
          ],
          size: 34,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 60, cy: 30 },
            { cx: 140, cy: 30 },
            { cx: 60, cy: 90 },
            { cx: 140, cy: 90 },
            { cx: 60, cy: 150 },
            { cx: 140, cy: 150 },
          ],
          size: 46,
        };
      break;
    case "cross":
      if (count === 1) return { positions: [{ cx: 100, cy: 107 }], size: 100 };
      if (count === 2)
        return {
          positions: [
            { cx: 40, cy: 108 },
            { cx: 160, cy: 108 },
          ],
          size: 38,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 40, cy: 108 },
            { cx: 100, cy: 45 },
            { cx: 160, cy: 108 },
          ],
          size: 38,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 100, cy: 45 },
            { cx: 40, cy: 108 },
            { cx: 160, cy: 108 },
            { cx: 100, cy: 175 },
          ],
          size: 40,
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
          size: 40,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 100, cy: 133 },
            { cx: 100, cy: 30 },
            { cx: 100, cy: 83 },
            { cx: 100, cy: 190 },
            { cx: 40, cy: 108 },
            { cx: 160, cy: 108 },
          ],
          size: 40,
        };
      break;
    case "fess":
      if (count === 2)
        return {
          positions: [
            { cx: 65, cy: 108 },
            { cx: 135, cy: 108 },
          ],
          size: 48,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 45, cy: 108 },
            { cx: 100, cy: 108 },
            { cx: 155, cy: 108 },
          ],
          size: 42,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 25, cy: 108 },
            { cx: 75, cy: 108 },
            { cx: 125, cy: 108 },
            { cx: 175, cy: 108 },
          ],
          size: 42,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 65, cy: 38 },
            { cx: 135, cy: 38 },
            { cx: 45, cy: 108 },
            { cx: 100, cy: 108 },
            { cx: 155, cy: 108 },
          ],
          size: 42,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 45, cy: 38 },
            { cx: 100, cy: 38 },
            { cx: 155, cy: 38 },
            { cx: 45, cy: 108 },
            { cx: 100, cy: 108 },
            { cx: 155, cy: 108 },
          ],
          size: 42,
        };
      break;
    case "flaunches":
      if (count === 5)
        return {
          positions: [
            { cx: 35, cy: 108 },
            { cx: 165, cy: 108 },
            { cx: 100, cy: 38 },
            { cx: 100, cy: 108 },
            { cx: 100, cy: 178 },
          ],
          size: 42,
        };
      break;
    case "fret":
      if (count === 2)
        return {
          positions: [
            { cx: 60, cy: 119 },
            { cx: 140, cy: 119 },
          ],
          size: 70,
        };
      break;
    case "gyronny6":
      if (count === 2)
        return {
          positions: [
            { cx: 60, cy: 50 },
            { cx: 140, cy: 50 },
          ],
          size: 70,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 60, cy: 175 },
            { cx: 140, cy: 175 },
            { cx: 60, cy: 50 },
            { cx: 140, cy: 50 },
          ],
          size: 50,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 60, cy: 50 },
            { cx: 140, cy: 50 },
            { cx: 40, cy: 118 },
            { cx: 160, cy: 118 },
            { cx: 60, cy: 180 },
            { cx: 140, cy: 180 },
          ],
          size: 50,
        };
      break;
    case "gyronny":
      if (count === 1)
        return {
          positions: [{ cx: 100, cy: 120 }],
          size: 130,
        };
      if (count === 2)
        return {
          positions: [
            { cx: 50, cy: 120 },
            { cx: 150, cy: 120 },
          ],
          size: 70,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 70, cy: 185 },
            { cx: 130, cy: 185 },
            { cx: 70, cy: 40 },
            { cx: 130, cy: 40 },
          ],
          size: 50,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 70, cy: 185 },
            { cx: 130, cy: 185 },
            { cx: 70, cy: 40 },
            { cx: 130, cy: 40 },
            { cx: 50, cy: 120 },
            { cx: 150, cy: 120 },
          ],
          size: 50,
        };
      break;
    case "gyronny12":
      if (count === 1)
        return {
          positions: [{ cx: 100, cy: 120 }],
          size: 130,
        };
      if (count === 2)
        return {
          positions: [
            { cx: 50, cy: 120 },
            { cx: 150, cy: 120 },
          ],
          size: 70,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 62, cy: 185 },
            { cx: 137, cy: 185 },
            { cx: 55, cy: 40 },
            { cx: 145, cy: 40 },
            { cx: 50, cy: 120 },
            { cx: 150, cy: 120 },
          ],
          size: 50,
        };
      break;
    case "label":
      // Charges typically placed below the label (which ends at y=78)
      if (count === 1) return { positions: [{ cx: 100, cy: 155 }], size: 85 };
      if (count === 3)
        return {
          positions: [
            { cx: 45, cy: 150 },
            { cx: 100, cy: 150 },
            { cx: 155, cy: 150 },
          ],
          size: 45,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 60, cy: 185 },
            { cx: 140, cy: 185 },
            { cx: 60, cy: 120 },
            { cx: 140, cy: 120 },
          ],
          size: 50,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 75, cy: 185 },
            { cx: 125, cy: 185 },
            { cx: 50, cy: 120 },
            { cx: 150, cy: 120 },
            { cx: 100, cy: 120 },
          ],
          size: 40,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 50, cy: 185 },
            { cx: 150, cy: 185 },
            { cx: 100, cy: 185 },
            { cx: 50, cy: 120 },
            { cx: 150, cy: 120 },
            { cx: 100, cy: 120 },
          ],
          size: 40,
        };
      break;
    case "lozengy":
      // Centred on intersections
      if (count === 1) return { positions: [{ cx: 100, cy: 100 }], size: 130 };
      if (count === 2)
        return {
          positions: [
            { cx: 60, cy: 100 },
            { cx: 140, cy: 100 },
          ],
          size: 70,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 60, cy: 100 },
            { cx: 140, cy: 100 },
            { cx: 100, cy: 160 },
          ],
          size: 70,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 60, cy: 80 },
            { cx: 140, cy: 80 },
            { cx: 60, cy: 160 },
            { cx: 140, cy: 160 },
          ],
          size: 60,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 60, cy: 40 },
            { cx: 140, cy: 40 },
            { cx: 60, cy: 120 },
            { cx: 140, cy: 120 },
            { cx: 100, cy: 200 },
          ],
          size: 60,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 60, cy: 40 },
            { cx: 140, cy: 40 },
            { cx: 60, cy: 120 },
            { cx: 140, cy: 120 },
            { cx: 60, cy: 200 },
            { cx: 140, cy: 200 },
          ],
          size: 40,
        };
      break;
    case "orle":
      if (count === 1) return { positions: [{ cx: 100, cy: 110 }], size: 120 };
      if (count === 2)
        return {
          positions: [
            { cx: 100, cy: 80 },
            { cx: 100, cy: 150 },
          ],
          size: 60,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 70, cy: 80 },
            { cx: 130, cy: 80 },
            { cx: 100, cy: 150 },
          ],
          size: 55,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 70, cy: 80 },
            { cx: 130, cy: 80 },
            { cx: 70, cy: 140 },
            { cx: 130, cy: 140 },
          ],
          size: 50,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 70, cy: 70 },
            { cx: 130, cy: 70 },
            { cx: 70, cy: 125 },
            { cx: 130, cy: 125 },
            { cx: 100, cy: 170 },
          ],
          size: 50,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 70, cy: 60 },
            { cx: 130, cy: 60 },
            { cx: 70, cy: 105 },
            { cx: 130, cy: 105 },
            { cx: 70, cy: 150 },
            { cx: 130, cy: 150 },
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
          size: 48,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 100, cy: 50 },
            { cx: 100, cy: 115 },
            { cx: 100, cy: 180 },
          ],
          size: 44,
        };
      break;
    case "pall":
      if (count === 2)
        return {
          positions: [
            { cx: 40, cy: 140 },
            { cx: 160, cy: 140 },
          ],
          size: 60,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 40, cy: 40 },
            { cx: 160, cy: 40 },
            { cx: 100, cy: 190 },
          ],
          size: 38,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 40, cy: 40 },
            { cx: 160, cy: 40 },
            { cx: 100, cy: 100 },
            { cx: 100, cy: 190 },
          ],
          size: 38,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 40, cy: 40 },
            { cx: 160, cy: 40 },
            { cx: 100, cy: 100 },
            { cx: 100, cy: 150 },
            { cx: 100, cy: 200 },
          ],
          size: 38,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 40, cy: 40 },
            { cx: 160, cy: 40 },
            { cx: 75, cy: 80 },
            { cx: 125, cy: 80 },
            { cx: 100, cy: 140 },
            { cx: 100, cy: 200 },
          ],
          size: 38,
        };
      break;
    case "partyPerBendSinister":
      if (count === 1) return { positions: [{ cx: 100, cy: 120 }], size: 130 };
      if (count === 2)
        return {
          positions: [
            { cx: 100, cy: 50 },
            { cx: 100, cy: 180 },
          ],
          size: 70,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 50, cy: 110 },
            { cx: 100, cy: 50 },
            { cx: 140, cy: 140 },
          ],
          size: 55,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 50, cy: 110 },
            { cx: 100, cy: 50 },
            { cx: 160, cy: 110 },
            { cx: 110, cy: 170 },
          ],
          size: 55,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 40, cy: 120 },
            { cx: 110, cy: 40 },
            { cx: 75, cy: 80 },
            { cx: 160, cy: 120 },
            { cx: 120, cy: 160 },
          ],
          size: 55,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 45, cy: 120 },
            { cx: 115, cy: 40 },
            { cx: 80, cy: 80 },
            { cx: 135, cy: 140 },
            { cx: 170, cy: 100 },
            { cx: 95, cy: 180 },
          ],
          size: 55,
        };
      break;
    case "partyPerFess":
      if (count === 2)
        return {
          positions: [
            { cx: 100, cy: 55 },
            { cx: 100, cy: 172 },
          ],
          size: 70,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 60, cy: 55 },
            { cx: 140, cy: 55 },
            { cx: 100, cy: 172 },
          ],
          size: 60,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 55, cy: 55 },
            { cx: 145, cy: 55 },
            { cx: 55, cy: 170 },
            { cx: 145, cy: 170 },
          ],
          size: 58,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 40, cy: 55 },
            { cx: 100, cy: 55 },
            { cx: 160, cy: 55 },
            { cx: 70, cy: 170 },
            { cx: 130, cy: 170 },
          ],
          size: 50,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 40, cy: 55 },
            { cx: 100, cy: 55 },
            { cx: 160, cy: 55 },
            { cx: 50, cy: 170 },
            { cx: 100, cy: 170 },
            { cx: 150, cy: 170 },
          ],
          size: 44,
        };
      break;
    case "pile":
      if (count === 2)
        return {
          positions: [
            { cx: 100, cy: 65 },
            { cx: 100, cy: 155 },
          ],
          size: 70,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 60, cy: 55 },
            { cx: 140, cy: 55 },
            { cx: 100, cy: 155 },
          ],
          size: 60,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 55, cy: 55 },
            { cx: 145, cy: 55 },
            { cx: 40, cy: 160 },
            { cx: 160, cy: 160 },
          ],
          size: 50,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 60, cy: 50 },
            { cx: 140, cy: 50 },
            { cx: 100, cy: 140 },
            { cx: 40, cy: 160 },
            { cx: 160, cy: 160 },
          ],
          size: 50,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 100, cy: 110 },
            { cx: 150, cy: 55 },
            { cx: 40, cy: 170 },
            { cx: 100, cy: 170 },
            { cx: 160, cy: 170 },
          ],
          size: 44,
        };
      break;
    case "partyPerPale":
      if (count === 2)
        return {
          positions: [
            { cx: 50, cy: 108 },
            { cx: 150, cy: 108 },
          ],
          size: 68,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 50, cy: 108 },
            { cx: 150, cy: 70 },
            { cx: 150, cy: 158 },
          ],
          size: 58,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 50, cy: 70 },
            { cx: 150, cy: 70 },
            { cx: 50, cy: 160 },
            { cx: 150, cy: 160 },
          ],
          size: 56,
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
          size: 46,
        };
      break;
    case "quarter":
      if (count === 1) return { positions: [{ cx: 50, cy: 55 }], size: 65 };
      if (count === 2)
        return {
          positions: [
            { cx: 50, cy: 32 },
            { cx: 50, cy: 78 },
          ],
          size: 38,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 30, cy: 35 },
            { cx: 70, cy: 35 },
            { cx: 50, cy: 80 },
          ],
          size: 30,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 30, cy: 35 },
            { cx: 70, cy: 35 },
            { cx: 30, cy: 80 },
            { cx: 70, cy: 80 },
          ],
          size: 30,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 30, cy: 30 },
            { cx: 70, cy: 30 },
            { cx: 30, cy: 80 },
            { cx: 70, cy: 80 },
            { cx: 50, cy: 55 },
          ],
          size: 30,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 20, cy: 30 },
            { cx: 60, cy: 30 },
            { cx: 20, cy: 80 },
            { cx: 60, cy: 80 },
            { cx: 40, cy: 55 },
            { cx: 80, cy: 55 },
          ],
          size: 30,
        };
      break;
    case "quarterly":
      if (count === 2)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 145, cy: 160 },
          ],
          size: 68,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 150, cy: 55 },
            { cx: 100, cy: 170 },
          ],
          size: 62,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 150, cy: 55 },
            { cx: 50, cy: 160 },
            { cx: 150, cy: 160 },
          ],
          size: 56,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 50, cy: 55 },
            { cx: 150, cy: 55 },
            { cx: 50, cy: 160 },
            { cx: 150, cy: 160 },
            { cx: 100, cy: 110 },
          ],
          size: 56,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 50, cy: 75 },
            { cx: 150, cy: 75 },
            { cx: 50, cy: 30 },
            { cx: 150, cy: 30 },
            { cx: 50, cy: 160 },
            { cx: 150, cy: 160 },
          ],
          size: 40,
        };
      break;
    case "saltire":
      if (count === 2)
        return {
          positions: [
            { cx: 166, cy: 110 },
            { cx: 34, cy: 110 },
          ],
          size: 48,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 38, cy: 110 },
            { cx: 162, cy: 110 },
            { cx: 100, cy: 175 },
          ],
          size: 48,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 100, cy: 40 },
            { cx: 38, cy: 110 },
            { cx: 162, cy: 110 },
            { cx: 100, cy: 175 },
          ],
          size: 48,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 100, cy: 108 },
            { cx: 54, cy: 52 },
            { cx: 146, cy: 52 },
            { cx: 52, cy: 165 },
            { cx: 148, cy: 165 },
          ],
          size: 34,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 124, cy: 135 },
            { cx: 76, cy: 135 },
            { cx: 54, cy: 52 },
            { cx: 146, cy: 52 },
            { cx: 44, cy: 175 },
            { cx: 156, cy: 175 },
          ],
          size: 34,
        };
      break;
    case "tressure":
      if (count === 2)
        return {
          positions: [
            { cx: 100, cy: 80 },
            { cx: 100, cy: 160 },
          ],
          size: 60,
        };
      if (count === 3)
        return {
          positions: [
            { cx: 70, cy: 80 },
            { cx: 130, cy: 80 },
            { cx: 100, cy: 160 },
          ],
          size: 50,
        };
      if (count === 4)
        return {
          positions: [
            { cx: 100, cy: 60 },
            { cx: 58, cy: 110 },
            { cx: 142, cy: 110 },
            { cx: 100, cy: 160 },
          ],
          size: 48,
        };
      if (count === 5)
        return {
          positions: [
            { cx: 100, cy: 170 },
            { cx: 60, cy: 70 },
            { cx: 140, cy: 70 },
            { cx: 60, cy: 130 },
            { cx: 140, cy: 130 },
          ],
          size: 48,
        };
      if (count === 6)
        return {
          positions: [
            { cx: 70, cy: 105 },
            { cx: 130, cy: 105 },
            { cx: 70, cy: 55 },
            { cx: 130, cy: 55 },
            { cx: 70, cy: 155 },
            { cx: 130, cy: 155 },
          ],
          size: 40,
        };
      break;
  }
  return null;
}

// Standard heraldic arrangements by charge count.
function getArrangement(count, shape, useSpecific = true) {
  const arr = {
    0: { positions: [], size: 0 },
    1: { positions: [{ cx: 100, cy: 110 }], size: 130 },
    2: {
      positions: [
        { cx: 58, cy: 105 },
        { cx: 142, cy: 105 },
      ],
      size: 68,
    },
    3: {
      positions: [
        { cx: 58, cy: 75 },
        { cx: 142, cy: 75 },
        { cx: 100, cy: 162 },
      ],
      size: 60,
    },
    4: {
      positions: [
        { cx: 60, cy: 62 },
        { cx: 140, cy: 62 },
        { cx: 60, cy: 150 },
        { cx: 140, cy: 150 },
      ],
      size: 56,
    },
    5: {
      positions: [
        { cx: 60, cy: 58 },
        { cx: 140, cy: 58 },
        { cx: 60, cy: 122 },
        { cx: 140, cy: 122 },
        { cx: 100, cy: 188 },
      ],
      size: 52,
    },
    6: {
      positions: [
        { cx: 60, cy: 50 },
        { cx: 140, cy: 50 },
        { cx: 60, cy: 110 },
        { cx: 140, cy: 110 },
        { cx: 60, cy: 170 },
        { cx: 140, cy: 170 },
      ],
      size: 46,
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
