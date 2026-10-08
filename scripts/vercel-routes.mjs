// Runs after `npm run build` (npm "postbuild").
// Adds two rules to Vercel's routing file (.vercel/output/config.json):
//  1. Page addresses without a trailing slash redirect to the slash version
//     (/contact -> /contact/), like the live WordPress site. The Keystatic admin
//     (/keystatic, /api/keystatic) and files with an extension are left alone.
//  2. Fonts are cached for a year (their file names never change).
import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../.vercel/output/config.json', import.meta.url);
let config;
try {
  config = JSON.parse(await readFile(file, 'utf8'));
} catch {
  console.log('[vercel-routes] no .vercel/output/config.json, nothing to do');
  process.exit(0);
}

const fsIndex = config.routes.findIndex((r) => r.handle === 'filesystem');
const extra = [
  {
    src: '^/((?!api/|keystatic(?:/|$)|_astro/|_image|_server-islands/)(?:[^/]+/)*[^/.]+)$',
    status: 308,
    headers: { Location: '/$1/' },
  },
  {
    src: '^/fonts/(.*)$',
    headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    continue: true,
  },
];
const fresh = extra.filter((e) => !config.routes.some((r) => r.src === e.src));
config.routes.splice(fsIndex, 0, ...fresh);
await writeFile(file, JSON.stringify(config, null, '\t'));
console.log('[vercel-routes] trailing-slash redirect and font caching added');
