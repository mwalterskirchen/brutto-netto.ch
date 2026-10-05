// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://brutto-netto.ch',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [preact(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
