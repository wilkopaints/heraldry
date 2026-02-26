const form = document.querySelector('form');
const heraldry = document.querySelector('#heraldry');
// Better solution to this for static page?
const deviceList = ["img/devices/boar-rampant.png",
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
                    "img/devices/boar.png"]

var colours = {
    0: "#d4af34", // or
    1: "#ffffff", // argent
    2: "#3953a4", // azure
    3: "#790000", //gules
    4: "#000000", //sable
    5: "#11671d", // vert
    6: "#dbdbdb" // cendree
}

var shapes = {
    0: "partyPerFess",
    1: "partyPerPale",
    2: "partyPerBendSinister",
    3: "quarterly",
    4: "quarterlyWithHeart",
    5: "chief",
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
    23: "gyronny"
}

const colourNames = {
    "#d4af34": "Or",
    "#ffffff": "Argent",
    "#3953a4": "Azure",
    "#790000": "Gules",
    "#000000": "Sable",
    "#11671d": "Vert",
    "#dbdbdb": "Cendré"
};

const shapeNames = {
    "partyPerFess": "Party per Fess",
    "partyPerPale": "Party per Pale",
    "partyPerBendSinister": "Party per Bend Sinister",
    "quarterly": "Quarterly",
    "quarterlyWithHeart": "Quarterly",
    "chief": "Chief",
    "pale": "Pale",
    "fess": "Fess",
    "bend": "Bend",
    "bendSinister": "Bend Sinister",
    "chevron": "Chevron",
    "cross": "Cross",
    "saltire": "Saltire",
    "pall": "Pall",
    "flaunches": "Flaunches",
    "pile": "Pile",
    "bordure": "Bordure",
    "barry": "Barry",
    "pally": "Pally",
    "bendy": "Bendy",
    "chevronny": "Chevronny",
    "chequy": "Chequy",
    "lozengy": "Lozengy",
    "gyronny": "Gyronny"
};

function randomColour() {
    var value = colours[Math.floor(Math.random() * Object.keys(colours).length)];
    return value;
}

function deviceDisplayName(path) {
    return path.replace('img/devices/', '').replace('.png', '')
               .split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Pick device tincture following the rule of tincture:
// metals (Or, Argent, Cendré) on colours, colours on metals.
const metals = new Set(["#d4af34", "#ffffff", "#dbdbdb"]);

function pickDeviceTincture(col1, col2) {
    const col1IsMetal = metals.has(col1);
    const candidates = Object.values(colours).filter(c => {
        if (c === col1 || c === col2) return false;
        return col1IsMetal ? !metals.has(c) : metals.has(c);
    });
    if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
    }
    // Fallback: anything different from the field
    const fallback = Object.values(colours).filter(c => c !== col1 && c !== col2);
    return fallback.length > 0 ? fallback[Math.floor(Math.random() * fallback.length)] : "#d4af34";
}

