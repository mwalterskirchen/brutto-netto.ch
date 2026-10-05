// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
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
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
