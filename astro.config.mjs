// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { disabledRoutePrefixes } from './src/config/sections.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://satvik.fyi',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    // The sitemap is rendered from the section registry: routes belonging to
    // disabled modules are excluded so that flipping `enabled: false` removes
    // a module from the sitemap without any other change.
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        if (pathname.startsWith('/404')) return false;
        return !disabledRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
