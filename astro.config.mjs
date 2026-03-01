// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    preact({
      include: ['**/components/**/*.tsx', '**/components/**/*.jsx'],
      exclude: ['**/SplineIsland.tsx'],
    }),
    react({
      include: ['**/SplineIsland.tsx'],
    })
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});