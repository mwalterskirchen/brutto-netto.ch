// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://brutto-netto.ch',
  trailingSlash: 'never',
  // The content is hand-written HTML that wraps text around inline elements; Astro 7's default
  // 'jsx' mode would drop those spaces.
  compressHTML: true,
  build: {
    format: 'file',
  },
  integrations: [preact(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
