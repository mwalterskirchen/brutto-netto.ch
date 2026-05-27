import { defineConfig } from 'astro/config';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import solid from '@astrojs/solid-js';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const REPO_URL = 'https://github.com/mwalterskirchen/brutto-netto.ch';

function resolveVersion() {
  try {
    const described = execSync('git describe --tags --always --dirty', {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    if (described) return described;
  } catch {
    // git unavailable or no tags yet — fall through
  }
  const pkg = JSON.parse(
    readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf8'),
  );
  return `v${pkg.version}`;
}

const version = resolveVersion();
const cleanTag = /^(v\d+\.\d+\.\d+)$/.exec(version)?.[1];
const baseTag = /^(v\d+\.\d+\.\d+)-/.exec(version)?.[1];
const versionUrl = cleanTag
  ? `${REPO_URL}/releases/tag/${cleanTag}`
  : baseTag
    ? `${REPO_URL}/compare/${baseTag}...HEAD`
    : `${REPO_URL}/commits/main`;

export default defineConfig({
  site: 'https://brutto-netto.ch',
  integrations: [solid(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __APP_VERSION_URL__: JSON.stringify(versionUrl),
    },
  },
});
