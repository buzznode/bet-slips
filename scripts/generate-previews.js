// Generates 6 icon preview PNGs (512×512) into ./previews/
// Run: node scripts/generate-previews.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SIZE = 512;
const OUT = path.join(__dirname, '..', 'previews');
fs.mkdirSync(OUT, { recursive: true });

async function render(name, svg) {
  await sharp(Buffer.from(svg))
    .resize(SIZE, SIZE)
    .png()
    .toFile(path.join(OUT, name));
  console.log(`✓ ${name}`);
}

const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
// Chess knight renders as a clean horse-head silhouette in Apple Symbols / Symbola
const SYM_FONT = 'Apple Symbols, Symbola, FreeSerif, serif';

// Chess knight ♞ — clean recognized horse-head profile
function horseChar(fill, fontSize, x, y) {
  return `<text x="${x}" y="${y}" font-family="${SYM_FONT}"
    font-size="${fontSize}" fill="${fill}" text-anchor="middle"
    dominant-baseline="auto">♞</text>`;
}

// Horseshoe: arc + two vertical prongs
function horseshoe(fill, cx, cy, r, thick) {
  const ri = r - thick;
  return `
    <path d="
      M ${cx - r},${cy}
      A ${r},${r} 0 1,1 ${cx + r},${cy}
      L ${cx + r},${cy + r * 0.65}
      L ${cx + r - thick},${cy + r * 0.65}
      A ${ri},${ri} 0 1,0 ${cx - ri},${cy}
      L ${cx - r + thick},${cy}
      L ${cx - r + thick},${cy + r * 0.65}
      L ${cx - r},${cy + r * 0.65}
      Z
    " fill="${fill}"/>`;
}

// Perforated notches punched out of a ticket edge
function notches(x, bg) {
  return [185, 218, 253, 288, 322]
    .map(y => `<circle cx="${x}" cy="${y}" r="16" fill="${bg}"/>`)
    .join('');
}

// ── Design 1A: Ticket + ♞ Horse — Dark ───────────────────────────────────────
const d1a = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0f0f14"/>
  <rect x="36" y="148" width="440" height="216" rx="16" fill="#1a1a24"/>
  <rect x="36" y="148" width="440" height="216" rx="16" fill="none" stroke="#7c3aed" stroke-width="1.5" opacity="0.5"/>
  ${notches(36, '#0f0f14')}
  ${notches(476, '#0f0f14')}
  <line x1="222" y1="163" x2="222" y2="351" stroke="#2d2d3f" stroke-width="2" stroke-dasharray="8,5"/>
  ${horseChar('#7c3aed', 168, 130, 348)}
  <text x="352" y="232" font-family="${FONT}" font-size="38" font-weight="900" fill="#f1f5f9" text-anchor="middle">BET</text>
  <text x="352" y="278" font-family="${FONT}" font-size="38" font-weight="900" fill="#7c3aed" text-anchor="middle">SLIPS</text>
  <text x="256" y="432" font-family="${FONT}" font-size="16" font-weight="500" fill="#64748b" text-anchor="middle" letter-spacing="4">HORSE RACING</text>
</svg>`;

// ── Design 1B: Ticket + ♞ Horse — Bright ─────────────────────────────────────
const d1b = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#7c3aed"/>
  <rect x="36" y="148" width="440" height="216" rx="16" fill="#f1f5f9"/>
  ${notches(36, '#7c3aed')}
  ${notches(476, '#7c3aed')}
  <line x1="222" y1="163" x2="222" y2="351" stroke="#c4b5fd" stroke-width="2" stroke-dasharray="8,5"/>
  ${horseChar('#7c3aed', 168, 130, 348)}
  <text x="352" y="232" font-family="${FONT}" font-size="38" font-weight="900" fill="#1e0a3c" text-anchor="middle">BET</text>
  <text x="352" y="278" font-family="${FONT}" font-size="38" font-weight="900" fill="#7c3aed" text-anchor="middle">SLIPS</text>
  <text x="256" y="432" font-family="${FONT}" font-size="16" font-weight="500" fill="#ddd6fe" text-anchor="middle" letter-spacing="4">HORSE RACING</text>
</svg>`;

