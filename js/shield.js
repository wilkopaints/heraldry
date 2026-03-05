// Shield SVG generation and caption

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
