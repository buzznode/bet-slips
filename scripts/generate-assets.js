// Generates production icon/splash/adaptive/favicon assets
// Run: node scripts/generate-assets.js

const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');
const FONT   = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const SYM    = 'Apple Symbols, Symbola, FreeSerif, serif';

// Navy + Gold palette
const C = {
  bg:      '#080d1a',
  surface: '#0e1628',
  border:  '#1e2d4a',
  gold:    '#B8860B',
  goldLt:  '#D4A017',
  text:    '#f1f5f9',
  dim:     '#64748b',
};

async function render(name, svg, w, h) {
  await sharp(Buffer.from(svg)).resize(w, h).png().toFile(path.join(ASSETS, name));
  console.log(`✓ assets/${name}  (${w}×${h})`);
}

// ── icon.png — 1024×1024 ──────────────────────────────────────────────────────
// Used by iOS App Store and as Expo's base icon.
// No rounded corners — the OS applies masking.
function notches(x, bg) {
  return [370, 415, 460, 505, 550]
    .map(y => `<circle cx="${x}" cy="${y}" r="30" fill="${bg}"/>`)
    .join('');
}

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${C.bg}"/>
  <!-- ticket -->
  <rect x="72" y="296" width="880" height="432" rx="32" fill="${C.surface}"/>
  <rect x="72" y="296" width="880" height="432" rx="32" fill="none" stroke="${C.gold}" stroke-width="3" opacity="0.6"/>
  ${notches(72,  C.bg)}
  ${notches(952, C.bg)}
  <line x1="444" y1="326" x2="444" y2="700" stroke="${C.border}" stroke-width="4" stroke-dasharray="16,10"/>
  <!-- horse -->
  <text x="260" y="696" font-family="${SYM}" font-size="336" fill="${C.gold}" text-anchor="middle" dominant-baseline="auto">♞</text>
  <!-- text -->
  <text x="704" y="464" font-family="${FONT}" font-size="76" font-weight="900" fill="${C.text}" text-anchor="middle">BET</text>
  <text x="704" y="556" font-family="${FONT}" font-size="76" font-weight="900" fill="${C.goldLt}" text-anchor="middle">SLIPS</text>
  <!-- subtitle -->
  <text x="512" y="864" font-family="${FONT}" font-size="32" font-weight="500" fill="${C.dim}" text-anchor="middle" letter-spacing="8">HORSE RACING</text>
</svg>`;

// ── adaptive-icon.png — 1024×1024 ────────────────────────────────────────────
// Android adaptive icon foreground. Android crops to circle/squircle, so
// keep the design within the inner ~72% safe zone (≈ 148px padding each side).
const adaptiveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${C.bg}"/>
  <!-- ticket — inset for safe zone -->
  <rect x="120" y="320" width="784" height="384" rx="28" fill="${C.surface}"/>
  <rect x="120" y="320" width="784" height="384" rx="28" fill="none" stroke="${C.gold}" stroke-width="3" opacity="0.6"/>
  ${[386, 424, 462, 500, 538].map(y => `<circle cx="120" cy="${y}" r="26" fill="${C.bg}"/>`).join('')}
  ${[386, 424, 462, 500, 538].map(y => `<circle cx="904" cy="${y}" r="26" fill="${C.bg}"/>`).join('')}
  <line x1="398" y1="346" x2="398" y2="678" stroke="${C.border}" stroke-width="3" stroke-dasharray="14,9"/>
  <text x="256" y="672" font-family="${SYM}" font-size="300" fill="${C.gold}" text-anchor="middle" dominant-baseline="auto">♞</text>
  <text x="660" y="476" font-family="${FONT}" font-size="68" font-weight="900" fill="${C.text}" text-anchor="middle">BET</text>
  <text x="660" y="554" font-family="${FONT}" font-size="68" font-weight="900" fill="${C.goldLt}" text-anchor="middle">SLIPS</text>
</svg>`;

// ── splash-icon.png — 200×200 centred mark (Expo puts it on the splash bg) ───
// Keep it simple — just the horse on transparent bg so Expo can composite it
// over the splash backgroundColor we set in app.json.
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <text x="100" y="185" font-family="${SYM}" font-size="195" fill="${C.gold}" text-anchor="middle" dominant-baseline="auto">♞</text>
</svg>`;

// ── favicon.png — 196×196 ─────────────────────────────────────────────────────
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="196" height="196" viewBox="0 0 196 196">
  <rect width="196" height="196" rx="44" fill="${C.bg}"/>
  <text x="98" y="182" font-family="${SYM}" font-size="178" fill="${C.gold}" text-anchor="middle" dominant-baseline="auto">♞</text>
</svg>`;

(async () => {
  await Promise.all([
    render('icon.png',          iconSvg,    1024, 1024),
    render('adaptive-icon.png', adaptiveSvg,1024, 1024),
    render('splash-icon.png',   splashSvg,   200,  200),
    render('favicon.png',       faviconSvg,  196,  196),
  ]);
  console.log('\nDone.');
})();
