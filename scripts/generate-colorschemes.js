// Generates icon + app screen mockup for 3 color schemes
// Run: node scripts/generate-colorschemes.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'previews');
fs.mkdirSync(OUT, { recursive: true });

async function renderIcon(name, svg) {
  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(OUT, name));
  console.log(`✓ ${name}`);
}
async function renderScreen(name, svg) {
  await sharp(Buffer.from(svg)).resize(390, 844).png().toFile(path.join(OUT, name));
  console.log(`✓ ${name}`);
}

const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const SYM  = 'Apple Symbols, Symbola, FreeSerif, serif';

function notches(x, bg) {
  return [185, 218, 253, 288, 322]
    .map(y => `<circle cx="${x}" cy="${y}" r="16" fill="${bg}"/>`)
    .join('');
}

// ── Color Schemes ──────────────────────────────────────────────────────────────

const schemes = {
  purple: {
    label:       'Current — Dark Purple',
    bg:          '#0f0f14',
    surface:     '#1a1a24',
    surfaceHigh: '#23232f',
    border:      '#2d2d3f',
    primary:     '#7c3aed',
    primaryDim:  '#3b1e7a',
    primaryLight:'#9461f5',
    accent:      '#f59e0b',
    text:        '#f1f5f9',
    textMuted:   '#94a3b8',
    textDim:     '#64748b',
    success:     '#22c55e',
    successDim:  '#14532d',
    danger:      '#ef4444',
    ticketBg:    '#1a1a24',
    ticketBorder:'#7c3aed',
    iconHorse:   '#7c3aed',
    iconText1:   '#f1f5f9',
    iconText2:   '#7c3aed',
    iconSub:     '#64748b',
    headerBg:    '#1a1a24',
    btnBg:       '#23232f',
    btnSelected: '#3b1e7a',
    btnBorder:   '#2d2d3f',
    btnSelBorder:'#7c3aed',
    pillActive:  '#3b1e7a',
    pillBorder:  '#7c3aed',
  },
  navy: {
    label:       'Navy + Gold',
    bg:          '#080d1a',
    surface:     '#0e1628',
    surfaceHigh: '#162035',
    border:      '#1e2d4a',
    primary:     '#d97706',
    primaryDim:  '#78350f',
    primaryLight:'#f59e0b',
    accent:      '#f59e0b',
    text:        '#f1f5f9',
    textMuted:   '#94a3b8',
    textDim:     '#64748b',
    success:     '#22c55e',
    successDim:  '#14532d',
    danger:      '#ef4444',
    ticketBg:    '#0e1628',
    ticketBorder:'#d97706',
    iconHorse:   '#d97706',
    iconText1:   '#f1f5f9',
    iconText2:   '#d97706',
    iconSub:     '#64748b',
    headerBg:    '#0e1628',
    btnBg:       '#162035',
    btnSelected: '#78350f',
    btnBorder:   '#1e2d4a',
    btnSelBorder:'#d97706',
    pillActive:  '#78350f',
    pillBorder:  '#d97706',
  },
  green: {
    label:       'Racing Green + Emerald',
    bg:          '#060f0c',
    surface:     '#0c1f18',
    surfaceHigh: '#122a21',
    border:      '#1a3d2e',
    primary:     '#059669',
    primaryDim:  '#064e3b',
    primaryLight:'#10b981',
    accent:      '#34d399',
    text:        '#f1f5f9',
    textMuted:   '#94a3b8',
    textDim:     '#64748b',
    success:     '#22c55e',
    successDim:  '#14532d',
    danger:      '#ef4444',
    ticketBg:    '#0c1f18',
    ticketBorder:'#059669',
    iconHorse:   '#059669',
    iconText1:   '#f1f5f9',
    iconText2:   '#059669',
    iconSub:     '#64748b',
    headerBg:    '#0c1f18',
    btnBg:       '#122a21',
    btnSelected: '#064e3b',
    btnBorder:   '#1a3d2e',
    btnSelBorder:'#059669',
    pillActive:  '#064e3b',
    pillBorder:  '#059669',
  },
  indigo: {
    label:       'Indigo + Amber',
    bg:          '#0f0f14',
    surface:     '#1a1a24',
    surfaceHigh: '#23232f',
    border:      '#2d2d3f',
    primary:     '#4338ca',
    primaryDim:  '#1e1b6e',
    primaryLight:'#6366f1',
    accent:      '#f59e0b',
    text:        '#f1f5f9',
    textMuted:   '#94a3b8',
    textDim:     '#64748b',
    success:     '#22c55e',
    successDim:  '#14532d',
    danger:      '#ef4444',
    ticketBg:    '#1a1a24',
    ticketBorder:'#4338ca',
    iconHorse:   '#4338ca',
    iconText1:   '#f1f5f9',
    iconText2:   '#f59e0b',   // amber for "SLIPS" — differentiates from purple
    iconSub:     '#64748b',
    headerBg:    '#1a1a24',
    btnBg:       '#23232f',
    btnSelected: '#1e1b6e',
    btnBorder:   '#2d2d3f',
    btnSelBorder:'#4338ca',
    pillActive:  '#1e1b6e',
    pillBorder:  '#4338ca',
  },
};

