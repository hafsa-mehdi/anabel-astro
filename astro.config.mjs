// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

// The Keystatic admin panel (/keystatic) runs only while developing locally
// (`npm run dev`). `npm run build` produces plain static HTML with no admin attached.
const isDev = process.argv.includes('dev');

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
  // Live URLs end in a slash. The Keystatic admin API needs 'ignore' while developing.
  trailingSlash: isDev ? 'ignore' : 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    react(),
    markdoc(),
    sitemap({ filter: (page) => !page.includes('/404') }),
    ...(isDev ? [keystatic()] : []),
  ],
});
