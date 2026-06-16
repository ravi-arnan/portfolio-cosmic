// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://raviarnan.netlify.app',
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      // No public source maps in production: they leak original source
      sourcemap: false
    }
  }
});