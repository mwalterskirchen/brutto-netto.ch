import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

const W = 1200;
const H = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g1" cx="80%" cy="-10%" r="55%">
      <stop offset="0%" stop-color="#4cc9f0" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#4cc9f0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="-10%" cy="30%" r="55%">
      <stop offset="0%" stop-color="#b5179e" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#b5179e" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0a0a0f"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>

  <!-- Swiss-red accent bar (left edge) -->
  <rect x="0" y="0" width="8" height="${H}" fill="#e8332a"/>

  <!-- Wordmark -->
  <g transform="translate(80, 96)">
    <!-- mark (scaled from public/mark.svg, 32 → 64) -->
    <g transform="scale(2)">
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#14141c" stroke="#2a2a36" stroke-width="1"/>
      <rect x="7" y="9" width="18" height="4" rx="2" fill="#f5f5f7"/>
      <rect x="7" y="15" width="13" height="4" rx="2" fill="#8a8a94"/>
      <rect x="7" y="21" width="9" height="4" rx="2" fill="#e8332a"/>
    </g>
    <text x="82" y="42" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="26" fill="#f5f5f7" letter-spacing="-0.5">
      brutto-netto<tspan fill="#8a8a94">.ch</tspan>
    </text>
  </g>

  <!-- Headline -->
  <g transform="translate(80, 260)">
    <text font-family="-apple-system, system-ui, 'Helvetica Neue', Arial, sans-serif" font-size="76" font-weight="600" fill="#f5f5f7" letter-spacing="-2.5">
      <tspan x="0" dy="0">Dein Netto.</tspan>
      <tspan x="0" dy="92">Ohne dass es</tspan>
      <tspan x="0" dy="92">jemand mitliest.</tspan>
    </text>
  </g>

  <!-- Bottom row: tagline + tag -->
  <g transform="translate(80, 555)">
    <text font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="20" fill="#8a8a94" letter-spacing="2">
      BRUTTO · NETTO · SCHWEIZ · 2026
    </text>
  </g>

  <!-- Bottom-right hint chip -->
  <g transform="translate(${W - 80}, 555)">
    <rect x="-220" y="-26" width="220" height="36" rx="8" fill="#14141c" stroke="#2a2a36"/>
    <text x="-110" y="-2" text-anchor="middle" font-family="ui-monospace, 'SF Mono', Menlo, monospace" font-size="14" fill="#f5f5f7" letter-spacing="1">
      OPEN SOURCE · LOKAL
    </text>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
  .resize(W, H)
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