// Returns { defs, content } — SVG fragments for the heraldic field division
function generateDivision(shape, col1, col2) {
    const W = 200, H = 240;
    const field = (c) => `<rect x="0" y="0" width="${W}" height="${H}" fill="${c}"/>`;

    switch (shape) {
        case 'partyPerFess':
            return { defs: '', content: `
                <rect x="0" y="0" width="${W}" height="${H/2}" fill="${col1}"/>
                <rect x="0" y="${H/2}" width="${W}" height="${H/2}" fill="${col2}"/>` };

        case 'partyPerPale':
            return { defs: '', content: `
                <rect x="0" y="0" width="${W/2}" height="${H}" fill="${col1}"/>
                <rect x="${W/2}" y="0" width="${W/2}" height="${H}" fill="${col2}"/>` };

        case 'partyPerBendSinister':
            return { defs: '', content: `
                <polygon points="0,0 ${W},0 0,${H}" fill="${col1}"/>
                <polygon points="${W},0 ${W},${H} 0,${H}" fill="${col2}"/>` };

        case 'quarterly':
        case 'quarterlyWithHeart':
            return { defs: '', content: `
                <rect x="0" y="0" width="${W/2}" height="${H/2}" fill="${col1}"/>
                <rect x="${W/2}" y="0" width="${W/2}" height="${H/2}" fill="${col2}"/>
                <rect x="0" y="${H/2}" width="${W/2}" height="${H/2}" fill="${col2}"/>
                <rect x="${W/2}" y="${H/2}" width="${W/2}" height="${H/2}" fill="${col1}"/>` };

        case 'chief':
            return { defs: '', content: `
                ${field(col1)}
                <rect x="0" y="0" width="${W}" height="60" fill="${col2}"/>` };

        case 'pale':
            return { defs: '', content: `
                ${field(col1)}
                <rect x="70" y="0" width="60" height="${H}" fill="${col2}"/>` };

        case 'fess':
            return { defs: '', content: `
                ${field(col1)}
                <rect x="0" y="85" width="${W}" height="70" fill="${col2}"/>` };

        case 'bend':
            return { defs: '', content: `
                ${field(col1)}
                <polygon points="-20,60 60,-20 220,180 140,260" fill="${col2}"/>` };

        case 'bendSinister':
            return { defs: '', content: `
                ${field(col1)}
                <polygon points="140,-20 220,60 60,260 -20,180" fill="${col2}"/>` };

        case 'chevron':
            return { defs: '', content: `
                ${field(col1)}
                <polygon points="0,180 100,80 200,180 200,140 100,40 0,140" fill="${col2}"/>` };

        case 'cross':
            return { defs: '', content: `
                ${field(col1)}
                <rect x="75" y="0" width="50" height="${H}" fill="${col2}"/>
                <rect x="0" y="95" width="${W}" height="50" fill="${col2}"/>` };

        case 'saltire':
            return { defs: '', content: `
                ${field(col1)}
                <polygon points="-30,-30 30,-30 ${W+30},${H+30} ${W-30},${H+30}" fill="${col2}"/>
                <polygon points="${W+30},-30 ${W-30},-30 -30,${H+30} 30,${H+30}" fill="${col2}"/>` };

        case 'pall':
            return { defs: '', content: `
                ${field(col1)}
                <polygon points="0,0 50,0 100,90 150,0 200,0 200,50 120,140 120,${H} 80,${H} 80,140 0,50" fill="${col2}"/>` };

        case 'flaunches':
            return { defs: '', content: `
                ${field(col1)}
                <ellipse cx="-10" cy="${H/2}" rx="80" ry="${H/2+20}" fill="${col2}"/>
                <ellipse cx="${W+10}" cy="${H/2}" rx="80" ry="${H/2+20}" fill="${col2}"/>` };

        case 'pile':
            return { defs: '', content: `
                ${field(col1)}
                <polygon points="0,0 ${W},0 ${W/2},${H}" fill="${col2}"/>` };

        case 'bordure':
            return { defs: '', content: `
                ${field(col2)}
                <path d="M 18,18 L 182,18 L 182,132 C 182,178 146,206 100,222 C 54,206 18,178 18,132 Z" fill="${col1}"/>` };

        case 'barry': {
            let content = '';
            for (let i = 0; i < 6; i++) {
                content += `<rect x="0" y="${i*40}" width="${W}" height="40" fill="${i%2===0 ? col1 : col2}"/>`;
            }
            return { defs: '', content };
        }

        case 'pally': {
            let content = '';
            for (let i = 0; i < 5; i++) {
                content += `<rect x="${i*40}" y="0" width="40" height="${H}" fill="${i%2===0 ? col1 : col2}"/>`;
            }
            return { defs: '', content };
        }

        case 'bendy': {
            const defs = `<pattern id="bendy-pat" x="0" y="0" width="56" height="56"
                    patternUnits="userSpaceOnUse" patternTransform="rotate(45 100 120)">
                <rect x="0" y="0" width="28" height="56" fill="${col1}"/>
                <rect x="28" y="0" width="28" height="56" fill="${col2}"/>
            </pattern>`;
            return { defs, content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#bendy-pat)"/>` };
        }

        case 'chevronny': {
            let content = field(col1);
            for (let i = 0; i < 6; i++) {
                if (i % 2 === 0) {
                    const y = i * 55 - 80;
                    content += `<polygon points="0,${y+100} 100,${y} 200,${y+100} 200,${y+70} 100,${y-30} 0,${y+70}" fill="${col2}"/>`;
                }
            }
            return { defs: '', content };
        }

        case 'chequy': {
            const defs = `<pattern id="chequy-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="20" height="20" fill="${col1}"/>
                <rect x="20" y="0" width="20" height="20" fill="${col2}"/>
                <rect x="0" y="20" width="20" height="20" fill="${col2}"/>
                <rect x="20" y="20" width="20" height="20" fill="${col1}"/>
            </pattern>`;
            return { defs, content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#chequy-pat)"/>` };
        }

        case 'lozengy': {
            const defs = `<pattern id="lozengy-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="40" height="40" fill="${col1}"/>
                <polygon points="20,0 40,20 20,40 0,20" fill="${col2}"/>
            </pattern>`;
            return { defs, content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#lozengy-pat)"/>` };
        }

        case 'gyronny': {
            const cx = 100, cy = 120;
            return { defs: '', content: `
                <polygon points="${cx},${cy} 0,0 100,0" fill="${col1}"/>
                <polygon points="${cx},${cy} 100,0 ${W},0" fill="${col2}"/>
                <polygon points="${cx},${cy} ${W},0 ${W},80" fill="${col1}"/>
                <polygon points="${cx},${cy} ${W},80 100,${H}" fill="${col2}"/>
                <polygon points="${cx},${cy} 100,${H} 0,80" fill="${col1}"/>
                <polygon points="${cx},${cy} 0,80 0,0" fill="${col2}"/>` };
        }

        default:
            return { defs: '', content: field(col1) };
    }
}

function generateShieldSVG(device, col1, col2, shape, devColour) {
    const shieldPath = "M 0,0 L 200,0 L 200,140 C 200,190 160,220 100,240 C 40,220 0,190 0,140 Z";
    const { defs, content } = generateDivision(shape, col1, col2);

    // SVG filter: extracts dark areas of the device image and recolours them to devColour.
    // Works for both black-on-white and black-on-transparent PNGs.
    const deviceFilter = `
    <filter id="dev-color" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1 -1 -1 0 3"
          in="SourceGraphic" result="darkMask"/>
      <feComposite in="darkMask" in2="SourceGraphic" operator="in" result="mask"/>
      <feFlood flood-color="${devColour}" result="color"/>
      <feComposite in="color" in2="mask" operator="in"/>
    </filter>`;

    return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-label="Heraldic shield">
  <defs>
    <clipPath id="shield-clip">
      <path d="${shieldPath}"/>
    </clipPath>
    ${deviceFilter}
    ${defs}
  </defs>
  <g clip-path="url(#shield-clip)">
    ${content}
  </g>
  <image href="${device}" x="20" y="25" width="160" height="160"
      clip-path="url(#shield-clip)" filter="url(#dev-color)"/>
  <path d="${shieldPath}" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
</svg>`;
}

function generateCaption(device, col1, col2, shape, devColour) {
    return `<p class="shield-caption">
        <span class="swatch" style="background:${col1}"></span>${colourNames[col1]}
        &amp; <span class="swatch" style="background:${col2}"></span>${colourNames[col2]}
        &ndash; ${shapeNames[shape] || shape}
        &ndash; <span class="swatch" style="background:${devColour}"></span>${deviceDisplayName(device)}
    </p>`;
}

const updateHeraldry = () => {
    const device = deviceList[Math.floor(Math.random() * deviceList.length)];
    const colourOne = randomColour();
    const colourTwo = randomColour();
    const shape = shapes[Math.floor(Math.random() * Object.keys(shapes).length)];
    const devColour = pickDeviceTincture(colourOne, colourTwo);
    heraldry.innerHTML = generateShieldSVG(device, colourOne, colourTwo, shape, devColour)
                       + generateCaption(device, colourOne, colourTwo, shape, devColour);
};

updateHeraldry();
form.addEventListener('submit', (e) => { e.preventDefault(); updateHeraldry(); });