// ── Icon 1A ────────────────────────────────────────────────────────────────────
function icon1a(s) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${s.bg}"/>
  <rect x="36" y="148" width="440" height="216" rx="16" fill="${s.ticketBg}"/>
  <rect x="36" y="148" width="440" height="216" rx="16" fill="none" stroke="${s.ticketBorder}" stroke-width="1.5" opacity="0.6"/>
  ${notches(36, s.bg)}
  ${notches(476, s.bg)}
  <line x1="222" y1="163" x2="222" y2="351" stroke="${s.border}" stroke-width="2" stroke-dasharray="8,5"/>
  <text x="130" y="348" font-family="${SYM}" font-size="168" fill="${s.iconHorse}" text-anchor="middle" dominant-baseline="auto">♞</text>
  <text x="352" y="232" font-family="${FONT}" font-size="38" font-weight="900" fill="${s.iconText1}" text-anchor="middle">BET</text>
  <text x="352" y="278" font-family="${FONT}" font-size="38" font-weight="900" fill="${s.iconText2}" text-anchor="middle">SLIPS</text>
  <text x="256" y="432" font-family="${FONT}" font-size="16" font-weight="500" fill="${s.iconSub}" text-anchor="middle" letter-spacing="4">HORSE RACING</text>
</svg>`;
}

// ── App Screen Mockup ──────────────────────────────────────────────────────────
// Simplified portrait (390×844) main screen showing: header, race nav,
// bet type grid, horse selector, history entry
function appScreen(s) {
  // Bet type buttons — 3 selected/3 default
  function betBtn(x, y, w, label, selected) {
    return `
      <rect x="${x}" y="${y}" width="${w}" height="44" rx="8"
        fill="${selected ? s.btnSelected : s.btnBg}"
        stroke="${selected ? s.btnSelBorder : s.btnBorder}" stroke-width="${selected ? 1.5 : 1}"/>
      <text x="${x + w/2}" y="${y + 27}" font-family="${FONT}" font-size="13" font-weight="${selected ? '700' : '500'}"
        fill="${selected ? s.primaryLight : s.textMuted}" text-anchor="middle">${label}</text>`;
  }

  // Horse button
  function horseBtn(x, y, num, state) {
    const bg   = state === 'selected' ? s.primaryDim  : state === 'scratched' ? '#1c1c2a' : s.surfaceHigh;
    const bord = state === 'selected' ? s.primary     : state === 'scratched' ? s.border  : s.border;
    const col  = state === 'selected' ? s.primaryLight: state === 'scratched' ? s.textDim : s.textMuted;
    return `
      <rect x="${x}" y="${y}" width="40" height="40" rx="8" fill="${bg}" stroke="${bord}" stroke-width="1"/>
      <text x="${x+20}" y="${y+25}" font-family="${FONT}" font-size="14" font-weight="700"
        fill="${col}" text-anchor="middle">${num}</text>`;
  }

  const horses = [
    [16,0,1,'selected'],[62,0,2,'default'],[108,0,3,'scratched'],[154,0,4,'default'],
    [200,0,5,'selected'],[246,0,6,'default'],[292,0,7,'default'],[338,0,8,'default'],
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
  <rect width="390" height="844" fill="${s.bg}"/>

  <!-- Status bar -->
  <rect width="390" height="44" fill="${s.surface}"/>
  <text x="20" y="29" font-family="${FONT}" font-size="13" font-weight="600" fill="${s.text}">9:41</text>
  <text x="370" y="29" font-family="${FONT}" font-size="11" fill="${s.textMuted}" text-anchor="end">●●●</text>

  <!-- Header -->
  <rect width="390" height="56" y="44" fill="${s.surface}"/>
  <rect width="390" height="1" y="99" fill="${s.border}"/>
  <text x="195" y="79" font-family="${FONT}" font-size="17" font-weight="700" fill="${s.text}" text-anchor="middle">Bet Slips</text>
  <text x="20" y="79" font-family="${FONT}" font-size="22" fill="${s.primary}" text-anchor="middle">⚙</text>
  <text x="370" y="79" font-family="${FONT}" font-size="13" font-weight="600" fill="${s.primary}" text-anchor="middle">+ Track</text>

  <!-- Track tab -->
  <rect width="390" height="42" y="100" fill="${s.surface}"/>
  <rect width="390" height="1" y="141" fill="${s.border}"/>
  <rect x="12" y="106" width="120" height="30" rx="15" fill="${s.primaryDim}" stroke="${s.primary}" stroke-width="1.5"/>
  <text x="72" y="125" font-family="${FONT}" font-size="13" font-weight="700" fill="${s.primaryLight}" text-anchor="middle">Churchill Downs</text>
  <rect x="140" y="106" width="90" height="30" rx="15" fill="${s.surfaceHigh}" stroke="${s.border}" stroke-width="1"/>
  <text x="185" y="125" font-family="${FONT}" font-size="13" fill="${s.textMuted}" text-anchor="middle">Keeneland</text>

  <!-- Race day header -->
  <rect width="390" height="56" y="142" fill="${s.surface}"/>
  <rect width="390" height="1" y="197" fill="${s.border}"/>
  <text x="195" y="163" font-family="${FONT}" font-size="11" font-weight="600" fill="${s.textDim}" text-anchor="middle" letter-spacing="2">RACE DAY</text>
  <text x="50" y="186" font-family="${FONT}" font-size="22" fill="${s.primary}" text-anchor="middle">‹</text>
  <text x="195" y="186" font-family="${FONT}" font-size="20" font-weight="700" fill="${s.text}" text-anchor="middle">Race 4</text>
  <text x="340" y="186" font-family="${FONT}" font-size="22" fill="${s.primary}" text-anchor="middle">›</text>
  <rect x="290" y="172" width="76" height="26" rx="13" fill="${s.primaryDim}" stroke="${s.primary}" stroke-width="1"/>
  <text x="328" y="189" font-family="${FONT}" font-size="12" font-weight="600" fill="${s.primaryLight}" text-anchor="middle">8 horses</text>

  <!-- Bettor pills -->
  <rect width="390" height="48" y="198" fill="${s.surfaceHigh}"/>
  <rect width="390" height="1" y="245" fill="${s.border}"/>
  <rect x="12" y="208" width="56" height="28" rx="14" fill="${s.pillActive}" stroke="${s.pillBorder}" stroke-width="1.5"/>
  <text x="40" y="226" font-family="${FONT}" font-size="13" font-weight="600" fill="${s.primaryLight}" text-anchor="middle">Me</text>
  <rect x="76" y="208" width="62" height="28" rx="14" fill="${s.surfaceHigh}" stroke="${s.border}" stroke-width="1"/>
  <text x="107" y="226" font-family="${FONT}" font-size="13" fill="${s.textMuted}" text-anchor="middle">Sarah</text>
  <rect x="146" y="208" width="56" height="28" rx="14" fill="${s.surfaceHigh}" stroke="${s.border}" stroke-width="1"/>
  <text x="174" y="226" font-family="${FONT}" font-size="13" fill="${s.textMuted}" text-anchor="middle">Mike</text>

  <!-- Bet type selector -->
  <rect width="390" height="130" y="246" fill="${s.surface}"/>
  <rect width="390" height="1" y="375" fill="${s.border}"/>
  <text x="16" y="268" font-family="${FONT}" font-size="12" font-weight="700" fill="${s.textDim}" letter-spacing="2">BET TYPE</text>
  <g transform="translate(16, 277)">
    ${betBtn(0,   0, 79, 'Win',      false)}
    ${betBtn(85,  0, 79, 'Place',    false)}
    ${betBtn(170, 0, 79, 'Show',     false)}
    ${betBtn(255, 0, 102,'Exacta',   true)}
    ${betBtn(0,   50, 108,'Quinella', false)}
    ${betBtn(114, 50, 100,'Trifecta', false)}
    ${betBtn(220, 50, 137,'Superfecta',false)}
  </g>

  <!-- Horse selector -->
  <rect width="390" height="108" y="376" fill="${s.surface}"/>
  <rect width="390" height="1" y="483" fill="${s.border}"/>
  <text x="16" y="398" font-family="${FONT}" font-size="12" font-weight="700" fill="${s.textDim}" letter-spacing="2">SELECT HORSES</text>
  <g transform="translate(16, 408)">
    ${horses.map(([x,y,num,st]) => horseBtn(x, y, num, st)).join('')}
  </g>
  <text x="195" y="475" font-family="${FONT}" font-size="13" fill="${s.textDim}" text-anchor="middle" font-style="italic">Select 2 horses for Exacta</text>

  <!-- Bet unit + calculate -->
  <rect width="390" height="60" y="484" fill="${s.surface}"/>
  <rect width="390" height="1" y="543" fill="${s.border}"/>
  <text x="16" y="510" font-family="${FONT}" font-size="12" font-weight="700" fill="${s.textDim}" letter-spacing="2">BET UNIT</text>
  <rect x="16" y="516" width="80" height="20" rx="4" fill="${s.surfaceHigh}" stroke="${s.border}" stroke-width="1"/>
  <text x="56" y="530" font-family="${FONT}" font-size="13" fill="${s.text}" text-anchor="middle">$2.00</text>
  <rect x="230" y="494" width="144" height="40" rx="10" fill="${s.primary}"/>
  <text x="302" y="519" font-family="${FONT}" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Calculate →</text>

  <!-- Bet history panel -->
  <rect width="390" height="1" y="543" fill="${s.border}"/>
  <rect width="390" height="44" y="544" fill="${s.surface}"/>
  <text x="16" y="571" font-family="${FONT}" font-size="15" font-weight="700" fill="${s.text}">Race 4 Bets</text>
  <rect x="108" y="558" width="22" height="22" rx="11" fill="${s.primary}"/>
  <text x="119" y="573" font-family="${FONT}" font-size="11" font-weight="700" fill="#fff" text-anchor="middle">3</text>
  <text x="340" y="571" font-family="${FONT}" font-size="15" font-weight="700" fill="${s.text}" text-anchor="end">$18.00</text>
  <rect width="390" height="1" y="587" fill="${s.border}"/>

  <!-- History entry 1 — win -->
  <rect width="390" height="76" y="588" fill="${s.surface}"/>
  <rect width="390" height="1" y="663" fill="${s.border}"/>
  <text x="16" y="611" font-family="${FONT}" font-size="14" font-weight="600" fill="${s.text}">Exacta — Straight</text>
  <text x="340" y="611" font-family="${FONT}" font-size="16" font-weight="700" fill="${s.success}" text-anchor="end">✓</text>
  <text x="16" y="632" font-family="${FONT}" font-size="13" fill="${s.textMuted}">1, 5</text>
  <text x="340" y="632" font-family="${FONT}" font-size="13" font-weight="600" fill="${s.textMuted}" text-anchor="end">$2.00</text>
  <!-- payout row -->
  <text x="16" y="656" font-family="${FONT}" font-size="12" fill="${s.textMuted}">Payout</text>
  <rect x="72" y="641" width="100" height="22" rx="5" fill="${s.successDim}" stroke="${s.success}" stroke-width="1"/>
  <text x="122" y="656" font-family="${FONT}" font-size="13" fill="${s.text}" text-anchor="middle">$ 24.60</text>

  <!-- History entry 2 — loss -->
  <rect width="390" height="54" y="664" fill="${s.surface}"/>
  <rect width="390" height="1" y="717" fill="${s.border}"/>
  <text x="16" y="687" font-family="${FONT}" font-size="14" font-weight="600" fill="${s.text}">Exacta — Box</text>
  <text x="340" y="687" font-family="${FONT}" font-size="16" font-weight="700" fill="${s.danger}" text-anchor="end">✗</text>
  <text x="16" y="708" font-family="${FONT}" font-size="13" fill="${s.textMuted}">2, 7</text>
  <text x="340" y="708" font-family="${FONT}" font-size="13" font-weight="600" fill="${s.textMuted}" text-anchor="end">$4.00</text>

  <!-- Race outcome panel stub -->
  <rect width="390" height="88" y="718" fill="${s.surfaceHigh}"/>
  <rect width="390" height="1" y="805" fill="${s.border}"/>
  <text x="16" y="742" font-family="${FONT}" font-size="12" font-weight="700" fill="${s.textDim}" letter-spacing="2">RACE 4 RESULTS</text>
  <text x="16" y="770" font-family="${FONT}" font-size="13" fill="${s.textMuted}">1st</text>
  <rect x="44" y="754" width="48" height="26" rx="5" fill="${s.surface}" stroke="${s.border}"/>
  <text x="68" y="771" font-family="${FONT}" font-size="15" font-weight="700" fill="${s.accent}" text-anchor="middle">1</text>
  <text x="108" y="770" font-family="${FONT}" font-size="13" fill="${s.textMuted}">2nd</text>
  <rect x="136" y="754" width="48" height="26" rx="5" fill="${s.surface}" stroke="${s.border}"/>
  <text x="160" y="771" font-family="${FONT}" font-size="15" font-weight="700" fill="${s.text}" text-anchor="middle">5</text>
  <text x="200" y="770" font-family="${FONT}" font-size="13" fill="${s.textMuted}">3rd</text>
  <rect x="228" y="754" width="48" height="26" rx="5" fill="${s.surface}" stroke="${s.border}"/>
  <text x="252" y="771" font-family="${FONT}" font-size="15" font-weight="700" fill="${s.textMuted}" text-anchor="middle">—</text>

  <!-- Home bar -->
  <rect width="390" height="34" y="810" fill="${s.bg}"/>
  <rect x="155" y="822" width="80" height="5" rx="2.5" fill="${s.border}"/>
</svg>`;
}

// ── Generate all ───────────────────────────────────────────────────────────────
(async () => {
  const entries = Object.entries(schemes);
  await Promise.all(
    entries.flatMap(([key, s]) => [
      renderIcon(`icon-${key}.png`,   icon1a(s)),
      renderScreen(`app-${key}.png`,  appScreen(s)),
    ])
  );
  console.log('\nAll previews → ./previews/');
})();
