// Field colour detection and division SVG generation

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
