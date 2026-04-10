import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://cadarn.com.br',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), mdx(), sitemap()],
});
