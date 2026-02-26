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
    6: "#dbdbdb", // cendree
    7: "#7b3f8c"  // purpure
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
    23: "gyronny",
    24: "gyronny6",
    25: "gyronny12"
}

const colourNames = {
    "#d4af34": "Or",
    "#ffffff": "Argent",
    "#3953a4": "Azure",
    "#790000": "Gules",
    "#000000": "Sable",
    "#11671d": "Vert",
    "#dbdbdb": "Cendré",
    "#7b3f8c": "Purpure"
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
    "gyronny": "Gyronny of 8",
    "gyronny6": "Gyronny of 6",
    "gyronny12": "Gyronny of 12"
};

function isBretonnian() { return document.getElementById('rule-brettonia')?.checked; }
function isNormalRules() { return document.getElementById('rule-normal')?.checked ?? true; }

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
    const pool = Object.values(colours).filter(c => !excludes.includes(c));
    return pool[Math.floor(Math.random() * pool.length)];
}

function randomDevice() {
    if (isBretonnian()) {
        // Give favoured devices 4× the weight of others
        const pool = [...deviceList, ...bretonnianFavouredDevices.flatMap(d => Array(3).fill(d))];
        return pool[Math.floor(Math.random() * pool.length)];
    }
    return deviceList[Math.floor(Math.random() * deviceList.length)];
}

