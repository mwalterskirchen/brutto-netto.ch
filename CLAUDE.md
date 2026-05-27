# brutto-netto.ch

Swiss salary calculator. Static site, deployed to Cloudflare Workers static assets.

## Stack

- **Astro 6** — static SSG, single page + legal pages.
- **Solid** — one hydrated island (`Calculator.tsx`).
- **Tailwind 4** — semantic theme tokens in `src/styles/global.css`.
- **Vitest** — unit tests for `src/lib/calculator.ts`.
- **Wrangler** — deploys `dist/` to CF Workers.
- **pnpm** — package manager (lockfile committed). Node 22+.

## Commands

```bash
pnpm dev      # http://localhost:4321
pnpm test     # vitest run
pnpm build    # → dist/
pnpm deploy   # build + wrangler deploy
```

## Commit conventions

**Conventional Commits required** — release-please parses them to bump version + write CHANGELOG.

Types used:

- `feat:` — new feature → minor bump
- `fix:` — bug fix → patch bump
- `perf:` — perf improvement → patch
- `refactor:` — code restructure, no behavior change
- `docs:` — docs only
- `test:` — tests only
- `chore:` — build/tooling/deps

**Breaking change** → major bump. Use either:

- `feat!: drop legacy URL format` (bang after type)
- or a `BREAKING CHANGE:` footer in the message body

**Style:** lowercase subject, terse, drop articles/grammar for concision. Example: `feat: keyboard shortcuts (m/y/t/k) w/ kbd chips`.

## Branches

Prefix branches: `feature/`, `fix/`, `chore/`.

## Release flow

Releases are PR-driven via [release-please](https://github.com/googleapis/release-please).

1. Merge conventional commits to `main`.
2. `.github/workflows/release-please.yml` opens (or updates) a rolling **Release PR** — bumps `package.json` + writes `CHANGELOG.md`.
3. Merging that PR → tags `vX.Y.Z` + creates GH release.
4. **Don't tag manually.** Don't bump `package.json` by hand.

Config: `release-please-config.json` + `.release-please-manifest.json` (current version of record).

## Version display

App version is shown in the footer as a mono chip linking to the GH release page.

- Resolved at build time in `astro.config.mjs` via `git describe --tags --always --dirty`.
- Exposed to source as `__APP_VERSION__` and `__APP_VERSION_URL__` (vite `define`).
- Globals declared in `src/env.d.ts`.
- Rendered in `src/components/Footer.astro`.

Clean tag → `v2.0.0` linking to `/releases/tag/v2.0.0`. Post-tag commits → `v2.0.0-3-gabc123` linking to compare view. Dirty tree → `…-dirty` suffix.

## Code style

- Prettier: `printWidth: 100`, `singleQuote: true` (in `package.json`).
- All UI copy lives in `src/lib/messages.de.ts`. Don't inline German strings in components.
- Deduction rates in `src/lib/deduction-rates.ts` — single source for tax math.
