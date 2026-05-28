# Brutto Netto Rechner Schweiz 🇨🇭

A free online salary calculator for Switzerland that calculates your **net salary** from your **gross salary**, accounting for all Swiss social security deductions.

**Live site:** [brutto-netto.ch](https://brutto-netto.ch)

## Features

- Calculate net salary from gross monthly or annual salary
- Support for 13th month salary (Dreizehnter Monatslohn)
- Age-based pension fund (BVG) contribution rates
- Optional daily sickness benefit insurance (KTG)
- All deductions itemized with percentages
- 100% private: all calculations run in your browser

### Deductions Calculated

| Deduction     | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| **AHV/IV/EO** | Old-age, disability & income compensation insurance (5.3%)            |
| **ALV**       | Unemployment insurance (1.1%, with solidarity rate above CHF 148,200) |
| **BVG**       | Occupational pension fund (age-dependent, 0.8% – 10.1%)               |
| **NBU**       | Non-occupational accident insurance (~1%)                             |
| **KTG**       | Daily sickness benefit insurance (~0.8%, optional)                    |

Rates are updated for **2026**.

## Tech Stack

- **Astro** (static SSG)
- **Solid** (single hydrated island for the calculator)
- **Tailwind CSS 4** with custom semantic theme tokens
- **Vitest** for calculator unit tests
- **Cloudflare Workers Static Assets** for hosting

## Development

Requires Node 22+ and [pnpm](https://pnpm.io/).

```bash
pnpm install        # install deps
pnpm dev            # start dev server (http://localhost:4321)
pnpm test           # run vitest
pnpm build          # produce dist/
pnpm preview        # serve the built dist/
pnpm deploy         # build + wrangler deploy (production)
pnpm deploy:preview # build + upload a preview version
```

## License

MIT
