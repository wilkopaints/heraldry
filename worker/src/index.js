import { initWasm, Resvg } from '@resvg/resvg-wasm';
// resvgWasm is a pre-compiled WebAssembly.Module bundled by Cloudflare at deploy time.
// Runtime cost is ~1ms instantiation rather than ~12ms compilation — stays within free tier.
import resvgWasm from './resvg.wasm';
import {
  deviceList,
  geometricCharges,
  geometricDisplayNames,
  colourNames,
  shapeNames,
  DEVICE_DIMS,
} from './data.js';

const BASE_URL = 'https://wilkopaints.art/heraldry/';

// Singleton — initWasm throws if called twice, and instantiation is per-isolate anyway
let wasmInitPromise = null;

function ensureWasm() {
  if (!wasmInitPromise) {
    wasmInitPromise = initWasm(resvgWasm);
  }
  return wasmInitPromise;
}

// ── Data helpers ─────────────────────────────────────────────────────────────

function getAllDevices() {
  return [...geometricCharges, ...deviceList];
}

function isGeometric(device) {
  return geometricCharges.includes(device);
}

function deviceDisplayName(path) {
  if (isGeometric(path)) return geometricDisplayNames[path] ?? path;
  return path
    .replace('img/devices/', '')
    .replace(/^[^/]+\//, '')
    .replace('.png', '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ── State decoding ───────────────────────────────────────────────────────────

function decodeState(hash) {
  const parts = hash.split('-');
  if (parts.length < 6) return null;
  const [shape, col1, col2, deviceIdx, count, layout, ...rest] = parts;
  const devices = getAllDevices();
  const device = devices[parseInt(deviceIdx)] || devices[0];
  const chargeCols = rest.length > 0 ? rest.join('-').split('.') : [];
  return {
    shape,
    col1: '#' + col1,
    col2: '#' + col2,
    device,
    count: parseInt(count),
    layout: layout === 'd' ? 'division' : 'standard',
    chargeCols: chargeCols.map((c) => '#' + c),
  };
}

function stateToTitle(state) {
  if (!state) return 'Heraldry Generator';
  const c1 = colourNames[state.col1] ?? state.col1;
  const c2 = colourNames[state.col2] ?? state.col2;
  const shape = shapeNames[state.shape] ?? state.shape;
  const parts = [`${c1} & ${c2}`, shape];
  if (state.count > 0) {
    parts.push(`${state.count}× ${deviceDisplayName(state.device)}`);
  }
  return parts.join(' – ');
}

// ── Division SVG generation (from divisions.js) ───────────────────────────────

function gyronnyColour(x, y, n, col1, col2) {
  const cx = 100, cy = 120;
  let angle = Math.atan2(y - cy, x - cx) + Math.PI / 2;
  angle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const sector = Math.floor(angle / ((2 * Math.PI) / n));
  return sector % 2 === 0 ? col1 : col2;
}

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

function edgeOf(p) {
  const eps = 0.5;
  if (p.y < eps) return 0;
  if (p.x > 200 - eps) return 1;
  if (p.y > 240 - eps) return 2;
  return 3;
}

const gyronnyCorners = [
  { x: 200, y: 0 }, { x: 200, y: 240 },
  { x: 0, y: 240 }, { x: 0, y: 0 },
];

function buildGyronny(n, col1, col2) {
  const cx = 100, cy = 120;
  const pts = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return rayHitsBounds(cx, cy, angle);
  });
  let content = '';
  for (let i = 0; i < n; i++) {
    const p1 = pts[i], p2 = pts[(i + 1) % n];
    const col = i % 2 === 0 ? col1 : col2;
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

function generateDivision(shape, col1, col2) {
  const W = 200, H = 240;
  const field = (c) => `<rect x="0" y="0" width="${W}" height="${H}" fill="${c}"/>`;

  switch (shape) {
    case 'partyPerFess':
      return { defs: '', content: `<rect x="0" y="0" width="${W}" height="110" fill="${col1}"/><rect x="0" y="110" width="${W}" height="132" fill="${col2}"/>` };
    case 'partyPerPale':
      return { defs: '', content: `<rect x="0" y="0" width="${W/2}" height="${H}" fill="${col1}"/><rect x="${W/2}" y="0" width="${W/2}" height="${H}" fill="${col2}"/>` };
    case 'partyPerBendSinister':
      return { defs: '', content: `<polygon points="0,0 ${W},0 0,${H}" fill="${col1}"/><polygon points="${W},0 ${W},${H} 0,${H}" fill="${col2}"/>` };
    case 'quarterly':
      return { defs: '', content: `<rect x="0" y="0" width="${W/2}" height="110" fill="${col1}"/><rect x="${W/2}" y="0" width="${W/2}" height="110" fill="${col2}"/><rect x="0" y="110" width="${W/2}" height="132" fill="${col2}"/><rect x="${W/2}" y="110" width="${W/2}" height="132" fill="${col1}"/>` };
    case 'chief':
      return { defs: '', content: `${field(col1)}<rect x="0" y="0" width="${W}" height="60" fill="${col2}"/>` };
    case 'pale':
      return { defs: '', content: `${field(col1)}<rect x="70" y="0" width="60" height="${H}" fill="${col2}"/>` };
    case 'fess':
      return { defs: '', content: `${field(col1)}<rect x="0" y="73" width="${W}" height="70" fill="${col2}"/>` };
    case 'bend':
      return { defs: '', content: `${field(col1)}<polygon points="-100,-97 300,403 300,313 -100,-187" fill="${col2}"/>` };
    case 'bendSinister':
      return { defs: '', content: `${field(col1)}<polygon points="-100,403 300,-97 300,-187 -100,313" fill="${col2}"/>` };
    case 'chevron':
      return { defs: '', content: `${field(col1)}<polygon points="0,160 100,60 200,160 200,120 100,20 0,120" fill="${col2}"/>` };
    case 'cross':
      return { defs: '', content: `${field(col1)}<rect x="75" y="0" width="50" height="${H}" fill="${col2}"/><rect x="0" y="83" width="${W}" height="50" fill="${col2}"/>` };
    case 'saltire':
      return { defs: '', content: `${field(col1)}<polygon points="-50,-102 -50,-42 250,318 250,258" fill="${col2}"/><polygon points="-50,258 -50,318 250,-42 250,-102" fill="${col2}"/>` };
    case 'pall':
      return { defs: '', content: `${field(col1)}<polygon points="0,0 50,0 100,70 150,0 200,0 200,50 120,120 120,${H} 80,${H} 80,120 0,50" fill="${col2}"/>` };
    case 'flaunches':
      return { defs: '', content: `${field(col1)}<ellipse cx="-10" cy="${H/2}" rx="80" ry="${H/2+20}" fill="${col2}"/><ellipse cx="${W+10}" cy="${H/2}" rx="80" ry="${H/2+20}" fill="${col2}"/>` };
    case 'pile':
      return { defs: '', content: `${field(col1)}<polygon points="0,0 ${W},0 ${W/2},${H}" fill="${col2}"/>` };
    case 'bordure':
      return { defs: '', content: `${field(col2)}<path d="M 18,18 L 182,18 L 182,110 C 182,170 146,218 100,222 C 54,218 18,170 18,110 Z" fill="${col1}"/>` };
    case 'barry': {
      let content = '';
      for (let i = 0; i < 6; i++)
        content += `<rect x="0" y="${i*40}" width="${W}" height="40" fill="${i%2===0?col1:col2}"/>`;
      return { defs: '', content };
    }
    case 'pally': {
      let content = '';
      for (let i = 0; i < 5; i++)
        content += `<rect x="${i*40}" y="0" width="40" height="${H}" fill="${i%2===0?col1:col2}"/>`;
      return { defs: '', content };
    }
    case 'bendy': {
      const defs = `<pattern id="bendy-pat" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(45 100 120)"><rect x="0" y="0" width="28" height="56" fill="${col1}"/><rect x="28" y="0" width="28" height="56" fill="${col2}"/></pattern>`;
      return { defs, content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#bendy-pat)"/>` };
    }
    case 'chevronny': {
      let content = field(col1);
      for (let i = 0; i < 6; i++) {
        if (i % 2 === 0) {
          const y = i * 55 - 100;
          content += `<polygon points="0,${y+100} 100,${y} 200,${y+100} 200,${y+70} 100,${y-30} 0,${y+70}" fill="${col2}"/>`;
        }
      }
      return { defs: '', content };
    }
    case 'chequy': {
      const defs = `<pattern id="chequy-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="20" height="20" fill="${col1}"/><rect x="20" y="0" width="20" height="20" fill="${col2}"/><rect x="0" y="20" width="20" height="20" fill="${col2}"/><rect x="20" y="20" width="20" height="20" fill="${col1}"/></pattern>`;
      return { defs, content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#chequy-pat)"/>` };
    }
    case 'lozengy': {
      const defs = `<pattern id="lozengy-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><rect x="0" y="0" width="40" height="40" fill="${col1}"/><polygon points="20,0 40,20 20,40 0,20" fill="${col2}"/></pattern>`;
      return { defs, content: `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#lozengy-pat)"/>` };
    }
    case 'gyronny': return buildGyronny(8, col1, col2);
    case 'gyronny6': return buildGyronny(6, col1, col2);
    case 'gyronny12': return buildGyronny(12, col1, col2);
    case 'quarter':
      return { defs: '', content: `${field(col1)}<rect x="0" y="0" width="100" height="110" fill="${col2}"/>` };
    case 'canton':
      return { defs: '', content: `${field(col1)}<rect x="0" y="0" width="60" height="60" fill="${col2}"/>` };
    case 'orle': {
      const outer = 'M 25,25 L 175,25 L 175,110 C 175,165 145,205 100,215 C 55,205 25,165 25,110 Z';
      const inner = 'M 37,37 L 163,37 L 163,110 C 163,155 138,190 100,198 C 62,190 37,155 37,110 Z';
      return { defs: '', content: `${field(col1)}<path d="${outer} ${inner}" fill="${col2}" fill-rule="evenodd"/>` };
    }
    case 'tressure': {
      const outer = 'M 22,22 L 178,22 L 178,110 C 178,168 148,212 100,220 C 52,212 22,168 22,110 Z';
      const inner = 'M 30,30 L 170,30 L 170,110 C 170,162 142,202 100,210 C 58,202 30,162 30,110 Z';
      return { defs: '', content: `${field(col1)}<path d="${outer} ${inner}" fill="${col2}" fill-rule="evenodd"/>` };
    }
    case 'base':
      return { defs: '', content: `${field(col1)}<rect x="0" y="180" width="${W}" height="60" fill="${col2}"/>` };
    case 'fret': {
      const sw = 6;
      return { defs: '', content: `${field(col1)}<svg x="0" y="0" width="${W}" height="${H}" viewBox="0 0 600 600" preserveAspectRatio="none"><g transform="matrix(2.7951,0,0,2.7951,-11.42941,-15.093552)"><path d="M112,18.6l-92.8,92.7l92.8,92.8l92.8-92.8L112,18.6z M112,56l55.3,55.3L112,166.6l-55.3-55.3L112,56z" fill="${col2}" stroke="${col1}" stroke-width="${sw}" fill-rule="evenodd"/></g><path d="M543.4,2.2l-270,270.2L69,477c14.6,21.1,30.6,40.2,47.3,57.4l209.5-209.6L598.5,51.9c0-0.4,0-49.8,0-49.8L543.4,2.2z" fill="${col2}" stroke="${col1}" stroke-width="${sw}"/><path d="M1.5,2.2v46.4L145.8,193l52.3-52.3L59.7,2.2H1.5z" fill="${col2}" stroke="${col1}" stroke-width="${sw}"/><path d="M250.4,193.1l-52.3,52.3L352.6,400l52.3-52.3L250.4,193.1z" fill="${col2}" stroke="${col1}" stroke-width="${sw}"/><path d="M457.3,400l-52.4,52.4l80.3,80.3c16.6-17.3,32.6-36.5,47.1-57.7L457.3,400z" fill="${col2}" stroke="${col1}" stroke-width="${sw}"/></svg>` };
    }
    case 'label': {
      const barTop = 25, barH = 18, pendH = 35, pendW = 16;
      const pendants = [28, 60, 100, 140, 172];
      const pendantsSvg = pendants.map((px) => `<rect x="${px-pendW/2}" y="${barTop+barH}" width="${pendW}" height="${pendH}" fill="${col2}"/>`).join('');
      return { defs: '', content: `${field(col1)}<rect x="0" y="${barTop}" width="${W}" height="${barH}" fill="${col2}"/>${pendantsSvg}` };
    }
    default:
      return { defs: '', content: field(col1) };
  }
}

// ── Geometric charge generation (from charges.js) ─────────────────────────────

function deviceFilterDefs(tinctures) {
  return [...new Set(tinctures)].map((t) => {
    const id = `dev-${t.replace('#', '')}`;
    if (t === '#000000') {
      return `<filter id="${id}" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="-1" intercept="1"/><feFuncG type="linear" slope="-1" intercept="1"/><feFuncB type="linear" slope="-1" intercept="1"/></feComponentTransfer></filter>`;
    }
    return `<filter id="${id}" color-interpolation-filters="sRGB" x="-5%" y="-5%" width="110%" height="110%"><feFlood flood-color="${t}" result="colour"/><feBlend in="colour" in2="SourceGraphic" mode="multiply" result="blended"/><feComposite in="blended" in2="SourceGraphic" operator="in"/></filter>`;
  }).join('\n');
}

function generateGeometricCharge(type, cx, cy, size, tincture, index) {
  const t = tincture;
  const outline = '#1a1a1a';
  const sw = Math.max(1.5, size * 0.04);

  switch (type) {
    case 'roundel':
      return { defs: '', content: `<circle cx="${cx}" cy="${cy}" r="${size/2}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>` };
    case 'annulet': {
      const rw = size * 0.18, r = size/2 - rw/2;
      return { defs: '', content: `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${outline}" stroke-width="${rw+sw*2}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${t}" stroke-width="${rw}"/>` };
    }
    case 'lozenge': {
      const hw = size*0.375, hh = size*0.5;
      return { defs: '', content: `<polygon points="${cx},${cy-hh} ${cx+hw},${cy} ${cx},${cy+hh} ${cx-hw},${cy}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>` };
    }
    case 'fusil': {
      const hw = size*0.22, hh = size*0.5;
      return { defs: '', content: `<polygon points="${cx},${cy-hh} ${cx+hw},${cy} ${cx},${cy+hh} ${cx-hw},${cy}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>` };
    }
    case 'mascle': {
      const hw = size*0.375, hh = size*0.5;
      const ihw = hw*0.54, ihh = hh*0.54;
      const outer = `M ${cx},${cy-hh} L ${cx+hw},${cy} L ${cx},${cy+hh} L ${cx-hw},${cy} Z`;
      const inner = `M ${cx},${cy-ihh} L ${cx+ihw},${cy} L ${cx},${cy+ihh} L ${cx-ihw},${cy} Z`;
      return { defs: '', content: `<path fill-rule="evenodd" d="${outer} ${inner}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>` };
    }
    case 'rustre': {
      const hw = size*0.375, hh = size*0.5, ir = size*0.145;
      const outer = `M ${cx},${cy-hh} L ${cx+hw},${cy} L ${cx},${cy+hh} L ${cx-hw},${cy} Z`;
      const hole = `M ${cx+ir},${cy} A ${ir},${ir} 0 1,1 ${cx-ir},${cy} A ${ir},${ir} 0 1,1 ${cx+ir},${cy} Z`;
      return { defs: '', content: `<path fill-rule="evenodd" d="${outer} ${hole}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>` };
    }
    case 'billet': {
      const bw = size*0.5, bh = size*0.85;
      return { defs: '', content: `<rect x="${cx-bw/2}" y="${cy-bh/2}" width="${bw}" height="${bh}" fill="${t}" stroke="${outline}" stroke-width="${sw}"/>` };
    }
    case 'escutcheon': {
      const scale = size/240, tx = cx - 100*scale, ty = cy - 120*scale, isw = sw/scale;
      return { defs: '', content: `<g transform="translate(${tx},${ty}) scale(${scale})"><path d="M 0,0 L 200,0 L 200,110 C 200,180 160,230 100,240 C 40,230 0,180 0,110 Z" fill="${t}" stroke="${outline}" stroke-width="${isw}"/></g>` };
    }
    case 'fountain': {
      const r = size/2, n = 6, bh = (r*2)/n, amp = bh*0.38, pw = r*2;
      const pid = `fp${index}`;
      const azure = '#3953a4', argent = '#ffffff';
      const wavePath = `M 0,0 C ${pw/4},${-amp} ${pw*3/4},${amp} ${pw},0 L ${pw},${bh} C ${pw*3/4},${bh+amp} ${pw/4},${bh-amp} 0,${bh} Z`;
      const defs = `<pattern id="${pid}" x="0" y="${cy-r}" width="${pw}" height="${bh*2}" patternUnits="userSpaceOnUse"><rect width="${pw}" height="${bh*2}" fill="${argent}"/><path d="${wavePath}" fill="${azure}"/></pattern>`;
      return { defs, content: `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${pid})" stroke="${outline}" stroke-width="${sw}"/>` };
    }
    case 'cross-potent': {
      const d = 'M 15,-50 L 15,-40 L 6,-40 L 6,-6 L 40,-6 L 40,-15 L 50,-15 L 50,15 L 40,15 L 40,6 L 6,6 L 6,40 L 15,40 L 15,50 L -15,50 L -15,40 L -6,40 L -6,6 L -40,6 L -40,15 L -50,15 L -50,-15 L -40,-15 L -40,-6 L -6,-6 L -6,-40 L -15,-40 L -15,-50 Z';
      const scale = size/100;
      return { defs: '', content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/></g>` };
    }
    case 'cross-crosslet': {
      const d = 'M 6,-6 L 6,-32 L 16,-32 L 16,-38 L 6,-38 L 6,-50 L -6,-50 L -6,-38 L -16,-38 L -16,-32 L -6,-32 L -6,-6 L -32,-6 L -32,-16 L -38,-16 L -38,-6 L -50,-6 L -50,6 L -38,6 L -38,16 L -32,16 L -32,6 L -6,6 L -6,32 L -16,32 L -16,38 L -6,38 L -6,50 L 6,50 L 6,38 L 16,38 L 16,32 L 6,32 L 6,6 L 32,6 L 32,16 L 38,16 L 38,6 L 50,6 L 50,-6 L 38,-6 L 38,-16 L 32,-16 L 32,-6 Z';
      const scale = size/100;
      return { defs: '', content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/></g>` };
    }
    case 'cross-maltese': {
      const d = 'M -46.7,20 L -1.7,1.7 L -20,46.7 L 0,33.3 L 20,46.7 L 1.7,1.7 L 46.7,20 L 33.3,0 L 46.7,-20 L 1.7,-1.7 L 20,-46.7 L 0,-33.3 L -20,-46.7 L -1.7,-1.7 L -46.7,-20 L -33.3,0 Z';
      const scale = size/100;
      return { defs: '', content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/></g>` };
    }
    case 'cross-moline': {
      const d = 'M -5.5,30 A 5.5,5.5 0 0,1 -11,35.5 A 6.4,6.4 0 0,0 0,35.5 A 6.4,6.4 0 0,0 11,35.5 A 5.5,5.5 0 0,1 5.5,30 V 5.5 H 30 A 5.5,5.5 0 0,1 35.5,11 A 6.4,6.4 0 0,0 35.5,0 A 6.4,6.4 0 0,0 35.5,-11 A 5.5,5.5 0 0,1 30,-5.5 H 5.5 V -30 A 5.5,5.5 0 0,1 11,-35.5 A 6.4,6.4 0 0,0 0,-35.5 A 6.4,6.4 0 0,0 -11,-35.5 A 5.5,5.5 0 0,1 -5.5,-30 V -5.5 H -30 A 5.5,5.5 0 0,1 -35.5,-11 A 6.4,6.4 0 0,0 -35.5,0 A 6.4,6.4 0 0,0 -35.5,11 A 5.5,5.5 0 0,1 -30,5.5 H -5.5 Z';
      const scale = size/100;
      return { defs: '', content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/></g>` };
    }
    case 'cross-flory': {
      const d = 'M -5.5,30 A 3,3 0 0,1 -8.6,33 A 3,3 0 0,1 -11.6,30 A 5.5,5.5 0 0,0 -13.6,34.3 A 5.5,5.5 0 0,0 -8.1,39.8 A 5.5,5.5 0 0,0 -4.5,38.6 A 9.1,9.1 0 0,0 0,46.4 A 9.1,9.1 0 0,0 4.5,38.6 A 5.5,5.5 0 0,0 8.1,39.8 A 5.5,5.5 0 0,0 13.6,34.3 A 5.5,5.5 0 0,0 11.6,30 A 3,3 0 0,1 8.6,33 A 3,3 0 0,1 5.5,30 V 5.5 H 30 A 3,3 0 0,1 33,8.6 A 3,3 0 0,1 30,11.6 A 5.5,5.5 0 0,0 34.3,13.6 A 5.5,5.5 0 0,0 39.8,8.1 A 5.5,5.5 0 0,0 38.6,4.5 A 9.1,9.1 0 0,0 46.4,0 A 9.1,9.1 0 0,0 38.6,-4.5 A 5.5,5.5 0 0,0 39.8,-8.1 A 5.5,5.5 0 0,0 34.3,-13.6 A 5.5,5.5 0 0,0 30,-11.6 A 3,3 0 0,1 33,-8.6 A 3,3 0 0,1 30,-5.5 H 5.5 V -30 A 3,3 0 0,1 8.6,-33 A 3,3 0 0,1 11.6,-30 A 5.5,5.5 0 0,0 13.6,-34.3 A 5.5,5.5 0 0,0 8.1,-39.8 A 5.5,5.5 0 0,0 4.5,-38.6 A 9.1,9.1 0 0,0 0,-46.4 A 9.1,9.1 0 0,0 -4.5,-38.6 A 5.5,5.5 0 0,0 -8.1,-39.8 A 5.5,5.5 0 0,0 -13.6,-34.3 A 5.5,5.5 0 0,0 -11.6,-30 A 3,3 0 0,1 -8.6,-33 A 3,3 0 0,1 -5.5,-30 V -5.5 H -30 A 3,3 0 0,1 -33,-8.6 A 3,3 0 0,1 -30,-11.6 A 5.5,5.5 0 0,0 -34.3,-13.6 A 5.5,5.5 0 0,0 -39.8,-8.1 A 5.5,5.5 0 0,0 -38.6,-4.5 A 9.1,9.1 0 0,0 -46.4,0 A 9.1,9.1 0 0,0 -38.6,4.5 A 5.5,5.5 0 0,0 -39.8,8.1 A 5.5,5.5 0 0,0 -34.3,13.6 A 5.5,5.5 0 0,0 -30,11.6 A 3,3 0 0,1 -33,8.6 A 3,3 0 0,1 -30,5.5 H -5.5 Z';
      const scale = size/100;
      return { defs: '', content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/></g>` };
    }
    case 'cross-patonce': {
      const d1 = 'M -37.5,-15.2 A 75,75 0 0,0 37.5,-15.2 A 5.9,5.9 0 0,1 37.5,-5.1 A 10.1,10.1 0 0,1 46.3,0 A 10.1,10.1 0 0,1 37.5,5.1 A 5.9,5.9 0 0,1 37.5,15.2 A 75,75 0 0,0 -37.5,15.2 A 5.9,5.9 0 0,1 -37.5,5.1 A 10.1,10.1 0 0,1 -46.3,0 A 10.1,10.1 0 0,1 -37.5,-5.1 A 5.9,5.9 0 0,1 -37.5,-15.2 Z';
      const d2 = 'M 15.2,-37.5 A 75,75 0 0,0 15.2,37.5 A 5.9,5.9 0 0,1 5.1,37.5 A 10.1,10.1 0 0,1 0,46.3 A 10.1,10.1 0 0,1 -5.1,37.5 A 5.9,5.9 0 0,1 -15.2,37.5 A 75,75 0 0,0 -15.2,-37.5 A 5.9,5.9 0 0,1 -5.1,-37.5 A 10.1,10.1 0 0,1 0,-46.3 A 10.1,10.1 0 0,1 5.1,-37.5 A 5.9,5.9 0 0,1 15.2,-37.5 Z';
      const scale = size/100;
      return { defs: '', content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d1}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/><path d="${d2}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/></g>` };
    }
    case 'cross-botonny': {
      const d = 'M -26,-5 A 6.7,6.7 0 1,0 -38,-5.7 A 6.7,6.7 0 1,0 -38,5.7 A 6.7,6.7 0 1,0 -26,5 H -5 V 26 A 6.7,6.7 0 1,0 -5.7,38 A 6.7,6.7 0 1,0 5.7,38 A 6.7,6.7 0 1,0 5,26 V 5 H 26 A 6.7,6.7 0 1,0 38,5.7 A 6.7,6.7 0 1,0 38,-5.7 A 6.7,6.7 0 1,0 26,-5 H 5 V -26 A 6.7,6.7 0 1,0 5.7,-38 A 6.7,6.7 0 1,0 -5.7,-38 A 6.7,6.7 0 1,0 -5,-26 V -5 Z';
      const scale = size/100;
      return { defs: '', content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/></g>` };
    }
    case 'cross-pattee': {
      const d = 'M -50,-28.9 C -37.6,-14.1 -19.3,-5.6 0,-5.6 C 19.3,-5.6 37.6,-14.1 50,-28.9 V 28.9 C 37.6,14.1 19.3,5.6 0,5.6 C -19.3,5.6 -37.6,14.1 -50,28.9 Z M 28.9,-50 C 14.1,-37.6 5.6,-19.3 5.6,0 C 5.6,19.3 14.1,37.6 28.9,50 H -28.9 C -14.1,37.6 -5.6,19.3 -5.6,0 C -5.6,-19.3 -14.1,-37.6 -28.9,-50 Z';
      const scale = size/100;
      return { defs: '', content: `<g transform="translate(${cx},${cy}) scale(${scale})"><path d="${d}" fill="${t}" stroke="${outline}" stroke-width="${sw/scale}"/></g>` };
    }
    default:
      return { defs: '', content: '' };
  }
}

// ── Arrangement (from arrangements.js, only getArrangement needed) ─────────────

function getDivisionSpecificArrangement(count, shape) {
  switch (shape) {
    case 'barry':
      if (count===1) return {positions:[{cx:100,cy:100}],size:120};
      if (count===2) return {positions:[{cx:100,cy:60},{cx:100,cy:140}],size:60};
      if (count===3) return {positions:[{cx:40,cy:60},{cx:160,cy:60},{cx:100,cy:140}],size:40};
      if (count===4) return {positions:[{cx:40,cy:60},{cx:160,cy:60},{cx:40,cy:140},{cx:160,cy:140}],size:40};
      if (count===5) return {positions:[{cx:40,cy:20},{cx:160,cy:20},{cx:40,cy:100},{cx:160,cy:100},{cx:100,cy:180}],size:38};
      if (count===6) return {positions:[{cx:40,cy:60},{cx:100,cy:60},{cx:160,cy:60},{cx:40,cy:140},{cx:100,cy:140},{cx:160,cy:140}],size:40};
      break;
    case 'base':
      if (count===3) return {positions:[{cx:55,cy:60},{cx:100,cy:140},{cx:145,cy:60}],size:60};
      if (count===5) return {positions:[{cx:55,cy:45},{cx:55,cy:110},{cx:145,cy:45},{cx:145,cy:110},{cx:100,cy:155}],size:45};
      if (count===6) return {positions:[{cx:55,cy:30},{cx:55,cy:90},{cx:145,cy:30},{cx:145,cy:90},{cx:55,cy:150},{cx:145,cy:150}],size:45};
      break;
    case 'bend':
      if (count===2) return {positions:[{cx:50,cy:47},{cx:140,cy:157}],size:52};
      if (count===3) return {positions:[{cx:48,cy:43},{cx:100,cy:108},{cx:152,cy:173}],size:46};
      if (count===5) return {positions:[{cx:40,cy:32},{cx:69,cy:69},{cx:98,cy:106},{cx:127,cy:143},{cx:156,cy:180}],size:50};
      if (count===6) return {positions:[{cx:36,cy:28},{cx:60,cy:58},{cx:83,cy:89},{cx:107,cy:120},{cx:132,cy:151},{cx:156,cy:180}],size:40};
      break;
    case 'bendSinister':
      if (count===2) return {positions:[{cx:150,cy:47},{cx:60,cy:157}],size:52};
      if (count===3) return {positions:[{cx:156,cy:39},{cx:104,cy:104},{cx:52,cy:169}],size:46};
      if (count===5) return {positions:[{cx:46,cy:178},{cx:75,cy:141},{cx:104,cy:104},{cx:133,cy:67},{cx:162,cy:30}],size:50};
      if (count===6) return {positions:[{cx:46,cy:176},{cx:70,cy:147},{cx:93,cy:116},{cx:117,cy:85},{cx:142,cy:54},{cx:166,cy:24}],size:40};
      break;
    case 'canton':
      if (count===1) return {positions:[{cx:30,cy:30}],size:38};
      if (count===3) return {positions:[{cx:58,cy:85},{cx:142,cy:85},{cx:100,cy:167}],size:50};
      if (count===6) return {positions:[{cx:60,cy:60},{cx:140,cy:60},{cx:60,cy:110},{cx:140,cy:110},{cx:60,cy:160},{cx:140,cy:160}],size:46};
      break;
    case 'chequy':
      if (count===2) return {positions:[{cx:58,cy:100},{cx:142,cy:100}],size:68};
      if (count===3) return {positions:[{cx:58,cy:80},{cx:142,cy:80},{cx:100,cy:160}],size:60};
      if (count===4) return {positions:[{cx:58,cy:80},{cx:142,cy:80},{cx:58,cy:160},{cx:142,cy:160}],size:60};
      if (count===5) return {positions:[{cx:60,cy:60},{cx:140,cy:60},{cx:60,cy:120},{cx:140,cy:120},{cx:100,cy:180}],size:50};
      break;
    case 'chevron':
      if (count===1) return {positions:[{cx:100,cy:120}],size:60};
      if (count===2) return {positions:[{cx:35,cy:32},{cx:165,cy:32}],size:55};
      if (count===3) return {positions:[{cx:35,cy:32},{cx:165,cy:32},{cx:100,cy:160}],size:52};
      if (count===5) return {positions:[{cx:35,cy:32},{cx:165,cy:32},{cx:55,cy:170},{cx:145,cy:170},{cx:100,cy:110}],size:52};
      if (count===6) return {positions:[{cx:35,cy:32},{cx:165,cy:32},{cx:65,cy:185},{cx:135,cy:185},{cx:135,cy:130},{cx:65,cy:130}],size:40};
      break;
    case 'chevronny':
      if (count===1) return {positions:[{cx:100,cy:105}],size:130};
      if (count===2) return {positions:[{cx:60,cy:90},{cx:140,cy:90}],size:40};
      if (count===3) return {positions:[{cx:60,cy:90},{cx:140,cy:90},{cx:100,cy:160}],size:40};
      break;
    case 'chief':
      if (count===1) return {positions:[{cx:100,cy:32}],size:42};
      if (count===2) return {positions:[{cx:60,cy:32},{cx:140,cy:32}],size:38};
      if (count===3) return {positions:[{cx:40,cy:32},{cx:100,cy:32},{cx:160,cy:32}],size:34};
      if (count===6) return {positions:[{cx:60,cy:30},{cx:140,cy:30},{cx:60,cy:90},{cx:140,cy:90},{cx:60,cy:150},{cx:140,cy:150}],size:46};
      break;
    case 'cross':
      if (count===1) return {positions:[{cx:100,cy:107}],size:100};
      if (count===2) return {positions:[{cx:40,cy:108},{cx:160,cy:108}],size:38};
      if (count===3) return {positions:[{cx:40,cy:108},{cx:100,cy:45},{cx:160,cy:108}],size:38};
      if (count===4) return {positions:[{cx:100,cy:45},{cx:40,cy:108},{cx:160,cy:108},{cx:100,cy:175}],size:40};
      if (count===5) return {positions:[{cx:100,cy:108},{cx:100,cy:45},{cx:100,cy:175},{cx:40,cy:108},{cx:160,cy:108}],size:40};
      if (count===6) return {positions:[{cx:100,cy:133},{cx:100,cy:30},{cx:100,cy:83},{cx:100,cy:190},{cx:40,cy:108},{cx:160,cy:108}],size:40};
      break;
    case 'fess':
      if (count===2) return {positions:[{cx:65,cy:108},{cx:135,cy:108}],size:48};
      if (count===3) return {positions:[{cx:45,cy:108},{cx:100,cy:108},{cx:155,cy:108}],size:42};
      if (count===4) return {positions:[{cx:25,cy:108},{cx:75,cy:108},{cx:125,cy:108},{cx:175,cy:108}],size:42};
      if (count===5) return {positions:[{cx:65,cy:38},{cx:135,cy:38},{cx:45,cy:108},{cx:100,cy:108},{cx:155,cy:108}],size:42};
      if (count===6) return {positions:[{cx:45,cy:38},{cx:100,cy:38},{cx:155,cy:38},{cx:45,cy:108},{cx:100,cy:108},{cx:155,cy:108}],size:42};
      break;
    case 'flaunches':
      if (count===5) return {positions:[{cx:35,cy:108},{cx:165,cy:108},{cx:100,cy:38},{cx:100,cy:108},{cx:100,cy:178}],size:42};
      break;
    case 'fret':
      if (count===2) return {positions:[{cx:60,cy:119},{cx:140,cy:119}],size:70};
      break;
    case 'gyronny6':
      if (count===2) return {positions:[{cx:60,cy:50},{cx:140,cy:50}],size:70};
      if (count===4) return {positions:[{cx:60,cy:175},{cx:140,cy:175},{cx:60,cy:50},{cx:140,cy:50}],size:50};
      if (count===6) return {positions:[{cx:60,cy:50},{cx:140,cy:50},{cx:40,cy:118},{cx:160,cy:118},{cx:60,cy:180},{cx:140,cy:180}],size:50};
      break;
    case 'gyronny':
      if (count===1) return {positions:[{cx:100,cy:120}],size:130};
      if (count===2) return {positions:[{cx:50,cy:120},{cx:150,cy:120}],size:70};
      if (count===4) return {positions:[{cx:70,cy:185},{cx:130,cy:185},{cx:70,cy:40},{cx:130,cy:40}],size:50};
      if (count===6) return {positions:[{cx:70,cy:185},{cx:130,cy:185},{cx:70,cy:40},{cx:130,cy:40},{cx:50,cy:120},{cx:150,cy:120}],size:50};
      break;
    case 'gyronny12':
      if (count===1) return {positions:[{cx:100,cy:120}],size:130};
      if (count===2) return {positions:[{cx:50,cy:120},{cx:150,cy:120}],size:70};
      if (count===6) return {positions:[{cx:62,cy:185},{cx:137,cy:185},{cx:55,cy:40},{cx:145,cy:40},{cx:50,cy:120},{cx:150,cy:120}],size:50};
      break;
    case 'label':
      if (count===1) return {positions:[{cx:100,cy:155}],size:85};
      if (count===3) return {positions:[{cx:45,cy:150},{cx:100,cy:150},{cx:155,cy:150}],size:45};
      if (count===4) return {positions:[{cx:60,cy:185},{cx:140,cy:185},{cx:60,cy:120},{cx:140,cy:120}],size:50};
      if (count===5) return {positions:[{cx:75,cy:185},{cx:125,cy:185},{cx:50,cy:120},{cx:150,cy:120},{cx:100,cy:120}],size:40};
      if (count===6) return {positions:[{cx:50,cy:185},{cx:150,cy:185},{cx:100,cy:185},{cx:50,cy:120},{cx:150,cy:120},{cx:100,cy:120}],size:40};
      break;
    case 'lozengy':
      if (count===1) return {positions:[{cx:100,cy:100}],size:130};
      if (count===2) return {positions:[{cx:60,cy:100},{cx:140,cy:100}],size:70};
      if (count===3) return {positions:[{cx:60,cy:100},{cx:140,cy:100},{cx:100,cy:160}],size:70};
      if (count===4) return {positions:[{cx:60,cy:80},{cx:140,cy:80},{cx:60,cy:160},{cx:140,cy:160}],size:60};
      if (count===5) return {positions:[{cx:60,cy:40},{cx:140,cy:40},{cx:60,cy:120},{cx:140,cy:120},{cx:100,cy:200}],size:60};
      if (count===6) return {positions:[{cx:60,cy:40},{cx:140,cy:40},{cx:60,cy:120},{cx:140,cy:120},{cx:60,cy:200},{cx:140,cy:200}],size:40};
      break;
    case 'orle':
      if (count===1) return {positions:[{cx:100,cy:110}],size:120};
      if (count===2) return {positions:[{cx:100,cy:80},{cx:100,cy:150}],size:60};
      if (count===3) return {positions:[{cx:70,cy:80},{cx:130,cy:80},{cx:100,cy:150}],size:55};
      if (count===4) return {positions:[{cx:70,cy:80},{cx:130,cy:80},{cx:70,cy:140},{cx:130,cy:140}],size:50};
      if (count===5) return {positions:[{cx:70,cy:70},{cx:130,cy:70},{cx:70,cy:125},{cx:130,cy:125},{cx:100,cy:170}],size:50};
      if (count===6) return {positions:[{cx:70,cy:60},{cx:130,cy:60},{cx:70,cy:105},{cx:130,cy:105},{cx:70,cy:150},{cx:130,cy:150}],size:40};
      break;
    case 'pale':
      if (count===2) return {positions:[{cx:100,cy:72},{cx:100,cy:158}],size:48};
      if (count===3) return {positions:[{cx:100,cy:50},{cx:100,cy:115},{cx:100,cy:180}],size:44};
      break;
    case 'pall':
      if (count===2) return {positions:[{cx:40,cy:140},{cx:160,cy:140}],size:60};
      if (count===3) return {positions:[{cx:40,cy:40},{cx:160,cy:40},{cx:100,cy:190}],size:38};
      if (count===4) return {positions:[{cx:40,cy:40},{cx:160,cy:40},{cx:100,cy:100},{cx:100,cy:190}],size:38};
      if (count===5) return {positions:[{cx:40,cy:40},{cx:160,cy:40},{cx:100,cy:100},{cx:100,cy:150},{cx:100,cy:200}],size:38};
      if (count===6) return {positions:[{cx:40,cy:40},{cx:160,cy:40},{cx:75,cy:80},{cx:125,cy:80},{cx:100,cy:140},{cx:100,cy:200}],size:38};
      break;
    case 'partyPerBendSinister':
      if (count===1) return {positions:[{cx:100,cy:120}],size:130};
      if (count===2) return {positions:[{cx:100,cy:50},{cx:100,cy:180}],size:70};
      if (count===3) return {positions:[{cx:50,cy:110},{cx:100,cy:50},{cx:140,cy:140}],size:55};
      if (count===4) return {positions:[{cx:50,cy:110},{cx:100,cy:50},{cx:160,cy:110},{cx:110,cy:170}],size:55};
      if (count===5) return {positions:[{cx:40,cy:120},{cx:110,cy:40},{cx:75,cy:80},{cx:160,cy:120},{cx:120,cy:160}],size:55};
      if (count===6) return {positions:[{cx:45,cy:120},{cx:115,cy:40},{cx:80,cy:80},{cx:135,cy:140},{cx:170,cy:100},{cx:95,cy:180}],size:55};
      break;
    case 'partyPerFess':
      if (count===2) return {positions:[{cx:100,cy:55},{cx:100,cy:172}],size:70};
      if (count===3) return {positions:[{cx:60,cy:55},{cx:140,cy:55},{cx:100,cy:172}],size:60};
      if (count===4) return {positions:[{cx:55,cy:55},{cx:145,cy:55},{cx:55,cy:170},{cx:145,cy:170}],size:58};
      if (count===5) return {positions:[{cx:40,cy:55},{cx:100,cy:55},{cx:160,cy:55},{cx:70,cy:170},{cx:130,cy:170}],size:50};
      if (count===6) return {positions:[{cx:40,cy:55},{cx:100,cy:55},{cx:160,cy:55},{cx:50,cy:170},{cx:100,cy:170},{cx:150,cy:170}],size:44};
      break;
    case 'pile':
      if (count===2) return {positions:[{cx:100,cy:65},{cx:100,cy:155}],size:70};
      if (count===3) return {positions:[{cx:60,cy:55},{cx:140,cy:55},{cx:100,cy:155}],size:60};
      if (count===4) return {positions:[{cx:55,cy:55},{cx:145,cy:55},{cx:40,cy:160},{cx:160,cy:160}],size:50};
      if (count===5) return {positions:[{cx:60,cy:50},{cx:140,cy:50},{cx:100,cy:140},{cx:40,cy:160},{cx:160,cy:160}],size:50};
      if (count===6) return {positions:[{cx:50,cy:55},{cx:100,cy:110},{cx:150,cy:55},{cx:40,cy:170},{cx:100,cy:170},{cx:160,cy:170}],size:44};
      break;
    case 'partyPerPale':
      if (count===2) return {positions:[{cx:50,cy:108},{cx:150,cy:108}],size:68};
      if (count===3) return {positions:[{cx:50,cy:108},{cx:150,cy:70},{cx:150,cy:158}],size:58};
      if (count===4) return {positions:[{cx:50,cy:70},{cx:150,cy:70},{cx:50,cy:160},{cx:150,cy:160}],size:56};
      if (count===6) return {positions:[{cx:50,cy:55},{cx:150,cy:55},{cx:50,cy:115},{cx:150,cy:115},{cx:50,cy:175},{cx:150,cy:175}],size:46};
      break;
    case 'quarter':
      if (count===1) return {positions:[{cx:50,cy:55}],size:65};
      if (count===2) return {positions:[{cx:50,cy:32},{cx:50,cy:78}],size:38};
      if (count===3) return {positions:[{cx:30,cy:35},{cx:70,cy:35},{cx:50,cy:80}],size:30};
      if (count===4) return {positions:[{cx:30,cy:35},{cx:70,cy:35},{cx:30,cy:80},{cx:70,cy:80}],size:30};
      if (count===5) return {positions:[{cx:30,cy:30},{cx:70,cy:30},{cx:30,cy:80},{cx:70,cy:80},{cx:50,cy:55}],size:30};
      if (count===6) return {positions:[{cx:20,cy:30},{cx:60,cy:30},{cx:20,cy:80},{cx:60,cy:80},{cx:40,cy:55},{cx:80,cy:55}],size:30};
      break;
    case 'quarterly':
      if (count===2) return {positions:[{cx:50,cy:55},{cx:145,cy:160}],size:68};
      if (count===3) return {positions:[{cx:50,cy:55},{cx:150,cy:55},{cx:100,cy:170}],size:62};
      if (count===4) return {positions:[{cx:50,cy:55},{cx:150,cy:55},{cx:50,cy:160},{cx:150,cy:160}],size:56};
      if (count===5) return {positions:[{cx:50,cy:55},{cx:150,cy:55},{cx:50,cy:160},{cx:150,cy:160},{cx:100,cy:110}],size:56};
      if (count===6) return {positions:[{cx:50,cy:75},{cx:150,cy:75},{cx:50,cy:30},{cx:150,cy:30},{cx:50,cy:160},{cx:150,cy:160}],size:40};
      break;
    case 'saltire':
      if (count===2) return {positions:[{cx:166,cy:110},{cx:34,cy:110}],size:48};
      if (count===3) return {positions:[{cx:38,cy:110},{cx:162,cy:110},{cx:100,cy:175}],size:48};
      if (count===4) return {positions:[{cx:100,cy:40},{cx:38,cy:110},{cx:162,cy:110},{cx:100,cy:175}],size:48};
      if (count===5) return {positions:[{cx:100,cy:108},{cx:54,cy:52},{cx:146,cy:52},{cx:52,cy:165},{cx:148,cy:165}],size:34};
      if (count===6) return {positions:[{cx:124,cy:135},{cx:76,cy:135},{cx:54,cy:52},{cx:146,cy:52},{cx:44,cy:175},{cx:156,cy:175}],size:34};
      break;
    case 'tressure':
      if (count===2) return {positions:[{cx:100,cy:80},{cx:100,cy:160}],size:60};
      if (count===3) return {positions:[{cx:70,cy:80},{cx:130,cy:80},{cx:100,cy:160}],size:50};
      if (count===4) return {positions:[{cx:100,cy:60},{cx:58,cy:110},{cx:142,cy:110},{cx:100,cy:160}],size:48};
      if (count===5) return {positions:[{cx:100,cy:170},{cx:60,cy:70},{cx:140,cy:70},{cx:60,cy:130},{cx:140,cy:130}],size:48};
      if (count===6) return {positions:[{cx:70,cy:105},{cx:130,cy:105},{cx:70,cy:55},{cx:130,cy:55},{cx:70,cy:155},{cx:130,cy:155}],size:40};
      break;
    default:
      break;
  }
  return null;
}

function getArrangement(count, shape, useSpecific = true) {
  const arr = {
    0: {positions:[],size:0},
    1: {positions:[{cx:100,cy:110}],size:130},
    2: {positions:[{cx:58,cy:105},{cx:142,cy:105}],size:68},
    3: {positions:[{cx:58,cy:75},{cx:142,cy:75},{cx:100,cy:162}],size:60},
    4: {positions:[{cx:60,cy:62},{cx:140,cy:62},{cx:60,cy:150},{cx:140,cy:150}],size:56},
    5: {positions:[{cx:60,cy:58},{cx:140,cy:58},{cx:60,cy:122},{cx:140,cy:122},{cx:100,cy:188}],size:52},
    6: {positions:[{cx:60,cy:50},{cx:140,cy:50},{cx:60,cy:110},{cx:140,cy:110},{cx:60,cy:170},{cx:140,cy:170}],size:46},
  };
  if (useSpecific) {
    const specific = getDivisionSpecificArrangement(count, shape);
    if (specific) return specific;
  }
  return arr[count] ?? arr[0];
}

// ── Shield SVG generation ──────────────────────────────────────────────────────

async function generateShieldSVG(state) {
  const { device, col1, col2, shape, count, layout, chargeCols } = state;
  const useSpecific = layout !== 'standard';
  const { positions, size } = getArrangement(count, shape, useSpecific);

  const symbols = positions.map(({ cx, cy }, i) => ({
    cx, cy, size,
    tincture: chargeCols[i] ?? col1,
  }));

  const shieldPath = 'M 0,0 L 200,0 L 200,110 C 200,180 160,230 100,240 C 40,230 0,180 0,110 Z';
  const { defs, content } = generateDivision(shape, col1, col2);

  let extraDefs = '', charges = '';

  if (isGeometric(device)) {
    symbols.forEach(({ cx, cy, size: sz, tincture }, i) => {
      const { defs: gd, content: gc } = generateGeometricCharge(device, cx, cy, sz, tincture, i);
      extraDefs += gd;
      charges += gc + '\n';
    });
    charges = `<g clip-path="url(#shield-clip)">${charges}</g>`;
  } else {
    extraDefs = deviceFilterDefs(symbols.map((s) => s.tincture));

    const dd = DEVICE_DIMS[device];
    const imageCharges = [];

    // Fetch device image once and embed as base64
    let dataHref = null;
    try {
      const imgUrl = new URL(device, BASE_URL).toString();
      const resp = await fetch(imgUrl);
      if (resp.ok) {
        const buf = await resp.arrayBuffer();
        const bytes = new Uint8Array(buf);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        dataHref = 'data:image/png;base64,' + btoa(binary);
      }
    } catch (_) {}

    for (const { cx, cy, size: sz, tincture } of symbols) {
      let iw = sz, ih = sz;
      if (dd) {
        const aspect = dd[0] / dd[1];
        if (aspect > 1) ih = sz / aspect;
        else if (aspect < 1) iw = sz * aspect;
      }
      const href = dataHref ?? device;
      imageCharges.push(
        `<image href="${href}" x="${cx-iw/2}" y="${cy-ih/2}" width="${iw}" height="${ih}" clip-path="url(#shield-clip)" filter="url(#dev-${tincture.replace('#','')})"/>`
      );
    }
    charges = imageCharges.join('\n  ');
  }

  return `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="shield-clip"><path d="${shieldPath}"/></clipPath>
    ${extraDefs}
    ${defs}
  </defs>
  <g clip-path="url(#shield-clip)">${content}</g>
  ${charges}
  <path d="${shieldPath}" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="round"/>
</svg>`;
}

// ── OG image: 1200×630 PNG with shield centred on dark background ─────────────

async function buildOgPng(state) {
  const shieldSvg = await generateShieldSVG(state);

  // Shield is 200×240 (5:6). Scale to fit 462×554 keeping ratio.
  const shieldH = 530, shieldW = Math.round(shieldH * 200 / 240);
  const ox = Math.round((1200 - shieldW) / 2);
  const oy = Math.round((630 - shieldH) / 2);

  // Inline the shield SVG as a nested <svg>
  const innerSvg = shieldSvg.replace(
    '<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">',
    `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" x="${ox}" y="${oy}" width="${shieldW}" height="${shieldH}">`
  );

  const ogSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#1c1008"/>
  <rect x="8" y="8" width="1184" height="614" fill="none" stroke="#d4af34" stroke-width="2" opacity="0.6"/>
  ${innerSvg}
</svg>`;

  await ensureWasm();
  const resvg = new Resvg(ogSvg, {
    fitTo: { mode: 'width', value: 1200 },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

// ── Request handlers ───────────────────────────────────────────────────────────

// Known social-preview bot User-Agents.
// Bots get a minimal HTML page with og: tags — no origin fetch, no HTMLRewriter.
// Real browsers pass straight through; the JS app reads ?state= from location.search.
const BOT_UA_RE =
  /discordbot|twitterbot|bluesky|bsky\.app|linkedinbot|slackbot|facebookexternalhit|whatsapp|telegram|iframely|embedly/i;

function handleMainPage(request, url) {
  const stateHash = url.searchParams.get('state');
  if (!stateHash) return fetch(request);

  const ua = request.headers.get('user-agent') ?? '';
  if (!BOT_UA_RE.test(ua)) return fetch(request);

  const state = decodeState(stateHash);
  const title = stateToTitle(state);
  const imageUrl = `${BASE_URL}og-image?state=${stateHash}`;
  const appUrl = url.toString();

  const html =
    `<!DOCTYPE html><html lang="en"><head>` +
    `<meta charset="UTF-8"/>` +
    `<title>${escHtml(title)} – Heraldry Generator</title>` +
    `<meta property="og:type" content="website"/>` +
    `<meta property="og:title" content="${escHtml(title)}"/>` +
    `<meta property="og:description" content="A heraldic shield generated with the Wilko Paints Heraldry Generator"/>` +
    `<meta property="og:image" content="${escHtml(imageUrl)}"/>` +
    `<meta property="og:image:width" content="1200"/>` +
    `<meta property="og:image:height" content="630"/>` +
    `<meta property="og:url" content="${escHtml(appUrl)}"/>` +
    `<meta name="twitter:card" content="summary_large_image"/>` +
    `<meta name="twitter:image" content="${escHtml(imageUrl)}"/>` +
    `</head><body><p><a href="${escHtml(appUrl)}">View this heraldic shield</a></p></body></html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}

async function handleOgImage(url) {
  const stateHash = url.searchParams.get('state') ?? '';
  const state = decodeState(stateHash);
  if (!state) return new Response('Invalid state', { status: 400 });

  try {
    const png = await buildOgPng(state);
    return new Response(png, {
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, max-age=604800, immutable',
      },
    });
  } catch (resvgErr) {
    // resvg commonly fails on free-tier (10ms CPU limit). Fall back to a
    // minimal pure-JS PNG that at least shows the shield's two tinctures.
    console.error('resvg failed, using colour fallback:', resvgErr?.message);
    try {
      const png = await tincturePng(state.col1, state.col2);
      return new Response(png, {
        headers: {
          'content-type': 'image/png',
          'cache-control': 'public, max-age=3600',
        },
      });
    } catch (fbErr) {
      console.error('colour fallback failed:', fbErr?.message);
      return new Response('Image generation failed', { status: 500 });
    }
  }
}

// ── Pure-JS fallback PNG (no WASM) ────────────────────────────────────────────
// Generates a 600×315 image split vertically into the two heraldic tinctures.

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

async function tincturePng(col1, col2) {
  const W = 600, H = 315;
  const [r1, g1, b1] = hexToRgb(col1);
  const [r2, g2, b2] = hexToRgb(col2);

  // Raw scanlines: 1 filter byte + W*3 RGB bytes per row
  const rowLen = 1 + W * 3;
  const raw = new Uint8Array(H * rowLen);
  for (let y = 0; y < H; y++) {
    raw[y * rowLen] = 0; // filter type None
    for (let x = 0; x < W; x++) {
      const left = x < W / 2;
      const o = y * rowLen + 1 + x * 3;
      raw[o] = left ? r1 : r2;
      raw[o + 1] = left ? g1 : g2;
      raw[o + 2] = left ? b1 : b2;
    }
  }

  // Compress with zlib (CompressionStream('deflate') = RFC 1950 zlib format)
  const cs = new CompressionStream('deflate');
  const w = cs.writable.getWriter();
  await w.write(raw);
  await w.close();
  const idat = new Uint8Array(await new Response(cs.readable).arrayBuffer());

  return buildPng(W, H, idat);
}

function buildPng(w, h, idatData) {
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = new Uint8Array(13);
  const dv = new DataView(ihdrData.buffer);
  dv.setUint32(0, w); dv.setUint32(4, h);
  ihdrData[8] = 8; ihdrData[9] = 2; // 8-bit depth, RGB colour

  const ihdr = pngChunk('IHDR', ihdrData);
  const idat = pngChunk('IDAT', idatData);
  const iend = pngChunk('IEND', new Uint8Array(0));

  const out = new Uint8Array(sig.length + ihdr.length + idat.length + iend.length);
  let pos = 0;
  for (const arr of [sig, ihdr, idat, iend]) { out.set(arr, pos); pos += arr.length; }
  return out;
}

function pngChunk(type, data) {
  const chunk = new Uint8Array(4 + 4 + data.length + 4);
  const dv = new DataView(chunk.buffer);
  dv.setUint32(0, data.length);
  chunk.set(new TextEncoder().encode(type), 4);
  if (data.length) chunk.set(data, 8);
  dv.setUint32(8 + data.length, crc32(chunk.subarray(4, 8 + data.length)));
  return chunk;
}

function crc32(buf) {
  const T = crc32._t ?? (crc32._t = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c;
    }
    return t;
  })());
  let c = 0xffffffff;
  for (const b of buf) c = T[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Worker entry point ────────────────────────────────────────────────────────

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // PNG image generation — always passes through worker
    if (url.pathname === '/heraldry/og-image') {
      return handleOgImage(url);
    }

    // Main page — pass through unless ?state= is present
    if (url.pathname === '/heraldry/' || url.pathname === '/heraldry') {
      return handleMainPage(request, url);
    }

    return fetch(request);
  },
};