// ── Design 2A: ♞ Horse Head — Dark ───────────────────────────────────────────
const d2a = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0f0f14"/>
  <circle cx="256" cy="220" r="192" fill="#1a1a24"/>
  ${horseChar('#7c3aed', 290, 256, 370)}
  <rect x="72" y="380" width="368" height="6" rx="3" fill="#7c3aed" opacity="0.6"/>
  <text x="256" y="448" font-family="${FONT}" font-size="44" font-weight="900" fill="#f1f5f9" text-anchor="middle">Bet Slips</text>
</svg>`;

// ── Design 2B: Horseshoe — Bright ────────────────────────────────────────────
const d2b = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#7c3aed"/>
  <circle cx="256" cy="220" r="192" fill="#6d28d9" opacity="0.5"/>
  ${horseshoe('#ffffff', 256, 84, 148, 36)}
  <rect x="72" y="380" width="368" height="6" rx="3" fill="#ffffff" opacity="0.5"/>
  <text x="256" y="448" font-family="${FONT}" font-size="44" font-weight="900" fill="#ffffff" text-anchor="middle">Bet Slips</text>
</svg>`;

// ── Design 3A: Slip + Checkmark — Dark ───────────────────────────────────────
const d3a = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0f0f14"/>
  <rect x="82" y="48" width="348" height="378" rx="14" fill="#1a1a24"/>
  <rect x="82" y="48" width="348" height="72" rx="14" fill="#7c3aed"/>
  <rect x="82" y="90" width="348" height="30" fill="#7c3aed"/>
  <text x="256" y="96" font-family="${FONT}" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">BET SLIPS</text>
  <rect x="114" y="148" width="284" height="11" rx="5" fill="#2d2d3f"/>
  <rect x="114" y="174" width="236" height="11" rx="5" fill="#2d2d3f"/>
  <rect x="114" y="200" width="260" height="11" rx="5" fill="#2d2d3f"/>
  <rect x="114" y="226" width="205" height="11" rx="5" fill="#2d2d3f"/>
  <rect x="114" y="253" width="284" height="2" rx="1" fill="#2d2d3f"/>
  <circle cx="256" cy="342" r="82" fill="#7c3aed"/>
  <polyline points="212,342 248,380 308,298" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="256" y="472" font-family="${FONT}" font-size="22" font-weight="600" fill="#64748b" text-anchor="middle" letter-spacing="2">HORSE RACING</text>
</svg>`;

// ── Design 3B: Slip + Checkmark — Bright ─────────────────────────────────────
const d3b = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#7c3aed"/>
  <rect x="82" y="48" width="348" height="378" rx="14" fill="#ffffff"/>
  <rect x="82" y="48" width="348" height="72" rx="14" fill="#6d28d9"/>
  <rect x="82" y="90" width="348" height="30" fill="#6d28d9"/>
  <text x="256" y="96" font-family="${FONT}" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">BET SLIPS</text>
  <rect x="114" y="148" width="284" height="11" rx="5" fill="#e2e8f0"/>
  <rect x="114" y="174" width="236" height="11" rx="5" fill="#e2e8f0"/>
  <rect x="114" y="200" width="260" height="11" rx="5" fill="#e2e8f0"/>
  <rect x="114" y="226" width="205" height="11" rx="5" fill="#e2e8f0"/>
  <rect x="114" y="253" width="284" height="2" rx="1" fill="#e2e8f0"/>
  <circle cx="256" cy="342" r="82" fill="#7c3aed"/>
  <polyline points="212,342 248,380 308,298" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <text x="256" y="472" font-family="${FONT}" font-size="22" font-weight="600" fill="#ddd6fe" text-anchor="middle" letter-spacing="2">HORSE RACING</text>
</svg>`;

// ── Generate ──────────────────────────────────────────────────────────────────
(async () => {
  await Promise.all([
    render('1a-ticket-horse-dark.png',     d1a),
    render('1b-ticket-horse-bright.png',   d1b),
    render('2a-horse-head-dark.png',       d2a),
    render('2b-horseshoe-bright.png',      d2b),
    render('3a-slip-check-dark.png',       d3a),
    render('3b-slip-check-bright.png',     d3b),
  ]);
  console.log('\nAll 6 previews → ./previews/');
})();