function deviceDisplayName(path) {
    return path.replace('img/devices/', '').replace('.png', '')
               .split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Rule of tincture: metals (Or, Argent, Cendré) go on colours and vice-versa.
const metals = new Set(["#d4af34", "#ffffff", "#dbdbdb"]);

function contrastingTincture(fieldColour, col1, col2) {
    const excludes = isBretonnian() ? bretonnianExcluded : [];
    const fieldIsMetal = metals.has(fieldColour);
    const pool = Object.values(colours).filter(c => {
        if (c === col1 || c === col2 || excludes.includes(c)) return false;
        if (isNormalRules()) return fieldIsMetal ? !metals.has(c) : metals.has(c);
        return true;
    });
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    const fallback = Object.values(colours).filter(c => c !== col1 && c !== col2 && !excludes.includes(c));
    return fallback.length > 0 ? fallback[Math.floor(Math.random() * fallback.length)] : "#d4af34";
}

// Standard heraldic arrangements by charge count.
function getArrangement(count) {
    const arr = {
        0: { positions: [],                                                                                                                                                   size: 0   },
        1: { positions: [{cx:100,cy:110}],                                                                                                                                    size: 145 },
        2: { positions: [{cx:60,cy:105},{cx:140,cy:105}],                                                                                                                     size: 85  },
        3: { positions: [{cx:60,cy:85},{cx:140,cy:85},{cx:100,cy:165}],                                                                                                       size: 80  },
        4: { positions: [{cx:60,cy:75},{cx:140,cy:75},{cx:60,cy:155},{cx:140,cy:155}],                                                                                        size: 72  },
        5: { positions: [{cx:60,cy:65},{cx:140,cy:65},{cx:60,cy:150},{cx:140,cy:150},{cx:100,cy:200}],                                                                        size: 65  },
        6: { positions: [{cx:60,cy:60},{cx:140,cy:60},{cx:60,cy:130},{cx:140,cy:130},{cx:60,cy:195},{cx:140,cy:195}],                                                         size: 60  },
    };
    return arr[count] ?? arr[0];
}

// Returns the field colour (col1 or col2) dominant at point (x,y) for the given division.
function getFieldColourAt(x, y, shape, col1, col2) {
    const W = 200, H = 240;
    switch (shape) {
        case 'partyPerFess':       return y < H/2 ? col1 : col2;
        case 'partyPerPale':       return x < W/2 ? col1 : col2;
        case 'partyPerBendSinister': return (x/W + y/H < 1) ? col1 : col2;
        case 'quarterly':
        case 'quarterlyWithHeart': return ((x < W/2) === (y < H/2)) ? col1 : col2;
        case 'chief':              return y < 60 ? col2 : col1;
        case 'pale':               return (x >= 70 && x <= 130) ? col2 : col1;
        case 'fess':               return (y >= 85 && y <= 155) ? col2 : col1;
        case 'bend': {
            // parallelogram band; center line y = 1.25x - 5, half-width ≈ 90 pixels
            return Math.abs(1.25*x - y - 5) < 90 ? col2 : col1;
        }
        case 'bendSinister': {
            return Math.abs(1.25*x + y - 245) < 90 ? col2 : col1;
        }
        case 'chevron': {
            if (x < 100) { const s = x+y; return (s >= 140 && s <= 180) ? col2 : col1; }
            else          { const d = x-y; return (d >= 20  && d <= 60)  ? col2 : col1; }
        }
        case 'cross':    return ((x>=75&&x<=125)||(y>=95&&y<=145)) ? col2 : col1;
        case 'saltire':  return (Math.abs(y-1.2*x)<30 || Math.abs(y+1.2*x-240)<30) ? col2 : col1;
        case 'pall': {
            const inStem  = x>=80 && x<=120 && y>=90;
            const inLeft  = Math.abs(y - 0.9*x) < 28 && x<100 && y<90;
            const inRight = Math.abs(y + 0.9*x - 180) < 28 && x>100 && y<90;
            return (inStem||inLeft||inRight) ? col2 : col1;
        }
        case 'flaunches': {
            const inLeft  = ((x+10)**2/6400  + (y-120)**2/19600) <= 1;
            const inRight = ((x-210)**2/6400 + (y-120)**2/19600) <= 1;
            return (inLeft||inRight) ? col2 : col1;
        }
        case 'pile':    return (x >= y/2.4 && x <= (480-y)/2.4) ? col2 : col1;
        case 'bordure': {
            if (x<18||x>182||y<18) return col2;
            if (y>=130 && ((x-100)**2/6400+(y-180)**2/4000) > 1) return col2;
            return col1;
        }
        case 'barry':     return Math.floor(y/40) % 2 === 0 ? col1 : col2;
        case 'pally':     return Math.floor(x/40) % 2 === 0 ? col1 : col2;
        case 'bendy': {
            const dx = x-100, dy = y-120;
            const ru = (Math.SQRT2/2)*dx + (Math.SQRT2/2)*dy;
            return Math.floor((ru+1000)/28) % 2 === 0 ? col1 : col2;
        }
        case 'chevronny': {
            const v = ((y + Math.abs(x-100)) % 55 + 55) % 55;
            return v < 30 ? col2 : col1;
        }
        case 'chequy':  return (Math.floor(x/20)+Math.floor(y/20)) % 2 === 0 ? col1 : col2;
        case 'lozengy': {
            const u = ((x+y)%40+40)%40, v = ((x-y)%40+40)%40;
            return (Math.abs(u-20)+Math.abs(v-20) <= 20) ? col2 : col1;
        }
        case 'gyronny':   return gyronnyColour(x, y, 8,  col1, col2);
        case 'gyronny6':  return gyronnyColour(x, y, 6,  col1, col2);
        case 'gyronny12': return gyronnyColour(x, y, 12, col1, col2);
        default: return col1;
    }
}

// Find where a ray from (cx,cy) at angle hits the bounding rectangle 0..W x 0..H
function rayHitsBounds(cx, cy, angle) {
    const W = 200, H = 240;
    const dx = Math.cos(angle), dy = Math.sin(angle);
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
    if (p.y < eps)       return 0;
    if (p.x > 200 - eps) return 1;
    if (p.y > 240 - eps) return 2;
    return 3;
}
const gyronnyCorners = [{x:200,y:0},{x:200,y:240},{x:0,y:240},{x:0,y:0}];

function buildGyronny(n, col1, col2) {
    const cx = 100, cy = 120;
    const pts = Array.from({ length: n }, (_, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2; // start at top, clockwise
        return rayHitsBounds(cx, cy, angle);
    });
    let content = '';
    for (let i = 0; i < n; i++) {
        const p1 = pts[i], p2 = pts[(i + 1) % n];
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
        content += `<polygon points="${cx},${cy} ${border.join(' ')}" fill="${col}"/>`;
    }
    return { defs: '', content };
}

function gyronnyColour(x, y, n, col1, col2) {
    const cx = 100, cy = 120;
    let angle = Math.atan2(y - cy, x - cx) + Math.PI / 2; // 0 at top, clockwise
    angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const sector = Math.floor(angle / (2 * Math.PI / n));
    return sector % 2 === 0 ? col1 : col2;
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
                <polygon points="-144,-95 256,405 344,335 -56,-165" fill="${col2}"/>` };

        case 'bendSinister':
            return { defs: '', content: `
                ${field(col1)}
                <polygon points="-56,405 344,-95 256,-165 -144,335" fill="${col2}"/>` };

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

        case 'gyronny':   return buildGyronny(8,  col1, col2);
        case 'gyronny6':  return buildGyronny(6,  col1, col2);
        case 'gyronny12': return buildGyronny(12, col1, col2);

        default:
            return { defs: '', content: field(col1) };
    }
}

// Build one SVG recolouring filter per unique tincture used by the symbols.
// Each filter also adds a thin dark outline by dilating the charge mask before
// compositing the charge colour on top.
function deviceFilterDefs(tinctures) {
    return [...new Set(tinctures)].map(t => {
        const id = `dev-${t.replace('#','')}`;
        return `<filter id="${id}" color-interpolation-filters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
      <feColorMatrix type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 -5 -5 0 8"
          in="SourceGraphic" result="darkMask"/>
      <feComposite in="darkMask" in2="SourceGraphic" operator="in" result="mask"/>
      <feMorphology in="mask" operator="dilate" radius="0.5" result="dilated"/>
      <feFlood flood-color="#000000" flood-opacity="1" result="outlineFlood"/>
      <feComposite in="outlineFlood" in2="dilated" operator="in" result="outline"/>
      <feFlood flood-color="${t}" result="chargeFlood"/>
      <feComposite in="chargeFlood" in2="mask" operator="in" result="charge"/>
      <feMerge>
        <feMergeNode in="outline"/>
        <feMergeNode in="charge"/>
      </feMerge>
    </filter>`;
    }).join('\n');
}

// symbols: array of { cx, cy, size, tincture }
function generateShieldSVG(device, col1, col2, shape, symbols) {
    const shieldPath = "M 0,0 L 200,0 L 200,140 C 200,190 160,220 100,240 C 40,220 0,190 0,140 Z";
    const { defs, content } = generateDivision(shape, col1, col2);
    const filterDefs = deviceFilterDefs(symbols.map(s => s.tincture));

    const images = symbols.map(({ cx, cy, size, tincture }) => {
        const h = size / 2;
        return `<image href="${device}" x="${cx-h}" y="${cy-h}" width="${size}" height="${size}"
      clip-path="url(#shield-clip)" filter="url(#dev-${tincture.replace('#','')})"/>`;
    }).join('\n  ');

    return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" aria-label="Heraldic shield">
  <defs>
    <clipPath id="shield-clip">
      <path d="${shieldPath}"/>
    </clipPath>
    ${filterDefs}
    ${defs}
  </defs>
  <g clip-path="url(#shield-clip)">
    ${content}
  </g>
  ${images}
  <path d="${shieldPath}" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
</svg>`;
}

function generateCaption(device, col1, col2, shape, symbols) {
    const parts = [
        `<span class="swatch" style="background:${col1}"></span>${colourNames[col1]} &amp; <span class="swatch" style="background:${col2}"></span>${colourNames[col2]}`,
        shapeNames[shape] || shape,
    ];
    if (symbols.length > 0) parts.push(`${symbols.length}\u00d7 ${deviceDisplayName(device)}`);
    return `<p class="shield-caption">${parts.join(' &ndash; ')}</p>`;
}

function populateControls() {
    const shapeSelect = document.getElementById('ctrl-shape');
    Object.values(shapes).forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = shapeNames[v] || v;
        shapeSelect.appendChild(opt);
    });

    ['ctrl-col1', 'ctrl-col2'].forEach(id => {
        const sel = document.getElementById(id);
        Object.values(colours).forEach(hex => {
            const opt = document.createElement('option');
            opt.value = hex;
            opt.textContent = colourNames[hex];
            sel.appendChild(opt);
        });
    });

    const countSelect = document.getElementById('ctrl-count');
    for (let i = 0; i <= 6; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = i;
        countSelect.appendChild(opt);
    }

    const deviceSelect = document.getElementById('ctrl-device');
    deviceList.forEach(path => {
        const opt = document.createElement('option');
        opt.value = path;
        opt.textContent = deviceDisplayName(path);
        deviceSelect.appendChild(opt);
    });
}

