# Brutto Netto Rechner Schweiz 🇨🇭

A free online salary calculator for Switzerland that calculates your **net salary** from your **gross salary**, accounting for all Swiss social security deductions.

**Live site:** [brutto-netto.ch](https://brutto-netto.ch)

## Features

- Calculate net salary from gross monthly salary
- Support for 13th month salary (Dreizehnter Monatslohn)
- Age-based pension fund (BVG) contribution rates
- Optional daily sickness benefit insurance (KTG)
- All deductions itemized with percentages

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

- **Astro 7** as a fully static site
- **Preact** island with `@preact/signals` for the calculator
- **Tailwind CSS 4** + **DaisyUI 5**
- **Cloudflare Pages** for hosting

## Development

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:4321)
pnpm dev

# Run tests
pnpm test

# Type-check and build for production
pnpm build

# Deploy to Cloudflare Pages manually
pnpm run deploy
```

Every push to `main` is tested, built and deployed to Cloudflare Pages by the [CI workflow](.github/workflows/ci.yml). Pull requests run the tests and the build only.

## License

MIT
