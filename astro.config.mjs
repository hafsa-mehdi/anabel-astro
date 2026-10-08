// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// Every page is pre-built static HTML. Only the Keystatic admin (/keystatic and
// /api/keystatic) runs on demand, as a Vercel function.

// On a Vercel test deployment, links, share images and canonical URLs use the Vercel address
// (the live domain does not have these files yet). Set SITE_INDEXING=true when this build
// replaces the live site, and the real domain is used again.
const LIVE = 'https://anabelsorientalrugs.com';
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL && process.env.SITE_INDEXING !== 'true' && vercelHost ? `https://${vercelHost}` : LIVE);

export default defineConfig({
  site,
  output: 'static',
  adapter: vercel(),
  // Page links are written with a trailing slash (like the live site) and Vercel adds a
  // missing slash with a redirect (vercel.json). 'ignore' keeps the Keystatic admin API working.
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    react(),
    markdoc(),
    sitemap({ filter: (page) => !page.includes('/404') }),
    keystatic(),
  ],
});