function updateSwatches() {
    document.getElementById('swatch-col1').style.background = document.getElementById('ctrl-col1').value;
    document.getElementById('swatch-col2').style.background = document.getElementById('ctrl-col2').value;
}

function setControls(device, col1, col2, shape, count) {
    document.getElementById('ctrl-device').value = device;
    document.getElementById('ctrl-col1').value = col1;
    document.getElementById('ctrl-col2').value = col2;
    document.getElementById('ctrl-shape').value = shape;
    document.getElementById('ctrl-count').value = count;
    updateSwatches();
}

function renderFromControls() {
    const device = document.getElementById('ctrl-device').value;
    const col1 = document.getElementById('ctrl-col1').value;
    const col2 = document.getElementById('ctrl-col2').value;
    const shape = document.getElementById('ctrl-shape').value;
    const count = parseInt(document.getElementById('ctrl-count').value);
    const { positions, size } = getArrangement(count);
    const symbols = positions.map(({ cx, cy }) => ({
        cx, cy, size,
        tincture: contrastingTincture(getFieldColourAt(cx, cy, shape, col1, col2), col1, col2),
    }));
    heraldry.innerHTML = generateShieldSVG(device, col1, col2, shape, symbols)
                       + generateCaption(device, col1, col2, shape, symbols);
}

const updateHeraldry = () => {
    const device = randomDevice();
    const col1 = randomColour();
    const col2 = randomColour();
    const shape = shapes[Math.floor(Math.random() * Object.keys(shapes).length)];
    const count = Math.floor(Math.random() * 7);
    setControls(device, col1, col2, shape, count);
    renderFromControls();
};

populateControls();
updateHeraldry();
form.addEventListener('submit', (e) => { e.preventDefault(); updateHeraldry(); });
['ctrl-shape', 'ctrl-col1', 'ctrl-col2', 'ctrl-count', 'ctrl-device'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
        updateSwatches();
        renderFromControls();
    });
});
const ruleBoxes = ['rule-normal', 'rule-brettonia'].map(id => document.getElementById(id));
ruleBoxes.forEach(box => {
    box.addEventListener('change', () => {
        if (box.checked) ruleBoxes.forEach(other => { if (other !== box) other.checked = false; });
        renderFromControls();
    });
});
