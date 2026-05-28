import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://brutto-netto.ch',
  integrations: [solid(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
