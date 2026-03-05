// Geometric charge generation and device filters

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
