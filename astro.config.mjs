import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://cadarn.com.br',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [react(), mdx(), sitemap()],
});
